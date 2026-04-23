"use client";

import { InteractiveRobotSpline } from "@/components/ui/interactive-3d-robot";

const ROBOT_SCENE_URL =
  "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

export function RobotHero() {
  return (
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden bg-gradient-to-b from-pink-50 via-white to-rose-50">
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-t from-pink-100/40 via-white/20 to-transparent"
        aria-hidden
      />
      <InteractiveRobotSpline
        scene={ROBOT_SCENE_URL}
        className="absolute inset-0 z-0 h-full w-full min-h-[600px] [&_canvas]:min-h-[600px]"
      />
    </div>
  );
}
