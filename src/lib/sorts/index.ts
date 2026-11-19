import { bubble } from "./bubble";
import { selection } from "./selection";
import { insertion } from "./insertion";
import { merge } from "./merge";
import { quick } from "./quick";
import { heap } from "./heap";
import { counting } from "./counting";
import { radix } from "./radix";
import { shell } from "./shell";
import type { SortAlgorithm } from "./types";

export const algorithms: SortAlgorithm[] = [
  bubble,
  selection,
  insertion,
  shell,
  merge,
  quick,
  heap,
  counting,
  radix,
];

export const algorithmsBySlug = Object.fromEntries(
  algorithms.map((a) => [a.meta.slug, a]),
) as Record<string, SortAlgorithm>;

export type { SortAlgorithm } from "./types";