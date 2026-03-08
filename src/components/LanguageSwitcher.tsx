import { useLanguage } from "@/i18n/LanguageContext";
import type { Locale } from "@/i18n/translations";

const options: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "fr", label: "FR" },
  { value: "es", label: "ES" },
];

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex gap-1 text-[13px] font-medium tracking-wide">
      {options.map((opt, i) => (
        <span key={opt.value} className="flex items-center gap-1">
          <button
            onClick={() => setLocale(opt.value)}
            className={`transition-colors px-1 ${
              locale === opt.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
          {i < options.length - 1 && (
            <span className="text-muted-foreground/40">·</span>
          )}
        </span>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
