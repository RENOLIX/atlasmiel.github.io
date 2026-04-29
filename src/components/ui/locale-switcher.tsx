import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { changeLocale, setLocaleInPath, SUPPORTED_LOCALES, type SupportedLocale } from "@/i18n";
import { cn } from "@/lib/utils";

export default function LocaleSwitcher({ inverted = false }: { inverted?: boolean }) {
  const { i18n } = useTranslation();
  const { lng } = useParams<{ lng: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const onChange = async (locale: SupportedLocale) => {
    await changeLocale(locale);
    navigate(setLocaleInPath(locale, location.pathname, location.search, location.hash));
  };

  return (
    <div className={cn("flex border text-[10px] uppercase tracking-widest", inverted ? "border-white/35 text-white" : "border-border text-foreground")}>
      {SUPPORTED_LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => void onChange(locale)}
          className={cn(
            "px-2 py-1 transition-colors",
            (lng ?? i18n.language) === locale
              ? inverted
                ? "bg-white text-foreground"
                : "bg-foreground text-background"
              : inverted
                ? "hover:bg-white/10"
                : "hover:bg-muted",
          )}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
