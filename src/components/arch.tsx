"use client";
import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

export default function Arch({
  small = false,
  progress = 0,
  keystoneState = "set",
  onSettled,
}: {
  small?: boolean;
  progress?: number;
  keystoneState?: "floating" | "dropping" | "set";
  onSettled?: () => void;
}) {
  const id = useId().replaceAll(":", "");
  const reduce = useReducedMotion();
  const point = (r: number, a: number) => [
    (250 + r * Math.cos(a)).toFixed(3),
    (263 - r * Math.sin(a)).toFixed(3),
  ];
  const stones = Array.from({ length: 13 }, (_, i) => {
    const a = (i * Math.PI) / 13 + 0.006;
    const b = ((i + 1) * Math.PI) / 13 - 0.006;
    const p = point(197, a),
      q = point(197, b),
      r = point(132, b),
      s = point(132, a);
    return `M${p} A197 197 0 0 0 ${q} L${r} A132 132 0 0 1 ${s} Z`;
  });
  const placed = Math.round((progress / 100) * 12);
  const hovering = !reduce && keystoneState === "floating";
  const dropping = !reduce && keystoneState === "dropping";

  return (
    <svg
      className={small ? "arch arch-small" : "arch"}
      viewBox="0 0 500 540"
      role="img"
      aria-label={`Sandstone arch. ${progress}% of the sample journey is placed.`}
    >
      <defs>
        <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="var(--sand-300)" />
          <stop offset=".45" stopColor="var(--sand-500)" />
          <stop offset="1" stopColor="var(--sand-700)" />
        </linearGradient>
        <linearGradient id={`${id}-gold`}>
          <stop stopColor="var(--gold-400)" />
          <stop offset="1" stopColor="var(--gold-600)" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-30%" width="160%" height="170%">
          <feDropShadow
            dx="8"
            dy="14"
            stdDeviation="9"
            floodColor="var(--night-950)"
            floodOpacity=".45"
          />
        </filter>
      </defs>
      <ellipse cx="258" cy="500" rx="208" ry="17" fill="var(--night-950)" opacity=".45" />
      <motion.g
        filter={small ? undefined : `url(#${id}-shadow)`}
        animate={dropping ? { x: [0, -2, 2, 0] } : { x: 0 }}
        transition={{ duration: 0.16, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="53" y={264 + i * 54} width="65" height="52" rx="1" fill={`url(#${id}-stone)`} stroke="var(--sand-700)" strokeWidth=".7" />
            <rect x="382" y={264 + i * 54} width="65" height="52" rx="1" fill={`url(#${id}-stone)`} stroke="var(--sand-700)" strokeWidth=".7" />
          </g>
        ))}
        <rect x="42" y="480" width="89" height="17" fill="var(--sand-700)" />
        <rect x="370" y="480" width="89" height="17" fill="var(--sand-700)" />
        {stones.map((d, i) =>
          i === 6 ? (
            <motion.path
              key={i}
              d={d}
              fill={`url(#${id}-gold)`}
              stroke="var(--gold-600)"
              initial={
                dropping ? { y: -72, opacity: 1 } : hovering ? { y: -68, opacity: 1 } : false
              }
              animate={
                hovering
                  ? { y: [-72, -60, -72], opacity: 1 }
                  : { y: 0, opacity: progress && placed < 6 ? 0.45 : 1 }
              }
              transition={
                hovering
                  ? { duration: 3.6, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
                  : { type: "spring", stiffness: 260, damping: 24 }
              }
              onAnimationComplete={() => {
                if (dropping) onSettled?.();
              }}
            />
          ) : (
            <path
              key={i}
              d={d}
              fill={`url(#${id}-stone)`}
              stroke="var(--sand-700)"
              strokeWidth=".6"
              opacity={!progress || i < placed || i === 6 ? 1 : 0.38}
            />
          ),
        )}
        {dropping &&
          Array.from({ length: 14 }, (_, i) => (
            <motion.circle
              key={i}
              cx="250"
              cy="150"
              r="2.2"
              fill="var(--sand-300)"
              initial={{ x: 0, y: 0, opacity: 0.8 }}
              animate={{
                x: Math.cos((i / 14) * Math.PI * 2) * (28 + (i % 4) * 10),
                y: 18 + (i % 5) * 8,
                opacity: 0,
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
      </motion.g>
      {!small && (
        <text x="250" y="536" textAnchor="middle" fill="var(--sand-300)" fontSize="9" letterSpacing="3.5">
          THE STEP THAT HOLDS THE REST
        </text>
      )}
    </svg>
  );
}
