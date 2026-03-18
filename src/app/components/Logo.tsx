import { ArchivoBlack } from "@/lib/fonts";
import Link from "next/link";

export default function Logo() {
  return (
    <Link 
      href="/"
      className={`${ArchivoBlack.className} hidden md:flex text-(--text-main) text-[12px] md:text-[14px]`}
    >
      ECOMMERCE
    </Link>
  );
}