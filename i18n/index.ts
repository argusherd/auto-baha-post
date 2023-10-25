import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./lang/en.json";
import zhTW from "./lang/zh-tw.json";

type Translation = typeof en;

interface Resources {
  [lng: string]: {
    translation: Translation;
  };
}

const resources: Resources = {
  en: {
    translation: en,
  },
  "zh-tw": {
    translation: zhTW,
  },
};

i18next.use(initReactI18next).init({ fallbackLng: "en", resources });

export default i18next;
