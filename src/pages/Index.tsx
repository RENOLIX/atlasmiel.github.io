import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Award, Droplets, Flower2, Leaf, Shield, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HONEY_COMB, HONEY_DRIP, JAR_IMG, PRODUCT_IDS, PRODUCT_IMAGES, PRODUCT_PRICES } from "@/pages/produits/data";

export default function Index() {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const { t, i18n } = useTranslation("common");
  const { lng } = useParams<{ lng: string }>();
  const prefix = lng ? `/${lng}` : "";
  const isRtl = i18n.dir() === "rtl";
  const features = [
    { icon: Leaf, label: t("features.natural"), desc: t("features.natural.desc") },
    { icon: Shield, label: t("features.quality"), desc: t("features.quality.desc") },
    { icon: Award, label: t("features.tradition"), desc: t("features.tradition.desc") },
    { icon: Star, label: t("features.taste"), desc: t("features.taste.desc") },
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => undefined);
  }, []);

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Navbar />
      <section ref={heroRef} className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <video ref={videoRef} autoPlay loop muted playsInline disablePictureInPicture disableRemotePlayback controlsList="nodownload nofullscreen noremoteplayback" onContextMenu={(e) => e.preventDefault()} className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none">
          <source src="https://hercules-cdn.com/file_NQSHNKolyUHd1rSKPyeUGhai" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="inline-flex items-center gap-2 px-5 py-2 border border-[oklch(0.72_0.16_68)] text-[oklch(0.85_0.12_70)] text-xs tracking-widest uppercase mb-8" style={{ fontFamily: "Montserrat, sans-serif" }}>{t("hero.badge")}</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const }} className="text-6xl md:text-8xl lg:text-9xl font-light text-white leading-none mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            ATLAS<br /><em className="italic text-[oklch(0.85_0.12_70)]">{t("hero.title2")}</em>
          </motion.h1>
          <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto mb-10 tracking-wide" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}>{t("hero.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`${prefix}/produits`} className="inline-flex items-center gap-3 px-8 py-4 bg-[oklch(0.55_0.18_55)] text-white text-sm tracking-widest uppercase hover:bg-[oklch(0.45_0.18_55)] transition-all duration-300" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem" }}>{t("hero.cta.products")}<ArrowRight size={16} className={isRtl ? "rotate-180" : ""} /></Link>
            <Link to={`${prefix}/histoire`} className="inline-flex items-center gap-3 px-8 py-4 border border-white/40 text-white text-sm tracking-widest uppercase hover:bg-white/10 transition-all duration-300" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem" }}>{t("hero.cta.history")}</Link>
          </div>
        </motion.div>
      </section>
      <section className="bg-[oklch(0.2_0.04_45)] py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f) => <div key={f.label} className="flex flex-col items-center text-center gap-3"><div className="p-3 rounded-full border border-[oklch(0.72_0.16_68)]/40"><f.icon size={20} className="text-[oklch(0.75_0.15_70)]" /></div><h4 className="text-sm font-medium text-white tracking-wide" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem" }}>{f.label}</h4><p className="text-xs text-white/50 leading-relaxed hidden md:block" style={{ fontFamily: "Montserrat, sans-serif" }}>{f.desc}</p></div>)}
        </div>
      </section>
      <section className="py-24 bg-[oklch(0.97_0.02_80)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16"><span className="text-xs tracking-widest uppercase text-primary opacity-70 mb-4 block" style={{ fontFamily: "Montserrat, sans-serif" }}>ATLAS-Miel</span><h2 className="text-5xl md:text-6xl font-light text-foreground" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t("honeyTypes.title")}</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[{ icon: Droplets, title: t("honeyTypes.liquid.title"), desc: t("honeyTypes.liquid.desc") }, { icon: Flower2, title: t("honeyTypes.hive.title"), desc: t("honeyTypes.hive.desc") }].map((item) => <div key={item.title} className="group relative bg-white border border-[oklch(0.88_0.04_75)] p-10 hover:border-primary/40 transition-all duration-500 hover:shadow-xl"><div className="flex items-start gap-6"><div className="shrink-0 p-4 border border-[oklch(0.72_0.16_68)]/30 bg-[oklch(0.97_0.04_78)]"><item.icon size={28} className="text-[oklch(0.55_0.18_55)]" /></div><div><h3 className="text-3xl font-light text-foreground mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>{item.title}</h3><p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.85rem" }}>{item.desc}</p></div></div></div>)}
          </div>
        </div>
      </section>
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16"><span className="text-xs tracking-widest uppercase text-primary opacity-70 mb-4 block" style={{ fontFamily: "Montserrat, sans-serif" }}>{t("products.tag")}</span><h2 className="text-5xl md:text-6xl font-light text-foreground" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t("products.title")}</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUCT_IDS.slice(0, 3).map((id) => <Link key={id} to={`${prefix}/produits/${id}`} className="group block"><div className="overflow-hidden aspect-[4/5] mb-5"><img src={id === "montagne" ? HONEY_DRIP : id === "jujubier" ? PRODUCT_IMAGES[id] : JAR_IMG} alt={t(`prod.${id}.name`)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div><span className="text-xs text-primary tracking-widest uppercase opacity-70 mb-1 block" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem" }}>{t(`prod.${id}.tag`)}</span><h3 className="text-2xl font-light text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t(`prod.${id}.name`)}</h3><p className="text-lg font-medium text-primary mt-2" style={{ fontFamily: "Montserrat, sans-serif" }}>{PRODUCT_PRICES[id].toLocaleString("fr-DZ")} DA</p></Link>)}
          </div>
          <div className="text-center mt-14"><Link to={`${prefix}/produits`} className="inline-flex items-center gap-3 px-10 py-4 border border-foreground text-foreground text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-300" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem" }}>{t("products.viewAll")}<ArrowRight size={16} className={isRtl ? "rotate-180" : ""} /></Link></div>
        </div>
      </section>
      <section className="relative py-32 overflow-hidden" style={{ backgroundImage: `url(${HONEY_COMB})`, backgroundSize: "cover", backgroundPosition: "center" }}><div className="absolute inset-0 bg-black/70" /><div className="relative z-10 text-center max-w-3xl mx-auto px-6"><p className="text-4xl md:text-5xl lg:text-6xl font-light italic text-white leading-tight" style={{ fontFamily: "Cormorant Garamond, serif" }}><span className="text-[oklch(0.85_0.12_70)]">{t("quote.text")}</span></p><p className="text-white/50 text-sm mt-6 tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem" }}>{t("quote.author")}</p></div></section>
      <section className="py-24 bg-primary text-primary-foreground"><div className="text-center max-w-2xl mx-auto px-6"><h2 className="text-5xl md:text-6xl font-light mb-6" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t("cta.title")}</h2><p className="opacity-80 mb-10 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.9rem" }}>{t("cta.desc")}</p><Link to={`${prefix}/produits`} className="inline-flex items-center gap-3 px-10 py-4 bg-white text-primary text-sm tracking-widest uppercase hover:bg-white/90 transition-all duration-300" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem" }}>{t("cta.btn")}<ArrowRight size={16} className={isRtl ? "rotate-180" : ""} /></Link></div></section>
      <Footer />
    </div>
  );
}
