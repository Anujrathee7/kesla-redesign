import type { PageKey } from "@/lib/routes";

/** Main navigation, in kesla.com's order, flattened to one row. */
export const NAV_ITEMS = [
  "products",
  "references",
  "dealers",
  "news",
  "company",
  "career",
  "contacts",
] as const satisfies readonly PageKey[];
