import type { Metadata } from "next";
import { Bricolage_Grotesque, Caveat } from "next/font/google";
import "./globals.css";
import { LightProvider } from "@/components/light/LightProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
});

/** Handwritten voice — used only for the origin vignettes' takeaway lines. */
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "Sanya Munam — UX Strategy & Design Operations",
  description:
    "A conversation with Sanya Munam. I untangle complicated products, teams, and decisions until they make sense to humans. UX strategy and design operations, Doha.",
  openGraph: {
    title: "Sanya Munam — UX Strategy & Design Operations",
    description:
      "A conversation with Sanya Munam. I untangle complicated things until they make sense to humans.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${caveat.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap"
        />
      </head>
      <body>
        <LightProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </LightProvider>
      </body>
    </html>
  );
}
