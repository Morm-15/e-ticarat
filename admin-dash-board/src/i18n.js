import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "./locales/en/entranslation.json";
import translationAR from "./locales/ar/artranslation.json";
import translationFR from "./locales/fr/frtranslation.json";
import translationTR from "./locales/tr/trtranslation.json";

const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR },
  fr: { translation: translationFR },
  tr: { translation: translationTR },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en", // اللغة الافتراضية
    interpolation: {
      escapeValue: false, // React بالفعل يمنع XSS
    },
    detection: {
      order: ["localStorage", "navigator"], // الكشف عن اللغة
      caches: ["localStorage"],
    },
  });

export default i18n;
