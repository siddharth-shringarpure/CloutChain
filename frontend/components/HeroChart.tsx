"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  createChart,
  type IChartApi,
  type CandlestickData as LightweightCandlestickData,
  type ChartOptions,
  type DeepPartial,
  CrosshairMode,
} from "lightweight-charts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CandlestickData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const HeroChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [data, setData] = useState<CandlestickData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<string>("0.4721");

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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/v1/olhc");
      setData(response.data);

      // Calculate price change for display
      if (response.data.length > 1) {
        const latest = response.data[response.data.length - 1];
        const previous = response.data[response.data.length - 2];
        const change = ((latest.close - previous.close) / previous.close) * 100;
        setPriceChange(change);
        setCurrentPrice(latest.close.toFixed(4));
      }
    } catch (error) {
      console.error("Error fetching OHLC data:", error);
      // Use sample data if API fails
      generateSampleData();
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleData = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 30);

    const sampleData = [];
    let price = 0.42;

    for (let i = 0; i < 30; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);

      const open = price * (1 + (Math.random() * 0.1 - 0.05));
      const close = open * (1 + (Math.random() * 0.1 - 0.05));
      const high = Math.max(open, close) * (1 + Math.random() * 0.03);
      const low = Math.min(open, close) * (1 - Math.random() * 0.03);

      sampleData.push({
        timestamp: date.toISOString(),
        open,
        high,
        low,
        close,
      });

      price = close;
    }

    setData(sampleData);

    // Calculate sample price change
    const latest = sampleData[sampleData.length - 1];
    const previous = sampleData[sampleData.length - 2];
    const change = ((latest.close - previous.close) / previous.close) * 100;
    setPriceChange(change);
    setCurrentPrice(latest.close.toFixed(4));
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      height: 400,
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

    // Add a line series for the AI prediction
    const lineSeries = chart.addLineSeries({
      color: "#805AD5",
      lineWidth: 2,
      lineStyle: 0,
    });

    // Generate AI prediction data (slightly above actual data)
    const predictionData = formattedData.slice(-15).map((item) => ({
      time: item.time,
      value: item.close * (1 + Math.random() * 0.05 + 0.02),
    }));

    lineSeries.setData(predictionData);

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

  if (isLoading) {
    return (
      <div className="p-4 h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">ZORA/USD</h3>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white mr-2">
              ${currentPrice}
            </span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded flex items-center ${
                priceChange > 0
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {priceChange > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
            }}
            className="h-2 w-2 rounded-full bg-purple-500"
          />
          <span className="text-xs text-purple-400">AI Prediction</span>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
};

export default HeroChart;
