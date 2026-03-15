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
import { OpenSans } from "@/lib/fonts";

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
  const [selected, setSelected] = useState<"shop" | "home" | "about" | "contact">("shop");
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
          
          {/* Menu */}
          <div className="flex gap-8 items-center justify-center">
            <Menu />
          </div>
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
              placeholder="Type here..."
              className={`
                w-full
                md:h-10
                h-8
                bg-(--bg-soft)
                rounded-full
                md:px-12
                md:pr-42
                pr-26
                px-4
                ${OpenSans.className}
                text-[12px]
                md:text-[13.5px]
                text-white
                shadow-md
                outline-none
              `}
            />
            {/* Button */}
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
              <p className={`text-sm ${OpenSans.className}`}>Search</p>
              { /* Lupa de pesquisar */}
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
                      href={`/search/${query}`}
                      key={ramdomKey(1000000000000)}
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
            <p className={`text-[12px] md:text-[16px]`}>login / signup</p>
          </button>
          <Cart />  
        </div>
      </div>
    </header>
  );
}
