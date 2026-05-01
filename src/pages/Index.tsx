import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Leaf,
  Shield,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  HONEY_COMB,
  PRODUCT_IDS,
  PRODUCT_IMAGES,
} from "@/pages/produits/data";
import { formatDzd } from "@/lib/currency";
import { getLowestProductPrice } from "@/lib/product-pricing";
import { useStore } from "@/lib/shop-store";
import honeyLiquid from "@/assets/honey-liquid.png";
import hiveProducts from "@/assets/hive-products.png";
import ctaHoneycomb from "@/assets/golden-honey-dripping-from-honeycomb.jpg";
import arabicHoneyShowcase from "@/assets/arabic-honey-showcase.png";

const honeyAccent = "#ffa700";

const sectionReveal = {
  hidden: { opacity: 0, y: 44 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const staggerReveal = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const itemReveal = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function Index() {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const { t, i18n } = useTranslation("common");
  const { lng } = useParams<{ lng: string }>();
  const prefix = lng ? `/${lng}` : "";
  const isRtl = i18n.dir() === "rtl";
  const heroVideoSrc = `${import.meta.env.BASE_URL}videos/atlas-hero.mp4`;
  const { activeProducts } = useStore();

  const features = [
    { icon: Leaf, label: t("features.natural"), desc: t("features.natural.desc") },
    { icon: Shield, label: t("features.quality"), desc: t("features.quality.desc") },
    { icon: Award, label: t("features.tradition"), desc: t("features.tradition.desc") },
    { icon: Star, label: t("features.taste"), desc: t("features.taste.desc") },
  ];

  const honeyTypes = [
    { image: honeyLiquid, title: t("honeyTypes.liquid.title"), desc: t("honeyTypes.liquid.desc") },
    { image: hiveProducts, title: t("honeyTypes.hive.title"), desc: t("honeyTypes.hive.desc") },
  ];

  const testimonials = [
    { text: t("testimonials.first.text"), name: t("testimonials.first.name") },
    { text: t("testimonials.second.text"), name: t("testimonials.second.name") },
    { text: t("testimonials.third.text"), name: t("testimonials.third.name") },
  ];

  const featuredProducts = activeProducts
    .filter((product) => product.featured)
    .slice(0, 3);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    void video.play().catch(() => undefined);
  }, []);

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Navbar />

      <section ref={heroRef} className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <img src={HONEY_COMB} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" />
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={HONEY_COMB}
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback"
          onCanPlay={() => {
            const video = videoRef.current;
            if (video) void video.play().catch(() => undefined);
          }}
          onContextMenu={(event) => event.preventDefault()}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        >
          <source src={heroVideoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 border border-[oklch(0.72_0.16_68)] text-[oklch(0.85_0.12_70)] text-xs tracking-widest uppercase mb-8"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {t("hero.badge")}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="text-6xl md:text-8xl lg:text-9xl font-light text-white leading-none mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            ATLAS
            <br />
            <em className="italic text-[oklch(0.85_0.12_70)]">{t("hero.title2")}</em>
          </motion.h1>
          <p
            className="text-base md:text-lg text-white/70 max-w-xl mx-auto mb-10 tracking-wide"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}
          >
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`${prefix}/produits`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[oklch(0.55_0.18_55)] text-white text-sm tracking-widest uppercase hover:bg-[oklch(0.45_0.18_55)] transition-all duration-300"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem" }}
            >
              {t("hero.cta.products")}
              <ArrowRight size={16} className={isRtl ? "rotate-180" : ""} />
            </Link>
            <Link
              to={`${prefix}/histoire`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/40 text-white text-sm tracking-widest uppercase hover:bg-white/10 transition-all duration-300"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem" }}
            >
              {t("hero.cta.history")}
            </Link>
          </div>
        </motion.div>
      </section>

      <motion.section
        className="bg-[oklch(0.2_0.04_45)] py-10"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionReveal}
      >
        <motion.div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8" variants={staggerReveal}>
          {features.map((feature) => (
            <motion.div key={feature.label} variants={itemReveal} className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-full border border-[oklch(0.72_0.16_68)]/40">
                <feature.icon size={20} className="text-[oklch(0.75_0.15_70)]" />
              </div>
              <h4 className="text-sm font-medium text-white tracking-wide" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem" }}>
                {feature.label}
              </h4>
              <p className="text-xs text-white/50 leading-relaxed hidden md:block" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="py-24 bg-[oklch(0.97_0.02_80)]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionReveal}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs tracking-widest uppercase text-primary opacity-70 mb-4 block" style={{ fontFamily: "Montserrat, sans-serif" }}>
              ATLAS-Miel
            </span>
            <h2 className="text-5xl md:text-6xl font-semibold text-foreground">
              {i18n.language === "ar" ? (
                <>
                  <span style={{ color: honeyAccent }}>العسل</span> ومنتجات الخلية
                </>
              ) : (
                t("honeyTypes.title")
              )}
            </h2>
          </div>
          {i18n.language === "ar" ? (
            <motion.div
              initial={{ opacity: 0, y: 70, scale: 0.94, filter: "blur(14px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="-mx-6 md:mx-auto md:max-w-6xl"
            >
              <img
                src={arabicHoneyShowcase}
                alt="العسل ومنتجات الخلية"
                className="w-full object-contain drop-shadow-[0_28px_55px_rgba(150,82,0,0.20)]"
              />
            </motion.div>
          ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-10" variants={staggerReveal}>
              {honeyTypes.map((item) => (
                <motion.div
                  key={item.title}
                  variants={itemReveal}
                  whileHover={{ y: -6 }}
                  className="group relative bg-white border border-[oklch(0.88_0.04_75)] p-8 md:p-10 hover:border-primary/40 transition-all duration-500 hover:shadow-xl"
                >
                  <div className="flex flex-col items-center text-center gap-5">
                    <img src={item.image} alt={item.title} className="h-36 w-36 object-contain transition-transform duration-500 group-hover:scale-110" />
                    <div>
                      <h3 className="text-3xl font-semibold text-foreground mb-4">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.85rem" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      <motion.section
        className="py-24 bg-muted/30"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionReveal}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs tracking-widest uppercase text-primary opacity-70 mb-4 block" style={{ fontFamily: "Montserrat, sans-serif" }}>
              {t("products.tag")}
            </span>
            <h2 className="text-5xl md:text-6xl font-light text-foreground" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              {t("products.title")}
            </h2>
          </div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={staggerReveal}>
            {featuredProducts.map((product) => {
              const knownId = PRODUCT_IDS.includes(product.id as (typeof PRODUCT_IDS)[number])
                ? product.id as (typeof PRODUCT_IDS)[number]
                : null;
              const name = knownId ? t(`prod.${knownId}.name`) : product.name;
              const tag = knownId ? t(`prod.${knownId}.tag`) : "ATLAS";
              const image = product.images[0] ?? (knownId ? PRODUCT_IMAGES[knownId] : HONEY_COMB);

              return (
              <motion.div key={product.id} variants={itemReveal} whileHover={{ y: -6 }}>
              <Link to={`${prefix}/produits/${product.id}`} className="group block">
                <div className="overflow-hidden aspect-[4/5] mb-5">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <span className="text-xs text-primary tracking-widest uppercase opacity-70 mb-1 block" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem" }}>
                  {tag}
                </span>
                <h3 className="text-2xl font-light text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {name}
                </h3>
                <p className="text-lg font-medium text-primary mt-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {formatDzd(getLowestProductPrice(product), i18n.language)}
                </p>
              </Link>
              </motion.div>
            )})}
          </motion.div>
          <div className="text-center mt-14">
            <Link
              to={`${prefix}/produits`}
              className="inline-flex items-center justify-center gap-3 px-10 py-4 border border-foreground text-foreground text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-300"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem" }}
            >
              {t("products.viewAll")}
              <ArrowRight size={16} className={isRtl ? "rotate-180" : ""} />
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="bg-white text-foreground py-8 border-y border-[oklch(0.88_0.04_75)]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionReveal}
      >
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center">
          <p className="text-2xl md:text-3xl font-light text-primary" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            {t("trust.natural")}
          </p>
          <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5">
            <ShieldCheck size={30} className="text-primary" strokeWidth={1.6} />
          </div>
          <p className="text-2xl md:text-3xl font-light text-primary" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            {t("trust.delivery")}
          </p>
        </div>
      </motion.section>

      <motion.section
        className="py-20 bg-[oklch(0.98_0.015_85)]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionReveal}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-light text-foreground" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              {t("testimonials.title")}
            </h2>
          </div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={staggerReveal}>
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.name} variants={itemReveal} whileHover={{ y: -5 }} className="bg-white border border-[oklch(0.88_0.04_75)] p-8">
                <div className="flex items-center gap-1 text-primary mb-5">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} size={15} fill="currentColor" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-8" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.9rem" }}>
                  {testimonial.text}
                </p>
                <p className="text-primary text-lg font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {testimonial.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="relative overflow-hidden py-28 text-white"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionReveal}
      >
        <img src={ctaHoneycomb} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/75" />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 text-[#ffd36a]" style={{ fontFamily: "Georgia, serif" }}>
            {t("cta.title")}
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed font-semibold" style={{ fontFamily: "Open Sans, sans-serif" }}>
            {t("cta.desc")}
          </p>
          <Link
            to={`${prefix}/produits`}
            className="inline-flex items-center justify-center gap-3 rounded-full bg-[#ffa700] px-10 py-4 text-sm font-extrabold tracking-widest uppercase text-[#24170c] shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:bg-[#ffd36a]"
            style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem" }}
          >
            {t("cta.btn")}
            <ArrowRight size={16} className={isRtl ? "rotate-180" : ""} />
          </Link>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
