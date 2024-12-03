import React from 'react';
import { HistoricalAQIData } from '../utils/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface HistoricalAQIChartProps {
  data: HistoricalAQIData[];
}

export const HistoricalAQIChart: React.FC<HistoricalAQIChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    category: item.category,
    '2019': item.year2019,
    '2020': item.year2020,
    '2021': item.year2021,
  }));

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Delhi AQI Comparison (2019-2021)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="2019" fill="#8884d8" />
          <Bar dataKey="2020" fill="#82ca9d" />
          <Bar dataKey="2021" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
