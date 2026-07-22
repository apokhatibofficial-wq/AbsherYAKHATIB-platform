"use client";

import { motion } from "motion/react";
import type { IconProps } from "./icons";

const ACCENT = "#2DD4BF";
const INK = "#161616";

function frame({ size = 22, ...props }: IconProps) {
  return { width: size, height: size, viewBox: "0 0 24 24", ...props };
}

/** تكييف وتبريد — fan spinning inside a circulation arrow */
export function CoolingIcon(props: IconProps) {
  return (
    <svg {...frame(props)}>
      <path
        d="M12 3a9 9 0 108.4 5.8"
        stroke={ACCENT}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M16.2 5.6l3.6.7-.9 3.5z" fill={ACCENT} />
      <motion.g
        style={{ transformOrigin: "12px 12px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
      >
        <path d="M12 12C12 8.3 10 6.2 7 6.2c0 3.1 2 5.2 5 5.8z" fill={INK} />
        <path d="M12 12c3.6.7 6.2-.6 7.1-3.4-3-1-5.8.1-7.1 3.4z" fill={INK} />
        <path d="M12 12c-.9 3.5.4 6.1 3.6 6.8 1-3-.1-5.7-3.6-6.8z" fill={INK} />
        <circle cx="12" cy="12" r="1.7" fill="#fff" stroke={INK} strokeWidth="1.3" />
      </motion.g>
    </svg>
  );
}

/** دهان — paint roller with flowing paint */
export function PainterIcon(props: IconProps) {
  return (
    <svg {...frame(props)}>
      <motion.path
        d="M5 9c1-2 2-2 3 0s2 2 3 0 2-2 3 0 2 2 3 0"
        stroke={ACCENT}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ y: [0, -1.4, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <rect x="5" y="9" width="10" height="5" rx="1.2" stroke={INK} strokeWidth="1.7" fill="#fff" />
      <path d="M15 11.3h1.6a1 1 0 011 1V17" stroke={INK} strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <rect x="16.6" y="17" width="2.4" height="5" rx="1.1" fill={INK} />
      <rect x="16.6" y="19.6" width="2.4" height="1.6" rx="0.6" fill={ACCENT} />
    </svg>
  );
}

/** سباك — dripping tap */
export function PlumberIcon(props: IconProps) {
  return (
    <svg {...frame(props)}>
      <rect x="8.5" y="4" width="8" height="2.6" rx="1.3" fill={ACCENT} />
      <circle cx="12.5" cy="5.3" r="0.6" fill={INK} />
      <path
        d="M12.5 6.6v2.4M3.5 13a3 3 0 003 3h1.5a5 5 0 005-5V9h2a3 3 0 013 3v3.5"
        stroke={INK}
        strokeWidth="1.7"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="15.8" y="16.6" width="3" height="1.6" rx="0.8" fill={ACCENT} />
      <motion.circle
        cx="17.3"
        cy="19"
        r="0.9"
        fill={ACCENT}
        animate={{ y: [0, 4, 4], opacity: [1, 1, 0] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: "easeIn" }}
      />
    </svg>
  );
}

/** كهربائي — plug connecting to an outlet */
export function ElectricianIcon(props: IconProps) {
  return (
    <svg {...frame(props)}>
      <rect x="2" y="3" width="10" height="15" rx="2" stroke={INK} strokeWidth="1.5" fill="#fff" />
      <rect x="4.4" y="6" width="5.2" height="3.4" rx="1.7" stroke={ACCENT} strokeWidth="1.5" fill="none" />
      <rect x="4.4" y="10.6" width="5.2" height="3.4" rx="1.7" stroke={ACCENT} strokeWidth="1.5" fill="none" />
      <motion.g
        animate={{ x: [0, -3.2, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="15.5" y="9" width="4.5" height="5" rx="1" stroke={INK} strokeWidth="1.5" fill="#fff" />
        <line x1="16.7" y1="9" x2="16.7" y2="6.3" stroke={ACCENT} strokeWidth="1.7" strokeLinecap="round" />
        <line x1="18.8" y1="9" x2="18.8" y2="6.3" stroke={ACCENT} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M17.7 14c0 3 3 2 3 5" stroke={ACCENT} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

/** نظافة — squeegee wiping a window */
export function CleaningIcon(props: IconProps) {
  return (
    <svg {...frame(props)}>
      {[4.5, 7, 9.5, 12, 14.5].map((y) => (
        <line key={y} x1="1" y1={y} x2="3" y2={y} stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
      ))}
      <rect x="3" y="3" width="14" height="14" rx="1" stroke={INK} strokeWidth="1.5" fill="#fff" />
      <path d="M6.5 13.5l3-3M9.5 15.5l3-3" stroke={ACCENT} strokeWidth="1.4" strokeLinecap="round" />
      <rect x="7.3" y="6.3" width="1.8" height="1.8" fill={ACCENT} transform="rotate(45 8.2 7.2)" />
      <rect x="11.3" y="9.3" width="1.8" height="1.8" fill={ACCENT} transform="rotate(45 12.2 10.2)" />
      <motion.g
        animate={{ x: [0, -3.5, 0], y: [0, -3.5, 0] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="14" y="14" width="7" height="2.6" rx="1" fill="#fff" stroke={INK} strokeWidth="1.4" transform="rotate(45 17.5 15.3)" />
        <path d="M18.8 18.6l3 3" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

/** نجار — swinging hammer */
export function CarpenterIcon(props: IconProps) {
  return (
    <svg {...frame(props)}>
      <motion.g
        style={{ transformOrigin: "9px 19px" }}
        animate={{ rotate: [0, -22, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M9 19l5-8.5" stroke={INK} strokeWidth="2.1" strokeLinecap="round" />
        <path
          d="M12.3 10.5l2-3.3a1.8 1.8 0 012.5-.6l1.4.9a1.8 1.8 0 01.6 2.5l-2 3.3z"
          fill={ACCENT}
          stroke={INK}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </motion.g>
    </svg>
  );
}

/** المهن الأخرى / غير المصنّفة — toolbox */
export function GenericProfessionIcon(props: IconProps) {
  return (
    <svg {...frame(props)}>
      <motion.g
        animate={{ y: [0, -1.6, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M8.5 9V6.3a2 2 0 012-2h3a2 2 0 012 2V9" stroke={INK} strokeWidth="1.7" fill="none" />
        <rect x="3" y="9" width="18" height="10" rx="2" stroke={INK} strokeWidth="1.7" fill="#fff" />
        <rect x="3" y="13" width="18" height="1.8" fill={ACCENT} opacity="0.55" />
        <rect x="10.4" y="12.3" width="3.2" height="3.2" rx="0.7" fill={ACCENT} />
      </motion.g>
    </svg>
  );
}

/** Picks the right icon for a profession by rendering it directly (no dynamic component reference). */
export function ProfessionIcon({ profession, ...props }: IconProps & { profession: string }) {
  switch (profession) {
    case "سباك":
      return <PlumberIcon {...props} />;
    case "كهربائي":
      return <ElectricianIcon {...props} />;
    case "نجار":
      return <CarpenterIcon {...props} />;
    case "دهان":
      return <PainterIcon {...props} />;
    case "تكييف وتبريد":
      return <CoolingIcon {...props} />;
    case "نظافة":
      return <CleaningIcon {...props} />;
    default:
      return <GenericProfessionIcon {...props} />;
  }
}
