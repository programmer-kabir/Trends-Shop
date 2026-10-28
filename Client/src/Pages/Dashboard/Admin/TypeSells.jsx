import React from "react";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900/95 text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-md">
        <p className="font-bold text-amber-400">{data.name}</p>
        <p className="text-slate-200 mt-1">
          Catalog Share: <span className="font-semibold">{data.value} items ({data.payload.percentage}%)</span>
        </p>
      </div>
    );
  }
  return null;
};

const TypeSells = () => {
  const { Shoes = [] } = useSelector((state) => state.Shoes || {});

  // Group real shoes by gender/category
  const mensCount = Shoes.filter((s) => s?.gender === "MEN'S" || s?.category?.includes("MAN")).length || 0;
  const womensCount = Shoes.filter((s) => s?.gender === "WOMEN'S" || s?.category?.includes("WOMEN")).length || 0;
  const kidsCount = Shoes.filter((s) => s?.gender === "KID'S" || s?.category?.includes("KID")).length || 0;
  const total = (mensCount + womensCount + kidsCount) || 1;

  const data = [
    {
      name: "Men's Collection",
      value: mensCount,
      percentage: Math.round((mensCount / total) * 100),
      color: "#f59e0b", // Amber
    },
    {
      name: "Women's Collection",
      value: womensCount,
      percentage: Math.round((womensCount / total) * 100),
      color: "#3b82f6", // Blue
    },
    {
      name: "Kid's Collection",
      value: kidsCount,
      percentage: Math.round((kidsCount / total) * 100),
      color: "#10b981", // Emerald
    },
  ];

  return (
    <div className="w-full h-full bg-white dark:bg-[#111622] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Category Mix
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Distribution across active footwear lines
        </p>
      </div>

      <div className="my-2" style={{ width: "100%", height: "180px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown Legend */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {item.name}
              </span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              {item.value} shoes ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypeSells;
