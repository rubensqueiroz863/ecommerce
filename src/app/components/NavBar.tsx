"use client";

import { useState } from "react";
import Logo from "./Logo";
import Menu from "./Menu";
import { NavBarProps } from "../types/navbar";
<<<<<<< docs/projectOrganization
import Image from "next/image";

export default function NavBar({ onSearch }: NavBarProps) {
  const [query, setQuery] = useState("");
=======
import Cart from "./Cart";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { OpenSans } from "@/lib/fonts";
import { SearchProps } from "../types/search";

export default function NavBar({ onSearch }: Readonly<NavBarProps>) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [lastSearchs, setLastSearchs] = useState<SearchProps[]>([]);
  const { user } = useAuth();

  async function fetchLastSearchs(userId: string) {
    try {
      const res = await fetch(
        `https://sticky-charil-react-blog-3b39d9e9.koyeb.app/search-history/last/${userId}`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!res.ok) throw new Error(`Erro ao buscar historico: ${res.status}`);
      
      const data: SearchProps[] = await res.json();
      
      return data;

    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async function registerSearch(query: string, userEmail: string) {
    try {
      const response = await fetch("https://sticky-charil-react-blog-3b39d9e9.koyeb.app/search-history/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro in server.");
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!user) return;

    async function loadForYou() {
      const querys = await fetchLastSearchs(user!.id);
      setLastSearchs(querys);
    }

    loadForYou();
  }, [user?.id]);
>>>>>>> local

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
<<<<<<< docs/projectOrganization
=======

    if (user) {
      registerSearch(query, user.email);
    }

>>>>>>> local
    onSearch(query);
  }

  return (
    <header className="bg-(--bg-main)">
<<<<<<< docs/projectOrganization
      <div className="
        flex
        items-center
        md:justify-between
        justify-center
        gap-4
        md:gap-0
        h-16
        px-4
        xl:px-16
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
              bg-(--text-main)
              px-2
              md:px-4
              pr-12
              text-[12px]
              md:text-[14px]
              text-(--bg-main)
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
            bg-(--text-secondary)
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
=======
      
      <div className="bg-(--bg-card) h-13 md:h-16 rounded-b-4xl">
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
          <div className="flex gap-8 items-center justify-center">
            <Menu />
          </div>
          <Logo />
          <form
            onSubmit={handleSubmit}
            className="relative mx-auto md:mx-0 flex-1 sm:max-w-sm md:max-w-md xl:max-w-xl"
>>>>>>> local
          >
            { /* Lupa de pesquisar */}
            <Image
              src="https://i.postimg.cc/t4PGp1ZF/54481.png"
              width={16}
              height={16}
              alt="Buscar"
              className="w-4 h-auto"
            />
<<<<<<< docs/projectOrganization
=======
            <button
              type="submit"
              className="
                absolute
                inset-y-0        
                right-0
                md:px-8
                px-2
                gap-2
                m-[4px]
                md:m-1
                flex
                items-center
                justify-center
                rounded-full
                bg-(--primary-color)
                cursor-pointer
              "
            >
              <p className={`text-sm ${OpenSans.className} text-(--text-light)`}>Search</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 md:translate-y-0.5 h-4 md:h-[18px] md:w-[18px] text-(--bg-main)"
                fill="none"
                viewBox="0 0 26 26"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"/>
              </svg>
            </button>
            <AnimatePresence>
              {isOpen && lastSearchs && (
                <motion.div
                  onMouseDown={(e) => e.preventDefault()} // evita que input perca foco ao clicar
                  className="absolute top-full left-0 w-full md:w-auto mt-1 rounded-md bg-(--bg-soft) text-[16px] shadow-lg z-50"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  {lastSearchs.map(({ query }) => (
                    <Link
                      key={query}
                      href={`/search/${query}`}
                      className="flex items-center justify-between gap-2 min-h-[40px] rounded-md px-4 hover:bg-(--bg-card) transition-colors text-(--bg-main)"
                    >
                      <svg
                        className="w-5 h-5 scale-x-[-1]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 28 28"
                        stroke="currentColor"
                      >
                        <circle cx="11" cy="11" r="8" strokeWidth="2" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
                      </svg>
                      <p className="truncate">{query}</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="w-5 h-5"
                      >
                        <path d="M17 17L7 7M7 7h7M7 7v7" />
                      </svg>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          <button>
            <p className={`text-[12px] text-(--text-light) md:text-[16px]`}>login / signup</p>
>>>>>>> local
          </button>
        </form>

        {/* Menu */}
        <Menu />
      </div>
    </header>
  );
}