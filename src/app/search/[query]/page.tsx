import { SearchProps } from "@/app/types/search";
import SearchClient from "./SearchClient";

export default async function Page({ params }: SearchProps) {
  const { query } = await params;
  // Pagina com os produtos pesquisados
  return <SearchClient query={query} />;
}
