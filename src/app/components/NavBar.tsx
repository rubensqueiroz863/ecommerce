"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import Menu from "./Menu";
import { NavBarProps } from "../types/navbar";
import Image from "next/image";
import Cart from "./Cart";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

type SearchHistoryDTO = {
  query: string;
}

function ramdomKey(max: number): number {
  return Math.floor(Math.random() * max);
}

export default function NavBar({ onSearch }: Readonly<NavBarProps>) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [lastSearchs, setLastSearchs] = useState<SearchHistoryDTO[]>([]);
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
      
      const data: SearchHistoryDTO[] = await res.json();
      
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
        throw new Error("Erro ao registrar busca");
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (user) {
      registerSearch(query, user.email);
    };
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
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            className={`
              w-full
              md:h-10
              h-8
              ${isOpen && lastSearchs ? "rounded-t-md" : "rounded-md"}
              bg-white
              px-2
              pr-12
              text-[12px]
              md:text-[14px]
              text-neutral-900
              shadow-md
              outline-none
            `}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-(--bg-main)"
              fill="none"
              viewBox="0 0 26 26"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"/>
            </svg>
          </button>
          <AnimatePresence>
            {isOpen && lastSearchs &&
              <motion.span
                onClick={(e) => e.preventDefault}
                className="w-full rounded-b-md bg-white text-[16px] py-2 absolute top-10 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                exit={{ opacity: 0 }}
              >
                {lastSearchs.map(({ query }) => (
                  <Link
                    href={`/search/${query}`}
                    key={ramdomKey(1000000000000)}
                    className="flex text-(--bg-main) min-h-8 items-center justify-between hover:bg-(--text-main) transition-colors px-4">
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
                    <p className="text-(--bg-main)">{query}</p>
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
              </motion.span>
            }
          </AnimatePresence>
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
