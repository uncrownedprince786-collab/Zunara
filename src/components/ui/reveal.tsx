"use client";

import { useCallback, useRef, type ReactNode } from "react";

function RevealBase({
  tag: Tag,
  children,
  className,
}: {
  tag: "div" | "section" | "article" | "li" | "span";
  children: ReactNode;
  className: string;
}) {
  const observed = useRef<HTMLElement | null>(null);

  const callbackRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;
      observed.current = node;
      if (typeof IntersectionObserver === "undefined") {
        node.classList.add("is-visible");
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      observer.observe(node);
      return () => observer.disconnect();
    },
    [],
  );

  switch (Tag) {
    case "li":
      return <li ref={callbackRef} className={className}>{children}</li>;
    case "section":
      return <section ref={callbackRef} className={className}>{children}</section>;
    case "article":
      return <article ref={callbackRef} className={className}>{children}</article>;
    case "span":
      return <span ref={callbackRef} className={className}>{children}</span>;
    default:
      return <div ref={callbackRef} className={className}>{children}</div>;
  }
}

/**
 * Motion primitive: reveals its children with a soft fade + rise once they
 * enter the viewport. Pure CSS transition (no animation library); respects
 * `prefers-reduced-motion` via the CSS overrides in globals.css.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}) {
  const delayClass =
    delay === 1 ? "reveal-delay-1"
    : delay === 2 ? "reveal-delay-2"
    : delay === 3 ? "reveal-delay-3"
    : delay === 4 ? "reveal-delay-4"
    : delay === 5 ? "reveal-delay-5"
    : "";

  return (
    <RevealBase tag={as} className={`reveal ${delayClass} ${className}`.trim()}>
      {children}
    </RevealBase>
  );
}
