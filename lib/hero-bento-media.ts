export interface HeroBentoMediaItem {
  id: number;
  type: "image" | "video";
  url: string;
  span: string;
}

/** Bento tile span patterns (cycles if you add more items). */
const SPANS = [
  "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
  "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2",
  "md:col-span-1 md:row-span-3 sm:col-span-2 sm:row-span-2",
  "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2",
  "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
] as const;

/** macOS screenshots — narrow no-break space (U+202F) before `AM`. */
const SCREENSHOTS = [
  `/Screenshot 2026-04-23 at 9.06.18\u202fAM.png`,
  `/Screenshot 2026-04-23 at 9.06.44\u202fAM.png`,
  `/Screenshot 2026-04-23 at 9.07.00\u202fAM.png`,
] as const;

/** Rest of `public/` gallery (HEIC uses `<img>` in the bento component). */
const GRADUATION_PHOTOS = [
  "/250426 Graduation DP7A1602 - AW.JPG",
  "/250504 Graduation DP1A1280 - AW.JPG",
  "/IMG_7839.JPG",
  "/IMG_7841.JPG",
  "/IMG_7847.JPG",
  "/IMG_7852.JPG",
  "/IMG_7855.JPG",
] as const;

const PUBLIC_PHOTOS = [...SCREENSHOTS, ...GRADUATION_PHOTOS];

export const heroBentoMedia: HeroBentoMediaItem[] = PUBLIC_PHOTOS.map(
  (url, i) => ({
    id: i + 1,
    type: "image" as const,
    url,
    span: SPANS[i % SPANS.length]!,
  }),
);
