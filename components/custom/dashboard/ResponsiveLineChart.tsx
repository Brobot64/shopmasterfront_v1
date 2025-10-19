"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DataItem {
  name: string;
  income: number;
  expenses: number;
  sales: number;
}

export default function YearlySalesChart() {
  const [showIncome, setShowIncome] = useState(true);
  const [showExpenses, setShowExpenses] = useState(true);
  const [showSales, setShowSales] = useState(true);

  const data: DataItem[] = [
    { name: "Jan", income: 52, expenses: 50, sales: 102 },
    { name: "Feb", income: 45, expenses: 30, sales: 75 },
    { name: "Mar", income: 48, expenses: 35, sales: 83 },
    { name: "Apr", income: 20, expenses: 22, sales: 42 },
    { name: "May", income: 90, expenses: 85, sales: 175 },
    { name: "Jun", income: 80, expenses: 95, sales: 175 },
    { name: "Jul", income: 75, expenses: 92, sales: 167 },
    { name: "Aug", income: 150, expenses: 60, sales: 210 },
    { name: "Sep", income: 100, expenses: 80, sales: 180 },
    { name: "Oct", income: 70, expenses: 95, sales: 165 },
    { name: "Nov", income: 60, expenses: 88, sales: 148 },
    { name: "Dec", income: 50, expenses: 82, sales: 132 },
  ];

  // Calculate totals
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);

  const formatTotal = (value: number) => {
    return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
  };

  return (
    <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Yearly sales</h2>
          <p className="text-sm text-gray-500">(+43%) than last year</p>
        </div>
        <select className="text-sm border px-3 py-1 rounded-md bg-white shadow-sm focus:outline-none">
          <option>2023</option>
          <option>2022</option>
        </select>
      </div>

      {/* Stats */}
      <div className="flex gap-8 mb-8">
        <button 
          onClick={() => setShowIncome(!showIncome)}
          className={`flex flex-col items-start cursor-pointer ${!showIncome ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center gap-2 text-sm text-gray-800 mb-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span className={!showIncome ? 'line-through' : ''}>Total income</span>
          </div>
          <div className="text-lg font-bold">{formatTotal(totalIncome)}</div>
        </button>

        <button 
          onClick={() => setShowExpenses(!showExpenses)}
          className={`flex flex-col items-start cursor-pointer ${!showExpenses ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center gap-2 text-sm text-gray-800 mb-1">
            <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
            <span className={!showExpenses ? 'line-through' : ''}>Total expenses</span>
          </div>
          <div className="text-lg font-bold">{formatTotal(totalExpenses)}</div>
        </button>

        <button 
          onClick={() => setShowSales(!showSales)}
          className={`flex flex-col items-start cursor-pointer ${!showSales ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center gap-2 text-sm text-gray-800 mb-1">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            <span className={!showSales ? 'line-through' : ''}>Total sales</span>
          </div>
          <div className="text-lg font-bold">{formatTotal(totalSales)}</div>
        </button>
      </div>

      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip />
            {showIncome && (
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            )}
            {showExpenses && (
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#facc15"
                strokeWidth={2}
                dot={false}
              />
            )}
            {showSales && (
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}