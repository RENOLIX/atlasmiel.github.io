import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  alt?: string;
}

export default function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg viewBox="0 0 40 40" fill="none" className="h-full aspect-square shrink-0">
        <polygon points="20,2 37,11 37,29 20,38 3,29 3,11" fill="oklch(0.72 0.16 68)" opacity="0.9" />
        <polygon points="20,8 32,14.5 32,27.5 20,34 8,27.5 8,14.5" fill="oklch(0.55 0.18 55)" />
        <text x="20" y="25" textAnchor="middle" fill="oklch(0.98 0.01 85)" fontSize="14" fontFamily="serif" fontWeight="bold">م</text>
      </svg>
      <span className="font-semibold uppercase tracking-[0.18em] text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>
        ATLAS-Miel
      </span>
    </div>
  );
}
