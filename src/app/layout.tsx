import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-montserrat",
});

// Superclarendon ist eine Adobe-Fonts-Schrift. Die Kit-ID steht in .env.local
// (NEXT_PUBLIC_ADOBE_FONTS_KIT_ID). Ohne ID zeigt die App die Ersatzschrift Georgia.
// TODO: Kit-ID eintragen und prüfen, dass der Schriftname im Kit „superclarendon“ lautet.
const adobeKitId = process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT_ID;

export const metadata: Metadata = {
  title: { default: "prop-calc", template: "%s – prop-calc" },
  description: "prop-calc hilft Innenarchitekt*innen vor Ort, Teppiche, Vorhangstangen, Bilder und Sitzabstände nach Messzahlen statt nach Bauchgefühl zu planen.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${montserrat.variable} h-full antialiased`}>
      <head>
        {adobeKitId && <link rel="stylesheet" href={`https://use.typekit.net/${adobeKitId}.css`} />}
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
