"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Clock,
  Filter,
  LineChart,
  Rocket,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("individuals");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Neural network animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      connections: number[];
    }[] = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);
    const connectionDistance = 150;
    const colors = [
      "rgba(168, 85, 247, 0.5)",
      "rgba(139, 92, 246, 0.5)",
      "rgba(79, 70, 229, 0.5)",
    ];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        connections: [],
      });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fill();

        // Find connections
        p.connections = [];
        for (let j = 0; j < particles.length; j++) {
          if (i === j) continue;
          const p2 = particles[j];
          const distance = Math.sqrt(
            Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2)
          );
          if (distance < connectionDistance) {
            p.connections.push(j);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${
              1 - distance / connectionDistance
            })`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden">
      {/* Neural network background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {/* Gradient overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black opacity-80 pointer-events-none z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-purple-900/30 backdrop-blur-sm bg-black/50">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-purple-500" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
              ZoraPredict
            </span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-zinc-400 hover:text-purple-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-zinc-400 hover:text-purple-400 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-zinc-400 hover:text-purple-400 transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="bg-white text-black hover:bg-zinc-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 cursor-pointer"
            >
              Login
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 relative overflow-hidden group cursor-pointer">
              <span className="relative z-10">Sign Up</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-4 py-12 md:py-24 lg:py-32 flex flex-col items-center text-center space-y-8 border-b border-purple-900/30">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-block px-3 py-1 rounded-full bg-purple-900/30 text-purple-400 text-sm font-medium mb-4">
              AI-Powered Virality Prediction
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400">
                Predict
              </span>{" "}
              the Next Viral{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400">
                Zora
              </span>{" "}
              Content
            </h1>
            <p className="text-xl text-zinc-400 max-w-[700px] mx-auto">
              Our advanced AI analyzes patterns, engagement metrics, and
              historical data to predict which Zora content will go viral before
              anyone else knows.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="relative overflow-hidden group h-12 px-8 text-center cursor-pointer">
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
            </Button>
            <Button
              variant="outline"
              className="border-purple-700/50 h-12 px-8 hover:bg-purple-900/20 transition-all duration-300 cursor-pointer"
            >
              View Demo
            </Button>
          </div>

          {/* Animated dashboard preview */}
          <div className="relative w-full max-w-4xl mt-12 rounded-lg overflow-hidden border border-purple-900/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 z-10"></div>
            <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg z-0 animate-pulse"></div>
            <div className="relative z-10 bg-zinc-900/90 p-1 rounded-lg">
              <img
                src="/dashboard.svg?height=600&width=1200"
                width={1200}
                height={600}
                alt="ZoraPredict AI Dashboard Preview"
                className="w-full object-cover rounded-md"
              />

              {/* Overlay with AI elements */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="absolute top-4 right-4 bg-purple-900/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  AI Prediction Active
                </div>

                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm p-2 rounded-lg border border-purple-500/30">
                  <div className="text-xs text-left">
                    <div className="text-purple-400 font-medium">
                      Virality Score
                    </div>
                    <div className="text-white text-lg font-bold">87.6%</div>
                    <div className="text-green-400 text-xs">
                      +23.4% above average
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl mt-8">
            <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-900/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-xs text-zinc-400">Prediction Accuracy</div>
            </div>
            <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-900/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">2.5x</div>
              <div className="text-xs text-zinc-400">Average ROI</div>
            </div>
            <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-900/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">10K+</div>
              <div className="text-xs text-zinc-400">Active Traders</div>
            </div>
            <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-900/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">5M+</div>
              <div className="text-xs text-zinc-400">Predictions Made</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="px-4 py-12 md:py-24 border-b border-purple-900/30 relative"
        >
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-radial from-purple-900/20 to-transparent"></div>
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-purple-900/30 text-purple-400 text-sm font-medium mb-4">
                Powerful Capabilities
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                AI-Powered Features
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Our neural network analyzes thousands of data points to give you
                the edge in the Zora ecosystem.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/0 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                    Virality Prediction
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Our AI analyzes 50+ factors to predict content virality with
                    98% accuracy.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/0 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Filter className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                    Neural Filtering
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Advanced neural network filters content based on
                    customizable virality thresholds.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/0 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                    Quantum Trading
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Set up automated trading based on AI-predicted virality
                    thresholds.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/0 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                    Real-Time Analysis
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Millisecond scanning of new posts with our distributed
                    neural network.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/0 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                    Sentiment Engine
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    NLP-powered sentiment analysis of comments and social
                    signals.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/0 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Rocket className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                    Predictive Scheduling
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Schedule trades with our AI that predicts optimal execution
                    times.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="px-4 py-12 md:py-24 border-b border-purple-900/30 relative"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-radial from-indigo-900/10 to-transparent"></div>
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-purple-900/30 text-purple-400 text-sm font-medium mb-4">
                The Technology
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                Neural Network Process
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Our proprietary AI uses advanced neural networks to predict
                content virality with unprecedented accuracy.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
              {/* Connection lines */}
              {/* <div className="hidden md:block absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500"></div> */}

              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-6 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <LineChart className="h-10 w-10 text-white relative z-10" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl z-0 blur-sm opacity-70 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-purple-900/30 animate-pulse"></div>
                <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                  1. Data Collection
                </h3>
                <p className="text-zinc-400">
                  Our quantum neural network continuously scans the Zora
                  ecosystem, collecting millions of data points.
                </p>
              </div>

              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-6 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <BrainCircuit className="h-10 w-10 text-white relative z-10" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl z-0 blur-sm opacity-70 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-indigo-900/30 animate-pulse delay-300"></div>
                <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                  2. Neural Processing
                </h3>
                <p className="text-zinc-400">
                  Our proprietary AI analyzes patterns, engagement metrics, and
                  historical data through 17 neural layers.
                </p>
              </div>

              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-6 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Zap className="h-10 w-10 text-white relative z-10" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl z-0 blur-sm opacity-70 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-purple-900/30 animate-pulse delay-700"></div>
                <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                  3. Predictive Output
                </h3>
                <p className="text-zinc-400">
                  Get real-time virality scores and automated trading signals
                  with 98% prediction accuracy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="px-4 py-12 md:py-24 border-b border-purple-900/30 relative"
        >
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-radial from-purple-900/20 to-transparent"></div>
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-purple-900/30 text-purple-400 text-sm font-medium mb-4">
                Pricing Plans
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                Choose Your Neural Network
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Select the AI power level that best fits your trading strategy
                and goals.
              </p>
            </div>

            <Tabs
              defaultValue="individuals"
              className="max-w-4xl mx-auto"
              onValueChange={setActiveTab}
            >
              <div className="flex justify-center mb-8">
                <TabsList className="bg-zinc-900/50 backdrop-blur-sm border border-purple-900/30">
                  <TabsTrigger
                    value="individuals"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                  >
                    Individual Traders
                  </TabsTrigger>
                  <TabsTrigger
                    value="teams"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                  >
                    Trading Teams
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="individuals" className="space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/0 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader>
                      <CardTitle className="text-white">Neural Basic</CardTitle>
                      <div className="mt-4 flex items-baseline text-zinc-100">
                        <span className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                          $29
                        </span>
                        <span className="ml-1 text-sm text-zinc-400">
                          /month
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span>{" "}
                          Virality predictions
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span> Basic
                          neural filtering
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span> 100
                          predictions/day
                        </li>
                        <li className="flex items-center text-zinc-500">
                          <span className="mr-2">✗</span> Quantum trading
                        </li>
                        <li className="flex items-center text-zinc-500">
                          <span className="mr-2">✗</span> Sentiment engine
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-white hover:bg-zinc-700 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-300">
                        Get Started
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-500 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -inset-[0.5px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg z-0 animate-pulse"></div>
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                      MOST POPULAR
                    </div>
                    <CardHeader>
                      <CardTitle className="text-white">Neural Pro</CardTitle>
                      <div className="mt-4 flex items-baseline text-zinc-100">
                        <span className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                          $79
                        </span>
                        <span className="ml-1 text-sm text-zinc-400">
                          /month
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span>{" "}
                          Advanced virality predictions
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span> Neural
                          filtering
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span>{" "}
                          Unlimited predictions
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span> Basic
                          quantum trading
                        </li>
                        <li className="flex items-center text-zinc-500">
                          <span className="mr-2">✗</span> Sentiment engine
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full relative overflow-hidden group">
                        <span className="relative z-10">Get Started</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"></span>
                        <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/0 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader>
                      <CardTitle className="text-white">
                        Neural Enterprise
                      </CardTitle>
                      <div className="mt-4 flex items-baseline text-zinc-100">
                        <span className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                          $199
                        </span>
                        <span className="ml-1 text-sm text-zinc-400">
                          /month
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span> Quantum
                          virality predictions
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span>{" "}
                          Advanced neural filtering
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span>{" "}
                          Unlimited predictions
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span>{" "}
                          Advanced quantum trading
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span> Full
                          sentiment engine
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-white hover:bg-zinc-700 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-300">
                        Get Started
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="teams" className="space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/0 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader>
                      <CardTitle className="text-white">Team Neural</CardTitle>
                      <div className="mt-4 flex items-baseline text-zinc-100">
                        <span className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                          $99
                        </span>
                        <span className="ml-1 text-sm text-zinc-400">
                          /month
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-zinc-400">
                        Up to 5 team members
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span>{" "}
                          Virality predictions
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span> Basic
                          neural filtering
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span> 500
                          predictions/day
                        </li>
                        <li className="flex items-center text-zinc-500">
                          <span className="mr-2">✗</span> Quantum trading
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-zinc-800 hover:bg-zinc-700 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-300">
                        Get Started
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-500 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -inset-[0.5px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg z-0 animate-pulse"></div>
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                      MOST POPULAR
                    </div>
                    <CardHeader>
                      <CardTitle className="text-white">Team Pro</CardTitle>
                      <div className="mt-4 flex items-baseline text-zinc-100">
                        <span className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                          $249
                        </span>
                        <span className="ml-1 text-sm text-zinc-400">
                          /month
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-zinc-400">
                        Up to 10 team members
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span>{" "}
                          Advanced virality predictions
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span> Neural
                          filtering
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span>{" "}
                          Unlimited predictions
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span> Basic
                          quantum trading
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full relative overflow-hidden group">
                        <span className="relative z-10">Get Started</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"></span>
                        <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-zinc-900/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/0 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader>
                      <CardTitle className="text-white">
                        Team Enterprise
                      </CardTitle>
                      <div className="mt-4 flex items-baseline text-zinc-100">
                        <span className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                          $499
                        </span>
                        <span className="ml-1 text-sm text-zinc-400">
                          /month
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-zinc-400">
                        Unlimited team members
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span> Quantum
                          virality predictions
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span>{" "}
                          Advanced neural filtering
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span>{" "}
                          Unlimited predictions
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span>{" "}
                          Advanced quantum trading
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span> Full
                          sentiment engine
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2 text-green-500">✓</span> Neural
                          API access
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-zinc-800 hover:bg-zinc-700 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-300">
                        Get Started
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-12 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-indigo-900/5 to-black"></div>
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-md rounded-2xl p-8 md:p-12 text-center border border-purple-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400">
                Harness the Power of AI Prediction
              </h2>
              <p className="text-zinc-300 mb-8 max-w-2xl mx-auto">
                Join thousands of traders who are already leveraging our neural
                network to predict viral Zora content before anyone else.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="relative overflow-hidden group h-12 px-8">
                  <span className="relative z-10">Start Free Trial</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-500/30 h-12 px-8 hover:bg-purple-900/20 transition-all duration-300"
                >
                  Schedule Neural Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-6 md:py-8 border-t border-purple-900/30 backdrop-blur-sm bg-black/50">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold mb-4 text-white">Product</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-purple-400 transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-purple-400 transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-purple-400 transition-colors"
                    >
                      Neural API
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-purple-400 transition-colors"
                    >
                      Integrations
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-white">Resources</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-purple-400 transition-colors"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-purple-400 transition-colors"
                    >
                      Neural Guides
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-purple-400 transition-colors"
                    >
                      AI Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-purple-400 transition-colors"
                    >
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-white">Company</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-purple-400 transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-purple-400 transition-colors"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-purple-400 transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-purple-400 transition-colors"
                    >
                      Partners
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-white">Legal</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-purple-400 transition-colors"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-purple-400 transition-colors"
                    >
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-purple-400 transition-colors"
                    >
                      Security
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-purple-900/30 flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <BrainCircuit className="h-5 w-5 text-purple-500" />
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                  ZoraPredict
                </span>
              </div>
              <p className="text-sm text-zinc-500">
                © 2025 ZoraPredict. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
