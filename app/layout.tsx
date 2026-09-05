import type { Metadata } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300"],
  style: ["normal"],
  display: "swap",
  variable: "--font-newsreader",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  display: "swap",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: {
    default: site.name + " — Real Estate, Partnerships, Value Creation",
    template: "%s · " + site.name,
  },
  description:
    "An advisory firm for institutional and private capital across the Andes and the Caribbean. We originate, structure and steward the transactions that global platforms cannot reach locally.",
  metadataBase: new URL(site.url),
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    title: site.name,
    description: "Real estate, partnerships and advisory across the Andes and the Caribbean.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={newsreader.variable + " " + instrument.variable}>
      <body>{children}</body>
    </html>
  );
}
