"use client";

import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import { ProductProps } from "./types/product";
import Product from "./components/Product";
import { SubCategoryProps } from "./types/subCategory";
import SubCategory from "./components/SubCategory";

export default function HomePage() {
  const [results, setResults] = useState<ProductProps[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [query, setQuery] = useState("");

  async function findProducts(query: string) {
    setLoading(true)
    setSearched(false)
    setQuery(query);

    const res = await fetch(`https://sticky-charil-react-blog-3b39d9e9.koyeb.app/produtos/buscar?name=${query}`)
    const data = await res.json();

    setResults(data)
    setSearched(true);
    setLoading(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://sticky-charil-react-blog-3b39d9e9.koyeb.app/subcategories");
        const data = await res.json();
        setSubCategories(data);
        console.log(data)
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []); // 👈 IMPORTANTE

  return (
    <div>
      <NavBar onSearch={findProducts}/>
      <div className="w-full h-px bg-(--hover-border)"></div>
      {loading && !searched ? (
        <p className="px-2 md:px-4 my-2 md:my-4 text-(--text-main) font-bold">Buscando...</p>
      ) : searched ? (
        <div className="flex my-2 md:my-4 px-2 md:px-4 flex-col">
          <p className="text-xl text-(--text-main) font-bold">{query}</p>
          <p className="text-sm text-(--text-secondary)">{results.length} resultados.</p>
        </div>
      ) : (
        <p></p>
      )}
      <ul className="gap-2 md:gap-4 px-2 md:px-4 grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2">
        {results.map(product => (
          <Product key={product.id} query={query} id={product.id} name={product.name} price={product.price} photo={product.photo}/>
        ))}
      </ul>
      <ul className="flex flex-col w-full overflow-x-auto">
        {subCategories.map(subCategory => (
          <SubCategory key={subCategory.id} id={subCategory.id} name={subCategory.name} slug={subCategory.slug}/>
        ))}
      </ul>
    </div>
  );
}
