"use client";

import ZoraCandlestick from "@/components/ZoraCandlestick";
import { motion } from "framer-motion";
import TradingStats from "@/components/TradingStats";
import AIInsights from "@/components/AIInsights";
import WalletConnect from "@/components/WalletConnect";
import { useAccount } from "wagmi";
import { Badge } from "@/components/ui/badge";

export default function ZoraChartPage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0f172a] to-black text-white p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 flex items-center justify-center">
                <span className="text-white font-bold">Z</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">
                ZoraTrade AI
              </h1>
              {isConnected && (
                <Badge
                  variant="outline"
                  className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                >
                  Wallet Connected
                </Badge>
              )}
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-gray-400 mt-2"
            >
              Advanced market analysis powered by artificial intelligence
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-4 md:mt-0"
          >
            <WalletConnect />
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <ZoraCandlestick />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-col gap-6"
          >
            <TradingStats />
            <AIInsights />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
