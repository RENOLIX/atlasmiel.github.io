import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const SUPPORTED_LOCALES = ["fr", "ar", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const SAVED_OR_DEFAULT_LOCALE: SupportedLocale =
  (localStorage.getItem("atlas-locale") as SupportedLocale | null) ?? "fr";

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

const common = {
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

const resources = {
  fr: { common },
  en: { common },
  ar: { common },
};

void i18n.use(initReactI18next).init({
  resources,
  lng: isSupportedLocale(SAVED_OR_DEFAULT_LOCALE) ? SAVED_OR_DEFAULT_LOCALE : "fr",
  fallbackLng: "fr",
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
