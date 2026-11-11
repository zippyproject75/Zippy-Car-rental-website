"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import { LogoutButton } from "@/features/auth/LogoutButton";

type Panel = "overview" | "vehicles" | "locations" | "enquiries" | "policies" | "activity";
type Overview = {
  fleet?: { total?: number; available?: number; unavailable?: number };
  customers?: { total?: number };
  enquiries?: { total?: number; new?: number };
  activePackages?: number;
};

type Vehicle = {
  id: string;
  slug: string;
  make: string;
  model: string;
  displayName: string;
  variant: string | null;
  unitIdentifier: string | null;
  fuelType: string | null;
  transmission: string | null;
  seatingCapacity: number | null;
  bodyType: string | null;
  description: string;
  isAvailable: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  photos: { id: string; url: string; altText: string; isPrimary: boolean }[];
  pricing: {
    packageCode: string;
    pricingStatus: "APPROVED" | "PENDING" | "PRICE_ON_REQUEST";
    amountInr: number | null;
    includedKm: number | null;
    extraKmChargeInr: number | null;
  }[];
};

type Location = {
  id: string;
  slug: string;
  nameEn: string;
  nameHi: string | null;
  nameMr: string | null;
  address: string;
  locality: string;
  postalCode: string | null;
  pickupInstructions: string;
  isActive: boolean;
};

type Enquiry = {
  id: string;
  vehicleName: string | null;
  packageCode: string | null;
  pickupLocation: string | null;
  pickupAt: string;
  returnAt: string;
  customerName: string | null;
  customerNote: string | null;
  status: string;
  internalNotes: string | null;
  createdAt: string;
};

type Policy = {
  id: string;
  slug: string;
  locale: "en" | "hi" | "mr";
  title: string;
  content: string;
  isPublished: boolean;
  version: number;
  updatedAt: string;
};

type Activity = {
  id: string;
  action: string;
  subjectType: string | null;
  subjectId: string | null;
  summary: Record<string, unknown>;
  createdAt: string;
  actorEmail: string | null;
};

const panels: { id: Panel; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "vehicles", label: "Vehicles & pricing" },
  { id: "locations", label: "Pickup locations" },
  { id: "enquiries", label: "Enquiries" },
  { id: "policies", label: "Policies" },
  { id: "activity", label: "Activity log" },
];

const inputClass =
  "min-h-11 w-full rounded-control border border-line bg-canvas px-3 py-2 text-sm text-ink";
const labelClass = "grid gap-1.5 text-sm font-medium text-ink";
const buttonClass =
  "inline-flex min-h-10 items-center justify-center rounded-control bg-accent px-4 py-2 text-sm font-semibold text-on-accent disabled:cursor-not-allowed disabled:opacity-60";

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, credentials: "same-origin" });
  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // Keep the HTTP status when the server does not return a JSON error.
    }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className={labelClass}>
      {label}
      <input
        className={inputClass}
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function AdminConsole({ ownerEmail }: { ownerEmail: string }) {
  const [panel, setPanel] = useState<Panel>("overview");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [vehicleDraft, setVehicleDraft] = useState<Partial<Vehicle>>({});
  const [newVehicle, setNewVehicle] = useState(false);
  const [newLocation, setNewLocation] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState("");

  const loadPanel = useCallback(async (target: Panel) => {
    if (target === "overview") setOverview(await requestJson<Overview>("/api/admin/overview"));
    if (target === "vehicles") {
      const result = await requestJson<{ vehicles: Vehicle[] }>("/api/admin/vehicles");
      setVehicles(result.vehicles);
    }
    if (target === "locations") {
      const result = await requestJson<{ locations: Location[] }>("/api/admin/locations");
      setLocations(result.locations);
    }
    if (target === "enquiries") {
      const result = await requestJson<{ enquiries: Enquiry[] }>("/api/admin/enquiries");
      setEnquiries(result.enquiries);
    }
    if (target === "policies") {
      const result = await requestJson<{ policies: Policy[] }>("/api/admin/policies");
      setPolicies(result.policies);
    }
    if (target === "activity") {
      const result = await requestJson<{ entries: Activity[] }>("/api/admin/activity?limit=100");
      setActivity(result.entries);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPanel(panel).catch((error: unknown) => {
        setNotice(
          error instanceof Error ? error.message : "The requested data could not be loaded.",
        );
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadPanel, panel]);

  async function perform(action: () => Promise<void>, successMessage = "Changes saved.") {
    setNotice("");
    setBusy(true);
    try {
      await action();
      setNotice(successMessage);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The operation could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  function editVehicle(vehicle: Vehicle) {
    setSelectedVehicleId(vehicle.id);
    setVehicleDraft({ ...vehicle });
    setNewVehicle(false);
  }

  function updateVehicleField<K extends keyof Vehicle>(key: K, value: Vehicle[K]) {
    setVehicleDraft((current) => ({ ...current, [key]: value }));
  }

  async function saveVehicle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await perform(async () => {
      const values = { ...vehicleDraft };
      delete values.id;
      delete values.photos;
      delete values.pricing;
      delete values.archivedAt;
      delete values.createdAt;
      delete values.updatedAt;
      const vehicle = newVehicle
        ? await requestJson<{ vehicle: { id: string } }>("/api/admin/vehicles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          })
        : await requestJson<{ vehicle: Vehicle }>(`/api/admin/vehicles/${selectedVehicleId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
      if (newVehicle) {
        setSelectedVehicleId(vehicle.vehicle.id);
        setNewVehicle(false);
      }
      await loadPanel("vehicles");
    });
  }

  async function archiveVehicle(vehicle: Vehicle) {
    if (
      !window.confirm(`Archive ${vehicle.displayName}? It will be removed from the public fleet.`)
    ) {
      return;
    }
    await perform(async () => {
      await requestJson(`/api/admin/vehicles/${vehicle.id}`, { method: "DELETE" });
      if (selectedVehicleId === vehicle.id) {
        setSelectedVehicleId("");
        setVehicleDraft({});
      }
      await loadPanel("vehicles");
    }, "Vehicle archived.");
  }

  async function savePricing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedVehicleId) return;
    const form = new FormData(event.currentTarget);
    const amount = String(form.get("amountInr") ?? "");
    const included = String(form.get("includedKm") ?? "");
    const extra = String(form.get("extraKmChargeInr") ?? "");
    const status = String(form.get("pricingStatus"));
    await perform(async () => {
      await requestJson(`/api/admin/vehicles/${selectedVehicleId}/pricing`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageCode: String(form.get("packageCode")),
          pricingStatus: status,
          amountInr: status === "APPROVED" && amount !== "" ? Number(amount) : null,
          includedKm: included ? Number(included) : null,
          extraKmChargeInr: extra ? Number(extra) : null,
        }),
      });
      await loadPanel("vehicles");
    }, "Pricing updated and recorded in the audit history.");
  }

  async function uploadPhoto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedVehicleId) return;
    const form = event.currentTarget;
    const file = new FormData(form).get("photo");
    if (!(file instanceof File) || !file.size) {
      setNotice("Choose an image to upload.");
      return;
    }
    await perform(async () => {
      const body = new FormData();
      body.append("photo", file);
      await requestJson(`/api/admin/vehicles/${selectedVehicleId}/photos`, {
        method: "POST",
        body,
      });
      form.reset();
      await loadPanel("vehicles");
    }, "Vehicle photo uploaded.");
  }

  async function deletePhoto(vehicle: Vehicle, photoId: string) {
    await perform(async () => {
      await requestJson(`/api/admin/vehicles/${vehicle.id}/photos/${photoId}`, {
        method: "DELETE",
      });
      await loadPanel("vehicles");
    }, "Photo removed.");
  }

  async function movePhoto(
    vehicle: Vehicle,
    photoId: string,
    direction: "up" | "down" | "primary",
  ) {
    const orderedPhotoIds = vehicle.photos.map((photo) => photo.id);
    const index = orderedPhotoIds.indexOf(photoId);
    if (direction === "up" && index > 0) {
      [orderedPhotoIds[index - 1], orderedPhotoIds[index]] = [
        orderedPhotoIds[index]!,
        orderedPhotoIds[index - 1]!,
      ];
    }
    if (direction === "down" && index >= 0 && index < orderedPhotoIds.length - 1) {
      [orderedPhotoIds[index], orderedPhotoIds[index + 1]] = [
        orderedPhotoIds[index + 1]!,
        orderedPhotoIds[index]!,
      ];
    }
    const primaryPhotoId =
      direction === "primary"
        ? photoId
        : (vehicle.photos.find((photo) => photo.isPrimary)?.id ?? orderedPhotoIds[0]);
    if (!primaryPhotoId || index < 0) return;
    await perform(
      async () => {
        await requestJson(`/api/admin/vehicles/${vehicle.id}/photos/order`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderedPhotoIds, primaryPhotoId }),
        });
        await loadPanel("vehicles");
      },
      direction === "primary" ? "Primary photo updated." : "Photo order updated.",
    );
  }

  async function createLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    await perform(async () => {
      await requestJson("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: data.slug,
          nameEn: data.nameEn,
          nameHi: data.nameHi || null,
          nameMr: data.nameMr || null,
          address: data.address || "",
          locality: data.locality || "",
          postalCode: data.postalCode || null,
          pickupInstructions: data.pickupInstructions || "",
          isActive: false,
        }),
      });
      setNewLocation(false);
      await loadPanel("locations");
    }, "Pickup location created.");
  }

  async function toggleLocation(location: Location) {
    await perform(async () => {
      await requestJson(`/api/admin/locations/${location.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !location.isActive }),
      });
      await loadPanel("locations");
    }, "Pickup location status updated.");
  }

  async function saveLocation(event: FormEvent<HTMLFormElement>, location: Location) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    await perform(async () => {
      await requestJson(`/api/admin/locations/${location.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: data.nameEn,
          nameHi: data.nameHi || null,
          nameMr: data.nameMr || null,
          address: data.address || "",
          locality: data.locality || "",
          postalCode: data.postalCode || null,
          pickupInstructions: data.pickupInstructions || "",
        }),
      });
      await loadPanel("locations");
    }, "Pickup location updated.");
  }

  async function saveEnquiry(event: FormEvent<HTMLFormElement>, enquiry: Enquiry) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await perform(async () => {
      await requestJson(`/api/admin/enquiries/${enquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: String(form.get("status")),
          internalNotes: String(form.get("internalNotes") ?? ""),
        }),
      });
      await loadPanel("enquiries");
    }, "Enquiry updated.");
  }

  async function savePolicy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await perform(async () => {
      const result = await requestJson<{ policy: { id: string } }>("/api/admin/policies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: String(form.get("slug")),
          locale: String(form.get("locale")),
          title: String(form.get("title")),
          content: String(form.get("content")),
          isPublished: form.get("isPublished") === "on",
        }),
      });
      setSelectedPolicyId(result.policy.id);
      await loadPanel("policies");
    }, "Policy saved with a new version.");
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId);
  const selectedPolicy = policies.find((policy) => policy.id === selectedPolicyId);

  return (
    <div className="container-site mx-auto px-4 py-12 sm:px-6 sm:py-16">
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="eyebrow">Private owner area</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Administration</h1>
          <p className="mt-2 text-sm text-ink-2">Signed in as {ownerEmail}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link className="text-sm font-semibold text-accent-ink underline" href="/admin/activity">
            Full activity log
          </Link>
          <LogoutButton />
        </div>
      </header>

      <nav aria-label="Owner management sections" className="mt-8 flex flex-wrap gap-2">
        {panels.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={panel === item.id}
            className={`min-h-10 rounded-control border px-3 py-2 text-sm font-medium ${
              panel === item.id
                ? "border-accent bg-accent text-on-accent"
                : "border-line bg-raised text-ink hover:bg-muted"
            }`}
            onClick={() => setPanel(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {notice ? (
        <p
          role="status"
          className="mt-5 rounded-control border border-line bg-muted p-3 text-sm text-ink"
        >
          {notice}
        </p>
      ) : null}
      {busy ? (
        <p className="mt-3 text-sm text-ink-2" aria-live="polite">
          Saving changes…
        </p>
      ) : null}

      {panel === "overview" ? (
        <section
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Business overview"
        >
          {(
            [
              ["Vehicles", overview?.fleet?.total],
              ["Available", overview?.fleet?.available],
              ["Customers", overview?.customers?.total],
              ["Enquiries", overview?.enquiries?.total],
            ] as const
          ).map(([label, value]) => (
            <article
              key={String(label)}
              className="rounded-card border border-line bg-raised p-5 shadow-raised"
            >
              <p className="text-sm text-ink-2">{label}</p>
              <p className="mt-2 font-display text-3xl font-bold text-ink">
                {value === undefined ? "—" : value}
              </p>
            </article>
          ))}
        </section>
      ) : null}

      {panel === "vehicles" ? (
        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.5fr)]">
          <div className="space-y-3">
            <button
              type="button"
              className={buttonClass}
              onClick={() => {
                setSelectedVehicleId("");
                setVehicleDraft({
                  slug: "",
                  make: "",
                  model: "",
                  displayName: "",
                  isAvailable: false,
                  isPublished: false,
                  isFeatured: false,
                  displayOrder: 0,
                });
                setNewVehicle(true);
              }}
            >
              Add vehicle
            </button>
            {vehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                className="flex items-start justify-between gap-3 rounded-card border border-line bg-raised p-4"
              >
                <button
                  type="button"
                  className="min-w-0 text-left"
                  onClick={() => editVehicle(vehicle)}
                >
                  <span className="block truncate font-semibold text-ink">
                    {vehicle.displayName}
                  </span>
                  <span className="mt-1 block text-xs text-ink-2">
                    {vehicle.isPublished ? "Published" : "Unpublished"} ·{" "}
                    {vehicle.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </button>
                <button
                  type="button"
                  className="text-xs font-medium text-red-700 underline"
                  onClick={() => void archiveVehicle(vehicle)}
                >
                  Archive
                </button>
              </article>
            ))}
          </div>

          {vehicleDraft.slug !== undefined ? (
            <div className="space-y-6 rounded-card border border-line bg-raised p-5 shadow-raised sm:p-7">
              <form
                className="grid gap-4 sm:grid-cols-2"
                onSubmit={(event) => void saveVehicle(event)}
              >
                <h2 className="text-xl font-bold text-ink sm:col-span-2">
                  {newVehicle ? "Create vehicle" : "Vehicle details"}
                </h2>
                {(
                  [
                    ["slug", "URL slug"],
                    ["make", "Make"],
                    ["model", "Model"],
                    ["displayName", "Display name"],
                    ["variant", "Variant"],
                    ["unitIdentifier", "Unit identifier"],
                    ["fuelType", "Fuel type"],
                    ["transmission", "Transmission"],
                    ["seatingCapacity", "Seats"],
                    ["bodyType", "Body type"],
                    ["displayOrder", "Display order"],
                  ] as const
                ).map(([key, title]) => (
                  <Field
                    key={key}
                    label={title}
                    type={key === "seatingCapacity" || key === "displayOrder" ? "number" : "text"}
                    value={String(vehicleDraft[key] ?? "")}
                    required={(
                      ["slug", "make", "model", "displayName"] as readonly string[]
                    ).includes(key)}
                    onChange={(value) =>
                      updateVehicleField(
                        key,
                        key === "seatingCapacity" || key === "displayOrder"
                          ? value
                            ? Number(value)
                            : null
                          : value,
                      )
                    }
                  />
                ))}
                <label className={`${labelClass} sm:col-span-2`}>
                  Description
                  <textarea
                    className={`${inputClass} min-h-24`}
                    value={vehicleDraft.description ?? ""}
                    onChange={(event) => updateVehicleField("description", event.target.value)}
                  />
                </label>
                <div className="flex flex-wrap gap-5 sm:col-span-2">
                  {(
                    [
                      ["isAvailable", "Available"],
                      ["isPublished", "Published on website"],
                      ["isFeatured", "Featured"],
                    ] as const
                  ).map(([key, title]) => (
                    <label className="flex items-center gap-2 text-sm text-ink" key={key}>
                      <input
                        type="checkbox"
                        checked={Boolean(vehicleDraft[key])}
                        onChange={(event) => updateVehicleField(key, event.target.checked)}
                      />
                      {title}
                    </label>
                  ))}
                </div>
                <button className={buttonClass} type="submit" disabled={busy}>
                  Save vehicle
                </button>
              </form>

              {!newVehicle && selectedVehicle ? (
                <>
                  <form
                    key={selectedVehicle.id}
                    className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2"
                    onSubmit={(event) => void savePricing(event)}
                  >
                    <h3 className="font-semibold text-ink sm:col-span-2">Package pricing</h3>
                    {(() => {
                      const current = selectedVehicle.pricing.find(
                        (item) => item.packageCode === "12-hour",
                      );
                      return (
                        <>
                          <label className={labelClass}>
                            Package
                            <input
                              name="packageCode"
                              className={inputClass}
                              defaultValue={current?.packageCode ?? "12-hour"}
                              required
                            />
                          </label>
                          <label className={labelClass}>
                            Status
                            <select
                              name="pricingStatus"
                              className={inputClass}
                              defaultValue={current?.pricingStatus ?? "PENDING"}
                            >
                              <option value="APPROVED">Approved price</option>
                              <option value="PENDING">Pending confirmation</option>
                              <option value="PRICE_ON_REQUEST">Price on request</option>
                            </select>
                          </label>
                          <label className={labelClass}>
                            Price (INR)
                            <input
                              name="amountInr"
                              className={inputClass}
                              type="number"
                              min="0"
                              defaultValue={current?.amountInr ?? ""}
                            />
                          </label>
                          <label className={labelClass}>
                            Included kilometres
                            <input
                              name="includedKm"
                              className={inputClass}
                              type="number"
                              defaultValue={current?.includedKm ?? ""}
                            />
                          </label>
                          <label className={labelClass}>
                            Extra km charge (INR)
                            <input
                              name="extraKmChargeInr"
                              className={inputClass}
                              type="number"
                              defaultValue={current?.extraKmChargeInr ?? ""}
                            />
                          </label>
                          <button className={buttonClass} type="submit" disabled={busy}>
                            Save pricing
                          </button>
                        </>
                      );
                    })()}
                  </form>

                  <div className="border-t border-line pt-5">
                    <h3 className="font-semibold text-ink">Vehicle photographs</h3>
                    <form
                      className="mt-3 flex flex-wrap items-end gap-3"
                      onSubmit={(event) => void uploadPhoto(event)}
                    >
                      <label className={`${labelClass} min-w-56 flex-1`}>
                        Add photo (PNG, JPEG or WebP; maximum 8 MB)
                        <input
                          className={inputClass}
                          type="file"
                          name="photo"
                          accept="image/png,image/jpeg,image/webp"
                          required
                        />
                      </label>
                      <button className={buttonClass} type="submit" disabled={busy}>
                        Upload photo
                      </button>
                    </form>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {selectedVehicle.photos.map((photo) => (
                        <li
                          key={photo.id}
                          className="flex items-center gap-3 rounded-control border border-line p-2"
                        >
                          <Image
                            src={photo.url}
                            alt={photo.altText}
                            width={64}
                            height={64}
                            className="size-16 rounded object-cover"
                          />
                          <span className="min-w-0 flex-1 truncate text-xs text-ink-2">
                            {photo.altText}
                            {photo.isPrimary ? " · Primary" : ""}
                          </span>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              className="text-xs text-accent-ink underline"
                              onClick={() => void movePhoto(selectedVehicle, photo.id, "up")}
                              aria-label="Move photo earlier"
                            >
                              Move up
                            </button>
                            <button
                              type="button"
                              className="text-xs text-accent-ink underline"
                              onClick={() => void movePhoto(selectedVehicle, photo.id, "down")}
                              aria-label="Move photo later"
                            >
                              Move down
                            </button>
                            {!photo.isPrimary ? (
                              <button
                                type="button"
                                className="text-xs text-accent-ink underline"
                                onClick={() => void movePhoto(selectedVehicle, photo.id, "primary")}
                              >
                                Make primary
                              </button>
                            ) : null}
                            <button
                              type="button"
                              className="text-xs text-red-700 underline"
                              onClick={() => void deletePhoto(selectedVehicle, photo.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <p className="rounded-card border border-line bg-raised p-6 text-sm text-ink-2">
              Select a vehicle to edit it, or add a new vehicle.
            </p>
          )}
        </section>
      ) : null}

      {panel === "locations" ? (
        <section className="mt-8 space-y-4">
          <button
            className={buttonClass}
            type="button"
            onClick={() => setNewLocation((value) => !value)}
          >
            {newLocation ? "Cancel" : "Add pickup location"}
          </button>
          {newLocation ? (
            <form
              className="grid gap-4 rounded-card border border-line bg-raised p-5 sm:grid-cols-2"
              onSubmit={(event) => void createLocation(event)}
            >
              {(
                [
                  ["slug", "URL slug"],
                  ["nameEn", "Name (English)"],
                  ["nameHi", "Name (Hindi)"],
                  ["nameMr", "Name (Marathi)"],
                  ["locality", "Locality"],
                  ["address", "Address"],
                  ["postalCode", "Postal code"],
                  ["pickupInstructions", "Pickup instructions"],
                ] as const
              ).map(([name, title]) => (
                <label key={name} className={labelClass}>
                  {title}
                  <input
                    className={inputClass}
                    name={name}
                    required={["slug", "nameEn"].includes(name)}
                  />
                </label>
              ))}
              <button type="submit" className={buttonClass} disabled={busy}>
                Create location
              </button>
            </form>
          ) : null}
          <ul className="grid gap-4 md:grid-cols-2">
            {locations.map((location) => (
              <li key={location.id} className="rounded-card border border-line bg-raised p-5">
                <form
                  key={`${location.id}-${location.nameEn}`}
                  className="grid gap-3"
                  onSubmit={(event) => void saveLocation(event, location)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-ink">{location.nameEn}</h2>
                      <p className="mt-1 text-sm text-ink-2">
                        {location.locality} · {location.address}
                      </p>
                    </div>
                    <span className="text-xs text-ink-2">
                      {location.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {(
                    [
                      ["nameEn", "Name (English)", location.nameEn],
                      ["nameHi", "Name (Hindi)", location.nameHi ?? ""],
                      ["nameMr", "Name (Marathi)", location.nameMr ?? ""],
                      ["locality", "Locality", location.locality],
                      ["address", "Address", location.address],
                      ["postalCode", "Postal code", location.postalCode ?? ""],
                      ["pickupInstructions", "Pickup instructions", location.pickupInstructions],
                    ] as const
                  ).map(([name, title, value]) => (
                    <label className={labelClass} key={name}>
                      {title}
                      <input className={inputClass} name={name} defaultValue={value} />
                    </label>
                  ))}
                  <div className="flex flex-wrap gap-4">
                    <button className={buttonClass} type="submit" disabled={busy}>
                      Save location
                    </button>
                    <button
                      type="button"
                      className="text-sm font-semibold text-accent-ink underline"
                      onClick={() => void toggleLocation(location)}
                    >
                      {location.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </form>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {panel === "enquiries" ? (
        <section className="mt-8 space-y-4">
          {enquiries.map((enquiry) => (
            <form
              key={enquiry.id}
              className="grid gap-4 rounded-card border border-line bg-raised p-5 sm:grid-cols-2"
              onSubmit={(event) => void saveEnquiry(event, enquiry)}
            >
              <div>
                <h2 className="font-semibold text-ink">
                  {enquiry.customerName || "Customer enquiry"}
                </h2>
                <p className="mt-1 text-sm text-ink-2">
                  {enquiry.vehicleName || "Any vehicle"} ·{" "}
                  {enquiry.pickupLocation || "Pickup to confirm"}
                </p>
                <p className="mt-1 text-xs text-ink-3">
                  {new Date(enquiry.pickupAt).toLocaleString()} –{" "}
                  {new Date(enquiry.returnAt).toLocaleString()}
                </p>
                {enquiry.customerNote ? (
                  <p className="mt-2 text-sm text-ink-2">{enquiry.customerNote}</p>
                ) : null}
              </div>
              <div className="grid gap-3">
                <label className={labelClass}>
                  Status
                  <select name="status" className={inputClass} defaultValue={enquiry.status}>
                    {[
                      "NEW",
                      "CONTACTED",
                      "AWAITING_CONFIRMATION",
                      "CONFIRMED",
                      "COMPLETED",
                      "CANCELLED",
                    ].map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={labelClass}>
                  Private owner notes
                  <textarea
                    name="internalNotes"
                    className={`${inputClass} min-h-20`}
                    defaultValue={enquiry.internalNotes ?? ""}
                  />
                </label>
                <button className={buttonClass} type="submit" disabled={busy}>
                  Save enquiry
                </button>
              </div>
            </form>
          ))}
          {!enquiries.length ? <p className="text-sm text-ink-2">No enquiries received.</p> : null}
        </section>
      ) : null}

      {panel === "policies" ? (
        <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(14rem,0.7fr)_minmax(0,1.5fr)]">
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                className={`w-full rounded-control border p-3 text-left text-sm ${
                  selectedPolicyId === "new" ? "border-accent bg-muted" : "border-line bg-raised"
                }`}
                onClick={() => setSelectedPolicyId("new")}
              >
                <span className="block font-semibold text-ink">Create policy document</span>
                <span className="text-xs text-ink-2">New locale or policy</span>
              </button>
            </li>
            {policies.map((policy) => (
              <li key={policy.id}>
                <button
                  type="button"
                  className={`w-full rounded-control border p-3 text-left text-sm ${
                    selectedPolicyId === policy.id
                      ? "border-accent bg-muted"
                      : "border-line bg-raised"
                  }`}
                  onClick={() => setSelectedPolicyId(policy.id)}
                >
                  <span className="block font-semibold text-ink">{policy.title}</span>
                  <span className="text-xs text-ink-2">
                    {policy.slug} · {policy.locale} · v{policy.version}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {selectedPolicy || selectedPolicyId === "new" ? (
            <form
              key={selectedPolicyId}
              className="grid gap-4 rounded-card border border-line bg-raised p-5"
              onSubmit={(event) => void savePolicy(event)}
            >
              <label className={labelClass}>
                Slug
                <input
                  className={inputClass}
                  name="slug"
                  defaultValue={selectedPolicy?.slug ?? ""}
                  required
                />
              </label>
              <label className={labelClass}>
                Locale
                <select
                  className={inputClass}
                  name="locale"
                  defaultValue={selectedPolicy?.locale ?? "en"}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="mr">Marathi</option>
                </select>
              </label>
              <label className={labelClass}>
                Title
                <input
                  className={inputClass}
                  name="title"
                  defaultValue={selectedPolicy?.title ?? ""}
                  required
                />
              </label>
              <label className={labelClass}>
                Content
                <textarea
                  className={`${inputClass} min-h-80`}
                  name="content"
                  defaultValue={selectedPolicy?.content ?? ""}
                  required
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  name="isPublished"
                  defaultChecked={selectedPolicy?.isPublished ?? false}
                />
                Published
              </label>
              <button className={buttonClass} type="submit" disabled={busy}>
                Save policy
              </button>
            </form>
          ) : (
            <p className="rounded-card border border-line bg-raised p-5 text-sm text-ink-2">
              Select a policy document to edit.
            </p>
          )}
        </section>
      ) : null}

      {panel === "activity" ? (
        <section className="mt-8 divide-y divide-line rounded-card border border-line bg-raised px-5 shadow-raised sm:px-7">
          {activity.map((entry) => (
            <article key={entry.id} className="py-5">
              <div className="flex flex-wrap justify-between gap-2">
                <h2 className="font-semibold text-ink">{entry.action}</h2>
                <time className="text-xs text-ink-3" dateTime={entry.createdAt}>
                  {new Date(entry.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Kolkata",
                  })}
                </time>
              </div>
              <p className="mt-1 text-sm text-ink-2">
                {entry.actorEmail ?? "Owner"} · {entry.subjectType ?? "account"}
              </p>
              {Object.keys(entry.summary).length ? (
                <pre className="mt-2 overflow-auto text-xs text-ink-3">
                  {JSON.stringify(entry.summary, null, 2)}
                </pre>
              ) : null}
            </article>
          ))}
          {!activity.length ? (
            <p className="py-5 text-sm text-ink-2">No activity recorded.</p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
