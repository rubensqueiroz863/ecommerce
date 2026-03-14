type HeroCardProps = {
  bg: string;
  img: string;
  size: string;
  bgPlace: string;
  name1: string;
  name2: string;
  show: string;
};

export default function HeroCard({
  bg,
  img,
  size,
  bgPlace,
  name1,
  name2,
  show
}: HeroCardProps) {
  return (
    <div
      className={`bg-no-repeat ${bgPlace} ${size} p-5 lg:p-6 rounded-3xl ${show} items-center`}
      style={{
        backgroundColor: bg,
        backgroundImage: `url(${img})`
      }}
    >
      <div>
        <p className="text-sm lg:text-lg text-white/80 leading-tight">{name1}</p>
        <p className="font-bold text-lg lg:text-xl leading-tight">{name2}</p>

        <button className="border mt-2 border-white rounded-full px-3 py-0.5 text-sm cursor-pointer hover:opacity-70 transition-all">
          Shop
        </button>
      </div>
    </div>
  );
}
