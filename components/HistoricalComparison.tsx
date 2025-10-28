import React from 'react';
import type { PriceData } from '../types';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';

interface HistoricalComparisonProps {
  priceData: PriceData;
}

const ComparisonItem: React.FC<{ label: string; change: number }> = ({ label, change }) => {
  const isPositive = change >= 0;
  const color = isPositive ? 'text-green-400' : 'text-red-400';
  const borderColor = isPositive ? 'border-green-400' : 'border-red-400';
  const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div className={`bg-slate-800/50 p-4 rounded-lg flex justify-between items-center border-l-4 ${borderColor}`}>
      <span className="text-slate-300 font-medium">{label}</span>
      <div className={`flex items-center gap-1 font-semibold ${color}`}>
        <Icon className="w-4 h-4" />
        <span>₹{Math.abs(change).toFixed(2)}</span>
      </div>
    </div>
  );
};

const HistoricalComparison: React.FC<HistoricalComparisonProps> = ({ priceData }) => {
  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl shadow-2xl border border-[var(--card-border)] backdrop-blur-sm">
      <h2 className="text-lg font-semibold text-white mb-4">Historical Change</h2>
      <div className="space-y-3">
        <ComparisonItem label="7 Days" change={priceData.week} />
        <ComparisonItem label="15 Days" change={priceData.fifteen} />
        <ComparisonItem label="30 Days" change={priceData.month} />
      </div>
    </div>
  );
};

export default HistoricalComparison;