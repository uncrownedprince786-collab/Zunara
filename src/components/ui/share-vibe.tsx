"use client";

import { useState } from "react";
import { absoluteUrl } from "@/lib/seo/site";
import type { LifeArea } from "@/lib/astrology/signals";
import { useLocale } from "@/lib/i18n/client";

export interface ShareVibeData {
  signName: string;
  periodLabel: string;
  hook: string; // the one-line prediction
  move: string; // the actionable "your move" tip
  areas: { area: LifeArea; strength: string }[];
  path: string;
}

export function ShareVibe({ data }: { data: ShareVibeData }) {
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const { t, tArea } = useLocale();

  const pills = data.areas
    .map((a) => `${tArea(a.area)}: ${t(`areas.${a.strength.toLowerCase()}`, a.strength)}`)
    .join(" · ");

  const lines = [
    `✨ ${data.signName} — ${t("horoscope.shareTitle", "Today's Vibe")} ${data.periodLabel}`,
    `"${data.hook}"`,
    `${t("common.pills", "Pills")}: ${pills}`,
    `${t("horoscope.yourMove", "Your move")}: ${data.move}`,
    `Zunara 🔭 ${absoluteUrl(data.path)}`,
  ];
  const msg = lines.join("\n");

  const WA = (m: string) => `https://wa.me/?text=${encodeURIComponent(m)}`;
  const X = (m: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(m)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(msg);
    } catch {
      const el = document.createElement("textarea");
      el.value = msg;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${data.signName} — ${t("horoscope.shareTitle", "Today's Vibe")}`, text: msg });
        return;
      } catch {
        /* user dismissed the sheet; fall through to the menu */
      }
    }
    await copy();
    setNote(t("horoscope.shareSnippet", "Snippet copied — paste it into Instagram, WhatsApp or anywhere you like."));
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={nativeShare}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm font-medium text-starlight transition-colors hover:border-gold/50 hover:text-gold"
      >
        <span aria-hidden>🔭</span>
        {t("horoscope.shareVibe", "Share today's vibe")}
      </button>

      <div className="mt-1 flex flex-wrap gap-2">
        <a
          href={WA(msg)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted transition-colors hover:border-gold/40 hover:text-gold"
        >
          WhatsApp
        </a>
        <a
          href={X(msg)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted transition-colors hover:border-gold/40 hover:text-gold"
        >
          X
        </a>
        <button
          type="button"
          onClick={copy}
          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted transition-colors hover:border-gold/40 hover:text-gold"
        >
          {copied ? t("common.copied", "Copied!") : t("common.copy", "Copy")}
        </button>
      </div>

      {note && <p className="text-xs text-subdued">{note}</p>}
    </div>
  );
}
