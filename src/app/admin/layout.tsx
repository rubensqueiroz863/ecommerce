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

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`admin-layout bg-(--bg-main) ${geistSans.variable} ${geistMono.variable}`}>
      <NavBarAdmin />
      {children}
    </div>
  );
}