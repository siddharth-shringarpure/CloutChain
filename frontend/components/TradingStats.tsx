"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  DollarSign,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

const TradingStats = () => {
  const [stats, setStats] = useState({
    volume: "0",
    marketCap: "0",
    holders: "0",
    volatility: "0",
  });

  useEffect(() => {
    // Simulate fetching stats
    setStats({
      volume: "$2.4M",
      marketCap: "$18.7M",
      holders: "12,458",
      volatility: "8.2%",
    });

    // Simulate changing stats
    const interval = setInterval(() => {
      const randomChange = () =>
        (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.05);

      setStats((prev) => {
        const volumeNum = parseFloat(
          prev.volume.replace("$", "").replace("M", "")
        );
        const mcapNum = parseFloat(
          prev.marketCap.replace("$", "").replace("M", "")
        );
        const holdersNum = parseInt(prev.holders.replace(",", ""));
        const volatilityNum = parseFloat(prev.volatility.replace("%", ""));

        return {
          volume: `$${(volumeNum * (1 + randomChange())).toFixed(1)}M`,
          marketCap: `$${(mcapNum * (1 + randomChange())).toFixed(1)}M`,
          holders: `${(
            holdersNum +
            Math.floor(Math.random() * 10) -
            3
          ).toLocaleString()}`,
          volatility: `${(volatilityNum * (1 + randomChange())).toFixed(1)}%`,
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border border-gray-800 bg-[#131722]/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
      <CardHeader className="border-b border-gray-800 bg-[#0f1218] p-4">
        <CardTitle className="text-lg font-medium text-white">
          Market Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-col"
        >
          <span className="text-xs text-gray-400 mb-1 flex items-center">
            <Activity className="h-3 w-3 mr-1" />
            24h Volume
          </span>
          <span className="text-lg font-bold text-white">{stats.volume}</span>
          <div className="flex items-center mt-1 text-xs text-emerald-400">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            +5.2%
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col"
        >
          <span className="text-xs text-gray-400 mb-1 flex items-center">
            <DollarSign className="h-3 w-3 mr-1" />
            Market Cap
          </span>
          <span className="text-lg font-bold text-white">
            {stats.marketCap}
          </span>
          <div className="flex items-center mt-1 text-xs text-rose-400">
            <ArrowDownRight className="h-3 w-3 mr-1" />
            -2.1%
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col"
        >
          <span className="text-xs text-gray-400 mb-1 flex items-center">
            <Users className="h-3 w-3 mr-1" />
            Holders
          </span>
          <span className="text-lg font-bold text-white">{stats.holders}</span>
          <div className="flex items-center mt-1 text-xs text-emerald-400">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            +0.8%
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col"
        >
          <span className="text-xs text-gray-400 mb-1 flex items-center">
            <Activity className="h-3 w-3 mr-1" />
            Volatility
          </span>
          <span className="text-lg font-bold text-white">
            {stats.volatility}
          </span>
          <div className="flex items-center mt-1 text-xs text-emerald-400">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            +1.3%
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default TradingStats;
