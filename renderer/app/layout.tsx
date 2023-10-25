"use client";

import moment from "moment";
import "moment/locale/zh-tw";
import { useEffect } from "react";
import i18n from "../../i18n";
import "./globals.css";
import Header from "./header";

export default function RootLayout({ children }) {
  const setLng = async () => {
    await i18n.changeLanguage(window.lng);
    moment.locale(window.lng);
  };

  useEffect(() => {
    setLng();
  }, []);

  return (
    <html>
      <head></head>
      <body>
        <Header />

        {children}
      </body>
    </html>
  );
}
