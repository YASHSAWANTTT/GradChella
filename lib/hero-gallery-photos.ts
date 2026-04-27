/**
 * Graduation photos in `public/`. Order follows `hero-photo-sequence` (devu → yash → couple).
 */
import { heroPhotoSequence } from "@/lib/hero-photo-sequence";

export const heroGalleryPhotos = heroPhotoSequence.map((src, i) => ({
  id: i + 1,
  src,
  alt: "Graduation photo",
}));
