import type { Metadata } from "next";
import {
  Geist,
  Instrument_Serif,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";
import "./globals.css";
import "./responsive.css";
import "./portal.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});
const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Keystone — Your new beginning in Abu Dhabi",
  description:
    "A clearer order for your new life in Abu Dhabi. Explore the interactive Keystone prototype.",
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${instrument.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
