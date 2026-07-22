"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Image from "next/image";

type Phase = "start" | "center" | "hold" | "zoom" | "zoomOut";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const logoVariants = {
  start: { x: "130%", opacity: 0, scale: 1 },
  center: { x: "0%", opacity: 1, scale: 1 },
  hold: { x: "0%", opacity: 1, scale: 1 },
  zoom: { x: "0%", opacity: 1, scale: 7 },
  zoomOut: { x: "0%", opacity: 1, scale: 7 },
};

const logoTransitions: Record<Phase, object> = {
  start: { duration: 0 },
  center: { duration: 1.05, ease: EASE },
  hold: { duration: 0 },
  zoom: { duration: 1.05, ease: EASE },
  zoomOut: { duration: 0 },
};

export function SplashScreen({ redirectTo = "/login" }: { redirectTo?: string }) {
  const [phase, setPhase] = useState<Phase>("start");
  const router = useRouter();

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase("center"));
    const t1 = setTimeout(() => setPhase("hold"), 1100);
    const t2 = setTimeout(() => setPhase("zoom"), 4100);
    const t3 = setTimeout(() => setPhase("zoomOut"), 5000);
    const t4 = setTimeout(() => router.replace(redirectTo), 5550);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [router, redirectTo]);

  return (
    <motion.div
      animate={{ opacity: phase === "zoomOut" ? 0 : 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0B6B4A 0%, #063D2B 100%)" }}
    >
      <motion.div variants={logoVariants} animate={phase} transition={logoTransitions[phase]}>
        <Image
          src="/absher-logo.png"
          alt="أبشر"
          width={220}
          height={220}
          priority
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </motion.div>
    </motion.div>
  );
}
