"use client";

/**
 * @fileoverview Dashboard component providing AI-powered predictions, analytics, and trading capabilities.
 * Implements a modern, responsive interface with real-time data visualisation.
 *
 * @todo Implement proper error handling for API calls
 * @todo Add loading states for data fetching
 * @todo Consider adding pagination for predictions table
 */

import { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  BellRing,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  TrendingUp,
  ChevronRight,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

// Custom Components
import NeuralNetworkAnimation from "@/components/NeuralNetworkAnimation";
import MobileSidebar from "@/components/MobileSidebar";
import DesktopSidebar from "@/components/DesktopSidebar";
import WalletConnect from "@/components/WalletConnect";
import TradeModal from "@/components/TradeModal";

import axios from "axios";
import { useAccount } from "wagmi";
import Link from "next/link";

// Animation constants for framer-motion
const ANIMATION_VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  },
};

// Neural network background visualisation
const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle canvas resizing
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // particle configuration
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
    }> = [];

    const PARTICLE_COUNT = Math.min(Math.floor(window.innerWidth / 20), 70);
    const CONNECTION_DISTANCE = 150;
    const COLOURS = [
      "rgba(0, 132, 255, 0.4)", // Primary blue
      "rgba(92, 221, 255, 0.4)", // Light blue
      "rgba(0, 180, 216, 0.4)", // Cyan
    ];

    // initialise particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
      });
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and render particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = COLOURS[Math.floor(Math.random() * COLOURS.length)];
        ctx.fill();

        // Draw connections between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const otherParticle = particles[j];
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) +
              Math.pow(particle.y - otherParticle.y, 2)
          );

          if (distance < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(0, 132, 255, ${
              0.2 - (distance / CONNECTION_DISTANCE) * 0.15
            })`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      // Activity indicator
      ctx.beginPath();
      ctx.arc(canvas.width - 10, canvas.height - 10, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 132, 255, 0.7)";
      ctx.fill();
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-60 z-1"
      style={{ display: "block", position: "absolute" }}
    />
  );
};

// Sample data for demonstration
const MOCK_VIRALITY_DATA = [
  { day: "Mon", score: 50, confidence: 85 },
  { day: "Tue", score: 60, confidence: 88 },
  { day: "Wed", score: 70, confidence: 92 },
  { day: "Thu", score: 85, confidence: 95 },
  { day: "Fri", score: 75, confidence: 90 },
  { day: "Sat", score: 90, confidence: 97 },
  { day: "Sun", score: 95, confidence: 98 },
];

interface Prediction {
  id: string;
  type: string;
  prediction: number;
  confidence: number;
  timeToViral: number;
  status: string;
  statusColor: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function Dashboard() {
  const { isConnected } = useAccount();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [recentPredictions, setRecentPredictions] = useState<Prediction[]>([]);
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState({
    address: "",
    name: "",
    predictionScore: 0,
  });

  // Fetch predictions from API
  const fetchPredictions = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/predict/get-total-similarity`
      );

      if (response.data?.predictions) {
        setRecentPredictions(response.data.predictions);
      }
    } catch (error) {
      console.error("Failed to fetch predictions:", error);
      // TODO: Implement proper error handling
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const handleTradeModal = (
    coinAddress: string,
    name = "Unknown",
    predictionScore = 0
  ) => {
    setSelectedCoin({
      address: coinAddress,
      name,
      predictionScore,
    });
    setTradeModalOpen(true);
  };

  // Main render
  return (
    <div className="flex min-h-screen flex-col bg-snow">
      <main className="flex-1 flex">
        {/* Mobile sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className="w-64 p-0 bg-white border-r border-ghost"
          >
            <MobileSidebar />
          </SheetContent>
        </Sheet>

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-ghost bg-white">
          <DesktopSidebar />
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col bg-snow">
          {/* Header */}
          <header className="h-16 border-b border-ghost bg-white/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden mr-2 text-charcoal"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-stone" />
                <Input
                  placeholder="Search predictions..."
                  className="pl-8 bg-white/50 border-ghost focus:border-electric text-charcoal text-sm rounded-full h-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-charcoal"
                    >
                      <BellRing className="h-5 w-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-electric rounded-full"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Badge
                variant="outline"
                className="bg-sky/20 text-electric border-electric/30 px-3 py-1 flex items-center gap-1.5 rounded-full"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                AI Active
              </Badge>

              <WalletConnect />
            </div>
          </header>

          {/* Main dashboard content */}
          <div className="flex-1 overflow-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              className="container mx-auto py-6 px-4 md:px-6"
            >
              <motion.div
                variants={ANIMATION_VARIANTS.fadeUp}
                className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
              >
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold font-display">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric to-blue-500">
                      Dashboard
                    </span>
                  </h1>
                  <p className="text-stone mt-1">
                    Welcome back, your AI predictions are ready.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <Button className="rounded-full bg-electric hover:bg-electric/90 gap-2 px-4">
                    <span>New Prediction</span>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>

              {/* Dashboard tabs */}
              <Tabs
                defaultValue="overview"
                className="mb-6"
                onValueChange={setActiveTab}
              >
                <TabsList className="bg-white/50 backdrop-blur-sm border border-ghost p-1 rounded-full">
                  <TabsTrigger
                    value="overview"
                    className="rounded-full data-[state=active]:bg-electric data-[state=active]:text-white"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="predictions"
                    className="rounded-full data-[state=active]:bg-electric data-[state=active]:text-white"
                  >
                    Predictions
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="rounded-full data-[state=active]:bg-electric data-[state=active]:text-white"
                  >
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="rounded-full data-[state=active]:bg-electric data-[state=active]:text-white"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Stats cards */}
                  <motion.div
                    variants={ANIMATION_VARIANTS.staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                  >
                    <motion.div variants={ANIMATION_VARIANTS.fadeUp}>
                      <Card className="bg-white/90 backdrop-blur-sm border-ghost hover:border-electric/50 transition-all duration-300 rounded-xl overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-stone">
                            Total Predictions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-charcoal">
                            5,248
                          </div>
                          <p className="text-xs text-mint flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +12.5% from last month
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={ANIMATION_VARIANTS.fadeUp}>
                      <Card className="bg-white/90 backdrop-blur-sm border-ghost hover:border-electric/50 transition-all duration-300 rounded-xl overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-stone">
                            Accuracy Rate
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-charcoal">
                            98.2%
                          </div>
                          <p className="text-xs text-mint flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +2.3% from last month
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={ANIMATION_VARIANTS.fadeUp}>
                      <Card className="bg-white/90 backdrop-blur-sm border-ghost hover:border-electric/50 transition-all duration-300 rounded-xl overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-stone">
                            Average ROI
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-charcoal">
                            2.7x
                          </div>
                          <p className="text-xs text-mint flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +0.4x from last month
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={ANIMATION_VARIANTS.fadeUp}>
                      <Card className="bg-white/90 backdrop-blur-sm border-ghost hover:border-electric/50 transition-all duration-300 rounded-xl overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-stone">
                            Active Signals
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-charcoal">
                            28
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="w-2 h-2 bg-mint rounded-full mr-1"></span>
                            <p className="text-xs text-stone">Live</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>

                  {/* Main chart */}
                  <motion.div
                    variants={ANIMATION_VARIANTS.fadeUp}
                    className="relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-sky/5"></div>
                    <NeuralBackground />
                    <Card className="bg-white/90 backdrop-blur-sm border-ghost relative z-10 rounded-xl overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-electric to-blue-500 font-bold">
                              Virality Predictions
                            </CardTitle>
                            <CardDescription>Last 7 days</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-charcoal"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white border-ghost rounded-lg"
                            >
                              <DropdownMenuItem className="hover:bg-sky/20 cursor-pointer text-charcoal">
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-sky/20 cursor-pointer text-charcoal">
                                Export Data
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-ghost" />
                              <DropdownMenuItem className="hover:bg-sky/20 cursor-pointer text-charcoal">
                                Refresh
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={MOCK_VIRALITY_DATA}
                              margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 0,
                              }}
                            >
                              <defs>
                                <linearGradient
                                  id="colorScore"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#0E78FF"
                                    stopOpacity={0.3}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#0E78FF"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#E5E7EB"
                                vertical={false}
                              />
                              <XAxis
                                dataKey="day"
                                tick={{ fill: "#6B7280", fontSize: 12 }}
                                axisLine={{ stroke: "#E5E7EB" }}
                                tickLine={{ stroke: "#E5E7EB" }}
                              />
                              <YAxis
                                tick={{ fill: "#6B7280", fontSize: 12 }}
                                axisLine={{ stroke: "#E5E7EB" }}
                                tickLine={{ stroke: "#E5E7EB" }}
                              />
                              <RechartsTooltip
                                contentStyle={{
                                  backgroundColor: "white",
                                  borderColor: "#0E78FF",
                                  borderRadius: "8px",
                                  color: "#333",
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#0E78FF"
                                fillOpacity={1}
                                fill="url(#colorScore)"
                                strokeWidth={3}
                              />
                              <Line
                                type="monotone"
                                dataKey="confidence"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                dot={{ fill: "#3B82F6", r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Two column layout for bottom section */}
                  <motion.div
                    variants={ANIMATION_VARIANTS.fadeUp}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    {/* Recent predictions table */}
                    <Card className="bg-white/90 backdrop-blur-sm border-ghost lg:col-span-2 rounded-xl overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-electric to-blue-500 font-bold">
                            Recent Predictions
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-electric hover:text-electric/80 hover:bg-sky rounded-full"
                          >
                            View All <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-ghost">
                                <th className="text-left py-3 px-2 text-xs font-medium text-stone">
                                  Address
                                </th>
                                <th className="text-left py-3 px-2 text-xs font-medium text-stone">
                                  Type
                                </th>
                                <th className="text-left py-3 px-2 text-xs font-medium text-stone">
                                  Prediction
                                </th>
                                <th className="text-left py-3 px-2 text-xs font-medium text-stone">
                                  Confidence
                                </th>
                                <th className="text-left py-3 px-2 text-xs font-medium text-stone">
                                  Status
                                </th>
                                <th className="text-left py-3 px-2 text-xs font-medium text-stone">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {recentPredictions
                                .filter(
                                  (prediction) =>
                                    prediction.prediction &&
                                    prediction.timeToViral
                                )
                                .map((prediction, index) => (
                                  <tr
                                    key={prediction.id}
                                    className={`border-b border-ghost/50 hover:bg-sky/10 transition-colors ${
                                      index === recentPredictions.length - 1
                                        ? "border-b-0"
                                        : ""
                                    }`}
                                  >
                                    <td className="py-3 px-2 text-sm text-charcoal">
                                      {prediction.id}
                                    </td>
                                    <td className="py-3 px-2 text-sm text-charcoal">
                                      {prediction.type}
                                    </td>
                                    <td
                                      className={`py-3 px-2 text-sm ${
                                        prediction.prediction > 60
                                          ? "text-mint"
                                          : prediction.prediction > 50
                                          ? "text-yellow-500"
                                          : "text-red-500"
                                      }`}
                                    >
                                      {prediction.prediction.toFixed(2)}%
                                    </td>
                                    <td className="py-3 px-2 text-sm text-charcoal">
                                      {prediction.confidence}%
                                    </td>
                                    <td className="py-3 px-2">
                                      <Badge
                                        variant="outline"
                                        className={`rounded-full ${
                                          prediction.statusColor === "green"
                                            ? "bg-seafoam/20 text-mint border-mint/30"
                                            : prediction.statusColor ===
                                              "orange"
                                            ? "bg-orange-100 text-orange-600 border-orange-300"
                                            : "bg-red-100 text-red-600 border-red-300"
                                        }`}
                                      >
                                        {prediction.status}
                                      </Badge>
                                    </td>
                                    <td className="py-3 px-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-full bg-sky/20 text-electric border-electric/30 hover:bg-sky"
                                        onClick={() =>
                                          handleTradeModal(
                                            prediction.id,
                                            `Coin ${index + 1}`,
                                            prediction.prediction
                                          )
                                        }
                                      >
                                        Trade
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Right column with two cards */}
                    <div className="space-y-6">
                      {/* Current prediction card */}
                      <Card className="bg-white/90 backdrop-blur-sm border-ghost rounded-xl overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-electric to-blue-500 font-bold">
                            Current Prediction
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-stone">Virality Score</span>
                            <span className="font-bold text-charcoal">
                              87.6%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-stone">Confidence</span>
                            <span className="font-bold text-charcoal">
                              98.2%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-stone">Time to Viral</span>
                            <span className="font-bold text-electric">
                              4.2h
                            </span>
                          </div>
                          <div className="pt-2">
                            <Button
                              className="w-full rounded-full bg-electric hover:bg-electric/90"
                              onClick={() => {
                                if (recentPredictions.length > 0) {
                                  handleTradeModal(
                                    recentPredictions[0].id,
                                    `Top Prediction`,
                                    recentPredictions[0].prediction
                                  );
                                }
                              }}
                            >
                              Execute Trade{" "}
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Neural processing card */}
                      <Card className="bg-white/90 backdrop-blur-sm border-ghost relative overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-sky/5"></div>
                        <NeuralBackground />
                        <CardHeader className="pb-2 relative z-10">
                          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-electric to-blue-500 font-bold">
                            Neural Processing
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          <NeuralNetworkAnimation />
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-stone">Processing Power</span>
                            <span className="font-bold text-charcoal">92%</span>
                          </div>
                          <div className="w-full bg-sky/30 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-gradient-to-r from-electric to-blue-500 h-1.5 rounded-full"
                              style={{ width: "92%" }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="predictions" className="space-y-6">
                  <motion.div variants={ANIMATION_VARIANTS.fadeUp}>
                    <Card className="bg-white/90 backdrop-blur-sm border-ghost rounded-xl overflow-hidden">
                      <CardHeader>
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-electric to-blue-500 font-bold">
                          Predictions Dashboard
                        </CardTitle>
                        <CardDescription>
                          Manage and analyse your content predictions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-stone">
                          This tab would contain a more detailed view of all
                          predictions, filtering options, and advanced
                          analytics.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <motion.div variants={ANIMATION_VARIANTS.fadeUp}>
                    <Card className="bg-white/90 backdrop-blur-sm border-ghost rounded-xl overflow-hidden">
                      <CardHeader>
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-electric to-blue-500 font-bold">
                          Analytics Dashboard
                        </CardTitle>
                        <CardDescription>
                          Detailed performance metrics and insights
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-stone">
                          This tab would contain advanced charts, performance
                          metrics, and historical data analysis.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <motion.div variants={ANIMATION_VARIANTS.fadeUp}>
                    <Card className="bg-white/90 backdrop-blur-sm border-ghost rounded-xl overflow-hidden">
                      <CardHeader>
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-electric to-blue-500 font-bold">
                          Account Settings
                        </CardTitle>
                        <CardDescription>
                          Manage your account and preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-stone">
                          This tab would contain account settings, notification
                          preferences, and API configuration options.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
              {/* Trade Modal */}
              <TradeModal
                isOpen={tradeModalOpen}
                onClose={() => setTradeModalOpen(false)}
                coinAddress={selectedCoin.address}
                coinName={selectedCoin.name}
                predictionScore={selectedCoin.predictionScore}
              />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
