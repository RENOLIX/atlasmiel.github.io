import { useEffect, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatDzd } from "@/lib/currency";
import { initializeMetaPixel, loadMetaPixelSettings, trackMetaPixel } from "@/lib/meta-pixel";

type LastOrder = {
  orderNumber?: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  value?: number;
  currency?: string;
};

const COPY = {
  ar: {
    title: "شكرا على طلبك",
    desc: "تم تسجيل طلبك بنجاح. سيتواصل معك فريق ATLAS-Miel لتأكيد التوصيل.",
    order: "رقم الطلب",
    product: "المنتج",
    total: "المجموع",
    home: "الصفحة الرئيسية",
    shop: "المتجر",
  },
  fr: {
    title: "Merci pour votre commande",
    desc: "Votre commande a bien ete recue. L'equipe ATLAS-Miel vous contactera pour confirmer la livraison.",
    order: "Commande",
    product: "Produit",
    total: "Total",
    home: "Accueil",
    shop: "Boutique",
  },
  en: {
    title: "Thank you for your order",
    desc: "Your order has been received. The ATLAS-Miel team will contact you to confirm delivery.",
    order: "Order",
    product: "Product",
    total: "Total",
    home: "Home",
    shop: "Shop",
  },
};

function readLastOrder(): LastOrder {
  if (typeof window === "undefined") return {};

  try {
    return JSON.parse(window.sessionStorage.getItem("atlas-last-order") ?? "{}") as LastOrder;
  } catch {
    return {};
  }
}

export default function MerciPage() {
  const { i18n } = useTranslation("common");
  const { lng } = useParams<{ lng: string }>();
  const [searchParams] = useSearchParams();
  const langKey = i18n.language.startsWith("ar") ? "ar" : i18n.language.startsWith("en") ? "en" : "fr";
  const copy = COPY[langKey];
  const prefix = lng ? `/${lng}` : "";
  const order = useMemo(() => readLastOrder(), []);
  const orderNumber = searchParams.get("order") || order.orderNumber || "";
  const value = Number(order.value || 0);

  useEffect(() => {
    let cancelled = false;

    const trackConversion = async () => {
      const settings = await loadMetaPixelSettings();
      if (cancelled || !initializeMetaPixel(settings)) return;

      const payload = {
        content_ids: order.productId ? [order.productId] : [],
        content_name: order.productName,
        content_type: "product",
        currency: order.currency || "DZD",
        num_items: Number(order.quantity || 1),
        value,
      };

      trackMetaPixel("Purchase", payload, {
        dedupeKey: orderNumber || `${order.productId ?? "order"}-${value}`,
        dedupeScope: "session",
      });
    };

    void trackConversion();

    return () => {
      cancelled = true;
    };
  }, [order.productId, order.productName, order.quantity, order.currency, orderNumber, value]);

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.018_86)]" dir={langKey === "ar" ? "rtl" : "ltr"}>
      <Navbar />
      <main className="pt-32 pb-20">
        <motion.section
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl px-6 text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
            <CheckCircle className="h-11 w-11" />
          </div>
          <h1 className="text-5xl font-extrabold text-foreground md:text-6xl">{copy.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            {copy.desc}
          </p>

          <div className="mt-10 rounded-[28px] border border-[#f4b400]/35 bg-white p-6 text-start shadow-[0_28px_70px_-55px_rgba(90,52,10,0.5)]">
            {orderNumber ? (
              <div className="flex items-center justify-between gap-4 border-b border-border py-4">
                <span className="text-sm font-bold text-muted-foreground">{copy.order}</span>
                <span className="font-extrabold text-foreground">{orderNumber}</span>
              </div>
            ) : null}
            {order.productName ? (
              <div className="flex items-center justify-between gap-4 border-b border-border py-4">
                <span className="text-sm font-bold text-muted-foreground">{copy.product}</span>
                <span className="font-extrabold text-foreground">{order.productName}</span>
              </div>
            ) : null}
            {value > 0 ? (
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm font-bold text-muted-foreground">{copy.total}</span>
                <span className="text-xl font-extrabold text-[#c68e00]">{formatDzd(value, i18n.language)}</span>
              </div>
            ) : null}
          </div>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={`${prefix}/`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground px-7 py-4 text-sm font-extrabold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <Home className="h-4 w-4" />
              {copy.home}
            </Link>
            <Link
              to={`${prefix}/produits`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f4b400] px-7 py-4 text-sm font-extrabold uppercase tracking-widest text-black shadow-[0_12px_30px_rgba(244,180,0,0.26)]"
            >
              <ShoppingBag className="h-4 w-4" />
              {copy.shop}
            </Link>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
