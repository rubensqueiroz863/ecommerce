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
<<<<<<< docs/projectOrganization
  title: "ecommerce",
  description: "Meu app ecommerce, utilizando nextjs e react",
=======
  title: "NexaShop",
  description: "NexaShop is a personal e-commerce project built with Next.js and Spring Boot, focused on modern web development and scalable architecture.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
>>>>>>> local
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-(--bg-main) ${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
<<<<<<< docs/projectOrganization
        </ThemeProvider>
        
=======
>>>>>>> local
      </body>
    </html>
  );
}
