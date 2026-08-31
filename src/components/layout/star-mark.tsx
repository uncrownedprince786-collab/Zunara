import type { SVGProps } from "react";

/**
 * Editorial celestial mark: a fine four-point star within a hairline circle,
 * evoking a hand-drawn map asterisk. Reads as a small engraved device.
 */
export function StarMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" opacity="0.5" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
      <path d="M12 5.5v13M5.5 12h13M7.6 7.6l8.8 8.8M16.4 7.6l-8.8 8.8" opacity="0.9" />
    </svg>
  );
}
