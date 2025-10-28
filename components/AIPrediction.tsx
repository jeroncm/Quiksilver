import React from 'react';
import type { AIPrediction, PredictionScenario } from '../types';
import SparklesIcon from './icons/SparklesIcon';

interface AIPredictionProps {
  prediction: AIPrediction | null;
}

const Scenario: React.FC<{ title: string; data: PredictionScenario }> = ({ title, data }) => (
  <div className="bg-slate-800/60 p-4 rounded-lg border border-white/10">
    <h4 className="font-semibold text-slate-300 mb-3">{title}</h4>
    <div className="grid grid-cols-3 gap-2 text-center text-sm">
      <div>
        <p className="text-red-400 text-xs">Worst</p>
        <p className="font-mono font-semibold text-slate-200 mt-1">₹{(data.worstCase ?? 0).toFixed(2)}</p>
      </div>
      <div>
        <p className="text-slate-400 text-xs">Average</p>
        <p className="font-mono font-semibold text-slate-200 mt-1">₹{(data.averageCase ?? 0).toFixed(2)}</p>
      </div>
      <div>
        <p className="text-green-400 text-xs">Best</p>
        <p className="font-mono font-semibold text-slate-200 mt-1">₹{(data.bestCase ?? 0).toFixed(2)}</p>
      </div>
    </div>
  </div>
);

const AIPredictionComponent: React.FC<AIPredictionProps> = ({ prediction }) => {
  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl shadow-2xl border border-[var(--card-border)] backdrop-blur-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-violet-500/10 p-2 rounded-full border border-violet-500/30">
          <SparklesIcon className="w-6 h-6 text-violet-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">AI Investment Analysis</h2>
      </div>
      
      {!prediction ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-slate-400">Generating AI analysis...</p>
        </div>
      ) : (
        <div className="space-y-5 flex-grow flex flex-col">
          <div>
            <h3 className="text-sm font-medium text-slate-400">Today's Outlook</h3>
            <p className="text-violet-300 font-semibold text-xl mt-1">{prediction.recommendation}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-400">Tomorrow's Forecast</h3>
            <p className="text-slate-200 mt-1">{prediction.tomorrow}</p>
          </div>
          
          <div className="space-y-3 pt-2">
            <Scenario title="1 Year Horizon" data={prediction.oneYear} />
            <Scenario title="5 Year Horizon" data={prediction.fiveYear} />
            <Scenario title="10 Year Horizon" data={prediction.tenYear} />
          </div>
          <div className="flex-grow"></div>
           <p className="text-xs text-slate-500 text-center pt-2">
              Disclaimer: This is an AI-generated forecast and not financial advice.
           </p>
        </div>
      )}
    </div>
  );
};

export default AIPredictionComponent;