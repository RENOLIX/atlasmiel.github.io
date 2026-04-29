import { Link, useParams } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("common");
  const { lng } = useParams<{ lng: string }>();
  const prefix = lng ? `/${lng}` : "";

  return (
    <footer className="bg-[oklch(0.2_0.04_45)] text-[oklch(0.85_0.03_75)]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-2xl font-light tracking-widest uppercase text-[oklch(0.85_0.12_70)] mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            ATLAS-Miel
          </h3>
          <p className="text-sm leading-relaxed opacity-70" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem" }}>
            {t("footer.tagline")}
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity text-sm tracking-widest" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem" }}>Instagram</a>
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity text-sm tracking-widest" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem" }}>Facebook</a>
          </div>
        </div>
        <div>
          <h4 className="text-xs tracking-widest uppercase opacity-50 mb-5" style={{ fontFamily: "Montserrat, sans-serif" }}>{t("footer.nav")}</h4>
          <ul className="space-y-3">
            {[
              { labelKey: "nav.home", href: `${prefix}/` },
              { labelKey: "nav.products", href: `${prefix}/produits` },
              { labelKey: "nav.history", href: `${prefix}/histoire` },
              { labelKey: "nav.contact", href: `${prefix}/contact` },
            ].map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-sm opacity-70 hover:opacity-100 transition-opacity" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem" }}>
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-widest uppercase opacity-50 mb-5" style={{ fontFamily: "Montserrat, sans-serif" }}>{t("footer.contact")}</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm opacity-70" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem" }}><MapPin size={15} className="shrink-0" />{t("contact.address.val")}</li>
            <li className="flex items-center gap-3 text-sm opacity-70" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem" }}><Phone size={15} className="shrink-0" />+213 555 000 000</li>
            <li className="flex items-center gap-3 text-sm opacity-70" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem" }}><Mail size={15} className="shrink-0" />contact@atlas-miel.dz</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs opacity-40" style={{ fontFamily: "Montserrat, sans-serif" }}>&copy; {new Date().getFullYear()} {t("footer.rights")}</p>
        <p className="text-xs opacity-40 italic" style={{ fontFamily: "Cormorant Garamond, serif" }}>{t("footer.pure")}</p>
      </div>
    </footer>
  );
}
