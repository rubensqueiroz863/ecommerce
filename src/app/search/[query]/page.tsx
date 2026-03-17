import { SearchPageProps } from "@/app/types/search";
import SearchClient from "./SearchClient";

export default async function Page({ params }: SearchPageProps) {
  const { query } = await params;
  return <SearchClient query={query} />;
}
