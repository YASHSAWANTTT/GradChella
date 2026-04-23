"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

/** Maroon + gold + cream — matches the invite stationery palette (not the package demo’s neon colors). */
const INVITE_SHADER = {
  colorBack: "hsl(40, 42%, 98%)",
  colors: [
    "hsl(46, 62%, 54%)", // gold — #D4AF37 family
    "hsl(351, 44%, 36%)", // maroon — #722F37 family
    "hsl(350, 52%, 22%)", // deep maroon — #4a1520 family
    "hsl(48, 72%, 88%)", // cream — #F5E6A8 family
  ],
  softness: 0.72,
  intensity: 0.36,
  noise: 0.06,
  shape: "corners" as const,
  scale: 1,
  rotation: 0,
  speed: 0.55,
};

export function GradientBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-0 min-h-screen w-full overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <GrainGradient
        className="h-full w-full min-h-screen"
        style={{ height: "100%", width: "100%", minHeight: "100%" }}
        colorBack={INVITE_SHADER.colorBack}
        softness={INVITE_SHADER.softness}
        intensity={INVITE_SHADER.intensity}
        noise={INVITE_SHADER.noise}
        shape={INVITE_SHADER.shape}
        offsetX={0}
        offsetY={0}
        scale={INVITE_SHADER.scale}
        rotation={INVITE_SHADER.rotation}
        speed={INVITE_SHADER.speed}
        colors={INVITE_SHADER.colors}
      />
      {/* Keeps foreground typography readable like the old mesh + white veil */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/25 to-white/65"
        aria-hidden
      />
    </div>
  );
}
