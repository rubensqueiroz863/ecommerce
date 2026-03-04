"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Brush
} from "recharts";

type RelatedProductDTO = {
  productId: string;
  productName: string;
  usersInCommon: number;
};

type RecommendationDTO = {
  baseProduct: string;
  topRelatedProducts: RelatedProductDTO[];
};

type ChartData = {
  baseProduct: string;
  relatedProductName: string;
  usersInCommon: number;
};

export default function RelatedProductsChart() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetch("https://sticky-charil-react-blog-3b39d9e9.koyeb.app/events/recommendations")
      .then(res => res.json())
      .then((result: RecommendationDTO[]) => {
        const chartData: ChartData[] = [];

        result.forEach(item => {
          item.topRelatedProducts.forEach(related => {
            chartData.push({
              baseProduct: item.baseProduct,
              relatedProductName: related.productName,
              usersInCommon: related.usersInCommon
            });
          });
        });

        setData(chartData);
      });
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="relatedProductName" />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;
              const item = payload[0].payload;

              return (
                <div
                  style={{
                    background: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    padding: "12px 28px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                    color: "#F9FAFB"
                  }}
                >
                  {/* Produto relacionado em destaque */}
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
                    {item.relatedProductName}
                  </div>

                  {/* Base product */}
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 2 }}>
                    Base Product
                  </div>
                  <div style={{ fontWeight: 500, marginBottom: 6 }}>
                    {item.baseProduct}
                  </div>

                  {/* Usuários em comum */}
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 2 }}>
                    Usuários em comum
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {item.usersInCommon}
                  </div>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="usersInCommon"
            stroke="#6366f1"
            strokeWidth={3}
          />
          <Brush dataKey="relatedProductName" height={30} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}