"use client";

import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <head></head>
      <body>
        <Link href={"/"}>Home</Link>
        <button onClick={() => window.electron.openBaha()}>Open Baha</button>

        {children}
      </body>
    </html>
  );
}
