import Fastify, {
  type FastifyError,
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getDatabase } from "./auth/database.js";
import { enforceRateLimits } from "./auth/http.js";
import { isTrustedFrontendOrigin, normalizeClientAddress } from "./auth/security.js";
import { getCurrentUser } from "./auth/session.js";
import { registerAdminRoutes } from "./routes/admin.js";

const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";
const enquirySchema = z.object({
  vehicleSlug: z.string().trim().max(100).nullable(),
  packageCode: z.string().trim().max(100).nullable(),
  pickupLocationSlug: z.string().trim().max(100).nullable(),
  pickupAt: z.string().datetime(),
  returnAt: z.string().datetime(),
  customerName: z.string().trim().max(100).optional(),
  customerNote: z.string().trim().max(300).optional(),
}).strict();
const customerRegistrationSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(128),
  displayName: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(30).optional(),
}).strict();

function requestMetadata(request: FastifyRequest) {
  return {
    clientAddress: normalizeClientAddress(request.ip),
    userAgent: request.headers["user-agent"]?.slice(0, 500) ?? null,
  };
}

function requiredBody<T extends z.ZodType>(
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

function publicImageUrl(storagePath: string): string {
  if (storagePath.startsWith("/")) return storagePath;
  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error("SUPABASE_URL must be configured to serve vehicle photos.");
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "vehicle-images";
  return `${url.replace(/\/+$/, "")}/storage/v1/object/public/${bucket}/${storagePath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

export function createServer(): FastifyInstance {
  const app = Fastify({
    logger: true,
    bodyLimit: 10 * 1024 * 1024,
    trustProxy: process.env.TRUST_PROXY === "true",
  });

  app.register(cors, {
    origin: frontendOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  });
  app.register(cookie);
  app.register(multipart, {
    limits: { fileSize: 8 * 1024 * 1024, files: 1, fields: 5 },
  });

  app.addHook("preHandler", async (request, reply) => {
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) return;
    const origin = request.headers.origin;
    const fetchSite = request.headers["sec-fetch-site"];
    const forwardedProto = request.headers["x-forwarded-proto"];
    const protocol = Array.isArray(forwardedProto)
      ? forwardedProto[0]
      : (forwardedProto ?? request.protocol);
    if (!isTrustedFrontendOrigin(origin, fetchSite, protocol)) {
      reply.code(403).send({ error: "Request origin could not be verified." });
      return;
    }
  });

  app.setErrorHandler((error: FastifyError, request, reply) => {
    request.log.error({ err: error }, "Backend request failed");
    const statusCode =
      error.code === "FST_REQ_FILE_TOO_LARGE" || error.code === "FST_FILES_LIMIT"
        ? 413
        : error.statusCode && error.statusCode >= 400 && error.statusCode < 500
          ? error.statusCode
          : 500;
    reply.code(statusCode).send({
      error:
        statusCode === 413
          ? "The upload exceeds the allowed size."
          : statusCode === 500
            ? "The service is temporarily unavailable."
            : error.message,
    });
  });

  app.get("/healthz", async (_request, reply) => reply.send({ status: "ok" }));

  app.get("/api/auth/session", async (request, reply) => {
    return reply.send({ user: await getCurrentUser(request, reply) });
  });

  app.post("/api/auth/register", async (request, reply) => {
    const body = requiredBody(request, reply, customerRegistrationSchema);
    if (!body) return;

    const meta = requestMetadata(request);
    const limited = await enforceRateLimits(
      "customer-registration",
      "",
      meta.clientAddress,
      [],
    );
    if (!limited.allowed) {
      return reply
        .header("Retry-After", String(limited.retryAfterSeconds ?? 900))
        .code(429)
        .send({ error: "Too many account creation attempts. Please try again later." });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    if (!supabaseUrl || !secretKey) {
      throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY are required for customer registration.");
    }

    const supabase = createClient(supabaseUrl, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: {
        display_name: body.displayName,
        phone: body.phone ?? "",
      },
    });

    if (error) {
      if (error.code === "email_exists" || error.code === "user_already_exists") {
        return reply.code(409).send({ error: "An account with this email already exists. Please sign in." });
      }
      request.log.warn({ code: error.code }, "Supabase rejected customer registration.");
      return reply.code(400).send({ error: "The account could not be created. Please check the details and try again." });
    }

    if (!data.user) {
      throw new Error("Supabase returned no user after customer registration.");
    }

    return reply.code(201).send({ created: true });
  });

  app.patch("/api/account", async (request, reply) => {
    const user = await getCurrentUser(request, reply);
    if (!user) return reply.code(401).send({ error: "Authentication required." });
    if (user.role !== "CUSTOMER") return reply.code(403).send({ error: "Forbidden." });
    const schema = z.object({
      displayName: z.string().trim().min(1).max(100).optional(),
      phone: z.union([z.string().trim().max(30), z.literal("")]).optional(),
    }).strict().refine((value) => Object.keys(value).length > 0);
    const body = requiredBody(request, reply, schema);
    if (!body) return;
    const [profile] = await getDatabase()`
      UPDATE customer_profiles
      SET display_name = COALESCE(${body.displayName ?? null}, display_name),
          phone = CASE WHEN ${body.phone !== undefined} THEN ${body.phone || null} ELSE phone END,
          updated_at = now()
      WHERE user_id = ${user.id}
      RETURNING display_name AS "displayName", phone
    `;
    if (!profile) return reply.code(404).send({ error: "Customer profile was not found." });
    return reply.send({ user: { ...user, ...profile } });
  });

  app.get("/api/public/catalog", async (_request, reply) => {
    const vehicles = await getDatabase()`
      SELECT v.id, v.slug, v.make, v.model, v.display_name AS "displayName",
        v.variant, v.unit_identifier AS "unitIdentifier", v.fuel_type AS "fuelType",
        v.transmission, v.seating_capacity AS "seatingCapacity", v.body_type AS "bodyType",
        v.description, v.is_available AS "isAvailable", v.is_featured AS "isFeatured",
        v.display_order AS "displayOrder",
        COALESCE((
          SELECT json_agg(json_build_object(
            'url', p.storage_path, 'altText', p.alt_text,
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
      WHERE v.is_published AND v.archived_at IS NULL
      ORDER BY v.display_order, v.created_at
    `;
    return reply.send({
      vehicles: vehicles.map((vehicle) => ({
        ...vehicle,
        photos: vehicle.photos.map((photo: { url: string }) => ({
          ...photo,
          url: publicImageUrl(photo.url),
        })),
      })),
    });
  });

  app.get("/api/public/policies/:locale", async (request, reply) => {
    const { locale } = request.params as { locale: string };
    if (!["en", "hi", "mr"].includes(locale)) {
      return reply.code(400).send({ error: "Unsupported locale." });
    }
    const policies = await getDatabase()`
      SELECT slug, locale, title, content, version
      FROM policy_documents WHERE locale = ${locale} AND is_published
      ORDER BY slug
    `;
    return reply.send({ policies });
  });

  app.get("/api/public/locations/:locale", async (request, reply) => {
    const { locale } = request.params as { locale: string };
    if (!["en", "hi", "mr"].includes(locale)) {
      return reply.code(400).send({ error: "Unsupported locale." });
    }
    const locations = await getDatabase()`
      SELECT slug,
        CASE ${locale}
          WHEN 'hi' THEN COALESCE(name_hi, name_en)
          WHEN 'mr' THEN COALESCE(name_mr, name_en)
          ELSE name_en
        END AS name,
        locality, address
      FROM pickup_locations
      WHERE is_active AND archived_at IS NULL
      ORDER BY name_en
    `;
    return reply.send({ locations });
  });

  app.post("/api/enquiries", async (request, reply) => {
    const authenticated = await getCurrentUser(request, reply);
    if (reply.sent) return;
    if (!authenticated) {
      return reply.code(401).send({ error: "Sign in with a customer account to submit an enquiry." });
    }
    if (authenticated.role !== "CUSTOMER") {
      return reply.code(403).send({ error: "Only customer accounts can submit rental enquiries." });
    }

    const body = requiredBody(request, reply, enquirySchema);
    if (!body) return;
    if (new Date(body.returnAt) <= new Date(body.pickupAt)) {
      return reply.code(400).send({ error: "Return time must be after pickup time." });
    }
    const meta = requestMetadata(request);
    const limited = await enforceRateLimits("customer-enquiry", "", meta.clientAddress, [
      { scope: "enquiry-ip", limit: 5, windowSeconds: 900 },
    ]);
    if (!limited.allowed) {
      return reply.header("Retry-After", String(limited.retryAfterSeconds ?? 900))
        .code(429).send({ error: "Too many enquiries. Please wait before trying again." });
    }
    const db = getDatabase();
    let vehicleId: string | null = null;
    let vehicleName: string | null = null;
    let priceSnapshot: Record<string, unknown> = {};
    if (body.vehicleSlug) {
      const [vehicle] = await db`
        SELECT id, display_name AS "displayName", is_available AS "isAvailable"
        FROM vehicles WHERE slug = ${body.vehicleSlug} AND is_published AND archived_at IS NULL
      `;
      if (!vehicle) return reply.code(400).send({ error: "Selected vehicle is not available for enquiries." });
      vehicleId = vehicle.id;
      vehicleName = vehicle.displayName;
      if (body.packageCode) {
        const [price] = await db`
          SELECT package_code AS "packageCode", pricing_status AS "pricingStatus",
            amount_inr AS "amountInr", included_km AS "includedKm",
            extra_km_charge_inr AS "extraKmChargeInr"
          FROM vehicle_pricing WHERE vehicle_id = ${vehicle.id} AND package_code = ${body.packageCode}
        `;
        if (price) priceSnapshot = price;
      }
    }
    let locationId: string | null = null;
    let locationName: string | null = null;
    if (body.pickupLocationSlug) {
      const [location] = await db`
        SELECT id, name_en AS name FROM pickup_locations
        WHERE slug = ${body.pickupLocationSlug} AND is_active AND archived_at IS NULL
      `;
      if (!location) return reply.code(400).send({ error: "Selected pickup point is no longer active." });
      locationId = location.id;
      locationName = location.name;
    }
    const [enquiry] = await db`
      INSERT INTO enquiries (
        customer_id, vehicle_id, vehicle_name_snapshot, package_code,
        pickup_location_id, pickup_location_snapshot, pickup_at, return_at,
        customer_name, customer_note, price_snapshot
      ) VALUES (
        ${authenticated.id}, ${vehicleId},
        ${vehicleName}, ${body.packageCode}, ${locationId}, ${locationName},
        ${new Date(body.pickupAt)}, ${new Date(body.returnAt)},
        ${body.customerName ?? null}, ${body.customerNote ?? ""},
        ${JSON.stringify(priceSnapshot)}::jsonb
      )
      RETURNING id, created_at AS "createdAt"
    `;
    return reply.code(201).send({ enquiry });
  });

  registerAdminRoutes(app);
  return app;
}

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "127.0.0.1";

if (process.env.NODE_ENV !== "test") {
  const app = createServer();
  await app.listen({ port, host });
}
