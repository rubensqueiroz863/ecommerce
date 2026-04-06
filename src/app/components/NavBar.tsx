"use client";

import { useEffect, useState } from "react";
import { NavBarProps } from "../types/navbar";
import Cart from "./Cart";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { OpenSans } from "@/lib/fonts";
import Menu from "./Menu";
import Logo from "./Logo";

type SearchHistoryDTO = {
  query: string;
}



export default function NavBar({ onSearch }: Readonly<NavBarProps>) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [lastSearchs, setLastSearchs] = useState<SearchHistoryDTO[]>([]);
  const [suggestions, setSuggestions] = useState<SearchHistoryDTO[]>([]);
  
  const { user } = useAuth();

  async function fetchLastSearchs(userId: string) {
    try {
      const res = await fetch(
        `https://search-api-xamv.onrender.com/users/${userId}`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!res.ok) throw new Error(`Erro ao buscar historico: ${res.status}`);
      
      const data: SearchHistoryDTO[] = await res.json();
      console.log(data)
      return data;

    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async function registerSearch(query: string, userEmail: string) {
    const searchPayload = {
      query: query,
      email: userEmail,
      performed_by: userEmail,

      fuzzy: true,
      min_score: "50",

      fields: {
        name: true
      },

      filters: {
        price_min: 1000,
        price_max: 5000,
        name_contains: "samsung"
      }
    };

    try {
      const response = await fetch("https://search-api-xamv.onrender.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchPayload),
      });

      if (!response.ok) {
        const err = await response.text();
        console.log("Erro backend:", err);
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

  useEffect(() => {
    if (!query) {
      setSuggestions(lastSearchs);
    } else {
      const filtered = lastSearchs.filter(item =>
        item.query.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    }
  }, [query, lastSearchs]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (user) {
      registerSearch(query, user.email);
    };
    onSearch(query);
  }
  
  return (
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
          <Menu />
          <div className="hidden md:flex">
            <Logo />
          </div>
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
              required
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
                hover:opacity-70
                transition-all
                rounded-full
                bg-(--primary-color)
                cursor-pointer
              "
            >
              <p className={`text-sm ${OpenSans.className}`}>Search</p>
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
              {isOpen && suggestions.length > 0 && (
                <motion.div
                  onMouseDown={(e) => e.preventDefault()}
                  className="absolute top-full left-0 w-full md:w-auto mt-2 rounded-md bg-[var(--bg-soft)] shadow-lg z-50 overflow-hidden"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="flex flex-col">
                    {suggestions.map(({ query }) => (
                      <Link
                        href={`/search/${query}`}
                        key={query}
                        className="flex items-center gap-3 px-4 py-2 min-h-[44px] hover:bg-[var(--bg-card)] text-[var(--bg-main)] transition-colors"
                      >
                        <svg
                          className="w-5 h-5 text-[var(--bg-main)] scale-x-[-1]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 28 28"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <p className="truncate">{query}</p>
                      </Link>
                    ))}
                  </div>
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