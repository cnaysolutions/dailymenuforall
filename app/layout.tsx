import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Günün Menüsü | Daily Menu",
  description:
    "AI-powered daily halal menu — soup, main course, salad, and side. No pork, no alcohol. Yapay zeka ile oluşturulan günlük helal menü.",
  keywords: ["daily menu", "halal food", "günün menüsü", "helal yemek", "AI menu"],
  openGraph: {
    title: "Günün Menüsü | Daily Menu",
    description: "Fresh halal menu every day — generated with AI",
    type: "website",
  },
  robots: "index, follow",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const lang = host.toLowerCase().includes("gunlukmenu") ? "tr" : "en";

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
