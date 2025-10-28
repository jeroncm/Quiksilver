import { GoogleGenAI, Type } from "@google/genai";
import type { HistoricalDataPoint, AIPrediction } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const fetchCurrentPrice = async (region: string): Promise<number> => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

    let promptContent = `What is the current price of 1 gram of silver in ${region}?`;

    if (dayOfWeek === 0 || dayOfWeek === 6) { // If Sunday or Saturday
      promptContent = `What was the closing price of 1 gram of silver in ${region} last Friday?`;
    }
    
    promptContent += ` Respond with only the numerical value (e.g., 95.50), without any currency symbols or text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptContent,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const priceText = response.text.trim();
    const match = priceText.match(/[\d.]+/);
    if (match) {
      const price = parseFloat(match[0]);
      if (!isNaN(price)) {
        return price;
      }
    }
    throw new Error("Could not parse price from AI response.");
  } catch (error) {
    console.error("Error fetching current price:", error);
    throw new Error("Could not fetch current silver price.");
  }
};


export const fetchHistoricalData = async (currentPrice: number, region: string): Promise<HistoricalDataPoint[]> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const today = new Date();

    const prompt = `Generate plausible historical daily silver prices (for 1 gram in ${region}'s currency) for the last 30 days, from ${thirtyDaysAgo.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}. The final day's price must be exactly ${currentPrice}. Create natural-looking daily fluctuations.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
              price: { type: Type.NUMBER }
            },
            required: ["date", "price"]
          }
        }
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    if (Array.isArray(data) && data.length > 0) {
      // Ensure the last price is the current price
      data[data.length - 1].price = currentPrice;
      return data;
    }
    throw new Error("Invalid historical data format.");

  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw new Error("Could not generate historical silver price data.");
  }
};

export const fetchAIPrediction = async (currentPrice: number, historicalData: HistoricalDataPoint[]): Promise<AIPrediction> => {
  try {
    const historicalTrendSummary = historicalData.length > 0
      ? `The price started at ${historicalData[0].price} 30 days ago and is now ${currentPrice}.`
      : `The current price is ${currentPrice}.`;
    
    const prompt = `
      Given the current silver price of ${currentPrice} and the recent trend (${historicalTrendSummary}), act as a financial analyst.
      Provide a concise investment recommendation for today.
      Predict tomorrow's price movement.
      Also, provide best case, worst case, and average case price predictions for holding 1 gram of silver purchased today over 1, 5, and 10 year horizons.
      Base your analysis on general market volatility, inflation, and industrial demand for silver. Do not give financial advice, but provide a plausible, data-driven forecast.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendation: { type: Type.STRING, description: "e.g., 'Good day to buy', 'Hold', 'Consider selling'" },
              tomorrow: { type: Type.STRING, description: "e.g., 'Likely to increase slightly', 'Stable with minor fluctuations'" },
              oneYear: {
                type: Type.OBJECT,
                properties: {
                  bestCase: { type: Type.NUMBER },
                  worstCase: { type: Type.NUMBER },
                  averageCase: { type: Type.NUMBER }
                },
                required: ["bestCase", "worstCase", "averageCase"]
              },
              fiveYear: {
                type: Type.OBJECT,
                properties: {
                  bestCase: { type: Type.NUMBER },
                  worstCase: { type: Type.NUMBER },
                  averageCase: { type: Type.NUMBER }
                },
                required: ["bestCase", "worstCase", "averageCase"]
              },
              tenYear: {
                type: Type.OBJECT,
                properties: {
                  bestCase: { type: Type.NUMBER },
                  worstCase: { type: Type.NUMBER },
                  averageCase: { type: Type.NUMBER }
                },
                required: ["bestCase", "worstCase", "averageCase"]
              }
            },
            required: ["recommendation", "tomorrow", "oneYear", "fiveYear", "tenYear"]
          }
        }
    });

    const jsonText = response.text.trim();
    const prediction = JSON.parse(jsonText);

    return prediction;

  } catch (error) {
    console.error("Error fetching AI prediction:", error);
    throw new Error("Could not generate AI prediction.");
  }
};