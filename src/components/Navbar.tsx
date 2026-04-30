import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import atlasLogo from "@/assets/atlas-logo.webp";
import LocaleSwitcher from "@/components/ui/locale-switcher";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation("common");
  const prefix = lng ? `/${lng}` : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: t("nav.home"), href: `${prefix}/` },
    { label: t("nav.products"), href: `${prefix}/produits` },
    { label: t("nav.history"), href: `${prefix}/histoire` },
    { label: t("nav.contact"), href: `${prefix}/contact` },
  ];
  const activePath = location.pathname.replace(/^\/(ar|fr|en)/, "") || "/";

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[oklch(0.98_0.015_85)]/95 backdrop-blur-md shadow-sm border-b border-[oklch(0.88_0.04_75)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={`${prefix}/`} className="flex items-center">
            <img src={atlasLogo} alt="ATLAS" className="h-12 w-28 object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const linkPath = link.href.replace(/^\/(ar|fr|en)/, "") || "/";
              const isActive = activePath === linkPath || (linkPath !== "/" && activePath.startsWith(linkPath));
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm tracking-widest uppercase transition-all duration-200 relative group ${
                    scrolled
                      ? isActive
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                      : "text-white/90 hover:text-white"
                  }`}
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem" }}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-current transition-all duration-300 ${
                    scrolled ? (isActive ? "w-full" : "w-0 group-hover:w-full") : "w-0"
                  }`} />
                </Link>
              );
            })}
            <Link
              to={`${prefix}/produits`}
              className="px-5 py-2 bg-primary text-primary-foreground text-xs tracking-widest uppercase transition-all duration-200 hover:bg-primary/80"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t("nav.order")}
            </Link>
            <LocaleSwitcher inverted={!scrolled} />
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LocaleSwitcher inverted={!scrolled} />
            <button
              className={scrolled ? "text-foreground" : "text-white"}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[oklch(0.98_0.015_85)] border-b border-border shadow-lg md:hidden"
          >
            <div className="flex flex-col py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-8 py-4 text-sm tracking-widest uppercase text-foreground hover:bg-muted"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem" }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-8 pt-2 pb-4">
                <Link
                  to={`${prefix}/produits`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-center px-5 py-3 bg-primary text-primary-foreground text-xs tracking-widest uppercase"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {t("nav.order")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
