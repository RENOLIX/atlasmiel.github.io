import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const SUPPORTED_LOCALES = ["fr", "ar", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const SAVED_OR_DEFAULT_LOCALE: SupportedLocale = "ar";

export function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale);
}

export function setLocaleInPath(locale: string, path = "/", search = "", hash = "") {
  const clean = path.replace(/^\/(ar|fr|en)(?=\/|$)/, "") || "/";
  return `/${locale}${clean === "/" ? "" : clean}${search}${hash}`;
}

export async function changeLocale(locale: SupportedLocale) {
  localStorage.setItem("atlas-locale", locale);
  await i18n.changeLanguage(locale);
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
}

const frCommon = {
      nav: { home: "Accueil", products: "Produits", history: "Histoire", contact: "Contact", order: "Commander" },
      footer: { tagline: "Miel naturel, pur et authentique issu des saveurs d'Algerie.", nav: "Navigation", contact: "Contact", rights: "ATLAS-Miel. Tous droits reserves.", pure: "Pur - Naturel - Algerien" },
      hero: { badge: "Miel naturel d'Algerie", title2: "Miel", subtitle: "Des miels purs, selectionnes avec soin, pour retrouver la richesse des terroirs algeriens.", "cta.products": "Voir les produits", "cta.history": "Notre histoire", scroll: "Defiler" },
      features: { natural: "100% naturel", "natural.desc": "Sans additifs ni conservateurs.", quality: "Qualite controlee", "quality.desc": "Une selection exigeante.", tradition: "Savoir-faire", "tradition.desc": "Une passion transmise.", taste: "Gout riche", "taste.desc": "Des aromes profonds." },
      honeyTypes: { title: "Miels et produits de la ruche", liquid: { title: "Miel naturel", desc: "Une texture doree, florale et intense, recoltee dans le respect de la nature." }, hive: { title: "Produits de la ruche", desc: "Une selection autour du miel, de la propolis et des richesses de la ruche." } },
      products: { tag: "Selection", title: "Nos miels signatures", viewAll: "Voir toute la collection", order: "Commander", page: { badge: "Boutique", title: "Nos Produits", subtitle: "Choisissez votre miel et commandez directement en ligne." } },
      quote: { text: "Le miel garde la memoire des fleurs.", author: "ATLAS-Miel" },
      stats: { natural: "Naturel", experience: "Annees", varieties: "Varietes", clients: "Clients" },
      cta: { title: "Goutez l'authenticite", desc: "Commandez votre pot de miel naturel et recevez-le partout en Algerie.", btn: "Commander maintenant" },
      contact: { badge: "Nous joindre", title: "Contact", subtitle: "Parlons miel", desc: "Une question, une commande speciale ou un conseil produit ? Envoyez-nous un message.", address: "Adresse", "address.val": "Alger, Algerie", phone: "Telephone", email: "Email", name: "Nom", message: "Message", send: "Envoyer", sending: "Envoi...", success: "Message envoye avec succes" },
      history: { since: "Depuis 2008", title: "Notre Histoire", timeline: "Chronologie", "y2008": "Premieres ruches", "y2008.desc": "Une passion familiale prend forme.", "y2012": "Selection locale", "y2012.desc": "Recherche des meilleurs terroirs.", "y2016": "Qualite renforcee", "y2016.desc": "Controle et conditionnement ameliores.", "y2020": "Nouvelle identite", "y2020.desc": "ATLAS-Miel devient une marque.", "y2024": "Vente en ligne", "y2024.desc": "Commande simple et livraison rapide.", heritage: { title1: "Un heritage", title2: "naturel", p1: "Notre miel est choisi pour sa purete, sa texture et son gout.", p2: "Chaque pot porte une promesse simple: authenticite, transparence et plaisir." } },
      product: { back: "Retour aux produits", notfound: "Produit introuvable", "notfound.back": "Retour", delivery: "Livraison disponible", payment: "Paiement a la livraison", order: { title: "Commander ce produit", name: "Nom complet", phone: "Telephone", wilaya: "Wilaya", qty: "Quantite", address: "Adresse", total: "Total", submitting: "Envoi...", submit: "Valider la commande", note: "Notre equipe vous contactera pour confirmer la livraison.", success: { title: "Commande recue", desc: "Merci. Nous vous contacterons rapidement.", new: "Nouvelle commande" } } },
      prod: {
        montagne: { name: "Miel de Montagne", desc: "Miel dore aux notes sauvages, riche et equilibre.", tag: "Signature", origin: "Atlas", b1: "Riche en aromes", b2: "Texture onctueuse", b3: "Ideal au petit-dejeuner" },
        jujubier: { name: "Miel de Jujubier", desc: "Miel noble au gout profond et naturellement intense.", tag: "Premium", origin: "Sud", b1: "Saveur puissante", b2: "Tres apprecie", b3: "Pot 500g" },
        "toutes-fleurs": { name: "Miel Toutes Fleurs", desc: "Miel floral doux, parfait pour toute la famille.", tag: "Doux", origin: "Prairies", b1: "Gout floral", b2: "Usage quotidien", b3: "Naturel" },
        romarin: { name: "Miel de Romarin", desc: "Miel clair aux notes herbacees et elegantes.", tag: "Aromatique", origin: "Tell", b1: "Parfum delicat", b2: "Excellent en infusion", b3: "Recolte soignee" },
        thym: { name: "Miel de Thym", desc: "Miel intense, parfume, au caractere mediterraneen.", tag: "Intense", origin: "Montagnes", b1: "Ar o mes puissants", b2: "Texture dense", b3: "Grand caractere" }
      }
};

const arCommon = {
  nav: { home: "الرئيسية", products: "المنتجات", history: "قصتنا", contact: "اتصل بنا", order: "اطلب الآن" },
  footer: { tagline: "عسل طبيعي، نقي وأصيل من خيرات الجزائر.", nav: "التصفح", contact: "التواصل", rights: "ATLAS-Miel. جميع الحقوق محفوظة.", pure: "نقي - طبيعي - جزائري" },
  hero: { badge: "عسل طبيعي من الجزائر", title2: "العسل", subtitle: "عسل نقي مختار بعناية ليحمل غنى الطبيعة الجزائرية.", "cta.products": "عرض المنتجات", "cta.history": "قصتنا", scroll: "مرر" },
  features: { natural: "طبيعي 100%", "natural.desc": "بدون إضافات أو مواد حافظة.", quality: "جودة مضمونة", "quality.desc": "اختيار دقيق ومراقب.", tradition: "خبرة أصيلة", "tradition.desc": "شغف متوارث.", taste: "مذاق غني", "taste.desc": "نكهات عميقة وطبيعية." },
  honeyTypes: { title: "العسل ومنتجات الخلية", liquid: { title: "عسل طبيعي", desc: "قوام ذهبي ونكهة زهرية غنية، مختار باحترام للطبيعة." }, hive: { title: "منتجات الخلية", desc: "اختيارات طبيعية من العسل وخيرات الخلية." } },
  products: { tag: "مختاراتنا", title: "أنواع العسل المميزة", viewAll: "عرض كل المنتجات", order: "اطلب", page: { badge: "المتجر", title: "منتجاتنا", subtitle: "اختر عسلك واطلب مباشرة عبر الموقع." } },
  quote: { text: "العسل يحتفظ بذاكرة الأزهار.", author: "ATLAS-Miel" },
  stats: { natural: "طبيعي", experience: "سنوات", varieties: "أنواع", clients: "زبائن" },
  cta: { title: "تذوق الأصالة", desc: "اطلب عسلًا طبيعيًا واستلمه في مختلف ولايات الجزائر.", btn: "اطلب الآن" },
  contact: { badge: "تواصل معنا", title: "اتصل بنا", subtitle: "لنتحدث عن العسل", desc: "لديك سؤال أو طلب خاص؟ أرسل لنا رسالة.", address: "العنوان", "address.val": "الجزائر العاصمة، الجزائر", phone: "الهاتف", email: "البريد الإلكتروني", name: "الاسم", message: "الرسالة", send: "إرسال", sending: "جار الإرسال...", success: "تم إرسال الرسالة بنجاح" },
  history: { since: "منذ 2008", title: "قصتنا", timeline: "المسار", "y2008": "البدايات الأولى", "y2008.desc": "بدأ الشغف العائلي بالعسل الطبيعي.", "y2012": "اختيار محلي", "y2012.desc": "البحث عن أفضل المناطق والمصادر.", "y2016": "تعزيز الجودة", "y2016.desc": "تحسين المراقبة والتعبئة.", "y2020": "هوية جديدة", "y2020.desc": "أصبحت ATLAS-Miel علامة واضحة.", "y2024": "البيع عبر الإنترنت", "y2024.desc": "طلب سهل وتوصيل سريع.", heritage: { title1: "إرث", title2: "طبيعي", p1: "نختار العسل لنقائه وقوامه ومذاقه.", p2: "كل عبوة تحمل وعدًا بسيطًا: الأصالة، الشفافية والمتعة." } },
  product: { back: "العودة إلى المنتجات", notfound: "المنتج غير موجود", "notfound.back": "رجوع", delivery: "التوصيل متوفر", payment: "الدفع عند الاستلام", order: { title: "اطلب هذا المنتج", name: "الاسم الكامل", phone: "الهاتف", wilaya: "الولاية", qty: "الكمية", address: "العنوان", total: "المجموع", submitting: "جار الإرسال...", submit: "تأكيد الطلب", note: "سيتصل بك فريقنا لتأكيد التوصيل.", success: { title: "تم استلام الطلب", desc: "شكرا لك. سنتواصل معك قريبا.", new: "طلب جديد" } } },
  prod: {
    montagne: { name: "عسل الجبال", desc: "عسل ذهبي بنكهة طبيعية غنية ومتوازنة.", tag: "مميز", origin: "الأطلس", b1: "غني بالنكهات", b2: "قوام ناعم", b3: "مثالي للفطور" },
    jujubier: { name: "عسل السدر", desc: "عسل فاخر بمذاق عميق وطبيعي.", tag: "فاخر", origin: "الجنوب", b1: "مذاق قوي", b2: "محبوب جدا", b3: "عبوة 500غ" },
    "toutes-fleurs": { name: "عسل الأزهار", desc: "عسل زهري لطيف مناسب لكل العائلة.", tag: "لطيف", origin: "المراعي", b1: "نكهة زهرية", b2: "للاستعمال اليومي", b3: "طبيعي" },
    romarin: { name: "عسل إكليل الجبل", desc: "عسل فاتح بنفحات عشبية أنيقة.", tag: "عطري", origin: "التل", b1: "رائحة لطيفة", b2: "ممتاز مع الشاي", b3: "اختيار بعناية" },
    thym: { name: "عسل الزعتر", desc: "عسل قوي ومعطر بطابع متوسطي.", tag: "قوي", origin: "الجبال", b1: "نكهات قوية", b2: "قوام كثيف", b3: "طابع مميز" },
  },
};

const resources = {
  fr: { common: frCommon },
  en: { common: frCommon },
  ar: { common: arCommon },
};

void i18n.use(initReactI18next).init({
  resources,
  lng: isSupportedLocale(SAVED_OR_DEFAULT_LOCALE) ? SAVED_OR_DEFAULT_LOCALE : "fr",
  fallbackLng: "ar",
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
