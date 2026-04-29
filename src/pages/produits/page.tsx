import { motion } from "motion/react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HONEY_COMB, PRODUCT_IDS, PRODUCT_IMAGES, PRODUCT_PRICES } from "@/pages/produits/data";

export { PRODUCT_IDS };

export default function Produits() {
  const { t, i18n } = useTranslation("common");
  const { lng } = useParams<{ lng: string }>();
  const prefix = lng ? `/${lng}` : "";
  const isRtl = i18n.dir() === "rtl";

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
          {PRODUCT_IDS.map((id, index) => (
            <motion.div key={id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.08 }}>
              <Link to={`${prefix}/produits/${id}`} className="group block">
                <div className="overflow-hidden aspect-[4/5] mb-5 relative">
                  <img src={PRODUCT_IMAGES[id]} alt={t(`prod.${id}.name`)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.6rem" }}>{t(`prod.${id}.tag`)}</div>
                </div>
                <p className="text-xs text-muted-foreground mb-1 tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem" }}>{t(`prod.${id}.origin`)}</p>
                <h3 className="text-2xl font-light text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t(`prod.${id}.name`)}</h3>
                <p className="text-muted-foreground mt-1 line-clamp-2" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.78rem" }}>{t(`prod.${id}.desc`)}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-xl font-medium text-primary" style={{ fontFamily: "Montserrat, sans-serif" }}>{PRODUCT_PRICES[id].toLocaleString("fr-DZ")} DA</span>
                  <span className="text-xs tracking-widest uppercase text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem" }}>{t("products.order")} <ArrowRight size={12} className={isRtl ? "rotate-180" : ""} /></span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
