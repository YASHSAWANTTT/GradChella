"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const flapSpring = { stiffness: 120, damping: 18, mass: 0.8 };

export function InteractiveEnvelope({
  title,
  year,
  onOpenComplete,
  disabled,
}: {
  title: string;
  year: string;
  onOpenComplete: () => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const openedRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(mx, { stiffness: 180, damping: 22 });
  const ry = useSpring(my, { stiffness: 180, damping: 22 });
  const shadow = useMotionTemplate`drop-shadow(0 22px 40px rgba(114,47,55,0.28))`;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const el = wrapRef.current;
      if (!el || open) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      mx.set(px * 18);
      my.set(py * -14);
    },
    [mx, my, open],
  );

  const resetTilt = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const handleOpen = () => {
    if (disabled || open || openedRef.current) return;
    openedRef.current = true;
    setOpen(true);
    window.setTimeout(() => {
      onOpenComplete();
    }, 1050);
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="text-center"
      >
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#B8860B]">
          {year}
        </p>
        <h1 className="mt-2 bg-gradient-to-r from-[#4a1520] via-[#722F37] to-[#B8860B] bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-[#7a4a52]">
          Poke the envelope — it’s not shy.
        </p>
      </motion.div>

      <motion.div
        ref={wrapRef}
        className="relative cursor-pointer select-none [perspective:1200px]"
        style={{ rotateX: rx, rotateY: ry, filter: shadow }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpen();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Open invitation envelope"
      >
        <motion.div
          className="relative h-[220px] w-[min(92vw,340px)]"
          animate={open ? { y: -6, scale: 1.02 } : { y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          {/* Back panel */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 h-[68%] rounded-b-2xl rounded-t-sm",
              "bg-gradient-to-br from-[#4a1520] via-[#722F37] to-[#2d0f14]",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-[#D4AF37]/25",
            )}
          />

          {/* Inner letter peek */}
          <motion.div
            className="absolute bottom-[12%] left-[8%] right-[8%] top-[18%] rounded-lg bg-gradient-to-b from-[#FFFBF0] to-white shadow-inner ring-1 ring-[#722F37]/10"
            initial={false}
            animate={
              open
                ? { y: -72, opacity: 1, scale: 1 }
                : { y: 8, opacity: 0.92, scale: 0.98 }
            }
            transition={{ type: "spring", stiffness: 200, damping: 22, delay: open ? 0.12 : 0 }}
          >
            <div className="flex h-full flex-col items-center justify-center gap-1 px-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                You’re in
              </span>
              <span className="text-lg font-semibold text-[#4a1520]">Officially invited</span>
            </div>
          </motion.div>

          {/* Pocket / front lower */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[52%] rounded-b-2xl bg-gradient-to-t from-[#2d0f14]/95 via-[#722F37]/85 to-transparent"
            style={{ clipPath: "polygon(0 35%, 50% 0, 100% 35%, 100% 100%, 0 100%)" }}
          />

          {/* Side flaps illusion */}
          <div
            className="absolute bottom-0 left-0 h-[52%] w-1/2 rounded-bl-2xl bg-gradient-to-br from-white/5 to-transparent opacity-70"
            style={{ clipPath: "polygon(0 40%, 100% 100%, 0 100%)" }}
          />
          <div
            className="absolute bottom-0 right-0 h-[52%] w-1/2 rounded-br-2xl bg-gradient-to-bl from-white/5 to-transparent opacity-70"
            style={{ clipPath: "polygon(100% 40%, 0 100%, 100% 100%)" }}
          />

          {/* Top flap (triangle) */}
          <motion.div
            className="absolute left-0 right-0 top-0 h-[52%] origin-top rounded-t-2xl bg-gradient-to-br from-[#8B2635] via-[#722F37] to-[#4a1520] ring-1 ring-[#D4AF37]/30"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              transformStyle: "preserve-3d",
            }}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: open ? -148 : 0 }}
            transition={flapSpring}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent" />
            <div className="absolute left-1/2 top-[22%] h-10 w-10 -translate-x-1/2 rounded-full border-2 border-[#E8C547] bg-gradient-to-br from-[#F5E6A8] to-[#D4AF37] shadow-[0_0_28px_rgba(212,175,55,0.45)]" />
          </motion.div>

          {!open && (
            <motion.div
              className="pointer-events-none absolute -right-3 -top-3 rounded-full border border-[#D4AF37]/60 bg-[#722F37] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F5E6A8] shadow-lg"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              Tap me
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <p className="max-w-xs text-center text-xs text-[#7a4a52]">
        Sound off? Good. This invite is purely visual vibes.
      </p>
    </div>
  );
}
