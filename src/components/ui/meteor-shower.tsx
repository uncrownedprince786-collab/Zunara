import type { CSSProperties } from "react";

/**
 * Ambient meteor shower backdrop.
 *
 * Pure-CSS, zero-JS, hardware-accelerated: each streak animates with
 * translate3d + will-change so the compositor thread handles it (no main-thread
 * work, no TBT cost). Deliberately sparse and subtle (a few slow diagonal
 * streaks instead of a busy storm), and locked safely behind all interactive
 * glass cards via z-index:-1 + pointer-events:none. Values are deterministic so
 * server and client render identically.
 */

type MeteorSpec = {
  top: string;
  left: string;
  len: string;
  dur: string;
  delay: string;
  o: number;
  dist: string;
};

const METEORS: MeteorSpec[] = [
  { top: "6%", left: "12%", len: "150px", dur: "5s", delay: "-1.2s", o: 0.55, dist: "62vw" },
  { top: "16%", left: "55%", len: "110px", dur: "7s", delay: "-3.2s", o: 0.4, dist: "52vw" },
  { top: "3%", left: "78%", len: "130px", dur: "6s", delay: "-4.6s", o: 0.45, dist: "46vw" },
  { top: "30%", left: "20%", len: "95px", dur: "8s", delay: "-2.1s", o: 0.35, dist: "58vw" },
  { top: "42%", left: "88%", len: "120px", dur: "6.5s", delay: "-5.1s", o: 0.4, dist: "32vw" },
];

export function MeteorShower() {
  return (
    <div aria-hidden="true" className="meteor-field">
      {METEORS.map((m, i) => (
        <span
          key={i}
          className="meteor"
          style={
            {
              "--top": m.top,
              "--left": m.left,
              "--len": m.len,
              "--dur": m.dur,
              "--delay": m.delay,
              "--o": m.o,
              "--dist": m.dist,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
