import { Link, useParams } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import atlasLogo from "@/assets/atlas-logo.webp";

export default function Footer() {
  const { lng } = useParams<{ lng: string }>();
  const prefix = lng ? `/${lng}` : "";

  const pages = [
    { label: "الصفحة الرئيسية", href: `${prefix}/` },
    { label: "المتجر", href: `${prefix}/produits` },
    { label: "من نحن", href: `${prefix}/histoire` },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-[#dda560] text-[#24170c]"
    >
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col items-center text-center">
          <img src={atlasLogo} alt="ATLAS" className="mb-5 h-20 w-40 object-contain" />
          <p className="text-sm leading-relaxed max-w-xs opacity-80">
            Atlas-miel, miel naturel et produits de la ruche selectionnes avec soin.
          </p>
        </div>

        <div className="text-left">
          <h4 className="text-sm font-semibold uppercase tracking-widest mb-5">
            Pages
          </h4>
          <ul className="space-y-3 text-right" dir="rtl">
            {pages.map((page) => (
              <li key={page.href}>
                <Link to={page.href} className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-left">
          <h4 className="text-sm font-semibold uppercase tracking-widest mb-5">
            Nos coordonnées
          </h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm opacity-85">
              <MapPin size={16} className="shrink-0" />
              Alger
            </li>
            <li className="flex items-center gap-3 text-sm opacity-85">
              <Phone size={16} className="shrink-0" />
              Num : +213 561 45 82 86
            </li>
            <li className="flex items-center gap-3 text-sm opacity-85">
              <Mail size={16} className="shrink-0" />
              Contact@atlas-miel.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#24170c]/15 max-w-7xl mx-auto px-6 py-6 flex items-center justify-center">
        <p className="text-xs opacity-75">
          © Atlas-miel 2026 Tous droits réservés
        </p>
      </div>
    </motion.footer>
  );
}
