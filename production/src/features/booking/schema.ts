import { z } from "zod";
import { NAME_MAX_LENGTH, NOTE_MAX_LENGTH } from "@/data/booking";

/** Optional personal fields. Validated client-side; never placed in a URL or stored. */
export const optionalFieldsSchema = z.object({
  name: z.string().trim().max(NAME_MAX_LENGTH, "nameTooLong"),
  note: z.string().max(NOTE_MAX_LENGTH, "noteTooLong"),
});
