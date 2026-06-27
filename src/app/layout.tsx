import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: '%s | WP Content Architect',
    default: 'WP Content Architect - Generator Post WordPress AI',
  },
  description: 'Transformasi ide Anda menjadi postingan WordPress profesional secara otomatis menggunakan AI tercanggih.',
  keywords: ['AI', 'WordPress', 'Next.js', 'Content Generator', 'Otomasi Blog', 'Universitas Majalengka'],
  authors: [{ name: 'Muhamad Dendi Purwanto' }],
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
      <body>
        {children}
      </body>
    </html>
  );
}
