import { ArchivoBlack } from "@/lib/fonts";
import Link from "next/link";

export default function Logo() {
  return (
    // Logo
    <Link 
      href="/"
      className={`${ArchivoBlack.className} flex text-(--text-main) text-[12px] md:text-[16px] xl:text-[18px]`}
    >
      NexaShop
    </Link>
  );
}