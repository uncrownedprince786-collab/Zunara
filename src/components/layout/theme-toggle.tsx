"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "zunara-theme";

type Theme = "dark" | "light";

function currentFromDom(): Theme {
  if (typeof document === "undefined") return "dark";
  const attr = document.documentElement.dataset.theme;
  return attr === "light" || attr === "dark" ? attr : "dark";
}

/**
 * Light/dark theme toggle. The initial theme is applied pre-hydration by an
 * inline script in the layout (no flash), so this component only reacts to
 * the attribute already on <html> and persists user choice to localStorage.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentFromDom);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
    window.setTimeout(() => root.classList.add("theme-ready"), 80);
  }, [theme]);

  const isLight = theme === "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="group inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
    >
      {isLight ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.4 14.2A8.5 8.5 0 0 1 9.8 3.6 8.5 8.5 0 1 0 20.4 14.2Z" />
        </svg>
      )}
    </button>
  );
}
