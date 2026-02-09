import { ArchivoBlack } from "@/lib/fonts";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    // Logo
    <Link 
      href="/"
      className={`${ArchivoBlack.className} flex text-(--text-main) text-[12px] md:text-[14px]`}
    >
      <Image
        src={"https://i.postimg.cc/nLrKnb1x/ecommerce-3-removebg-preview.png"}
        width={1200}
        height={1200}
        alt="Logo image"
        className="w-18 h-auto pointer-events-none cursor-none"
      />
    </Link>
  );
}