import type { Product, ProductLocale, ProductTranslations } from "@/types";

const KNOWN_PRODUCT_NAMES: Record<string, Record<ProductLocale, string>> = {
  "\u0639\u0633\u0644 \u0627\u0644\u062c\u0628\u0627\u0644": {
    ar: "\u0639\u0633\u0644 \u0627\u0644\u062c\u0628\u0627\u0644",
    fr: "Miel de montagne",
    en: "Mountain honey",
  },
  "\u0639\u0633\u0644 \u0627\u0644\u062c\u0628\u0644\u064a": {
    ar: "\u0639\u0633\u0644 \u0627\u0644\u062c\u0628\u0644\u064a",
    fr: "Miel de montagne",
    en: "Mountain honey",
  },
  "\u0639\u0633\u0644 \u0627\u0644\u0633\u062f\u0631": {
    ar: "\u0639\u0633\u0644 \u0627\u0644\u0633\u062f\u0631",
    fr: "Miel de sidr",
    en: "Sidr honey",
  },
  "\u0639\u0633\u0644 \u0627\u0644\u0623\u0632\u0647\u0627\u0631": {
    ar: "\u0639\u0633\u0644 \u0627\u0644\u0623\u0632\u0647\u0627\u0631",
    fr: "Miel toutes fleurs",
    en: "Wildflower honey",
  },
  "\u0639\u0633\u0644 \u0625\u0643\u0644\u064a\u0644 \u0627\u0644\u062c\u0628\u0644": {
    ar: "\u0639\u0633\u0644 \u0625\u0643\u0644\u064a\u0644 \u0627\u0644\u062c\u0628\u0644",
    fr: "Miel de romarin",
    en: "Rosemary honey",
  },
  "\u0639\u0633\u0644 \u0627\u0644\u0632\u0639\u062a\u0631": {
    ar: "\u0639\u0633\u0644 \u0627\u0644\u0632\u0639\u062a\u0631",
    fr: "Miel de thym",
    en: "Thyme honey",
  },
  "\u0639\u0633\u0644 \u0627\u0644\u0646\u064a\u0644\u062f\u064a\u0629": {
    ar: "\u0639\u0633\u0644 \u0627\u0644\u0646\u064a\u0644\u062f\u064a\u0629",
    fr: "Miel de nigelle",
    en: "Nigella honey",
  },
  "\u0639\u0633\u0644 \u0634\u0648\u0643 \u0627\u0644\u0625\u0628\u0644": {
    ar: "\u0639\u0633\u0644 \u0634\u0648\u0643 \u0627\u0644\u0625\u0628\u0644",
    fr: "Miel de chardon de chameau",
    en: "Camel thorn honey",
  },
  "\u0639\u0633\u0644 \u0627\u0644\u062e\u0645\u0648\u0633": {
    ar: "\u0639\u0633\u0644 \u0627\u0644\u062e\u0645\u0648\u0633",
    fr: "Miel de khamous",
    en: "Khamous honey",
  },
  "\u0639\u0633\u0644 \u0627\u0644\u0643\u0627\u0644\u064a\u062a\u0648\u0633": {
    ar: "\u0639\u0633\u0644 \u0627\u0644\u0643\u0627\u0644\u064a\u062a\u0648\u0633",
    fr: "Miel d'eucalyptus",
    en: "Eucalyptus honey",
  },
  "\u0639\u0633\u0644 \u0627\u0644\u0644\u0628\u064a\u0646\u0629": {
    ar: "\u0639\u0633\u0644 \u0627\u0644\u0644\u0628\u064a\u0646\u0629",
    fr: "Miel de lebina",
    en: "Lebina honey",
  },
  "\u0639\u0633\u0644 \u0627\u0644\u0645\u0631\u0627\u0631 \u0627\u0644\u0634\u0648\u0643\u064a": {
    ar: "\u0639\u0633\u0644 \u0627\u0644\u0645\u0631\u0627\u0631 \u0627\u0644\u0634\u0648\u0643\u064a",
    fr: "Miel de figue de barbarie",
    en: "Prickly pear honey",
  },
  "\u062d\u0628\u0648\u0628 \u0627\u0644\u0644\u0642\u0627\u062d": {
    ar: "\u062d\u0628\u0648\u0628 \u0627\u0644\u0644\u0642\u0627\u062d",
    fr: "Pollen",
    en: "Pollen",
  },
  "\u0627\u0644\u0628\u0631\u0648\u0628\u0648\u0644\u064a\u0633": {
    ar: "\u0627\u0644\u0628\u0631\u0648\u0628\u0648\u0644\u064a\u0633",
    fr: "Propolis",
    en: "Propolis",
  },
  "\u0627\u0644\u063a\u0630\u0627\u0621 \u0627\u0644\u0645\u0644\u0643\u064a": {
    ar: "\u0627\u0644\u063a\u0630\u0627\u0621 \u0627\u0644\u0645\u0644\u0643\u064a",
    fr: "Gelee royale",
    en: "Royal jelly",
  },
};

export function getProductLocale(language: string): ProductLocale {
  if (language.startsWith("ar")) return "ar";
  if (language.startsWith("en")) return "en";
  return "fr";
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeProductTranslations(value: unknown): ProductTranslations {
  const input = value && typeof value === "object" ? value as ProductTranslations : {};

  return (["ar", "fr", "en"] as const).reduce<ProductTranslations>((translations, locale) => {
    const entry = input[locale];
    if (!entry || typeof entry !== "object") {
      return translations;
    }

    const name = clean(entry.name);
    const description = clean(entry.description);
    if (name || description) {
      translations[locale] = { name, description };
    }

    return translations;
  }, {});
}

export function getLocalizedProductName(product: Pick<Product, "name" | "translations">, language: string) {
  const locale = getProductLocale(language);
  const translated = clean(product.translations?.[locale]?.name);
  if (translated) return translated;

  const known = KNOWN_PRODUCT_NAMES[clean(product.name)];
  return known?.[locale] ?? product.name;
}

export function getLocalizedProductDescription(product: Pick<Product, "description" | "translations">, language: string) {
  const locale = getProductLocale(language);
  const translated = clean(product.translations?.[locale]?.description);
  return translated || product.description;
}
