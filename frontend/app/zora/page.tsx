"use client";

import { useEffect, useState } from "react";
import {
  BellRing,
  LogOut,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";

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
  DropdownMenuLabel,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import NeuralNetworkAnimation from "@/components/NeuralNetworkAnimation";
import MobileSidebar from "@/components/MobileSidebar";
import DesktopSidebar from "@/components/DesktopSidebar";
import axios from "axios";

// Sample data for charts
const viralityData = [
  { day: "Mon", score: 50, confidence: 85 },
  { day: "Tue", score: 60, confidence: 88 },
  { day: "Wed", score: 70, confidence: 92 },
  { day: "Thu", score: 85, confidence: 95 },
  { day: "Fri", score: 75, confidence: 90 },
  { day: "Sat", score: 90, confidence: 97 },
  { day: "Sun", score: 95, confidence: 98 },
];

// const recentPredictions = [
//   {
//     id: "ZOR-8291",
//     type: "Image",
//     prediction: 87.6,
//     confidence: 98.2,
//     timeToViral: 4.2,
//     status: "Active",
//     statusColor: "green",
//   },
//   {
//     id: "ZOR-8290",
//     type: "Video",
//     prediction: 92.3,
//     confidence: 97.5,
//     timeToViral: 2.8,
//     status: "Active",
//     statusColor: "green",
//   },
//   {
//     id: "ZOR-8289",
//     type: "Collection",
//     prediction: 68.5,
//     confidence: 85.1,
//     timeToViral: 8.4,
//     status: "Watching",
//     statusColor: "orange",
//   },
//   {
//     id: "ZOR-8288",
//     type: "Image",
//     prediction: 45.2,
//     confidence: 76.8,
//     timeToViral: 12.6,
//     status: "Low Potential",
//     statusColor: "red",
//   },
//   {
//     id: "ZOR-8287",
//     type: "Video",
//     prediction: 79.4,
//     confidence: 91.3,
//     timeToViral: 5.7,
//     status: "Active",
//     statusColor: "green",
//   },
//   {
//     id: "ZOR-8286",
//     type: "Collection",
//     prediction: 83.1,
//     confidence: 94.7,
//     timeToViral: 3.9,
//     status: "Active",
//     statusColor: "green",
//   },
// ];

type Prediction = {
  id: string;
  type: string;
  prediction: number;
  confidence: number;
  timeToViral: number;
  status: string;
  statusColor: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [recentPredictions, setRecentPredictions] = useState<Prediction[]>([]);

  const fetchPrediction = async () => {
    try {
      console.log(API_BASE_URL);
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/predict/get-total-similarity`
      );

      if (res.data && res.data.predictions) {
        setRecentPredictions(res.data.predictions);
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-zinc-900 border-r border-purple-900/30"
        >
          <MobileSidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-purple-900/30 bg-zinc-900/80 backdrop-blur-sm">
        <DesktopSidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-purple-900/30 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-between px-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden mr-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search predictions..."
                className="pl-8 bg-zinc-800/50 border-zinc-700 focus:border-purple-500 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <BellRing className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Badge
              variant="outline"
              className="bg-purple-900/20 text-purple-400 border-purple-500/30 px-3 py-1 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              AI Active
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback className="bg-purple-900/50 text-white">
                      JP
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-zinc-900 border-purple-900/30"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-purple-900/30" />
                <DropdownMenuItem className="hover:bg-purple-900/20 cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-purple-900/20 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-purple-900/20 cursor-pointer">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-purple-900/30" />
                <DropdownMenuItem className="hover:bg-purple-900/20 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main dashboard content */}
        <main className="flex-1 overflow-auto bg-gradient-to-b from-black to-zinc-900">
          <div className="container mx-auto py-6 px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-zinc-400">
                  Welcome back, your AI predictions are ready.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <Button className="bg-purple-600 hover:bg-purple-700 relative overflow-hidden group">
                  <span className="relative z-10">New Prediction</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <Plus className="ml-2 h-4 w-4 relative z-10" />
                </Button>
              </div>
            </div>

            {/* Dashboard tabs */}
            <Tabs
              defaultValue="overview"
              className="mb-6"
              onValueChange={setActiveTab}
            >
              <TabsList className="bg-zinc-900/50 backdrop-blur-sm border border-purple-900/30 p-1">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="predictions"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                >
                  Predictions
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/30 hover:border-purple-500/50 transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-zinc-400">
                        Total Predictions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">5,248</div>
                      <p className="text-xs text-green-400 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12.5% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/30 hover:border-purple-500/50 transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-zinc-400">
                        Accuracy Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">98.2%</div>
                      <p className="text-xs text-green-400 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +2.3% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/30 hover:border-purple-500/50 transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-zinc-400">
                        Average ROI
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2.7x</div>
                      <p className="text-xs text-green-400 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +0.4x from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/30 hover:border-purple-500/50 transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-zinc-400">
                        Active Signals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">28</div>
                      <div className="flex items-center mt-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                        <p className="text-xs text-zinc-400">Live</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main chart */}
                <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Virality Predictions</CardTitle>
                        <CardDescription>Last 7 days</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-zinc-900 border-purple-900/30"
                        >
                          <DropdownMenuItem className="hover:bg-purple-900/20 cursor-pointer">
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-purple-900/20 cursor-pointer">
                            Export Data
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-purple-900/30" />
                          <DropdownMenuItem className="hover:bg-purple-900/20 cursor-pointer">
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
                          data={viralityData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
                                stopColor="#A855F7"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#A855F7"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#2A2A45"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="day"
                            tick={{ fill: "#8888AA", fontSize: 12 }}
                            axisLine={{ stroke: "#2A2A45" }}
                            tickLine={{ stroke: "#2A2A45" }}
                          />
                          <YAxis
                            tick={{ fill: "#8888AA", fontSize: 12 }}
                            axisLine={{ stroke: "#2A2A45" }}
                            tickLine={{ stroke: "#2A2A45" }}
                          />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "#191932",
                              borderColor: "#A855F7",
                              borderRadius: "8px",
                              color: "white",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#A855F7"
                            fillOpacity={1}
                            fill="url(#colorScore)"
                            strokeWidth={3}
                          />
                          <Line
                            type="monotone"
                            dataKey="confidence"
                            stroke="#6366F1"
                            strokeWidth={2}
                            dot={{ fill: "#6366F1", r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Two column layout for bottom section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent predictions table */}
                  <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/30 lg:col-span-2">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Recent Predictions</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-400 hover:text-purple-300"
                        >
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-purple-900/30">
                              <th className="text-left py-3 px-2 text-xs font-medium text-zinc-400">
                                Content ID
                              </th>
                              <th className="text-left py-3 px-2 text-xs font-medium text-zinc-400">
                                Type
                              </th>
                              <th className="text-left py-3 px-2 text-xs font-medium text-zinc-400">
                                Prediction
                              </th>
                              <th className="text-left py-3 px-2 text-xs font-medium text-zinc-400">
                                Confidence
                              </th>
                              <th className="text-left py-3 px-2 text-xs font-medium text-zinc-400">
                                Time to Viral
                              </th>
                              <th className="text-left py-3 px-2 text-xs font-medium text-zinc-400">
                                Status
                              </th>
                              <th className="text-left py-3 px-2 text-xs font-medium text-zinc-400">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentPredictions.map((prediction, index) => (
                              <tr
                                key={prediction.id}
                                className={`border-b border-purple-900/20 hover:bg-purple-900/10 transition-colors ${
                                  index === recentPredictions.length - 1
                                    ? "border-b-0"
                                    : ""
                                }`}
                              >
                                <td className="py-3 px-2 text-sm">
                                  {prediction.id}
                                </td>
                                <td className="py-3 px-2 text-sm">
                                  {prediction.type}
                                </td>
                                <td
                                  className={`py-3 px-2 text-sm ${
                                    prediction.prediction > 80
                                      ? "text-green-400"
                                      : prediction.prediction > 60
                                      ? "text-yellow-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {prediction.prediction}%
                                </td>
                                <td className="py-3 px-2 text-sm">
                                  {prediction.confidence}%
                                </td>
                                <td className="py-3 px-2 text-sm text-fuchsia-400">
                                  {prediction.timeToViral}h
                                </td>
                                <td className="py-3 px-2">
                                  <Badge
                                    variant="outline"
                                    className={`
                                      ${
                                        prediction.statusColor === "green"
                                          ? "bg-green-900/20 text-green-400 border-green-500/30"
                                          : prediction.statusColor === "orange"
                                          ? "bg-orange-900/20 text-orange-400 border-orange-500/30"
                                          : "bg-red-900/20 text-red-400 border-red-500/30"
                                      }
                                    `}
                                  >
                                    {prediction.status}
                                  </Badge>
                                </td>
                                <td className="py-3 px-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-indigo-900/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-900/30"
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
                    <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/30">
                      <CardHeader className="pb-2">
                        <CardTitle>Current Prediction</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Virality Score</span>
                          <span className="font-bold text-white">87.6%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Confidence</span>
                          <span className="font-bold text-white">98.2%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Time to Viral</span>
                          <span className="font-bold text-fuchsia-400">
                            4.2h
                          </span>
                        </div>
                        <div className="pt-2">
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                            Execute Trade
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Neural processing card */}
                    <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/30">
                      <CardHeader className="pb-2">
                        <CardTitle>Neural Processing</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <NeuralNetworkAnimation />
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-zinc-400">
                            Processing Power
                          </span>
                          <span className="font-bold text-white">92%</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full"
                            style={{ width: "92%" }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="predictions" className="space-y-6">
                <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Predictions Dashboard</CardTitle>
                    <CardDescription>
                      Manage and analyze your content predictions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-400">
                      This tab would contain a more detailed view of all
                      predictions, filtering options, and advanced analytics.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                    <CardDescription>
                      Detailed performance metrics and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-400">
                      This tab would contain advanced charts, performance
                      metrics, and historical data analysis.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-400">
                      This tab would contain account settings, notification
                      preferences, and API configuration options.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}