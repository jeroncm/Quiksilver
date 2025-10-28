import React from 'react';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';

interface PriceDisplayProps {
  currentPrice: number;
  priceChange: number;
  lastUpdatedText: string;
  changeLabel: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ currentPrice, priceChange, lastUpdatedText, changeLabel }) => {
  const isPriceValid = typeof currentPrice === 'number' && isFinite(currentPrice);
  const isChangeValid = typeof priceChange === 'number' && isFinite(priceChange);

  const isPositive = isChangeValid && priceChange >= 0;
  const changeColor = isChangeValid ? (isPositive ? 'text-green-400' : 'text-red-400') : 'text-slate-400';
  const isWeekend = changeLabel === 'weekend';

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 p-6 rounded-2xl shadow-2xl border border-[var(--card-border)] backdrop-blur-sm">
      <p className="text-slate-400 text-sm font-medium">Current Price (1 gram)</p>
      <div className="flex items-baseline gap-4 mt-2">
        <span className="text-6xl font-bold text-white tracking-tighter">
          {isPriceValid ? `₹${currentPrice.toFixed(2)}` : 'N/A'}
        </span>
        {!isWeekend && (
          <div className={`flex items-center text-lg font-semibold ${changeColor}`}>
            {isChangeValid && (isPositive ? <ArrowUpIcon className="w-5 h-5" /> : <ArrowDownIcon className="w-5 h-5" />)}
            <span>
              {isChangeValid ? `₹${Math.abs(priceChange).toFixed(2)}` : '₹--.--'} {changeLabel}
            </span>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500 mt-2">{lastUpdatedText}</p>
    </div>
  );
};

export default PriceDisplay;