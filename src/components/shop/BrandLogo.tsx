import atlasLogo from "@/assets/atlas-logo.webp";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  alt?: string;
}

export default function BrandLogo({ className, imageClassName, alt = "ATLAS" }: BrandLogoProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={atlasLogo}
        alt={alt}
        draggable={false}
        className={cn("h-full w-full object-contain select-none", imageClassName)}
      />
    </div>
  );
}
