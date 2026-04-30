import { motion } from "motion/react";
import { Award, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HONEY_COMB, MOUNTAIN } from "@/pages/produits/data";

const honeyAccent = "#ffa700";

const sectionReveal = {
  hidden: { opacity: 0, y: 42 },
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

export default function Histoire() {
  const { t, i18n } = useTranslation("common");
  const isRtl = i18n.dir() === "rtl";
  const isArabic = i18n.language === "ar";
  const timeline = ["2008", "2012", "2016", "2020", "2024"];

  const pillars = isArabic
    ? [
        { icon: Sparkles, title: "النقاء" },
        { icon: Heart, title: "الفوائد الصحية" },
        { icon: Award, title: "الجودة" },
      ]
    : [
        { icon: Sparkles, title: "Purete" },
        { icon: Heart, title: "Bienfaits sante" },
        { icon: Award, title: "Qualite" },
      ];

  const aboutParagraphs = isArabic
    ? [
        "أطلس هي علامة تجارية متخصصة في بيع العسل الطبيعي والأصيل. نحرص على اختيار أجود أنواع العسل بعناية من مصادر موثوقة، لنقدم لعملائنا منتجًا نقيًا، لذيذًا، وغنيًا بالفوائد الصحية",
        "نؤمن بأن العسل ليس مجرد منتج غذائي، بل هو كنز طبيعي يحمل في طياته فوائد عديدة للجسم والصحة. لذلك، نلتزم بتوفير عسل خالٍ من أي إضافات أو مواد حافظة، محافظين على جودته وطبيعته كما وهبته الطبيعة",
        "نسعى دائمًا لكسب ثقة عملائنا من خلال الجودة العالية، والشفافية في اختيار منتجاتنا، وتقديم تجربة مميزة ترضي جميع الأذواق. هدفنا هو أن نكون خياركم الأول لكل ما يتعلق بالعسل الطبيعي، وأن نشارككم أسلوب حياة صحي ومتوازن",
      ]
    : [
        "Atlas est une marque specialisee dans la vente de miel naturel et authentique. Nous selectionnons avec soin les meilleurs miels aupres de sources fiables pour offrir un produit pur, savoureux et riche en bienfaits.",
        "Nous croyons que le miel n'est pas un simple aliment, mais un tresor naturel aux nombreuses vertus. Nous proposons un miel sans additifs ni conservateurs, preserve dans sa qualite naturelle.",
        "Notre objectif est de gagner la confiance de nos clients grace a la qualite, la transparence et une experience qui respecte tous les gouts.",
      ];

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Navbar />

      <section
        className="relative pt-36 pb-20 text-center overflow-hidden"
        style={{ backgroundImage: `url(${MOUNTAIN})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <span className="text-xs tracking-widest uppercase text-[oklch(0.85_0.12_70)] opacity-80 mb-4 block" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {t("history.since")}
          </span>
          <h1 className="text-6xl md:text-7xl font-light text-white" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            {t("history.title")}
          </h1>
        </motion.div>
      </section>

      <motion.section
        className="py-20 bg-[oklch(0.97_0.04_75)]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionReveal}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div className="bg-white border border-[oklch(0.88_0.04_75)] grid grid-cols-1 md:grid-cols-3 gap-px mb-16 shadow-sm" variants={staggerReveal}>
            {pillars.map((pillar) => (
              <motion.div key={pillar.title} variants={itemReveal} whileHover={{ y: -4 }} className="bg-white px-8 py-8 flex items-center justify-center gap-4 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <pillar.icon size={22} strokeWidth={1.6} />
                </div>
                <h3 className="text-2xl font-semibold" style={{ color: honeyAccent }}>
                  {pillar.title}
                </h3>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="max-w-3xl mx-auto text-center" variants={itemReveal}>
            <span className="text-xs tracking-widest uppercase text-primary opacity-70 mb-4 block" style={{ fontFamily: "Montserrat, sans-serif" }}>
              {isArabic ? "من نحن" : "A PROPOS"}
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-8">
              {isArabic ? (
                <>
                  <span style={{ color: honeyAccent }}>أطلس</span> - عسل طبيعي وأصيل
                </>
              ) : (
                "L'authenticite avant tout"
              )}
            </h2>
            <div className="space-y-5 text-muted-foreground leading-loose" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.92rem" }}>
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          <motion.div className="mt-16 bg-white border border-[oklch(0.88_0.04_75)] grid grid-cols-1 md:grid-cols-3 gap-px text-center" variants={staggerReveal}>
            <motion.div variants={itemReveal} className="bg-white py-10 px-6">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem" }}>
                {isArabic ? "من منتجات الخلية" : "Produits de la ruche"}
              </p>
              <p className="text-6xl font-semibold text-primary leading-none">
                +5
              </p>
            </motion.div>
            <motion.div variants={itemReveal} className="bg-white py-10 px-6">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem" }}>
                {isArabic ? "من أنواع العسل" : "Varietes de miel"}
              </p>
              <p className="text-6xl font-semibold text-primary leading-none">
                +14
              </p>
            </motion.div>
            <motion.div variants={itemReveal} className="bg-white py-10 px-6 flex flex-col items-center justify-center">
              <ShieldCheck size={28} className="text-primary mb-4" strokeWidth={1.6} />
              <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.86rem" }}>
                {isArabic
                  ? "نحن علامة تجارية متخصصة في تقديم عسل طبيعي 100% ، نحرص على اختيار أجود الأنواع من مصادر موثوقة لنقدم لكم منتجًا نقيًا وصحيًا"
                  : "Nous sommes une marque specialisee dans le miel 100% naturel, choisi aupres de sources fiables pour offrir un produit pur et sain."}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-24 max-w-5xl mx-auto px-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionReveal}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-foreground" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              {t("history.heritage.title1")}
              <br />
              <em className="italic text-primary">{t("history.heritage.title2")}</em>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.88rem" }}>
              {t("history.heritage.p1")}
            </p>
            <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.88rem" }}>
              {t("history.heritage.p2")}
            </p>
          </div>
          <div className="aspect-[4/5] overflow-hidden">
            <img src={HONEY_COMB} alt="Honey" className="w-full h-full object-cover" />
          </div>
        </div>

        <h2 className="text-4xl font-light text-center mb-16 text-foreground" style={{ fontFamily: "Cormorant Garamond, serif" }}>
          {t("history.timeline")}
        </h2>
        <div className="space-y-12">
          {timeline.map((year) => (
            <div key={year} className={`${isRtl ? "border-r pr-6" : "border-l pl-6"} border-border`}>
              <span className="text-4xl font-light text-primary/40" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                {year}
              </span>
              <h3 className="text-2xl font-light text-foreground mt-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                {t(`history.y${year}`)}
              </h3>
              <p className="text-muted-foreground mt-2" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300, fontSize: "0.83rem" }}>
                {t(`history.y${year}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
