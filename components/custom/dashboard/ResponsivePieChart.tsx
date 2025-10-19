"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Asia", value: 2500, percentage: "31.3%", color: "#8884d8" },
  { name: "America", value: 1800, percentage: "22.5%", color: "#83a6ed" },
  { name: "Europe", value: 2200, percentage: "27.5%", color: "#8dd1e1" },
  { name: "Africa", value: 1500, percentage: "18.7%", color: "#82ca9d" },
];

const summaryStats = [
  { value: "6.3%", label: "Growth" },
  { value: "18.8%", label: "New Visits" },
  { value: "43.8%", label: "Bounce Rate" },
];

export default function CurrentVisitsChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full h-full max-w-md">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Current visits</h2>
        
        <div className="flex gap-4">
          {summaryStats.map((stat, index) => (
            <div key={index} className="text-right">
              <div className="text-sm font-medium text-gray-500">{stat.label}</div>
              <div className="text-lg font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex">
        <div className="w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value} visits`, 
                  `${props.payload.percentage} of total`
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-1/2 pl-4 flex flex-col justify-center">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center mb-3">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }} 
              />
              <span className="text-sm font-medium text-gray-600">
                {entry.name}
              </span>
              <span className="ml-auto font-bold">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-gray-400" />
              <span className="text-sm font-medium text-gray-600">Total</span>
              <span className="ml-auto font-bold">
                {data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}