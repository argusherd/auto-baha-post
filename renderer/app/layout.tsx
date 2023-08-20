"use client";

import "./globals.css";
import Header from "./header";

export default function RootLayout({ children }) {
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
