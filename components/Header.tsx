import React from 'react';
import RefreshIcon from './icons/RefreshIcon';

interface HeaderProps {
  region: string;
  onRefresh: () => void;
  isLoading: boolean;
  subTitle: string;
}

const Header: React.FC<HeaderProps> = ({ region, onRefresh, isLoading, subTitle }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-white/10">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Silver Price <span className="gradient-text">AI</span>
        </h1>
        <p className="text-slate-400 mt-2">{subTitle}</p>
      </div>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="mt-4 sm:mt-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 text-slate-300 rounded-lg hover:bg-white/10 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <RefreshIcon className={`w-5 h-5 transition-transform duration-500 ${isLoading ? 'animate-spin' : 'group-hover:rotate-90'}`} />
        <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
      </button>
    </header>
  );
};

export default Header;