import { motion } from "motion/react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HONEY_COMB, PRODUCT_IDS, PRODUCT_IMAGES, PRODUCT_PRICES, PRODUCT_WEIGHT_PRICES } from "@/pages/produits/data";
import { formatDzd } from "@/lib/currency";
import { useStore } from "@/lib/shop-store";
import { getLowestProductPrice } from "@/lib/product-pricing";

export { PRODUCT_IDS };

export default function Produits() {
  const { t, i18n } = useTranslation("common");
  const { lng } = useParams<{ lng: string }>();
  const prefix = lng ? `/${lng}` : "";
  const isRtl = i18n.dir() === "rtl";
  const { activeProducts } = useStore();
  const products = activeProducts.length
    ? activeProducts
    : PRODUCT_IDS.map((id) => ({
        id,
        name: t(`prod.${id}.name`),
        description: t(`prod.${id}.desc`),
        price: PRODUCT_PRICES[id],
        weightPrices: PRODUCT_WEIGHT_PRICES[id],
        weights: ["500g", "1kg"],
        images: [PRODUCT_IMAGES[id]],
      }));

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Navbar />
      <section className="relative pt-36 pb-20 text-center overflow-hidden" style={{ backgroundImage: `url(${HONEY_COMB})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/65" />
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
          <span className="text-xs tracking-widest uppercase text-[oklch(0.85_0.12_70)] opacity-80 mb-4 block" style={{ fontFamily: "Montserrat, sans-serif" }}>{t("products.page.badge")}</span>
          <h1 className="text-6xl md:text-7xl font-light text-white" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t("products.page.title")}</h1>
          <p className="text-white/60 mt-4 max-w-lg mx-auto" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.85rem" }}>{t("products.page.subtitle")}</p>
        </motion.div>
      </section>
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, index) => {
            const id = product.id;
            const knownId = PRODUCT_IDS.includes(id as (typeof PRODUCT_IDS)[number]) ? id as (typeof PRODUCT_IDS)[number] : null;
            const name = knownId ? t(`prod.${knownId}.name`) : product.name;
            const desc = knownId ? t(`prod.${knownId}.desc`) : product.description;
            const tag = knownId ? t(`prod.${knownId}.tag`) : "ATLAS";
            const origin = knownId ? t(`prod.${knownId}.origin`) : "Atlas";
            const image = product.images[0] ?? (knownId ? PRODUCT_IMAGES[knownId] : HONEY_COMB);

            return (
            <motion.div key={id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.08 }}>
              <Link to={`${prefix}/produits/${id}`} className="group block">
                <div className="overflow-hidden aspect-[4/5] mb-5 relative">
                  <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.6rem" }}>{tag}</div>
                </div>
                <p className="text-xs text-muted-foreground mb-1 tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem" }}>{origin}</p>
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{name}</h3>
                <p className="text-muted-foreground mt-1 line-clamp-2" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.78rem" }}>{desc}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-xl font-extrabold text-primary" style={{ fontFamily: "Montserrat, sans-serif" }}>{formatDzd(getLowestProductPrice(product), i18n.language)}</span>
                  <span className="text-xs tracking-widest uppercase text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem" }}>{t("products.order")} <ArrowRight size={12} className={isRtl ? "rotate-180" : ""} /></span>
                </div>
              </Link>
            </motion.div>
          )})}
        </div>
      </section>
      <Footer />
    </div>
  );
}
