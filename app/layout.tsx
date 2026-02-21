import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lenovocompare.ch"),
  title: {
    default: "LenovoCompare CH — Swiss Laptop Comparison",
    template: "%s — LenovoCompare CH",
  },
  description:
    "Compare 98+ Lenovo laptops across ThinkPad, IdeaPad Pro, and Legion lineups with Swiss pricing, scoring, and hardware analysis.",
  openGraph: {
    type: "website",
    locale: "de_CH",
    siteName: "LenovoCompare CH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
