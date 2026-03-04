"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const monthNames = [
  "",
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

type ClicksPerMonthDTO = {
  productId: string;
  productName: string;
  month: number;
  clicks: number;
};

type ChartData = {
  month: string;
  productName: string;
  clicks: number;
};

export default function ProductsClicksChart() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetch("https://sticky-charil-react-blog-3b39d9e9.koyeb.app/events/all-clicks/products/monthly")
      .then(res => res.json())
      .then((result: ClicksPerMonthDTO[]) => {

        const bestPerMonth: ChartData[] = Array.from({ length: 12 }, (_, i) => ({
          month: monthNames[i + 1],
          productName: "-",
          clicks: 0
        }));

        result.forEach(item => {
          const index = item.month - 1;

          if (item.clicks > bestPerMonth[index].clicks) {
            bestPerMonth[index] = {
              month: monthNames[item.month],
              productName: item.productName,
              clicks: item.clicks
            };
          }
        });

        setData(bestPerMonth);
      });
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;

              const data = payload[0].payload;

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
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>
                    {label}
                  </div>

                  <div style={{ fontSize: 14, color: "#9CA3AF" }}>
                    Produto
                  </div>

                  <div style={{ fontWeight: 500, marginBottom: 6 }}>
                    {data.productName}
                  </div>

                  <div style={{ fontSize: 14, color: "#9CA3AF" }}>
                    Cliques
                  </div>

                  <div style={{ fontWeight: 600, fontSize: 16 }}>
                    {data.clicks}
                  </div>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="#6366f1"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}