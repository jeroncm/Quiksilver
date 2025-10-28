import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { HistoricalDataPoint } from '../types';

interface PriceChartProps {
  data: HistoricalDataPoint[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/80 p-3 border border-slate-700 rounded-lg shadow-lg backdrop-blur-sm">
        <p className="label text-slate-300">{`Date : ${label}`}</p>
        <p className="intro text-cyan-400 font-bold">{`Price : ₹${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/50 p-6 rounded-2xl shadow-2xl border border-[var(--card-border)] backdrop-blur-sm h-full flex items-center justify-center">
        <p className="text-slate-400">No chart data available.</p>
      </div>
    );
  }

  const formattedData = data.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  const domainMin = Math.min(...data.map(d => d.price)) * 0.98;
  const domainMax = Math.max(...data.map(d => d.price)) * 1.02;

  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl shadow-2xl border border-[var(--card-border)] backdrop-blur-sm">
      <h2 className="text-lg font-semibold text-white mb-4">30-Day Price Trend</h2>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <AreaChart
            data={formattedData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.3)" />
            <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={[domainMin, domainMax]} tickFormatter={(value) => `₹${Number(value).toFixed(0)}`}/>
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(168, 85, 247, 0.5)', strokeWidth: 1, strokeDasharray: '3 3' }}/>
            <Area type="monotone" dataKey="price" stroke="#22d3ee" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;