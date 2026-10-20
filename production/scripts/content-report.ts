import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { registerHooks } from "node:module";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Node's type-stripper does not apply tsconfig path aliases or TypeScript extension
// resolution. Keep this launch audit pointed at the same source modules as the app.
registerHooks({
  resolve(specifier, context, nextResolve) {
    let candidate: string | undefined;
    if (specifier.startsWith("@/")) {
      candidate = path.join(root, "src", specifier.slice(2));
    } else if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
      candidate = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    }

    if (candidate && !path.extname(candidate) && fs.existsSync(`${candidate}.ts`)) {
      return { url: pathToFileURL(`${candidate}.ts`).href, shortCircuit: true };
    }
    if (candidate && fs.existsSync(candidate)) {
      return { url: pathToFileURL(candidate).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});

const [{ site }, { cars }, { pricingConfig }, { legalDocuments, isLegalApproved }, routing] =
  await Promise.all([
    import("../src/data/site"),
    import("../src/data/cars"),
    import("../src/data/pricing"),
    import("../src/data/legal/index"),
    import("../src/i18n/routing"),
  ]);

type Finding = { launchRequired: boolean; message: string };
const findings: Finding[] = [];
const add = (message: string, launchRequired = false) => findings.push({ launchRequired, message });
const isLaunch = process.argv.includes("--launch");

if (cars.length !== 5) add(`Fleet must contain exactly five records; found ${cars.length}.`, true);
const slugs = cars.map((car) => car.slug);
if (new Set(slugs).size !== slugs.length) add("Fleet contains duplicate slugs.", true);

for (const car of cars) {
  if (car.description.status !== "confirmed") add(`${car.slug}: vehicle description is pending.`);
  for (const [name, fact] of Object.entries(car.specs)) {
    if (fact.status !== "confirmed") add(`${car.slug}: ${name} is pending.`);
  }
  if (pricingConfig[car.id].status !== "approved") add(`${car.slug}: pricing is pending.`);

  for (const image of [car.images.primary, ...car.images.gallery].filter((item) => item !== null)) {
    if (image.width <= 0 || image.height <= 0) {
      add(`${car.slug}: ${image.src} has invalid dimensions.`, true);
    }
    for (const locale of routing.locales) {
      if (!image.alt[locale]?.trim())
        add(`${car.slug}: ${image.src} lacks ${locale} alt text.`, true);
    }
    if (image.src.startsWith("/") && !fs.existsSync(path.join(root, "public", image.src))) {
      add(`${car.slug}: referenced image is missing from public${image.src}.`, true);
    }
  }
  if (!car.images.primary)
    add(`${car.slug}: primary photo is pending (the designed fallback is used).`);
}

const launchFacts = [
  ["legal business name", site.legalName],
  ["primary phone", site.contacts.primaryPhone],
  ["email", site.contacts.email],
  ["WhatsApp destination", site.contacts.whatsapp],
  ["privacy/grievance contact", site.contacts.grievanceContact],
] as const;
for (const [label, fact] of launchFacts) {
  if (fact.status !== "confirmed") add(`${label} is not confirmed.`, true);
}
for (const branch of site.branches) {
  if (branch.address.status !== "confirmed") {
    add(`${branch.id}: branch address is not confirmed.`, true);
  }
  if (branch.hours.status !== "confirmed") add(`${branch.id}: branch hours are pending.`);
}

for (const locale of routing.locales) {
  if (site.copyReview[locale] !== "approved")
    add(`${locale}: customer-facing copy is unapproved.`, true);
}
for (const document of legalDocuments) {
  for (const locale of routing.locales) {
    if (document.launchRequired && !isLegalApproved(document.content[locale])) {
      add(`${document.slug} (${locale}) is not approved.`, true);
    }
  }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
if (!siteUrl) {
  add("NEXT_PUBLIC_SITE_URL is missing.", true);
} else {
  try {
    const url = new URL(siteUrl);
    if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash) {
      add("NEXT_PUBLIC_SITE_URL must be an HTTPS origin without a path, query, or hash.", true);
    }
  } catch {
    add("NEXT_PUBLIC_SITE_URL is not a valid URL.", true);
  }
}

type MessageTree = { [key: string]: string | MessageTree };
function flatten(tree: MessageTree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string" ? `${prefix}${key}` : flatten(value, `${prefix}${key}.`),
  );
}
const messageKeys = routing.locales.map((locale) => {
  const file = path.join(root, "src", "messages", `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(file, "utf8")) as MessageTree;
  return [locale, flatten(messages).sort()] as const;
});
const [baseLocale, baseKeys] = messageKeys[0]!;
for (const [locale, keys] of messageKeys.slice(1)) {
  if (JSON.stringify(keys) !== JSON.stringify(baseKeys)) {
    add(`${locale}: message keys do not match ${baseLocale}.`, true);
  }
}

const blockers = findings.filter((finding) => finding.launchRequired);
const pending = findings.filter((finding) => !finding.launchRequired);

console.log(
  `Content report: ${blockers.length} launch blocker(s), ${pending.length} optional gap(s).`,
);
for (const finding of blockers) console.log(`BLOCKER: ${finding.message}`);
for (const finding of pending) console.log(`PENDING: ${finding.message}`);

if (isLaunch && blockers.length > 0) process.exitCode = 1;
