import { ArchivoBlack } from "@/lib/fonts";
import Link from "next/link";

export default function Logo() {
  return (
    <Link 
      href="/"
      className={`${ArchivoBlack.className} text-(--text-main)`}
    >
      ECOMMERCE
    </Link>
  );
}