import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Russo_One, Tinos } from "next/font/google";
import "./globals.css";

const russoOne = Russo_One({
  variable: "--font-main",
  weight: "400",
  subsets: ["latin"],
});

const tinos = Tinos({
  variable: "--font-secondary",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Badminton Score",
  description:
    "A modern badminton scoreboard website for singles & doubles. Accurately implements BWF serving/receiving rules, tracks score, sets, and match time. Features include live stats, point-by-point history, undo, and a detailed match summary.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  appleWebApp: {
    capable: true,
    title: 'Badminton Score',
    statusBarStyle: 'default',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="google-site-verification" content="87eXcn4-m8d7xLxFsR2Wee36VPQigrtM6l3Inh5A3zM" />
      <body className={`${russoOne.variable} ${tinos.variable} antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
