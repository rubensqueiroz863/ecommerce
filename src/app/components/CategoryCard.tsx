import { OpenSans } from "@/lib/fonts";
import Image from "next/image";

type CategoryCardProps = {
  name1: string;
  name2: string;
  button: string;
  img: string;
  show: string;
  grandient: string;
}

export default function CategoryCard({ name1, name2, button, img, show, grandient }: CategoryCardProps) {
  return (
    <div className={`flex ${show} ${grandient} ${OpenSans.className} max-w-[500px] flex-row xl:flex-row items-center py-4 md:py-12 pl-10 pr-2 xl:h-74 rounded-4xl [46px] justify-between w-full`}>
      
      {/* Texto principal e botão */}
      <div className="flex flex-col gap-6 z-10">
        <div>
          <p className="text-white text-[34px] font-bold leading-none">
            {name1}
          </p>
          <p className="text-white text-[34px] font-bold leading-none">
            {name2}
          </p>
        </div>
        <button className="text-white cursor-pointer hover:opacity-70 transition-all border text-sm rounded-full px-4 py-2 font-medium">
          {button}
        </button>
      </div>
      {/* Imagem */}
      <Image
        src={img}
        alt="Phones category"
        width={1280}
        height={1280}
        className="xl:w-58 w-48 h-auto"
      />
    </div>
  );
}