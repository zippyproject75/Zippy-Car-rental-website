import { createClient } from "@supabase/supabase-js";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { isAllowedPermission } from "../auth/authorization.js";
import { recordAdminActivity, getRecentAdminActivity } from "../auth/audit.js";
import { getDatabase } from "../auth/database.js";
import { normalizeClientAddress } from "../auth/security.js";
import { getCurrentUser, type AuthenticatedUser } from "../auth/session.js";

const slugSchema = z.string().trim().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const nullableText = z.string().trim().max(500).nullable();

const vehicleFields = {
  slug: slugSchema,
  make: z.string().trim().min(1).max(100),
  model: z.string().trim().min(1).max(100),
  displayName: z.string().trim().min(1).max(150),
  variant: nullableText.optional(),
  unitIdentifier: z.string().trim().max(100).nullable().optional(),
  fuelType: z.string().trim().max(50).nullable().optional(),
  transmission: z.string().trim().max(50).nullable().optional(),
  seatingCapacity: z.number().int().min(1).max(20).nullable().optional(),
  bodyType: z.string().trim().max(50).nullable().optional(),
  description: z.string().trim().max(5000).optional(),
  isAvailable: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  displayOrder: z.number().int().min(0).max(100000).optional(),
};

const vehicleCreateSchema = z.object(vehicleFields).strict();
const vehicleUpdateSchema = z
  .object(vehicleFields)
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0);

const pricingSchema = z
  .object({
    packageCode: slugSchema,
    pricingStatus: z.enum(["APPROVED", "PENDING", "PRICE_ON_REQUEST"]),
    amountInr: z.number().min(0).max(10000000).nullable(),
    includedKm: z.number().int().min(0).max(100000).nullable(),
    extraKmChargeInr: z.number().min(0).max(1000000).nullable(),
  })
  .strict()
  .refine(
    (value) =>
      (value.pricingStatus === "APPROVED" && value.amountInr !== null) ||
      (value.pricingStatus !== "APPROVED" && value.amountInr === null),
    "Approved pricing requires a price; pending and on-request pricing must not contain one.",
  );

const locationSchema = z.object({
  slug: slugSchema,
  nameEn: z.string().trim().min(1).max(150),
  nameHi: z.string().trim().max(150).nullable(),
  nameMr: z.string().trim().max(150).nullable(),
  address: z.string().trim().max(500),
  locality: z.string().trim().max(150),
  postalCode: z.string().trim().max(20).nullable(),
  pickupInstructions: z.string().trim().max(2000),
  isActive: z.boolean(),
}).strict();

const enquiryUpdateSchema = z
  .object({
    status: z.enum(["NEW", "CONTACTED", "AWAITING_CONFIRMATION", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
    internalNotes: z.string().trim().max(5000).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0);

const policySchema = z.object({
  slug: slugSchema,
  locale: z.enum(["en", "hi", "mr"]),
  title: z.string().trim().min(1).max(200),
  content: z.string().max(50000),
  isPublished: z.boolean(),
}).strict();

function requestMetadata(request: FastifyRequest) {
  return {
    clientAddress: normalizeClientAddress(request.ip),
    userAgent: request.headers["user-agent"]?.slice(0, 500) ?? null,
  };
}

async function requireOwner(
  request: FastifyRequest,
  reply: FastifyReply,
  permission: Parameters<typeof isAllowedPermission>[1],
): Promise<AuthenticatedUser | null> {
  const user = await getCurrentUser(request, reply);
  if (!user) {
    reply.code(401).send({ error: "Authentication required." });
    return null;
  }
  if (!isAllowedPermission(user, permission)) {
    reply.code(403).send({ error: "Forbidden." });
    return null;
  }
  return user;
}

function parsedBody<T extends z.ZodType>(
  request: FastifyRequest,
  reply: FastifyReply,
  schema: T,
): z.infer<T> | null {
  const parsed = schema.safeParse(request.body);
  if (!parsed.success) {
    reply.code(400).send({ error: "Please check the submitted information." });
    return null;
  }
  return parsed.data;
}

function supabaseStorage() {
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY are required for storage.");
  return createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  }).storage;
}

function isSupportedImage(type: string, buffer: Buffer): boolean {
  if (type === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (type === "image/jpeg") return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  return (
    type === "image/webp" &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  );
}

function databaseImageUrl(storagePath: string): string {
  if (storagePath.startsWith("/")) return storagePath;
  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error("SUPABASE_URL must be configured to serve vehicle photos.");
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "vehicle-images";
  return `${url.replace(/\/+$/, "")}/storage/v1/object/public/${bucket}/${storagePath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

async function listVehicleRows(includeArchived: boolean) {
  return getDatabase()`
    SELECT v.id, v.slug, v.make, v.model, v.display_name AS "displayName",
      v.variant, v.unit_identifier AS "unitIdentifier", v.fuel_type AS "fuelType",
      v.transmission, v.seating_capacity AS "seatingCapacity", v.body_type AS "bodyType",
      v.description, v.is_available AS "isAvailable", v.is_published AS "isPublished",
      v.is_featured AS "isFeatured", v.display_order AS "displayOrder",
      v.archived_at AS "archivedAt", v.created_at AS "createdAt", v.updated_at AS "updatedAt",
      COALESCE((
        SELECT json_agg(json_build_object(
          'id', p.id, 'url', p.storage_path, 'altText', p.alt_text,
          'displayOrder', p.display_order, 'isPrimary', p.is_primary
        ) ORDER BY p.display_order, p.created_at)
        FROM vehicle_photos p WHERE p.vehicle_id = v.id
      ), '[]'::json) AS photos,
      COALESCE((
        SELECT json_agg(json_build_object(
          'packageCode', p.package_code, 'pricingStatus', p.pricing_status,
          'amountInr', p.amount_inr, 'includedKm', p.included_km,
          'extraKmChargeInr', p.extra_km_charge_inr
        ) ORDER BY p.package_code)
        FROM vehicle_pricing p WHERE p.vehicle_id = v.id
      ), '[]'::json) AS pricing
    FROM vehicles v
    WHERE ${includeArchived} OR v.archived_at IS NULL
    ORDER BY v.display_order, v.created_at
  `;
}

export function registerAdminRoutes(app: FastifyInstance) {
  app.get("/api/admin/overview", async (request, reply) => {
    const user = await requireOwner(request, reply, "vehicles:read");
    if (!user) return;
    const db = getDatabase();
    const [fleet] = await db`
      SELECT COUNT(*)::integer AS total,
        COUNT(*) FILTER (WHERE is_available)::integer AS available,
        COUNT(*) FILTER (WHERE NOT is_available)::integer AS unavailable
      FROM vehicles WHERE archived_at IS NULL
    `;
    const [customers] = await db`
      SELECT COUNT(*)::integer AS total FROM user_roles WHERE role = 'CUSTOMER'
    `;
    const [enquiries] = await db`
      SELECT COUNT(*)::integer AS total,
        COUNT(*) FILTER (WHERE status = 'NEW')::integer AS new
      FROM enquiries
    `;
    const [packages] = await db`
      SELECT COUNT(DISTINCT package_code)::integer AS total
      FROM vehicle_pricing WHERE pricing_status = 'APPROVED'
    `;
    return reply.send({ fleet, customers, enquiries, activePackages: packages?.total ?? 0 });
  });

  app.get("/api/admin/vehicles", async (request, reply) => {
    if (!(await requireOwner(request, reply, "vehicles:read"))) return;
    const vehicles = await listVehicleRows(false);
    return reply.send({
      vehicles: vehicles.map((vehicle) => ({
        ...vehicle,
        photos: vehicle.photos.map((photo: { url: string }) => ({
          ...photo,
          url: databaseImageUrl(photo.url),
        })),
      })),
    });
  });

  app.post("/api/admin/vehicles", async (request, reply) => {
    const user = await requireOwner(request, reply, "vehicles:write");
    if (!user) return;
    const body = parsedBody(request, reply, vehicleCreateSchema);
    if (!body) return;
    const [vehicle] = await getDatabase()`
      INSERT INTO vehicles (
        slug, make, model, display_name, variant, unit_identifier, fuel_type, transmission,
        seating_capacity, body_type, description, is_available, is_published, is_featured, display_order
      ) VALUES (
        ${body.slug}, ${body.make}, ${body.model}, ${body.displayName}, ${body.variant ?? null},
        ${body.unitIdentifier ?? null}, ${body.fuelType ?? null}, ${body.transmission ?? null},
        ${body.seatingCapacity ?? null}, ${body.bodyType ?? null}, ${body.description ?? ""},
        ${body.isAvailable ?? false}, ${body.isPublished ?? false}, ${body.isFeatured ?? false},
        ${body.displayOrder ?? 0}
      )
      RETURNING id, slug
    `;
    if (!vehicle) return reply.code(500).send({ error: "Vehicle could not be created." });
    await recordAdminActivity({
      actorUserId: user.id,
      action: "vehicle.created",
      subjectType: "vehicle",
      subjectId: vehicle.id,
      summary: { slug: vehicle.slug },
      requestMetadata: requestMetadata(request),
    });
    return reply.code(201).send({ vehicle });
  });

  app.patch("/api/admin/vehicles/:id", async (request, reply) => {
    const user = await requireOwner(request, reply, "vehicles:write");
    if (!user) return;
    const body = parsedBody(request, reply, vehicleUpdateSchema);
    if (!body) return;
    const { id } = request.params as { id: string };
    const [existing] = await getDatabase()`SELECT * FROM vehicles WHERE id = ${id} AND archived_at IS NULL`;
    if (!existing) return reply.code(404).send({ error: "Vehicle not found." });
    const fieldMap: Record<string, string> = {
      slug: "slug", make: "make", model: "model", displayName: "display_name",
      variant: "variant", unitIdentifier: "unit_identifier", fuelType: "fuel_type",
      transmission: "transmission", seatingCapacity: "seating_capacity", bodyType: "body_type",
      description: "description", isAvailable: "is_available", isPublished: "is_published",
      isFeatured: "is_featured", displayOrder: "display_order",
    };
    const updates = Object.entries(body).map(([field, value]) => {
      const column = fieldMap[field];
      if (!column) throw new Error(`Unsupported vehicle update field: ${field}`);
      return { column, value };
    });
    await getDatabase().begin(async (tx) => {
      for (const update of updates) {
        await tx.unsafe(`UPDATE vehicles SET "${update.column}" = $1 WHERE id = $2`, [
          update.value,
          id,
        ]);
      }
      await tx`UPDATE vehicles SET updated_at = now() WHERE id = ${id}`;
    });
    const auditFields = ["isAvailable", "isPublished", "isFeatured", "displayOrder"];
    const summary = Object.fromEntries(
      Object.entries(body)
        .filter(([field]) => auditFields.includes(field))
        .map(([field, value]) => [
          field,
          { previous: existing[fieldMap[field]!], current: value },
        ]),
    );
    if ("isAvailable" in body || "isPublished" in body || "isFeatured" in body) {
      await recordAdminActivity({
        actorUserId: user.id,
        action: "vehicle.status_updated",
        subjectType: "vehicle",
        subjectId: id,
        summary,
        requestMetadata: requestMetadata(request),
      });
    }
    return reply.send({ vehicle: { id, ...body } });
  });

  app.delete("/api/admin/vehicles/:id", async (request, reply) => {
    const user = await requireOwner(request, reply, "vehicles:delete");
    if (!user) return;
    const { id } = request.params as { id: string };
    const [vehicle] = await getDatabase()`
      UPDATE vehicles SET archived_at = now(), is_published = false, updated_at = now()
      WHERE id = ${id} AND archived_at IS NULL
      RETURNING id, slug
    `;
    if (!vehicle) {
      reply.code(404).send({ error: "Vehicle not found." });
      return;
    }
    await recordAdminActivity({
      actorUserId: user.id,
      action: "vehicle.archived",
      subjectType: "vehicle",
      subjectId: id,
      summary: { slug: vehicle.slug },
      requestMetadata: requestMetadata(request),
    });
    return reply.code(204).send();
  });

  app.put("/api/admin/vehicles/:id/pricing", async (request, reply) => {
    const user = await requireOwner(request, reply, "pricing:write");
    if (!user) return;
    const body = parsedBody(request, reply, pricingSchema);
    if (!body) return;
    const { id } = request.params as { id: string };
    const result = await getDatabase().begin(async (tx) => {
      const [vehicle] = await tx`SELECT id FROM vehicles WHERE id = ${id} AND archived_at IS NULL`;
      if (!vehicle) return null;
      const [previous] = await tx`
        SELECT package_code AS "packageCode", pricing_status AS "pricingStatus",
          amount_inr AS "amountInr", included_km AS "includedKm",
          extra_km_charge_inr AS "extraKmChargeInr"
        FROM vehicle_pricing WHERE vehicle_id = ${id} AND package_code = ${body.packageCode}
        FOR UPDATE
      `;
      const values = {
        pricingStatus: body.pricingStatus,
        amountInr: body.amountInr,
        includedKm: body.includedKm,
        extraKmChargeInr: body.extraKmChargeInr,
      };
      await tx`
        INSERT INTO vehicle_pricing (
          vehicle_id, package_code, pricing_status, amount_inr, included_km, extra_km_charge_inr
        ) VALUES (
          ${id}, ${body.packageCode}, ${body.pricingStatus}, ${body.amountInr},
          ${body.includedKm}, ${body.extraKmChargeInr}
        )
        ON CONFLICT (vehicle_id, package_code) DO UPDATE SET
          pricing_status = EXCLUDED.pricing_status,
          amount_inr = EXCLUDED.amount_inr,
          included_km = EXCLUDED.included_km,
          extra_km_charge_inr = EXCLUDED.extra_km_charge_inr,
          updated_at = now()
      `;
      await tx`
        INSERT INTO vehicle_pricing_history (vehicle_id, package_code, previous_values, new_values, changed_by)
        VALUES (
          ${id}, ${body.packageCode}, ${JSON.stringify(previous ?? {})}::jsonb,
          ${JSON.stringify(values)}::jsonb, ${user.id}
        )
      `;
      await tx`UPDATE vehicles SET updated_at = now() WHERE id = ${id}`;
      return { previous: previous ?? null, current: values };
    });
    if (!result) return reply.code(404).send({ error: "Vehicle not found." });
    await recordAdminActivity({
      actorUserId: user.id,
      action: "vehicle.pricing_updated",
      subjectType: "vehicle",
      subjectId: id,
      summary: {
        packageCode: body.packageCode,
        previous: result.previous,
        current: result.current,
      },
      requestMetadata: requestMetadata(request),
    });
    return reply.send({ pricing: { packageCode: body.packageCode, ...result.current } });
  });

  app.post("/api/admin/vehicles/:id/photos", async (request, reply) => {
    const user = await requireOwner(request, reply, "vehicles:photos");
    if (!user) return;
    const { id } = request.params as { id: string };
    const [vehicle] = await getDatabase()`
      SELECT id, display_name AS "displayName" FROM vehicles WHERE id = ${id} AND archived_at IS NULL
    `;
    if (!vehicle) {
      reply.code(404).send({ error: "Vehicle not found." });
      return;
    }
    const file = await request.file();
    if (!file) return reply.code(400).send({ error: "Select an image to upload." });
    const image = await file.toBuffer();
    if (!isSupportedImage(file.mimetype, image)) {
      return reply.code(415).send({ error: "Only valid PNG, JPEG, and WebP images are supported." });
    }
    const extension = file.mimetype === "image/jpeg" ? "jpg" : file.mimetype.slice("image/".length);
    const storagePath = `${id}/${crypto.randomUUID()}.${extension}`;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "vehicle-images";
    const storage = supabaseStorage().from(bucket);
    const { error: uploadError } = await storage.upload(storagePath, image, {
      contentType: file.mimetype,
      cacheControl: "3600",
      upsert: false,
    });
    if (uploadError) throw new Error(`Vehicle image upload failed: ${uploadError.message}`);

    try {
      const [photo] = await getDatabase().begin(async (tx) => {
        const [primary] = await tx`
          SELECT id FROM vehicle_photos WHERE vehicle_id = ${id} AND is_primary LIMIT 1
        `;
        const [created] = await tx`
          INSERT INTO vehicle_photos (vehicle_id, storage_path, alt_text, display_order, is_primary)
          VALUES (
            ${id}, ${storagePath}, ${vehicle.displayName},
            (SELECT COALESCE(MAX(display_order), -1) + 1 FROM vehicle_photos WHERE vehicle_id = ${id}),
            ${!primary}
          )
          RETURNING id, storage_path AS "storagePath", alt_text AS "altText",
            display_order AS "displayOrder", is_primary AS "isPrimary"
        `;
        return [created];
      });
      if (!photo) throw new Error("Vehicle photo record could not be created.");
      await recordAdminActivity({
        actorUserId: user.id,
        action: "vehicle.photo_uploaded",
        subjectType: "vehicle",
        subjectId: id,
        summary: { photoId: photo.id, mimeType: file.mimetype },
        requestMetadata: requestMetadata(request),
      });
      return reply.code(201).send({ photo: { ...photo, url: databaseImageUrl(photo.storagePath) } });
    } catch (error) {
      const { error: cleanupError } = await storage.remove([storagePath]);
      if (cleanupError) request.log.error({ err: cleanupError, storagePath }, "Failed to clean up orphaned image");
      throw error;
    }
  });

  app.delete("/api/admin/vehicles/:id/photos/:photoId", async (request, reply) => {
    const user = await requireOwner(request, reply, "vehicles:photos");
    if (!user) return;
    const { id, photoId } = request.params as { id: string; photoId: string };
    const [photo] = await getDatabase()`
      SELECT id, storage_path AS "storagePath", is_primary AS "isPrimary"
      FROM vehicle_photos WHERE id = ${photoId} AND vehicle_id = ${id}
    `;
    if (!photo) {
      reply.code(404).send({ error: "Vehicle photo not found." });
      return;
    }
    if (!photo.storagePath.startsWith("/")) {
      const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "vehicle-images";
      const { error } = await supabaseStorage().from(bucket).remove([photo.storagePath]);
      if (error) throw new Error(`Vehicle image deletion failed: ${error.message}`);
    }
    await getDatabase().begin(async (tx) => {
      await tx`DELETE FROM vehicle_photos WHERE id = ${photoId} AND vehicle_id = ${id}`;
      if (photo.isPrimary) {
        await tx`
          UPDATE vehicle_photos SET is_primary = true
          WHERE id = (
            SELECT id FROM vehicle_photos WHERE vehicle_id = ${id}
            ORDER BY display_order, created_at LIMIT 1
          )
        `;
      }
    });
    await recordAdminActivity({
      actorUserId: user.id,
      action: "vehicle.photo_deleted",
      subjectType: "vehicle",
      subjectId: id,
      summary: { photoId },
      requestMetadata: requestMetadata(request),
    });
    return reply.code(204).send();
  });

  app.patch("/api/admin/vehicles/:id/photos/order", async (request, reply) => {
    const user = await requireOwner(request, reply, "vehicles:photos");
    if (!user) return;
    const body = parsedBody(request, reply, z.object({
      orderedPhotoIds: z.array(z.string().uuid()).min(1).max(20),
      primaryPhotoId: z.string().uuid(),
    }).strict());
    if (!body) return;
    if (new Set(body.orderedPhotoIds).size !== body.orderedPhotoIds.length ||
        !body.orderedPhotoIds.includes(body.primaryPhotoId)) {
      return reply.code(400).send({ error: "Photo order must contain unique IDs and its primary photo." });
    }
    const { id } = request.params as { id: string };
    await getDatabase().begin(async (tx) => {
      const photos = await tx`
        SELECT id FROM vehicle_photos WHERE vehicle_id = ${id}
      `;
      if (photos.length !== body.orderedPhotoIds.length ||
          photos.some((photo) => !body.orderedPhotoIds.includes(photo.id))) {
        throw new Error("Photo order does not match the vehicle's current gallery.");
      }
      await tx`UPDATE vehicle_photos SET is_primary = false WHERE vehicle_id = ${id}`;
      for (const [displayOrder, photoId] of body.orderedPhotoIds.entries()) {
        await tx`
          UPDATE vehicle_photos SET display_order = ${displayOrder},
            is_primary = ${photoId === body.primaryPhotoId}
          WHERE id = ${photoId} AND vehicle_id = ${id}
        `;
      }
    });
    await recordAdminActivity({
      actorUserId: user.id,
      action: "vehicle.photos_reordered",
      subjectType: "vehicle",
      subjectId: id,
      summary: { count: body.orderedPhotoIds.length, primaryPhotoId: body.primaryPhotoId },
      requestMetadata: requestMetadata(request),
    });
    return reply.send({ updated: true });
  });

  app.get("/api/admin/locations", async (request, reply) => {
    if (!(await requireOwner(request, reply, "locations:write"))) return;
    const locations = await getDatabase()`
      SELECT id, slug, name_en AS "nameEn", name_hi AS "nameHi", name_mr AS "nameMr",
        address, locality, postal_code AS "postalCode",
        pickup_instructions AS "pickupInstructions", is_active AS "isActive",
        archived_at AS "archivedAt"
      FROM pickup_locations ORDER BY is_active DESC, name_en
    `;
    return reply.send({ locations });
  });

  app.post("/api/admin/locations", async (request, reply) => {
    const user = await requireOwner(request, reply, "locations:write");
    if (!user) return;
    const body = parsedBody(request, reply, locationSchema);
    if (!body) return;
    const [location] = await getDatabase()`
      INSERT INTO pickup_locations (
        slug, name_en, name_hi, name_mr, address, locality, postal_code,
        pickup_instructions, is_active
      ) VALUES (
        ${body.slug}, ${body.nameEn}, ${body.nameHi}, ${body.nameMr}, ${body.address},
        ${body.locality}, ${body.postalCode}, ${body.pickupInstructions}, ${body.isActive}
      )
      RETURNING id, slug
    `;
    if (!location) return reply.code(500).send({ error: "Pickup location could not be created." });
    await recordAdminActivity({
      actorUserId: user.id, action: "location.created", subjectType: "pickup_location",
      subjectId: location.id, summary: { slug: location.slug }, requestMetadata: requestMetadata(request),
    });
    return reply.code(201).send({ location });
  });

  app.patch("/api/admin/locations/:id", async (request, reply) => {
    const user = await requireOwner(request, reply, "locations:write");
    if (!user) return;
    const body = parsedBody(request, reply, locationSchema.partial().strict().refine((v) => Object.keys(v).length > 0));
    if (!body) return;
    const { id } = request.params as { id: string };
    const mapping: Record<string, string> = {
      slug: "slug", nameEn: "name_en", nameHi: "name_hi", nameMr: "name_mr",
      address: "address", locality: "locality", postalCode: "postal_code",
      pickupInstructions: "pickup_instructions", isActive: "is_active",
    };
    const db = getDatabase();
    let updated = false;
    for (const [key, value] of Object.entries(body)) {
      const column = mapping[key];
      if (!column) throw new Error(`Unsupported pickup location update field: ${key}`);
      const [row] = await db.unsafe(
        `UPDATE pickup_locations SET "${column}" = $1, updated_at = now()
         WHERE id = $2 AND archived_at IS NULL RETURNING id`,
        [value, id],
      );
      if (row) updated = true;
    }
    if (!updated) return reply.code(404).send({ error: "Pickup location not found." });
    const [location] = await db`
      SELECT is_active AS "isActive", slug FROM pickup_locations WHERE id = ${id}
    `;
    if (!location) return reply.code(404).send({ error: "Pickup location not found." });
    await recordAdminActivity({
      actorUserId: user.id, action: "location.updated", subjectType: "pickup_location",
      subjectId: id, summary: { slug: location.slug, isActive: location.isActive },
      requestMetadata: requestMetadata(request),
    });
    return reply.send({ location });
  });

  app.get("/api/admin/enquiries", async (request, reply) => {
    if (!(await requireOwner(request, reply, "enquiries:read"))) return;
    const enquiries = await getDatabase()`
      SELECT e.id, e.vehicle_name_snapshot AS "vehicleName", e.package_code AS "packageCode",
        e.pickup_location_snapshot AS "pickupLocation", e.pickup_at AS "pickupAt",
        e.return_at AS "returnAt", e.customer_name AS "customerName",
        e.customer_note AS "customerNote", e.status, e.internal_notes AS "internalNotes",
        e.price_snapshot AS "priceSnapshot", e.created_at AS "createdAt", e.updated_at AS "updatedAt"
      FROM enquiries e ORDER BY e.created_at DESC LIMIT 200
    `;
    return reply.send({ enquiries });
  });

  app.patch("/api/admin/enquiries/:id", async (request, reply) => {
    const user = await requireOwner(request, reply, "enquiries:read");
    if (!user) return;
    const body = parsedBody(request, reply, enquiryUpdateSchema);
    if (!body) return;
    const { id } = request.params as { id: string };
    const [before] = await getDatabase()`
      SELECT status, internal_notes AS "internalNotes" FROM enquiries WHERE id = ${id}
    `;
    if (!before) {
      reply.code(404).send({ error: "Enquiry not found." });
      return;
    }
    const [after] = await getDatabase()`
      UPDATE enquiries
      SET status = COALESCE(${body.status ?? null}, status),
          internal_notes = COALESCE(${body.internalNotes ?? null}, internal_notes),
          updated_at = now()
      WHERE id = ${id}
      RETURNING id, status, internal_notes AS "internalNotes"
    `;
    if (!after) return reply.code(404).send({ error: "Enquiry not found." });
    await recordAdminActivity({
      actorUserId: user.id, action: "enquiry.updated", subjectType: "enquiry", subjectId: id,
      summary: {
        status: { previous: before.status, current: after.status },
        internalNotesUpdated: body.internalNotes !== undefined,
      },
      requestMetadata: requestMetadata(request),
    });
    return reply.send({ enquiry: after });
  });

  app.get("/api/admin/policies", async (request, reply) => {
    if (!(await requireOwner(request, reply, "policies:write"))) return;
    const policies = await getDatabase()`
      SELECT id, slug, locale, title, content, is_published AS "isPublished",
        version, updated_at AS "updatedAt"
      FROM policy_documents ORDER BY slug, locale
    `;
    return reply.send({ policies });
  });

  app.put("/api/admin/policies", async (request, reply) => {
    const user = await requireOwner(request, reply, "policies:write");
    if (!user) return;
    const body = parsedBody(request, reply, policySchema);
    if (!body) return;
    const result = await getDatabase().begin(async (tx) => {
      const [previous] = await tx`
        SELECT id, version, title, content, is_published AS "isPublished"
        FROM policy_documents WHERE slug = ${body.slug} AND locale = ${body.locale}
        FOR UPDATE
      `;
      if (previous) {
        await tx`
          INSERT INTO policy_document_versions
            (document_id, version, title, content, is_published, changed_by)
          VALUES (
            ${previous.id}, ${previous.version}, ${previous.title}, ${previous.content},
            ${previous.isPublished}, ${user.id}
          )
        `;
      }
      const [document] = await tx`
        INSERT INTO policy_documents (slug, locale, title, content, is_published, version, updated_by)
        VALUES (${body.slug}, ${body.locale}, ${body.title}, ${body.content}, ${body.isPublished},
          ${previous ? previous.version + 1 : 1}, ${user.id})
        ON CONFLICT (slug, locale) DO UPDATE SET
          title = EXCLUDED.title, content = EXCLUDED.content, is_published = EXCLUDED.is_published,
          version = EXCLUDED.version, updated_by = EXCLUDED.updated_by, updated_at = now()
        RETURNING id, slug, locale, version, is_published AS "isPublished"
      `;
      if (!document) throw new Error("Policy could not be saved.");
      return document;
    });
    if (!result) return reply.code(500).send({ error: "Policy could not be saved." });
    await recordAdminActivity({
      actorUserId: user.id, action: "policy.updated", subjectType: "policy",
      subjectId: result.id, summary: { slug: body.slug, locale: body.locale, version: result.version },
      requestMetadata: requestMetadata(request),
    });
    return reply.send({ policy: result });
  });

  app.get("/api/admin/activity", async (request, reply) => {
    if (!(await requireOwner(request, reply, "audit:read"))) return;
    const query = request.query as { limit?: string };
    const limit = query.limit === undefined ? 50 : Number(query.limit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return reply.code(400).send({ error: "Activity limit must be between 1 and 100." });
    }
    return reply.send({ entries: await getRecentAdminActivity(limit) });
  });
}
