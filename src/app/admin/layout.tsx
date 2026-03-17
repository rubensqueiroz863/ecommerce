import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import NavBarAdmin from "../components/NavBarAdmin";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-(--bg-main) ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <NavBarAdmin />
          {children}        
      </body>
    </html>
  );
}