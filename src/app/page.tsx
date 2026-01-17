"use client";

import { useState } from "react";
import NavBar from "./components/NavBar";
import { ProductProps } from "./types/product";
import Product from "./components/Product";

export default function HomePage() {
  const [results, setResults] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [query, setQuery] = useState("");

  async function find(query: string) {
    setLoading(true)

    setQuery(query);

    const res = await fetch(`https://sticky-charil-react-blog-3b39d9e9.koyeb.app/produtos/buscar?name=${query}`)
    const data = await res.json()

    setResults(data)
    setSearched(true);
    setLoading(false)
  }

  return (
    <div>
      <NavBar onSearch={find}/>
      <div className="w-full h-px bg-(--hover-border)"></div>
      {loading && <p>Buscando...</p>}
      {searched && (
        <div className="flex m-2 flex-col">
          <p className="text-xl text-(--text-main) font-bold">{query}</p>
          <p className="text-sm text-(--text-secondary)">{results.length} resultados.</p>
        </div>
        
      )}
      <ul className="gap-2 grid xl:grid-cols-4 grid-cols-3">
        {results.map(product => (
          <Product key={product.id} query={query} id={product.id} name={product.name} price={product.price}/>
        ))}
      </ul>
    </div>
  );
}
