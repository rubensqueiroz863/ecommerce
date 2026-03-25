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
import { RecommendationChartData, RecommendationDTO } from "../types/charts";

export default function RelatedProductsChart() {
  const [data, setData] = useState<RecommendationChartData[]>([]);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API_URL + "events/recommendations/products")
      .then(res => res.json())
      .then((result: RecommendationDTO[]) => {
        const chartData: RecommendationChartData[] = [];

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
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
                    {item.relatedProductName}
                  </div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 2 }}>
                    Base Product
                  </div>
                  <div style={{ fontWeight: 500, marginBottom: 6 }}>
                    {item.baseProduct}
                  </div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 2 }}>
                    Users in common
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