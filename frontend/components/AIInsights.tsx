"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Brain, Sparkles, TrendingUp, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

const AIInsights = () => {
  const [insights, setInsights] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentInsight, setCurrentInsight] = useState(0);

  const possibleInsights = [
    "Bullish divergence detected on 4h timeframe. Consider long positions with tight stops.",
    "Volume profile suggests accumulation phase. Potential breakout within 48 hours.",
    "Support level at $0.42 has been tested 3 times. High probability of bounce.",
    "RSI indicates oversold conditions. Mean reversion expected within 24-48 hours.",
    "Whale wallet activity increased by 27% in the last 6 hours. Monitoring for price impact.",
    "Sentiment analysis of social media shows 78% positive mentions, up from 52% yesterday.",
    "Price action forming a cup and handle pattern. Target price: $0.68 within 2 weeks.",
    "Correlation with BTC dropped to 0.31, suggesting independent price movement.",
    "AI model predicts 65% probability of breaking $0.50 resistance within 72 hours.",
    "Unusual options activity detected. Market makers positioning for upside movement.",
  ];

  useEffect(() => {
    // Initial insights
    generateNewInsights();

    // Rotate through insights
    const rotationInterval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 8000);

    // Generate new insights periodically
    const generationInterval = setInterval(() => {
      generateNewInsights();
    }, 30000);

    return () => {
      clearInterval(rotationInterval);
      clearInterval(generationInterval);
    };
  }, [insights.length]);

  const generateNewInsights = () => {
    setIsGenerating(true);

    // Simulate AI generating insights
    setTimeout(() => {
      const newInsights = [];
      const usedIndices = new Set();

      while (newInsights.length < 3) {
        const randomIndex = Math.floor(Math.random() * possibleInsights.length);
        if (!usedIndices.has(randomIndex)) {
          usedIndices.add(randomIndex);
          newInsights.push(possibleInsights[randomIndex]);
        }
      }

      setInsights(newInsights);
      setIsGenerating(false);
      setCurrentInsight(0);
    }, 2000);
  };

  return (
    <Card className="border border-gray-800 bg-[#131722]/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
      <CardHeader className="border-b border-gray-800 bg-[#0f1218] p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-white flex items-center">
            <Brain className="h-4 w-4 mr-2 text-purple-400" />
            AI Market Insights
          </CardTitle>
          <motion.div
            animate={{ scale: isGenerating ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: isGenerating ? Infinity : 0, duration: 1 }}
          >
            <Sparkles
              className={`h-4 w-4 ${
                isGenerating ? "text-purple-400" : "text-gray-500"
              }`}
            />
          </motion.div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative h-[180px] overflow-hidden">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <motion.div
                key={insight}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: currentInsight === index ? 1 : 0,
                  y: currentInsight === index ? 0 : 20,
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700">
                  {index % 3 === 0 ? (
                    <TrendingUp className="h-5 w-5 text-emerald-400 mt-0.5" />
                  ) : index % 3 === 1 ? (
                    <BarChart3 className="h-5 w-5 text-amber-400 mt-0.5" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-purple-400 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm text-gray-200">{insight}</p>
                    <div className="mt-4 flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></div>
                      <span className="text-xs text-emerald-400 font-medium">
                        {index % 3 === 0
                          ? "High confidence"
                          : index % 3 === 1
                          ? "Medium confidence"
                          : "Experimental"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">Generating insights...</p>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          {insights.map((_, idx) => (
            <motion.div
              key={idx}
              className={`h-1.5 w-1.5 rounded-full mx-1 ${
                currentInsight === idx ? "bg-purple-500" : "bg-gray-700"
              }`}
              animate={{
                scale: currentInsight === idx ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: currentInsight === idx ? Infinity : 0,
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
