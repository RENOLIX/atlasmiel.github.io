import { motion } from "motion/react";
import { Award, Heart, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HONEY_COMB, MOUNTAIN } from "@/pages/produits/data";

export default function Histoire() {
  const { t, i18n } = useTranslation("common");
  const isRtl = i18n.dir() === "rtl";
  const timeline = ["2008", "2012", "2016", "2020", "2024"];
  const pillars = [
    { icon: Sparkles, title: "Purete", desc: "Du miel sans additifs ni conservateurs, preserve tel que la nature l'a offert." },
    { icon: Heart, title: "Bienfaits Sante", desc: "Un tresor naturel riche en vitamines et antioxydants." },
    { icon: Award, title: "Qualite", desc: "Nous selectionnons soigneusement les meilleures sources." },
  ];

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Navbar />
      <section className="relative pt-36 pb-20 text-center overflow-hidden" style={{ backgroundImage: `url(${MOUNTAIN})`, backgroundSize: "cover", backgroundPosition: "center" }}><div className="absolute inset-0 bg-black/60" /><motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10"><span className="text-xs tracking-widest uppercase text-[oklch(0.85_0.12_70)] opacity-80 mb-4 block" style={{ fontFamily: "Montserrat, sans-serif" }}>{t("history.since")}</span><h1 className="text-6xl md:text-7xl font-light text-white" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t("history.title")}</h1></motion.div></section>
      <section className="py-20 bg-[oklch(0.97_0.04_75)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {pillars.map((pillar) => <div key={pillar.title} className="group text-center px-8 py-10 bg-white border border-[oklch(0.88_0.08_70)] hover:border-primary transition-colors duration-300"><div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300"><pillar.icon size={28} strokeWidth={1.5} /></div><h3 className="text-2xl font-light text-foreground mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>{pillar.title}</h3><p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.83rem" }}>{pillar.desc}</p></div>)}
          </div>
          <div className="max-w-3xl mx-auto text-center"><span className="text-xs tracking-widest uppercase text-primary opacity-70 mb-4 block" style={{ fontFamily: "Montserrat, sans-serif" }}>A PROPOS</span><h2 className="text-4xl md:text-5xl font-light text-foreground mb-8" style={{ fontFamily: "Cormorant Garamond, serif" }}>L'authenticite avant tout</h2><div className="space-y-5 text-muted-foreground leading-loose" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.9rem" }}><p>Atlas est une marque specialisee dans la vente de miel naturel et authentique. Nous selectionnons avec soin les meilleurs miels aupres de sources fiables.</p><p>Nous croyons que le miel n'est pas qu'un simple produit alimentaire, mais un veritable tresor naturel aux multiples vertus.</p><p>Notre objectif est de gagner la confiance de nos clients grace a la qualite, la transparence et une experience exceptionnelle.</p></div></div>
        </div>
      </section>
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24"><div><h2 className="text-4xl md:text-5xl font-light mb-6 text-foreground" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t("history.heritage.title1")}<br /><em className="italic text-primary">{t("history.heritage.title2")}</em></h2><p className="text-muted-foreground leading-relaxed mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.88rem" }}>{t("history.heritage.p1")}</p><p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.88rem" }}>{t("history.heritage.p2")}</p></div><div className="aspect-[4/5] overflow-hidden"><img src={HONEY_COMB} alt="Honey" className="w-full h-full object-cover" /></div></div>
        <h2 className="text-4xl font-light text-center mb-16 text-foreground" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t("history.timeline")}</h2>
        <div className="space-y-12">{timeline.map((year) => <div key={year} className="border-l border-border pl-6"><span className="text-4xl font-light text-primary/40" style={{ fontFamily: "Cormorant Garamond, serif" }}>{year}</span><h3 className="text-2xl font-light text-foreground mt-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t(`history.y${year}`)}</h3><p className="text-muted-foreground mt-2" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.83rem" }}>{t(`history.y${year}.desc`)}</p></div>)}</div>
      </section>
      <Footer />
    </div>
  );
}
