import React, { useState, useEffect, useCallback } from 'react';
import type { HistoricalDataPoint, PriceData, AIPrediction } from './types';
import { fetchCurrentPrice, fetchHistoricalData, fetchAIPrediction } from './services/geminiService';
import Header from './components/Header';
import PriceDisplay from './components/PriceDisplay';
import HistoricalComparison from './components/HistoricalComparison';
import PriceChart from './components/PriceChart';
import AIPredictionComponent from './components/AIPrediction';

const App: React.FC = () => {
  const [region] = useState('Chennai, India');
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [aiPrediction, setAiPrediction] = useState<AIPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentPrice = await fetchCurrentPrice(region);
      setPriceData({
        current: currentPrice,
        yesterday: 0,
        week: 0,
        fifteen: 0,
        month: 0,
        year: 0,
      });

      const history = await fetchHistoricalData(currentPrice, region);
      setHistoricalData(history);

      if (history.length > 0) {
        const yesterdayPrice = history.length > 1 ? history[history.length - 2].price : currentPrice;
        const weekAgoPrice = history.length > 7 ? history[history.length - 8].price : history[0].price;
        const fifteenDaysAgoPrice = history.length > 15 ? history[history.length - 16].price : history[0].price;
        const monthAgoPrice = history[0].price;
        
        setPriceData({
          current: currentPrice,
          yesterday: currentPrice - yesterdayPrice,
          week: currentPrice - weekAgoPrice,
          fifteen: currentPrice - fifteenDaysAgoPrice,
          month: currentPrice - monthAgoPrice,
          year: 0, // Year data is not fetched in this demo
        });
      }

      const prediction = await fetchAIPrediction(currentPrice, history);
      setAiPrediction(prediction);

    } catch (err) {
      console.error(err);
      setError('Failed to fetch silver price data. The market might be closed or the AI is unavailable.');
    } finally {
      setLoading(false);
    }
  }, [region]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const getSubTitle = () => {
    if (isWeekend) {
      return `Last closing price (Friday) for ${region}`;
    }
    return `Live price for ${region}`;
  };

  const getLastUpdatedText = () => {
    if (isWeekend) {
      return `Last updated: Friday's close`;
    }
    return `Last updated: Just now`;
  };
  
  const getChangeLabel = () => {
    if (isWeekend) {
      return 'weekend'; // Special value to indicate hiding the change
    }
    if (dayOfWeek === 1) { // Monday
        return `(vs Friday)`;
    }
    return `(24h)`;
  };


  return (
    <div className="min-h-screen text-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header region={region} onRefresh={fetchData} isLoading={loading} subTitle={getSubTitle()} />

        {loading && (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!loading && !error && priceData && (
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <PriceDisplay 
                currentPrice={priceData.current} 
                priceChange={priceData.yesterday}
                lastUpdatedText={getLastUpdatedText()}
                changeLabel={getChangeLabel()}
              />
              <HistoricalComparison priceData={priceData} />
            </div>
            <div className="lg:col-span-2">
              <PriceChart data={historicalData} />
            </div>
            <div className="lg:col-span-1">
              <AIPredictionComponent prediction={aiPrediction} />
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default App;