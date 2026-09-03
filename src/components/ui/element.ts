import type { Element } from "@/lib/zodiac/zodiac";

/** Text/icon accent color class per element. */
export function elementText(element: Element): string {
  const map: Record<Element, string> = {
    Fire: "text-fire",
    Earth: "text-earth",
    Air: "text-air",
    Water: "text-water",
  };
  return map[element] ?? "";
}

/** Border accent color class per element. */
export function elementBorder(element: Element): string {
  const map: Record<Element, string> = {
    Fire: "border-fire/40 hover:border-fire/70",
    Earth: "border-earth/40 hover:border-earth/70",
    Air: "border-air/40 hover:border-air/70",
    Water: "border-water/40 hover:border-water/70",
  };
  return map[element] ?? "";
}

/** Theme-tinted glass background (top-corner radial glow + inner surface). */
export function elementFill(element: Element): string {
  const map: Record<Element, string> = {
    Fire: "bg-fire/[0.07] hover:bg-fire/[0.12]",
    Earth: "bg-earth/[0.07] hover:bg-earth/[0.12]",
    Air: "bg-air/[0.07] hover:bg-air/[0.12]",
    Water: "bg-water/[0.07] hover:bg-water/[0.12]",
  };
  return map[element] ?? "bg-white/[0.03]";
}

/** Small element rune glyph. */
export function elementRune(element: Element): string {
  const map: Record<Element, string> = {
    Fire: "△",
    Earth: "▧",
    Air: "⬦",
    Water: "⧫",
  };
  return map[element] ?? "✵";
}
