"use client";

import { useRef, useState } from "react";

export default function HoldToChange({
  label,
  onComplete,
}: {
  label: string;
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const [holding, setHolding] = useState(false);
  const start = useRef(0);
  const frame = useRef(0);

  const stop = (commit: boolean) => {
    cancelAnimationFrame(frame.current);
    setHolding(false);
    if (commit && progress >= 1) onComplete();
    setProgress(0);
  };

  const tick = (now: number) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = Math.min(1, (now - start.current) / (reduce ? 180 : 900));
    setProgress(next);
    if (next >= 1) {
      setHolding(false);
      setProgress(0);
      onComplete();
      return;
    }
    frame.current = requestAnimationFrame(tick);
  };

  const begin = (x: number, y: number) => {
    setPoint({ x, y });
    setHolding(true);
    start.current = performance.now();
    frame.current = requestAnimationFrame(tick);
  };

  return (
    <>
      <button
        type="button"
        className="hold-target"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          begin(event.clientX, event.clientY);
        }}
        onPointerUp={() => stop(false)}
        onPointerCancel={() => stop(false)}
        onKeyDown={(event) => {
          if (event.key === " " && !event.repeat) {
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            begin(rect.left + rect.width / 2, rect.top + rect.height / 2);
          }
        }}
        onKeyUp={(event) => {
          if (event.key === " ") stop(false);
        }}
      >
        {label}
      </button>
      {holding && (
        <span
          className="hold-ring"
          style={{ left: point.x, top: point.y }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="18" />
            <circle
              cx="24"
              cy="24"
              r="18"
              className="hold-progress"
              style={{ strokeDashoffset: `${113 - progress * 113}` }}
            />
          </svg>
        </span>
      )}
    </>
  );
}
