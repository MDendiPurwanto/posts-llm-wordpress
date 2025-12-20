import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | WP Content Architect',
    default: 'WP Content Architect - Generator Post WordPress AI',
  },
  description: 'Transformasi ide Anda menjadi postingan WordPress profesional secara otomatis menggunakan AI tercanggih.',
  keywords: ['AI', 'WordPress', 'Next.js', 'Content Generator', 'Otomasi Blog', 'Universitas Majalengka'],
  authors: [{ name: 'Dede Maulana' }],
  openGraph: {
    title: 'WP Content Architect',
    description: 'Generator Post WordPress Berbasis AI',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
