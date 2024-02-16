// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import languages from "../lang.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: require("./locales/en.json"),
    },
    ar: {
      translation: require("./locales/ar.json"),
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
