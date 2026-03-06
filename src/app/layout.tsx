import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "مكتبة تسواهن | التسوق للكتب",
  description: "المتجر الإلكتروني الأفضل لشراء الكتب",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} antialiased font-sans bg-background text-foreground`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
