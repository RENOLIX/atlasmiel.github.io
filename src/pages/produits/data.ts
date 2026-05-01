export const HONEY_DRIP = "https://images.unsplash.com/photo-1545246909-b4e087f05214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHw4fHxnb2xkZW4lMjBob25leSUyMGRyaXBwaW5nJTIwamFyJTIwbHV4dXJ5fGVufDB8fHx8MTc3NzMzOTA2N3ww&ixlib=rb-4.1.0&q=80&w=1080";
export const HONEY_COMB = "https://images.unsplash.com/photo-1773957949154-a7d1ef35ae76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHw0fHxob25leSUyMGJlZSUyMGhvbmV5Y29tYiUyMGNsb3NlJTIwdXAlMjBnb2xkZW58ZW58MHx8fHwxNzc3MzM5MDY5fDA&ixlib=rb-4.1.0&q=80&w=1080";
export const HONEY_COMB_CONTACT = "https://images.unsplash.com/photo-1580912458557-8bae76ee5bac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwxfHxob25leSUyMGJlZSUyMGhvbmV5Y29tYiUyMGNsb3NlJTIwdXAlMjBnb2xkZW58ZW58MHx8fHwxNzc3MzM5MDY5fDA&ixlib=rb-4.1.0&q=80&w=1080";
export const JAR_IMG = "https://images.unsplash.com/photo-1740506569102-1bb75e5e1afe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaG9uZXklMjBqYXIlMjB3b29kZW4lMjBydXN0aWMlMjBvcmdhbmljfGVufDB8fHx8MTc3NzMzOTA3MHww&ixlib=rb-4.1.0&q=80&w=1080";
export const HONEY_DIPPER = "https://images.unsplash.com/photo-1573697610008-4c72b4e9508f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwyfHxuYXR1cmFsJTIwaG9uZXklMjBqYXIlMjB3b29kZW4lMjBydXN0aWMlMjBvcmdhbmljfGVufDB8fHx8MTc3NzMzOTA3MHww&ixlib=rb-4.1.0&q=80&w=1080";
export const HONEY_SHELF = "https://images.unsplash.com/photo-1761416351532-ede97c29fab8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHw2fHxuYXR1cmFsJTIwaG9uZXklMjBqYXIlMjB3b29kZW4lMjBydXN0aWMlMjBvcmdhbmljfGVufDB8fHx8MTc3NzMzOTA3MHww&ixlib=rb-4.1.0&q=80&w=1080";
export const MOUNTAIN = "https://images.unsplash.com/photo-1748868964933-3a38dc848eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHw0fHxob25leWNvbWIlMjBiZWVzJTIwbmF0dXJlJTIwQWxnZXJpYSUyMG1vdW50YWluc3xlbnwwfHx8fDE3NzczMzkwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080";

export const PRODUCT_IDS = ["montagne", "jujubier", "toutes-fleurs", "romarin", "thym"] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

export const PRODUCT_IMAGES: Record<ProductId, string> = {
  montagne: HONEY_DRIP,
  jujubier: HONEY_COMB,
  "toutes-fleurs": JAR_IMG,
  romarin: HONEY_DIPPER,
  thym: HONEY_SHELF,
};

export const PRODUCT_PRICES: Record<ProductId, number> = {
  montagne: 1800,
  jujubier: 2500,
  "toutes-fleurs": 1400,
  romarin: 2200,
  thym: 2800,
};

export const PRODUCT_WEIGHT_PRICES: Record<ProductId, Record<string, number>> = {
  montagne: { "500g": 1800, "1kg": 3400 },
  jujubier: { "500g": 2500, "1kg": 4800 },
  "toutes-fleurs": { "500g": 1400, "1kg": 2600 },
  romarin: { "500g": 2200, "1kg": 4200 },
  thym: { "500g": 2800, "1kg": 5400 },
};

export const PRODUCT_WEIGHT_COMPARE_PRICES: Record<ProductId, Record<string, number>> = {
  montagne: {},
  jujubier: {},
  "toutes-fleurs": {},
  romarin: {},
  thym: {},
};
