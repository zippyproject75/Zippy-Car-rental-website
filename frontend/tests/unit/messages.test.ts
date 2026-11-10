import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import mr from "@/messages/mr.json";
import type { Locale } from "@/i18n/routing";

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tree).flatMap(([k, v]) =>
      typeof v === "string" ? [[`${prefix}${k}`, v]] : Object.entries(flatten(v, `${prefix}${k}.`)),
    ),
  );
}

/** ICU argument names used by a message (simple, plural and select arguments). */
function argumentNames(message: string): string[] {
  return [...message.matchAll(/\{\s*([A-Za-z_][\w]*)\s*(?:,|\})/g)].map((m) => m[1] ?? "").sort();
}

const catalogues = { en, hi, mr } as Record<Locale, Tree>;
const enFlat = flatten(en as Tree);

describe("message catalogues", () => {
  for (const [locale, messages] of Object.entries(catalogues) as [Locale, Tree][]) {
    const flat = flatten(messages);

    it(`${locale}: has exactly the English keys`, () => {
      expect(Object.keys(flat).sort()).toEqual(Object.keys(enFlat).sort());
    });

    it(`${locale}: every message parses as ICU and uses the English arguments`, () => {
      const invalid: string[] = [];
      const t = createTranslator({
        locale,
        messages,
        onError: (error) => {
          if (error.code === "INVALID_MESSAGE") invalid.push(error.message);
        },
        getMessageFallback: ({ key }) => key,
      });
      const translate = t as unknown as (key: string, values?: Record<string, unknown>) => string;
      for (const [key, message] of Object.entries(flat)) {
        const names = argumentNames(message);
        const values = Object.fromEntries(names.map((n) => [n, 1]));
        translate(key, values);
        expect(new Set(names), `${locale}:${key}`).toEqual(
          new Set(argumentNames(enFlat[key] ?? "")),
        );
      }
      expect(invalid).toEqual([]);
    });
  }
});
