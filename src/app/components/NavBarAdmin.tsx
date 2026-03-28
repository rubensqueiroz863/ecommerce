"use client";

import AdminMenu from "./AdminMenu";
import Logo from "./Logo";

export default function NavBarAdmin() {
  return (
    <header className="bg-[var(--bg-main)]">
      <div className="
        flex
        items-center
        md:justify-between
        justify-center
        gap-4
        md:gap-0
        rounded-b-4xl
        h-12
        md:h-16
        md:px-8
        px-6
        xl:px-16
        bg-(--bg-card)
      ">
        {/* Logo */}
        <Logo />

        {/* Menu / Botão de abrir menu */}
        <AdminMenu />
      </div>
    </header>
  );
}