"use client";

import { useLocale } from "@/lib/i18n/client";
import type { ChangeItem } from "@/lib/astrology/changes";

const ASPECT_KEYS = ["conjunction", "opposition", "square", "trine", "sextile"];

function subst(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
}

function signBlurbKey(planet: string | undefined): string {
  switch (planet) {
    case "sun":
      return "blurbSunSign";
    case "moon":
      return "blurbMoonSign";
    case "mercury":
      return "blurbMercurySign";
    case "venus":
      return "blurbVenusSign";
    case "mars":
      return "blurbMarsSign";
    default:
      return "blurbPlanetSign";
  }
}

/**
 * Renders a structured ChangeItem with fully localized title + blurb.
 * Falls back to the source (English) strings if anything is unexpected.
 */
export function LocalizedChange({
  change,
  titleClassName = "font-medium text-starlight",
  blurbClassName = "mt-0.5 text-sm leading-6 text-muted",
}: {
  change: ChangeItem;
  titleClassName?: string;
  blurbClassName?: string;
}) {
  const { t, tPlanet, tSign } = useLocale();

  let title: string;
  let blurb: string;

  switch (change.kind) {
    case "sun-sign":
    case "moon-sign":
    case "planet-sign": {
      const planet = change.planet ? tPlanet(change.planet) : t("planets.planet", "Planet");
      const sign = change.sign ? tSign(change.sign) : t("signs.aries", "Aries");
      title = subst(t("changes.movedIntoPlanet", "{planet} moved into {sign}"), { planet, sign });
      blurb = subst(t(`changes.${signBlurbKey(change.planet)}`, ""), { sign, planet });
      break;
    }
    case "retro-start": {
      const planet = change.planet ? tPlanet(change.planet) : "";
      title = subst(t("changes.beganRetrograde", "{planet} began its retrograde"), { planet });
      blurb = subst(t("changes.blurbRetroStart", ""), { planet });
      break;
    }
    case "retro-end": {
      const planet = change.planet ? tPlanet(change.planet) : "";
      title = subst(t("changes.turnedDirect", "{planet} turned direct"), { planet });
      blurb = subst(t("changes.blurbRetroEnd", ""), { planet });
      break;
    }
    case "aspect": {
      const a = change.bodyA ? tPlanet(change.bodyA) : "";
      const b = change.bodyB ? tPlanet(change.bodyB) : "";
      const facet = change.aspect ?? "";
      const aspect =
        ASPECT_KEYS.includes(facet) ? t(`aspects.${facet}`, facet) : facet;
      const article = /^[aeiou]/i.test(facet) ? "an" : "a";
      title = subst(t("changes.formsAspect", "{a} forms {article} {aspect} with {b}"), {
        a,
        b,
        aspect,
        article,
      });
      const blurbBase =
        facet === "square"
          ? "blurbSquare"
          : facet === "opposition"
            ? "blurbOpposition"
            : facet === "conjunction"
              ? "blurbConjunction"
              : "blurbAspect";
      blurb = t(`changes.${blurbBase}`, "");
      break;
    }
    default: {
      title = change.title;
      blurb = change.blurb;
    }
  }

  return (
    <>
      <p className={titleClassName}>{title}</p>
      <p className={blurbClassName}>{blurb}</p>
    </>
  );
}
