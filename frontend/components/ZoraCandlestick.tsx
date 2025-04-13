"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  createChart,
  type IChartApi,
  type CandlestickData as LightweightCandlestickData,
  type ChartOptions,
  type DeepPartial,
  CrosshairMode,
} from "lightweight-charts";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface CandlestickData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

const ZoraCandlestick: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [data, setData] = useState<CandlestickData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [time, setTime] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [aiSignal, setAiSignal] = useState<string>("neutral");

  const formatData = (
    data: CandlestickData[]
  ): LightweightCandlestickData[] => {
    return data.map((item) => ({
      time: new Date(item.timestamp).toISOString().split("T")[0],
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));
  };

  useEffect(() => {
    fetchData();
    // Simulate AI signal changes
    const interval = setInterval(() => {
      const signals = ["buy", "sell", "neutral", "strong_buy", "strong_sell"];
      setAiSignal(signals[Math.floor(Math.random() * signals.length)]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setIsRefreshing(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/olhc`);
      setData(response.data);
      setTime(new Date().toLocaleTimeString());

      // Calculate price change for display
      if (response.data.length > 1) {
        const latest = response.data[response.data.length - 1];
        const previous = response.data[response.data.length - 2];
        const change = ((latest.close - previous.close) / previous.close) * 100;
        setPriceChange(change);
      }
    } catch (error) {
      console.error("Error fetching OHLC data:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: {
          type: "gradient",
          gradient: { startColor: "#131722", endColor: "#1c2230" },
        },
        textColor: "#D9D9D9",
        fontSize: 12,
        fontFamily: "Inter, sans-serif",
      },
      grid: {
        vertLines: { color: "rgba(42, 46, 57, 0.6)" },
        horzLines: { color: "rgba(42, 46, 57, 0.6)" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "rgba(128, 90, 213, 0.5)",
          width: 1,
          style: 1,
          labelBackgroundColor: "#805AD5",
        },
        horzLine: {
          color: "rgba(128, 90, 213, 0.5)",
          width: 1,
          style: 1,
          labelBackgroundColor: "#805AD5",
        },
      },
      rightPriceScale: {
        borderColor: "rgba(42, 46, 57, 0.6)",
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: "rgba(42, 46, 57, 0.6)",
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
    } as DeepPartial<ChartOptions>);

    // Add a candlestick series with cyberpunk colors
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#00E396",
      downColor: "#FF4976",
      borderVisible: false,
      wickUpColor: "#00E396",
      wickDownColor: "#FF4976",
    });

    // Set the data
    const formattedData = formatData(data);
    candlestickSeries.setData(formattedData);

    // Fit content
    chart.timeScale().fitContent();

    // Handle window resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    chartRef.current = chart;

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data]);

  const getSignalColor = () => {
    switch (aiSignal) {
      case "buy":
      case "strong_buy":
        return "bg-emerald-500";
      case "sell":
      case "strong_sell":
        return "bg-rose-500";
      default:
        return "bg-amber-500";
    }
  };

  const getSignalText = () => {
    switch (aiSignal) {
      case "buy":
        return "Buy";
      case "strong_buy":
        return "Strong Buy";
      case "sell":
        return "Sell";
      case "strong_sell":
        return "Strong Sell";
      default:
        return "Neutral";
    }
  };

  return (
    <Card className="border border-gray-800 bg-[#131722]/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
      <CardHeader className="border-b border-gray-800 bg-[#0f1218] p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 1, ease: "linear" }}
              className="h-8 w-8 rounded-full bg-purple-900/30 flex items-center justify-center"
            >
              <Zap className="h-4 w-4 text-purple-400" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Zora Price Action
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant="outline"
                  className="text-xs border-gray-700 bg-gray-800/50"
                >
                  ZORA/USD
                </Badge>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={priceChange > 0 ? "positive" : "negative"}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className={`flex items-center text-xs ${
                      priceChange > 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {priceChange > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(priceChange).toFixed(2)}%
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={aiSignal}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center"
              >
                <div
                  className={`h-2 w-2 rounded-full ${getSignalColor()} mr-2 animate-pulse`}
                ></div>
                <span className="text-xs font-medium text-gray-300">
                  AI Signal: {getSignalText()}
                </span>
              </motion.div>
            </AnimatePresence>
            <Button
              onClick={fetchData}
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-[500px] bg-[#131722]">
            <Skeleton className="h-8 w-8 rounded-full bg-gray-800 mb-4" />
            <Skeleton className="h-4 w-48 bg-gray-800 mb-2" />
            <Skeleton className="h-3 w-32 bg-gray-800" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div ref={chartContainerRef} className="w-full h-[500px]" />
          </motion.div>
        )}
      </CardContent>

      <div className="px-4 py-2 bg-[#0f1218] border-t border-gray-800 flex justify-between items-center text-xs text-gray-400">
        <span>Last updated: {time}</span>
        <div className="flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
          <span>
            Trading involves risk. AI predictions are not financial advice.
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ZoraCandlestick;
