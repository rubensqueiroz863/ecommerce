import Logo from "./Logo";
import Menu from "./Menu";

export default function NavBar(){
  return (
    <div className="flex items-center justify-between xl:px-20 px-10 bg-(--bg-main) h-12">
      <Logo />
      <Menu />
    </div>
  );
}