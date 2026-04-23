"use client";

import { motion } from "framer-motion";

/** Soft white field + gold sparkles (blobs) + whisper maroon wash — reads “celebration stationery”. */
export function MeshGradientBg() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden bg-white"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,rgba(212,175,55,0.14),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_40%,rgba(114,47,55,0.06),transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_65%,rgba(212,175,55,0.08),transparent_38%)]" />

      <motion.div
        className="absolute -left-1/4 top-[15%] h-[420px] w-[420px] rounded-full bg-[#D4AF37]/12 blur-[100px]"
        animate={{ x: [0, 28, 0], y: [0, 18, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-1/5 bottom-[5%] h-[380px] w-[380px] rounded-full bg-[#722F37]/10 blur-[95px]"
        animate={{ x: [0, -22, 0], y: [0, -16, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/3 h-[200px] w-[200px] -translate-x-1/2 rounded-full bg-[#F5E6A8]/35 blur-[50px]"
        animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.95, 1.08, 0.95] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Gold “sparkle” specks */}
      {[
        { left: "8%", top: "12%", s: 1 },
        { left: "22%", top: "28%", s: 1.2 },
        { left: "78%", top: "18%", s: 0.9 },
        { left: "88%", top: "42%", s: 1.1 },
        { left: "12%", top: "62%", s: 0.85 },
        { left: "45%", top: "8%", s: 1 },
        { left: "62%", top: "72%", s: 1.15 },
        { left: "34%", top: "88%", s: 0.95 },
      ].map((dot, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.9),0_0_2px_rgba(255,255,255,0.9)]"
          style={{ left: dot.left, top: dot.top, scale: dot.s }}
          animate={{
            opacity: [0.35, 1, 0.35],
            scale: [dot.s * 0.85, dot.s * 1.25, dot.s * 0.85],
          }}
          transition={{
            duration: 2.4 + (i % 4) * 0.35,
            repeat: Infinity,
            delay: i * 0.22,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(255,255,255,0.92)_88%,#ffffff_100%)]" />
    </div>
  );
}
