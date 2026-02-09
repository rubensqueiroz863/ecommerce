"use client";

import { useState } from "react";
import Logo from "./Logo";
import Menu from "./Menu";
import { NavBarProps } from "../types/navbar";
import Image from "next/image";
import Cart from "./Cart";

export default function NavBar({ onSearch }: NavBarProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearch(query);
  }

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
        px-4
        xl:px-16
        bg-(--bg-main)
      ">
        {/* Logo */}
        <Logo />

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className="relative mx-auto md:mx-0 flex-1 sm:max-w-sm md:max-w-md xl:max-w-xl"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            className="
              w-full
              md:h-10
              h-8
              rounded-md
              bg-white
              px-2
              pr-12
              text-[12px]
              md:text-[14px]
              text-neutral-900
              shadow-md
              outline-none
            "
          />

          {/* Divider */}
          <span className="
            absolute
            right-10
            top-1/2
            -translate-y-1/2
            h-5
            w-px
            bg-(--text-main)
            opacity-40
          " />

          {/* Button */}
          <button
            type="submit"
            className="
              cursor-pointer
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              flex
              h-8
              w-8
              items-center
              justify-center
            "
          >
            { /* Lupa de pesquisar */}
            <Image
              src="https://i.postimg.cc/t4PGp1ZF/54481.png"
              width={16}
              height={16}
              alt="Buscar"
              className="w-4 h-auto"
            />
          </button>
        </form>

        {/* Menu */}
        <div className="flex gap-8 items-center justify-center">
          <Cart />
          <Menu />
        </div>
      </div>
    </header>
  );
}
