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
      honeyTypes: { title: "Miels et produits de la ruche", liquid: { title: "Miel naturel", desc: "Le miel liquide naturel est l'essence de la purete de la nature, avec une texture legere, un gout riche et de nombreux bienfaits. Nous vous proposons une selection de qualite: miel de nigelle, miel de chardon de chameau, miel de khamous, miel de sidr, miel de montagne, miel d'eucalyptus, miel de lebina et miel de figue de barbarie." }, hive: { title: "Produits de la ruche", desc: "Les produits de la ruche sont des tresors naturels riches en nutriments et bienfaits. Nous vous proposons les meilleurs produits: pollen, propolis et gelee royale, choisis avec soin pour soutenir votre sante et votre vitalite." } },
      products: { tag: "Selection", title: "Nos miels signatures", viewAll: "Voir toute la collection", order: "Commander", page: { badge: "Boutique", title: "Nos Produits", subtitle: "Choisissez votre miel et commandez directement en ligne." } },
      trust: { natural: "100% naturel", delivery: "Livraison 69 wilayas" },
      testimonials: { title: "Avis de nos clients", first: { text: "Produit au top, emballage soigne et miel de haute qualite.", name: "عبد القادر زروقي" }, second: { text: "Le miel est excellent, naturel et tres savoureux. Je le recommande.", name: "أمين بن عمر" }, third: { text: "Tres bon produit, livraison rapide et miel d'excellente qualite.", name: "محمد أمين قادري" } },
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

const enCommon = {
  ...frCommon,
  nav: { home: "Home", products: "Products", history: "About", contact: "Contact", order: "Order now" },
  footer: { tagline: "Pure, natural and authentic honey from Algeria.", nav: "Navigation", contact: "Contact", rights: "ATLAS-Miel. All rights reserved.", pure: "Pure - Natural - Algerian" },
  hero: { badge: "Natural honey from Algeria", title2: "Honey", subtitle: "Pure honey carefully selected to bring you the richness of Algerian terroirs.", "cta.products": "View products", "cta.history": "Our story", scroll: "Scroll" },
  features: { natural: "100% natural", "natural.desc": "No additives or preservatives.", quality: "Controlled quality", "quality.desc": "A careful selection.", tradition: "Know-how", "tradition.desc": "A passion passed on.", taste: "Rich taste", "taste.desc": "Deep natural aromas." },
  honeyTypes: {
    title: "Honey and hive products",
    liquid: { title: "Natural honey", desc: "Natural liquid honey is the essence of nature's purity, with a light texture, rich taste and many benefits. We offer a careful selection of premium varieties for an authentic natural experience." },
    hive: { title: "Hive products", desc: "Hive products are natural treasures rich in nutrients and health benefits. We offer pollen, propolis and royal jelly, carefully selected to support wellness and vitality." },
  },
  products: { tag: "Selection", title: "Our signature honeys", viewAll: "View all products", order: "Order", page: { badge: "Shop", title: "Our Products", subtitle: "Choose your honey and order directly online." } },
  trust: { natural: "100% natural", delivery: "Delivery to 69 wilayas" },
  testimonials: { title: "Customer reviews", first: { text: "Top product, good packaging and high quality honey.", name: "عبد القادر زروقي" }, second: { text: "Excellent honey, natural and very tasty. I recommend it.", name: "أمين بن عمر" }, third: { text: "Good product, fast delivery and excellent honey quality.", name: "محمد أمين قادري" } },
  cta: { title: "Taste authenticity", desc: "Order your natural honey jar and receive it anywhere in Algeria.", btn: "Order now" },
  contact: { badge: "Get in touch", title: "Contact", subtitle: "Let's talk honey", desc: "Have a question, a special order or need product advice? Send us a message.", address: "Address", "address.val": "Algiers, Algeria", phone: "Phone", email: "Email", name: "Name", message: "Message", send: "Send", sending: "Sending...", success: "Message sent successfully" },
  history: { since: "Since 2008", title: "Our Story", timeline: "Timeline", "y2008": "First hives", "y2008.desc": "A family passion begins.", "y2012": "Local selection", "y2012.desc": "Searching for the best sources.", "y2016": "Stronger quality", "y2016.desc": "Improved control and packaging.", "y2020": "New identity", "y2020.desc": "ATLAS-Miel becomes a clear brand.", "y2024": "Online sales", "y2024.desc": "Simple orders and fast delivery.", heritage: { title1: "A natural", title2: "heritage", p1: "We choose honey for its purity, texture and taste.", p2: "Every jar carries a simple promise: authenticity, transparency and pleasure." } },
  product: { back: "Back to products", notfound: "Product not found", "notfound.back": "Back", delivery: "Delivery available", payment: "Cash on delivery", order: { title: "Order this product", name: "Full name", phone: "Phone", wilaya: "Wilaya", qty: "Quantity", address: "Address", total: "Total", submitting: "Sending...", submit: "Confirm order", note: "Our team will contact you to confirm delivery.", success: { title: "Order received", desc: "Thank you. We will contact you soon.", new: "New order" } } },
  prod: {
    montagne: { name: "Mountain Honey", desc: "Golden honey with wild notes, rich and balanced.", tag: "Signature", origin: "Atlas", b1: "Rich aromas", b2: "Smooth texture", b3: "Ideal for breakfast" },
    jujubier: { name: "Jujube Honey", desc: "Premium honey with a deep and naturally intense taste.", tag: "Premium", origin: "South", b1: "Powerful flavor", b2: "Highly appreciated", b3: "500g jar" },
    "toutes-fleurs": { name: "Wildflower Honey", desc: "Soft floral honey, perfect for the whole family.", tag: "Soft", origin: "Meadows", b1: "Floral taste", b2: "Daily use", b3: "Natural" },
    romarin: { name: "Rosemary Honey", desc: "Light honey with elegant herbal notes.", tag: "Aromatic", origin: "Tell", b1: "Delicate aroma", b2: "Excellent in tea", b3: "Careful harvest" },
    thym: { name: "Thyme Honey", desc: "Intense fragrant honey with Mediterranean character.", tag: "Intense", origin: "Mountains", b1: "Powerful notes", b2: "Dense texture", b3: "Strong character" },
  },
};

const arCommon = {
  nav: { home: "الرئيسية", products: "المنتجات", history: "قصتنا", contact: "اتصل بنا", order: "اطلب الآن" },
  footer: { tagline: "عسل طبيعي، نقي وأصيل من خيرات الجزائر.", nav: "التصفح", contact: "التواصل", rights: "ATLAS-Miel. جميع الحقوق محفوظة.", pure: "نقي - طبيعي - جزائري" },
  hero: { badge: "عسل طبيعي من الجزائر", title2: "العسل", subtitle: "عسل نقي مختار بعناية ليحمل غنى الطبيعة الجزائرية.", "cta.products": "عرض المنتجات", "cta.history": "قصتنا", scroll: "مرر" },
  features: { natural: "طبيعي 100%", "natural.desc": "بدون إضافات أو مواد حافظة.", quality: "جودة مضمونة", "quality.desc": "اختيار دقيق ومراقب.", tradition: "خبرة أصيلة", "tradition.desc": "شغف متوارث.", taste: "مذاق غني", "taste.desc": "نكهات عميقة وطبيعية." },
  honeyTypes: { title: "العسل ومنتجات الخلية", liquid: { title: "عسل طبيعي", desc: "العسل السائل الطبيعي هو خلاصة نقاء الطبيعة، يتميز بقوامه الخفيف ومذاقه الغني وفوائده الصحية المتعددة. نقدّم لكم مجموعة مختارة من أجود الأنواع: عسل النيلدية، عسل شوك الإبل، عسل الخموس، عسل السدر، عسل الجبلي، عسل الكاليتوس، عسل اللبينة، وعسل المرار الشوكي، لتجربة طبيعية أصيلة وجودة لا تُضاهى" }, hive: { title: "منتجات الخلية", desc: "منتجات الخلية هي كنوز طبيعية غنية بالعناصر الغذائية والفوائد الصحية، يمنحها لنا النحل بعناية فائقة من قلب الطبيعة. نقدّم لكم أجود هذه المنتجات: حبوب اللقاح، البروبوليس (العكبر)، والغذاء الملكي، المختارة بعناية لدعم صحتكم وتعزيز حيويتكم بأسلوب طبيعي وأصيل" } },
  products: { tag: "مختاراتنا", title: "أنواع العسل المميزة", viewAll: "عرض كل المنتجات", order: "اطلب", page: { badge: "المتجر", title: "منتجاتنا", subtitle: "اختر عسلك واطلب مباشرة عبر الموقع." } },
  trust: { natural: "100% طبيعي", delivery: "توصيل 69 ولاية" },
  testimonials: { title: "آراء عملائنا", first: { text: "منتج في القمة، التغليف مليح والعسل جودة عالية", name: "عبد القادر زروقي" }, second: { text: "العسل هايل بزاف، طبيعي وبنّة تاعو تشهي. ننصح بيه", name: "أمين بن عمر" }, third: { text: "منتوج مليح، التوصيل كان سريع والعسل نوعية ممتازة", name: "محمد أمين قادري" } },
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
  en: { common: enCommon },
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
