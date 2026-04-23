"use client";

import { useEffect, useRef } from "react";

const COLORS = [
  "#D4AF37",
  "#E8C547",
  "#F5E6A8",
  "#722F37",
  "#8B2635",
  "#ffffff",
  "#C5A028",
  "#4a1520",
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  color: string;
  life: number;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ConfettiCanvas({
  active,
  onComplete,
}: {
  active: boolean;
  onComplete?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active) return;

    if (prefersReducedMotion()) {
      onCompleteRef.current?.();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);

    const particles: Particle[] = [];
    const count = Math.min(220, Math.floor((window.innerWidth * window.innerHeight) / 12000));
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.35;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 14;
      particles.push({
        x: cx + (Math.random() - 0.5) * 80,
        y: cy + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed * (0.4 + Math.random()),
        vy: Math.sin(angle) * speed * 0.5 - Math.random() * 8,
        w: 6 + Math.random() * 8,
        h: 8 + Math.random() * 10,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.35,
        color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? "#f472b6",
        life: 1,
      });
    }

    const gravity = 0.22;
    const drag = 0.992;
    const start = performance.now();
    const maxMs = 3200;

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", resize);

    const tick = (now: number) => {
      const elapsed = now - start;
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      ctx.clearRect(0, 0, ww, wh);

      for (const p of particles) {
        p.vy += gravity;
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life *= 0.995;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (elapsed < maxMs) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onCompleteRef.current?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full"
      aria-hidden
    />
  );
}
