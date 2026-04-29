import type { Product } from "../types";
import { HONEY_COMB, HONEY_DIPPER, HONEY_DRIP, HONEY_SHELF, JAR_IMG } from "@/pages/produits/data";

export const seedProducts: Product[] = [
  { id: "montagne", name: "Miel de Montagne", description: "Miel dore aux notes sauvages, riche et equilibre.", price: 1800, category: "femme", images: [HONEY_DRIP], sizes: ["500g"], shoeSizes: [], colors: ["Naturel"], stock: 30, featured: true, active: true },
  { id: "jujubier", name: "Miel de Jujubier", description: "Miel noble au gout profond et naturellement intense.", price: 2500, category: "femme", images: [HONEY_COMB], sizes: ["500g"], shoeSizes: [], colors: ["Naturel"], stock: 24, featured: true, active: true },
  { id: "toutes-fleurs", name: "Miel Toutes Fleurs", description: "Miel floral doux, parfait pour toute la famille.", price: 1400, category: "femme", images: [JAR_IMG], sizes: ["500g"], shoeSizes: [], colors: ["Naturel"], stock: 40, featured: true, active: true },
  { id: "romarin", name: "Miel de Romarin", description: "Miel clair aux notes herbacees et elegantes.", price: 2200, category: "femme", images: [HONEY_DIPPER], sizes: ["500g"], shoeSizes: [], colors: ["Naturel"], stock: 18, featured: false, active: true },
  { id: "thym", name: "Miel de Thym", description: "Miel intense, parfume, au caractere mediterraneen.", price: 2800, category: "femme", images: [HONEY_SHELF], sizes: ["500g"], shoeSizes: [], colors: ["Naturel"], stock: 16, featured: false, active: true },
];
