import ClicksChart from "@/app/components/ClicksChart";
import ProductsClicksChart from "@/app/components/ProductsClicksChart";
import RelatedProductsChart from "@/app/components/RelatedProductsChart";

export default function DashboardPage() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="flex flex-col items-start p-12 gap-4">
      <div className="w-full flex flex-col gap-4 font-bold text-(--text-main) text-xl">
        <h1 className="px-16">Analytics de Total de Clicks de { currentYear }</h1>
        <ClicksChart />
      </div>
      <div className="w-full flex flex-col gap-4 font-bold text-(--text-main) text-xl">
        <h1 className="px-16">Analytics de Produtos Mais Clicados por Més de { currentYear }</h1>
        <ProductsClicksChart />
      </div>
      <div className="w-full flex flex-col gap-4 font-bold text-(--text-main) text-xl">
        <h1 className="px-16">Produtos Relacionados</h1>
        <RelatedProductsChart />
      </div>
    </div>
  );
}