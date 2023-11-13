"use client";

import moment from "moment";
import "moment/locale/zh-tw";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import "./globals.css";
import Header from "./header";

export default function RootLayout({ children }) {
  const setLng = async () => {
    await i18n.changeLanguage(window.lng);
    moment.locale(window.lng);
  };
  const { t } = useTranslation();

  useEffect(() => {
    setLng();
  }, []);

  return (
    <html>
      <head>
        <title>{t("app")}</title>
      </head>
      <body>
        <Header />

        <div className="container mx-auto pt-3">{children}</div>
      </body>
    </html>
  );
}
