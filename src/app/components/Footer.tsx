import Image from "next/image";

export default function Footer() {

  return (
    <div className="flex items-center w-full gap-2 flex-col text-[12px] md:text-[18px] md:px-0 px-16 justify-center pt-16 pb-12">
      <div className="flex gap-1.5 items-center justify-center w-full text-(--text-main)/80 dark:text-(--text-main)/80">
        <p className="w-20">Built with:</p>
        <Image
          src={"https://i.postimg.cc/Zqc6YScN/nextjs-original.png"}
          width={128}
          height={128}
          alt="Nextjs logo"
          className="w-5 h-5"
        />
        <p>Next.js</p>
        <Image
          src={"https://i.postimg.cc/Yqd9SSKg/favicon-4.png"}
          width={128}
          height={128}
          alt="Nextjs logo"
          className="w-5 h-5"
        />
        <p>Vercel</p>
        <Image
          src={"https://i.postimg.cc/bNpFY43B/spring-boot-icon.webp"}
          width={128}
          height={128}
          alt="Spirng boot logo"
          className="w-4 h-4"
        />
        <p className="w-20">SpringBoot</p>
      </div>
      <p className="text-sm text-center text-(--text-secondary)">
        Direitos autorais © Rubens Q. ALves 2026. Todos os direitos reservados.
      </p>
    </div>
  );
}