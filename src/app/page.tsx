"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import NavBar from "./components/NavBar";
import SubCategory from "./components/SubCategory";
import Product from "./components/Product";
import MenuDrawer from "./components/MenuDrawer";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";

import { SubCategoryProps } from "./types/subCategory";
import { ProductProps } from "./types/product";
import { PageResponse } from "./types/pageResponse";

import { useMenu } from "@/lib/menu";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import CategoriesCard from "./components/CategoriesCard";
import { OpenSans } from "@/lib/fonts";
import CategoryCard from "./components/CategoryCard";
import HeroCard from "./components/HeroCard";

interface MostClickedProductDTO {
  product: ProductProps;
  clicks: number;
}

export interface UserRecommendation {
  productId: string;
  productName: string;
  productPrice: number;
  usersInCommon: number;
}

export interface UserRecommendationGroup {
  userId: string;
  userName: string;
  recommendations: UserRecommendation[];
}

export default function HomePage() {
  const [subCategories, setSubCategories] = useState<SubCategoryProps[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forYou, setForYou] = useState<MostClickedProductDTO[]>([]);
  const [userRecommendations, setRecommendations] = useState<UserRecommendationGroup | undefined>(undefined);

  const router = useRouter();
  const menu = useMenu();
  const cart = useCart();
  const { user } = useAuth();

  const { ref, inView } = useInView({ threshold: 0 });

  const fetchSubCategories = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}subcategories?page=${page}&size=6`
      );
      const data: PageResponse<SubCategoryProps> = await res.json();

      setSubCategories(prev => [...prev, ...data.data]);
      setHasMore(data.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error("Erro ao buscar subcategorias:", err);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  async function fetchMostClicked(userId: string, limit: number = 10) {
    console.log(userId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}events/users/${userId}/top-clicks?limit=${limit}`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!res.ok) throw new Error(`Erro ao buscar produtos: ${res.status}`);
      const data: MostClickedProductDTO[] = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async function fetchRecommendations(userId: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}events/users/${userId}/recommendations`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!res.ok) throw new Error(`Erro ao buscar produtos: ${res.status}`);
      
      const data: UserRecommendationGroup = await res.json();
      
      return data;

    } catch (err) {
      console.error(err);
      return undefined;
    }
  }
  useEffect(() => {
    if (!user) return;

    async function loadForYou() {
      const forYouData = await fetchMostClicked(user!.id, 10);
      const recommendationsData = await fetchRecommendations(user!.id);
      setForYou(forYouData);
      setRecommendations(recommendationsData);
    }

    loadForYou();
  }, [user?.id]);

  useEffect(() => {
    fetchSubCategories();
  }, []);

  useEffect(() => {
    if (inView) fetchSubCategories();
  }, [inView, fetchSubCategories]);


  function search(query: string) {
    router.push(`/search/${query}`);
  }

  return (
    <div className="w-full">
      <NavBar onSearch={search} />
      <div className="flex w-full gap-2 px-4 justify-between pt-4 md:pt-8 md:px-8">
        <div className="hidden md:block">
          <CategoriesCard />
        </div>
        <div className="flex xl:flex-row flex-col gap-2 items-center justify-center">
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
              size="bg-size-[100px] lg:bg-size-[130px] min-h-[130px] lg:min-h-[180px]"
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
          className="px-4 md:px-8 w-full mt-10"
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
            <button className="bg-(--primary-color) text-(--text-light) rounded-full px-4 py-1 text-[16px] md:text-xs cursor-pointer">
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
              </div>
            ))}
          </div>
        </motion.div>
      )}
      {userRecommendations &&
        userRecommendations?.recommendations?.length > 0 && (
          <motion.div
            className="px-4 md:px-8 w-full mt-10"
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
              <button className="bg-(--primary-color) text-(--text-light) rounded-full px-4 py-1 text-xs cursor-pointer">
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
                </div>
              ))}
            </div>
          </motion.div>
      )}
        <AnimatePresence>
          {subCategories.map(subCategory => (
            <SubCategory
              key={`sub-${subCategory.id}`}
              id={subCategory.id}
              name={subCategory.name}
              slug={subCategory.slug}
              role="user"
            />
          ))}
        </AnimatePresence>
      {hasMore && (
        <div
          ref={ref}
          className="py-4 mb-125 text-center text-sm text-gray-400"
        >
          {loading ? "Loading..." : "Loading more..."}
        </div>
      )}
      <AnimatePresence>{menu.isOpen && <MenuDrawer />}</AnimatePresence>
      <AnimatePresence>{cart.isOpen && <CartDrawer />}</AnimatePresence>
      
      <Footer />
    </div>
  );
}