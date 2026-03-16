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
import { ClickChartData, ClickClicksPerMonthDTO } from "../types/charts";

const monthNames = [
  "",
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez"
];

export default function ClicksChart() {
  const [data, setData] = useState<ClickChartData[]>([]);

  useEffect(() => {
    fetch("https://sticky-charil-react-blog-3b39d9e9.koyeb.app/events/all-clicks/monthly")
      .then(res => res.json())
      .then((result: ClickClicksPerMonthDTO[]) => {

        const fullYear: ClickChartData[] = Array.from({ length: 12 }, (_, i) => ({
          month: monthNames[i + 1],
          clicks: 0
        }));

        result.forEach(item => {
          const index = item.month - 1;
          fullYear[index].clicks = item.total;
        });

        setData(fullYear);
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
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "12px",
              color: "#F9FAFB"
            }}
            labelStyle={{ color: "#F9FAFB" }}
            formatter={(value: number | undefined) => [
              `${value ?? 0} cliques`,
              "Total"
            ]}
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