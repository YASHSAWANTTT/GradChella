"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

const spring = { stiffness: 350, damping: 25, mass: 0.6 };

type MagneticButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
  strength?: number;
};

export function MagneticButton({
  className,
  children,
  strength = 0.35,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hover, setHover] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const glowX = useTransform(sx, (v) => v * 0.4);
  const glowY = useTransform(sy, (v) => v * 0.4);

  const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      className={cn(
        "relative isolate overflow-hidden rounded-2xl px-8 py-4 text-base font-semibold tracking-tight text-[#4a1520] shadow-lg shadow-[#722F37]/15 outline-none ring-2 ring-[#D4AF37]/50 transition-shadow focus-visible:ring-2 focus-visible:ring-[#722F37] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        className,
      )}
      style={{ x: sx, y: sy }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => {
        setHover(false);
        reset();
      }}
      onPointerMove={handleMove}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      <span
        className="absolute inset-0 bg-gradient-to-br from-[#F5E6A8] via-[#E8C547] to-[#D4AF37]"
        aria-hidden
      />
      <motion.span
        className="pointer-events-none absolute -inset-8 rounded-full bg-white/50 blur-2xl"
        style={{ x: glowX, y: glowY, opacity: hover ? 0.65 : 0.3 }}
        aria-hidden
      />
      <span className="relative z-[1] flex items-center justify-center gap-2 drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]">
        {children}
      </span>
    </motion.button>
  );
}
