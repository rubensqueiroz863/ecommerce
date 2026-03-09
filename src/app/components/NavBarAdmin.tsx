"use client";

import AdminMenu from "./AdminMenu";
import Logo from "./Logo";

export default function NavBarAdmin() {
  return (
    // Navbar
    <header className="bg-(--bg-main)">
      <div className="
        flex
        items-center
        md:justify-between
        justify-center
        gap-4
        md:gap-0
        h-20
        px-18
        xl:px-16
        bg-(--bg-main)
      ">
        {/* Logo */}
        <Logo />
        {/* Menu */}
        <AdminMenu />
      </div>
    </header>
  );
}
