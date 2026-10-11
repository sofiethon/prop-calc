import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "Proportio", template: "%s – Proportio" },
  description: "Proportio hilft Innenarchitekt*innen vor Ort, Teppiche, Vorhangstangen, Bilder und Sitzabstände nach Messzahlen statt nach Bauchgefühl zu planen.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
