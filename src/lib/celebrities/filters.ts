import type { Celebrity } from "@/lib/content/celebrities";
import { CATEGORY_STYLE, categoryFromProfession, type CategorySlug } from "./categories";

export type CelebrityFilter = "all" | "cinema" | "music" | "science" | "sports";

export const CELEBRITY_FILTER_GROUPS: Record<
  Exclude<CelebrityFilter, "all">,
  readonly CategorySlug[]
> = {
  cinema: ["cinema"],
  music: ["music"],
  science: ["science", "tech-business", "world-leaders"],
  sports: ["sports"],
};

export function celebrityMatchesFilter(
  c: Celebrity,
  filter: CelebrityFilter,
): boolean {
  if (filter === "all") return true;
  const category =
    c.category && c.category in CATEGORY_STYLE
      ? (c.category as CategorySlug)
      : categoryFromProfession(c.profession, c.star);
  const group = CELEBRITY_FILTER_GROUPS[filter];
  return group.includes(category);
}
