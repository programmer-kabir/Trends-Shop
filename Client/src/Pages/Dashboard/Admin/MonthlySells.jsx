import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-md">
        <p className="font-bold text-amber-400 mb-1.5">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <span style={{ color: entry.color }} className="font-medium">
              {entry.name}:
            </span>
            <span className="font-semibold text-slate-100">
              {entry.dataKey === "revenue"
                ? `৳${entry.value.toLocaleString()}`
                : `${entry.value} orders`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MonthlySells = () => {
  const { RequestPayment = [] } = useSelector((state) => state.RequestPayment || {});

  const months = [
    { name: "Jan", index: 0 },
    { name: "Feb", index: 1 },
    { name: "Mar", index: 2 },
    { name: "Apr", index: 3 },
    { name: "May", index: 4 },
    { name: "Jun", index: 5 },
    { name: "Jul", index: 6 },
    { name: "Aug", index: 7 },
    { name: "Sep", index: 8 },
    { name: "Oct", index: 9 },
    { name: "Nov", index: 10 },
    { name: "Dec", index: 11 },
  ];

  const chartData = months.map((m) => {
    const ordersInMonth = (RequestPayment || []).filter((order) => {
      if (!order?.orderDate) return false;
      const orderDate = new Date(order.orderDate);
      return !isNaN(orderDate) && orderDate.getMonth() === m.index;
    });

    const revenueInMonth = ordersInMonth.reduce((acc, curr) => {
      const price = Number(curr.price) || 0;
      const shipping = Number(curr.shippingCost) || 0;
      return acc + price + shipping;
    }, 0);

    return {
      name: m.name,
      orders: ordersInMonth.length,
      revenue: revenueInMonth,
    };
  });

  return (
    <div className="w-full bg-white dark:bg-[#111622] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Revenue & Order Trajectory
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monthly distribution of total sales volume and BDT revenue
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
            Revenue (৳)
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            Orders Count
          </span>
        </div>
      </div>

      <div style={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 0, left: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              yAxisId="left"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              name="Revenue"
              barSize={16}
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#3b82f6" }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlySells;
