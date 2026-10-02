"use client";

import { useState } from "react";

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  const msg = `"${title}" — from the Zunara Journal\n\nRead it ${`https://zunara.vercel.app${path}`}`;
  const text = encodeURIComponent(msg);
  const url = encodeURIComponent(`https://zunara.vercel.app${path}`);

  const WA = () => `https://wa.me/?text=${text}`;
  const X = () => `https://twitter.com/intent/tweet?text=${text}`;
  const FB = () => `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  const PIN = () => `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`;
  const TELEGRAM = () => `https://t.me/share/url?url=${url}&text=${text}`;

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

  const item =
    "inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-4 text-sm font-medium text-muted transition-colors hover:border-gold/50 hover:text-gold";

  return (
    <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line-soft pt-6">
      <span className="mr-1 text-sm font-medium text-subdued">Share this essay</span>
      <a href={WA()} target="_blank" rel="noopener noreferrer" className={item}>
        WhatsApp
      </a>
      <a href={X()} target="_blank" rel="noopener noreferrer" className={item}>
        X
      </a>
      <a href={FB()} target="_blank" rel="noopener noreferrer" className={item}>
        Facebook
      </a>
      <a href={PIN()} target="_blank" rel="noopener noreferrer" className={item}>
        Pinterest
      </a>
      <a href={TELEGRAM()} target="_blank" rel="noopener noreferrer" className={item}>
        Telegram
      </a>
      <button type="button" onClick={copy} className={item}>
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}