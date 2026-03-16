"use client";

import { useEffect, useState, useCallback } from "react";
import NavBar from "./components/NavBar";
import { SubCategoryProps } from "./types/subCategory";
import SubCategory from "./components/SubCategory";
import { useRouter } from "next/navigation";
import { useMenu } from "@/lib/menu";
import MenuDrawer from "./components/MenuDrawer";
import { AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

<<<<<<< docs/projectOrganization
type PageResponse<T> = {
  data: T[];
  hasMore: boolean;
};
=======
import NavBar from "./components/NavBar";
import SubCategory from "./components/SubCategory";
import Product from "./components/Product";
import MenuDrawer from "./components/MenuDrawer";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";

import { SubCategoryProps } from "./types/category";
import { PageResponse } from "./types/pageResponse";

import { useMenu } from "@/lib/menu";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import CategoriesCard from "./components/CategoriesCard";
import { OpenSans } from "@/lib/fonts";
import CategoryCard from "./components/CategoryCard";
import HeroCard from "./components/HeroCard";
import { MostClickedProductDTO, UserRecommendationGroup } from "./types/homepage";
// import { isAuthenticated } from "@/lib/getAuthenticated";
>>>>>>> local

export default function HomePage() {
  const [subCategories, setSubCategories] = useState<SubCategoryProps[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const menu = useMenu();

<<<<<<< docs/projectOrganization
  // Detecta se está visivel na tela
  const { ref, inView } = useInView({
    threshold: 0,
  });
=======
  const { ref, inView } = useInView({ threshold: 0 });
>>>>>>> local

  // Fetch das subcategorias
  const fetchSubCategories = useCallback(async () => {
    // detecta se está carregando ou se não tem mais
    if (loading || !hasMore) return;

    setLoading(true);

    // Tenta fazer o fetch das subcategorias
    try {
      const res = await fetch(
        `https://sticky-charil-react-blog-3b39d9e9.koyeb.app/subcategories?page=${page}&size=6`
      );
      // Converte para json
      const data: PageResponse<SubCategoryProps> = await res.json();
      // Pega a data com as subcategorias e se tem main
      setSubCategories(prev => [...prev, ...data.data]);
      setHasMore(data.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      // Erro no fetch
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);
  
  // Chama o fetch
  useEffect(() => {
    // if (!isAuthenticated()) {
    //   router.push(`/login?redirect=/`);
    //   return;
    // }
    fetchSubCategories();
  }, []);

  // Caso visivel, chama mais categorias
  useEffect(() => {
    if (inView) {
      fetchSubCategories();
    }
  }, [inView, fetchSubCategories]);

  function search(query: string) {
    router.push(`/search/${query}`);
  }

  return (
    // Homepage
    <div className="w-full">
      { /* NavBar */}
      <NavBar onSearch={search} />
<<<<<<< docs/projectOrganization

      <ul
        className="
          flex
          flex-col
          gap-3
          w-full
          px-2
          py-2
        "
      >
        { /* SubCategorias com animação */}
=======
      <div className="flex w-full gap-2 px-4 justify-between pt-4 md:pt-8 md:px-8">
        <div className="hidden md:block">
          <CategoriesCard />
        </div>
        <div className="flex xl:flex-row flex-col gap-2 items-center justify-center xl:px-0 md:px-12">
          <div className="flex flex-row gap-12">
            <CategoryCard name1="Phone" name2="Shop" button="Shop by Category" img="/images/phones.png" show="" grandient="bg-linear-to-r from-[#010101] to-[#35695c]" />
            <CategoryCard name1="Computers" name2="Shop" button="Shop by Category" img="/images/computers.png" show="hidden xl:flex" grandient="bg-linear-to-r from-[#010101] to-[#ff0101]" />
            <div className="xl:flex flex-col gap-4 justify-between hidden">
              <HeroCard
                bg="#0ea5e9"
                img="/images/asus.png"
                size="bg-size-[110px] lg:bg-size-[130px] max-h-[140px] min-w-[172px]"
                bgPlace="bg-bottom-right"
                name1="Notebooks"
                name2="Latest Models"
                show="flex"
              />
              <HeroCard
                bg="#22c55e"
                img="/images/gym.png"
                size="bg-size-[110px] lg:bg-size-[100px] max-h-[140px] min-w-[172px]"
                bgPlace="bg-right"
                name1="Fitness"
                name2="Workout Gear"
                show="flex"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full px-4 pt-4 md:pt-6 md:px-8">
        <div className="w-full max-w-8xl">
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 text-(--text-light)">
            <HeroCard
              bg="#01c8a1"
              img="/images/apple.png"
              size="bg-size-[110px] lg:bg-size-[130px] min-h-[130px] lg:min-h-[150px]"
              bgPlace="bg-bottom-right"
              name1="Apple"
              name2="New Products"
              show="flex"
            />
            <HeroCard
              bg="#101010"
              img="/images/quadcopter.png"
              size="bg-size-[100px] lg:bg-size-[130px] min-h-[130px] lg:min-h-[150px]"
              bgPlace="bg-right"
              name1="Flying"
              name2="Quadcopter"
              show="flex"
            />
            <HeroCard
              bg="#fc9614"
              img="/images/clean.png"
              size="bg-size-[90px] lg:bg-size-[120px] min-h-[130px] lg:min-h-[150px]"
              bgPlace="bg-right"
              name1="Clean"
              name2="Your Home"
              show="hidden md:flex"
            />
            <HeroCard
              bg="#8c24e1"
              img="/images/drink.png"
              size="bg-size-[70px] lg:bg-size-[100px] min-h-[130px] lg:min-h-[150px]"
              bgPlace="bg-right"
              name1="Drink"
              name2="Coffee"
              show="hidden md:flex"
            />
            <HeroCard
              bg="#ff0101"
              img="/images/play.png"
              size="bg-size-[70px] lg:bg-size-[120px] min-h-[130px] lg:min-h-[150px]"
              bgPlace="bg-right"
              name1="Play"
              name2="Games"
              show="hidden xl:flex"
            />
          </div>
        </div>
      </div>
      {forYou.length > 0 && (
        <motion.div
          className="px-10 w-full mt-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className={`flex items-center gap-18 text-(--text-dark) ${OpenSans.className}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xl font-bold">
              For You
            </p>
            <span className="flex-1 h-px bg-(--text-secondary) opacity-50"></span>
            <button className="hover:opacity-70 bg-(--primary-color) text-(--text-light) rounded-full px-4 py-1 text-[16px] md:text-xs cursor-pointer">
              View All
            </button>
          </motion.div>
          <div className="flex gap-6 overflow-x-auto overflow-y-hidden mt-4">
            {forYou.map(({ product, clicks }, index) => (
              <div key={product.id} className="relative flex items-center">
                <Product
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  width="min-w-[200px] max-w-[200px]"
                  query=""
                  photo={product.photo || ""}
                  role="user"
                />
                {index !== forYou.length - 1 && (
                  <span className="absolute bg-(--text-secondary) -right-3 top-1/2 h-full w-px my-2 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
      {userRecommendations &&
        userRecommendations?.recommendations?.length > 0 && (
          <motion.div
            className="px-10 w-full mt-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className={`flex items-center gap-18 text-(--text-dark) ${OpenSans.className}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xl font-bold">
                Recommendations
              </p>
              <span className="flex-1 h-px bg-(--text-secondary) opacity-50"></span>
              <button className="hover:opacity-70 bg-(--primary-color) text-(--text-light) rounded-full px-4 py-1 text-xs cursor-pointer">
                View All
              </button>
            </motion.div>
            <div className="flex gap-6 overflow-x-auto overflow-y-hidden mt-4">
              {userRecommendations.recommendations.map((rec, index) => (
                <div key={rec.productId} className="relative flex flex-col items-start gap-1">
                  <span className="text-xs text-(--text-secondary)">
                    {rec.usersInCommon} users in common
                  </span>
                  <Product
                    id={rec.productId}
                    name={rec.productName}
                    price={rec.productPrice}
                    width="min-w-[200px] max-w-[200px]"
                    query=""
                    photo=""
                    role="user"
                  />
                  {index !== userRecommendations.recommendations.length - 1 && (
                    <span className="absolute bg-(--text-secondary) -right-3 top-1/2 h-20 w-px opacity-40 -translate-y-1/2" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
      )}
>>>>>>> local
        <AnimatePresence>
          {subCategories.map(subCategory => (
            <SubCategory
              key={subCategory.id}
              id={subCategory.id}
              name={subCategory.name}
              slug={subCategory.slug}
            />
          ))}
        </AnimatePresence>
      </ul>

      {/* 🔽 SENTINELA DO INFINITE SCROLL */}
      {hasMore && (
<<<<<<< docs/projectOrganization
        <div ref={ref} className="py-4 text-center text-sm text-gray-400">
          {loading ? "Carregando..." : "Carregando mais..."}
        </div>
      )}
      { /* Menu drawer */}
      <AnimatePresence>
        {menu.isOpen && <MenuDrawer />}
      </AnimatePresence>
=======
        <div
          ref={ref}
          className="py-4 mb-125 text-center text-sm text-gray-400"
        >
          {loading ? "Loading..." : "Loading more..."}
        </div>
      )}
      <AnimatePresence>{menu.isOpen && <MenuDrawer />}</AnimatePresence>
      <AnimatePresence>{cart.isOpen && <CartDrawer />}</AnimatePresence>
      <div className="w-full h-px bg-(--soft-border) mt-30 md:mt-35" />
      <Footer />
>>>>>>> local
    </div>
  );
}
