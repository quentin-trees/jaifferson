import { createContext, useContext, useState, type ReactNode } from "react";
import { translations, type Locale } from "./translations";

type TranslationType = (typeof translations)[Locale];

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: TranslationType;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("en");
  const t = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
