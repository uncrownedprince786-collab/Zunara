"use client";

import { useEffect, useState } from "react";
import { computeSnapshot } from "@/lib/astronomy/astro";
import { getZodiacSign } from "@/lib/zodiac/zodiac";

/**
 * Shows the current (live) position of a lunar node. Position is computed in
 * the browser on mount (via `computeSnapshot`, which resolves node longitudes)
 * so the server page stays static and deterministic.
 */
export function NodePosition({ node }: { node: "northNode" | "southNode" }) {
  const [position, setPosition] = useState<string>("Position updates live");

  useEffect(() => {
    const snap = computeSnapshot(new Date());
    const pos = snap.positions.find((p) => p.key === node);
    if (pos) {
      const sign = getZodiacSign(pos.sign);
      const deg = Math.floor(pos.degreeInSign);
      const min = Math.floor((pos.degreeInSign - deg) * 60);
      const label = node === "northNode" ? "North Node" : "South Node";
      const title = sign ? `${sign.name}` : pos.sign;
      setPosition(
        `${label} in ${title} at ${deg}° ${String(min).padStart(2, "0")}′`,
      );
    }
  }, [node]);

  return (
    <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-muted">
      <span aria-hidden="true" className="text-gold">☊</span>
      {position}
    </p>
  );
}