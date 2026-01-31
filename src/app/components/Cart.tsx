import Image from "next/image";

export default function Cart() {
  return (
    <button className="cursor-pointer">
      <Image
        src={"https://i.postimg.cc/VN22vfk0/imag32es-removebg-preview.png"}
        width={128}
        height={128}
        alt="Cart button"
        className="w-6 h-6"
      />
    </button>
  );
}