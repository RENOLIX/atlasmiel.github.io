import type { Product } from "../types";
import { HONEY_COMB, HONEY_DIPPER, HONEY_DRIP, HONEY_SHELF, JAR_IMG } from "@/pages/produits/data";

export const seedProducts: Product[] = [
  { id: "montagne", name: "Miel de Montagne", description: "Miel dore aux notes sauvages, riche et equilibre.", price: 1800, weightPrices: { "500g": 1800, "1kg": 3400 }, category: "femme", images: [HONEY_DRIP], weights: ["500g", "1kg"], sizes: ["500g", "1kg"], shoeSizes: [], colors: [], stock: 30, featured: true, active: true },
  { id: "jujubier", name: "Miel de Jujubier", description: "Miel noble au gout profond et naturellement intense.", price: 2500, weightPrices: { "500g": 2500, "1kg": 4800 }, category: "femme", images: [HONEY_COMB], weights: ["500g", "1kg"], sizes: ["500g", "1kg"], shoeSizes: [], colors: [], stock: 24, featured: true, active: true },
  { id: "toutes-fleurs", name: "Miel Toutes Fleurs", description: "Miel floral doux, parfait pour toute la famille.", price: 1400, weightPrices: { "500g": 1400, "1kg": 2600 }, category: "femme", images: [JAR_IMG], weights: ["500g", "1kg"], sizes: ["500g", "1kg"], shoeSizes: [], colors: [], stock: 40, featured: true, active: true },
  { id: "romarin", name: "Miel de Romarin", description: "Miel clair aux notes herbacees et elegantes.", price: 2200, weightPrices: { "500g": 2200, "1kg": 4200 }, category: "femme", images: [HONEY_DIPPER], weights: ["500g", "1kg"], sizes: ["500g", "1kg"], shoeSizes: [], colors: [], stock: 18, featured: false, active: true },
  { id: "thym", name: "Miel de Thym", description: "Miel intense, parfume, au caractere mediterraneen.", price: 2800, weightPrices: { "500g": 2800, "1kg": 5400 }, category: "femme", images: [HONEY_SHELF], weights: ["500g", "1kg"], sizes: ["500g", "1kg"], shoeSizes: [], colors: [], stock: 16, featured: false, active: true },
];
