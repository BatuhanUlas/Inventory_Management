import i18n from "i18next";
import { axios } from "../axios";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

const language =
  localStorage.getItem("language") || process.env.REACT_APP_I18N_LOCALE || "us";

i18n.use(Backend).use(initReactI18next).init({
  lng: language,
  initImmediate: false,
});

axios.defaults.headers.common["Accept-Language"] = language;

export default i18n;
