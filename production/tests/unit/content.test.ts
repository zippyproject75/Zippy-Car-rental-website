import { describe, expect, it } from "vitest";
import { cars } from "@/data/cars";
import { getLegalDocument, isLegalApproved, legalDocuments, visibleLegalLinks } from "@/data/legal";
import { site } from "@/data/site";
import { locales } from "@/i18n/routing";
import { getPublishedBranches } from "@/lib/catalog";
import { getVisibleContacts } from "@/lib/contacts";
import { visibleFact } from "@/lib/content";
import type { Fact } from "@/types/content";

describe("fleet", () => {
  it("contains exactly the five approved units in order", () => {
    expect(cars.map((c) => c.slug)).toEqual(["fronx", "brezza", "baleno", "ertiga-1", "ertiga-2"]);
    expect(cars.filter((c) => c.model === "Ertiga").map((c) => c.unitNumber)).toEqual([1, 2]);
    expect(new Set(cars.map((c) => c.id)).size).toBe(5);
  });
  it("publishes no unconfirmed facts in production", () => {
    for (const car of cars) {
      for (const fact of Object.values(car.specs)) {
        if (fact.status !== "confirmed") {
          expect(visibleFact(fact as Fact<unknown>, false)).toBeNull();
        }
      }
    }
  });
});

describe("visibleFact", () => {
  it("shows pending candidate values only when allowed and marks them", () => {
    const fact = { status: "pending" as const, value: "x", note: "" };
    expect(visibleFact(fact, false)).toBeNull();
    expect(visibleFact(fact, true)).toEqual({ value: "x", pending: true });
    const confirmed = { status: "confirmed" as const, value: "y", source: "owner" };
    expect(visibleFact(confirmed, false)).toEqual({
      value: "y",
      pending: false,
    });
  });
});

describe("production gating", () => {
  it("never exposes pending contacts or branches", () => {
    const contacts = getVisibleContacts(false);
    for (const p of contacts.phones) expect(p.pending).toBe(false);
    if (contacts.email) expect(contacts.email.pending).toBe(false);
    for (const b of getPublishedBranches(false)) expect(b.address.status).toBe("confirmed");
  });
  it("hides unapproved legal documents from production links", () => {
    for (const locale of locales) {
      const visible = visibleLegalLinks(locale, false).map((d) => d.slug);
      for (const doc of legalDocuments) {
        expect(visible.includes(doc.slug)).toBe(isLegalApproved(doc.content[locale]));
      }
    }
  });
  it("has all four legal documents in every locale", () => {
    for (const slug of [
      "terms-and-conditions",
      "privacy-policy",
      "cookie-policy",
      "cancellation-and-refund-policy",
    ] as const) {
      for (const locale of locales)
        expect(getLegalDocument(slug).content[locale].title).toBeTruthy();
    }
  });
  it("does not ship an unconfirmed WhatsApp destination", () => {
    if (site.contacts.whatsapp.status !== "confirmed") {
      expect(visibleFact(site.contacts.whatsapp, false)).toBeNull();
    }
  });
});
