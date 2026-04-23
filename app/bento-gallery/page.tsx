import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";
import { heroBentoMedia } from "@/lib/hero-bento-media";

export default function BentoGridGalleryDemo() {
  return (
    <main className="min-h-screen overflow-y-auto bg-background py-8">
      <InteractiveBentoGallery
        mediaItems={heroBentoMedia}
        title="Gallery Shots Collection"
        description="Drag and explore our curated collection of shots"
      />
    </main>
  );
}
