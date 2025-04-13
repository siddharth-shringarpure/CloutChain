"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart2,
  Brain,
  ChevronRight,
  Clock,
  Flame,
  LineChart,
  Lock,
  Rocket,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/custom/Header";
import { Footer } from "@/components/custom/Footer";
import { ScrollToTop } from "@/components/custom/ScrollToTop";

/**
 * @fileoverview Main landing page component showcasing the platform's key features
 * and functionality. Implements animated sections and responsive design.
 */

const FADE_UP = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const FADE_IN = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// Neural Network Background component
const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Particle settings
    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
    }[] = [];

    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 70);
    const connectionDistance = 150;
    const colors = [
      "rgba(0, 132, 255, 0.4)",
      "rgba(92, 221, 255, 0.4)",
      "rgba(0, 180, 216, 0.4)",
    ];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
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

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distance = Math.sqrt(
            Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2)
          );

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 132, 255, ${
              0.2 - (distance / connectionDistance) * 0.15
            })`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Optional: Add a small indicator dot in bottom right to confirm the canvas is active
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

// TODO: Consider extracting animation constants to a separate config file
// TODO: Add proper analytics tracking for user interactions
// TODO: Implement proper error boundaries around motion components

/**
 * Home component serving as the main landing page
 * @returns {React.ReactNode} The rendered home page
 */
export default function Home(): React.ReactNode {
  const router = useRouter();
  const [coinLink, setCoinLink] = useState("");
  const [email, setEmail] = useState("");

  const handleCoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/dashboard";
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero section with main value proposition */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={FADE_UP}
          className="section bg-snow py-8 md:py-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-sky/5"></div>
          <NeuralBackground />
          <div className="container-tight px-4 md:px-6 relative z-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div variants={FADE_IN} className="space-y-6 md:space-y-8">
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric to-blue-500">
                    Predict
                  </span>{" "}
                  the Next Viral Zora Content
                </h1>
                <p className="text-lg md:text-xl text-stone">
                  Leverage AI-powered analytics to identify trending coins
                  before they explode in popularity.
                </p>
                <motion.form
                  onSubmit={handleCoinSubmit}
                  variants={FADE_UP}
                  className="flex flex-col sm:flex-row gap-4 max-w-full sm:max-w-md"
                >
                  <div className="flex-1">
                    <Input
                      placeholder="Paste a Zora coin link"
                      className="h-12 rounded-full"
                      value={coinLink}
                      onChange={(e) => setCoinLink(e.target.value)}
                    />
                  </div>
                  <div className="w-full sm:w-auto">
                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-full w-full sm:w-auto px-4 sm:px-8 bg-electric hover:bg-electric/90"
                    >
                      Predict Now
                    </Button>
                  </div>
                </motion.form>
              </motion.div>

              {/* Hero image placeholder */}
              <motion.div
                variants={FADE_IN}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative h-[300px] md:h-[400px] w-full rounded-xl border bg-ghost p-2 shadow-sm"
              >
                <Image
                  src="/dashboard.svg?height=400&width=600"
                  alt="Dashboard Preview"
                  width={600}
                  height={400}
                  className="h-full w-full rounded object-cover"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER_CONTAINER}
          className="py-6 sm:py-8 md:py-12 border-y border-ghost"
        >
          <div className="container-tight px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                // TODO: Add actual stats that are believable
                { value: "1M+", label: "Predictions" },
                { value: "500K+", label: "Posts analysed" },
                { value: "£2B+", label: "Trading volume" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={FADE_UP}
                  className="stat-card bg-snow p-3 sm:p-4 md:p-6 rounded-lg text-center"
                >
                  <div className="stat-value text-2xl md:text-3xl font-bold text-charcoal">
                    {stat.value}
                  </div>
                  <div className="stat-label text-sm md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={FADE_UP}
          id="how-it-works"
          className="section-alt py-12 md:py-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-sky/5"></div>
          <NeuralBackground />
          <div className="container-tight px-4 md:px-6 relative z-10">
            <motion.div
              variants={FADE_IN}
              className="flex flex-col max-w-2xl mx-auto text-center mb-12 md:mb-16"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-electric to-blue-500">
                How It Works
              </h2>
              <p className="mt-2 md:mt-4 text-base md:text-lg text-stone">
                Our AI-powered platform analyses multiple signals to predict
                social content virality with precision and executes trades at
                optimal times
              </p>
            </motion.div>
            <motion.div
              variants={STAGGER_CONTAINER}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {[
                {
                  icon: Brain,
                  title: "Analyse Content",
                  desc: "Our AI analyses image, text, and sentiment to identify viral potential",
                },
                {
                  icon: BarChart2,
                  title: "Score & Compare",
                  desc: "Content is scored based on vector similarity and historical data",
                },
                {
                  icon: Flame,
                  title: "Real-time Scan",
                  desc: "Continuous monitoring of fresh coins to catch trends early",
                },
                {
                  icon: LineChart,
                  title: "Auto-Trade",
                  desc: "Set thresholds and let our platform execute trades automatically",
                },
                {
                  icon: Clock,
                  title: "Real-Time Analysis",
                  desc: "Millisecond scanning of new posts with our distributed neural network",
                },
                {
                  icon: Rocket,
                  title: "Predictive Scheduling",
                  desc: "Schedule trades with our AI that predicts optimal execution times",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={FADE_UP}
                  className="flex flex-col items-start space-y-4 rounded-lg p-4 md:p-6 bg-white/90 backdrop-blur-sm"
                >
                  <div className="rounded-full bg-sky p-4">
                    <item.icon className="h-5 w-5 md:h-6 md:w-6 text-electric" />
                  </div>
                  <h3 className="text-lg md:text-xl font-medium">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-stone">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Trending Posts Feed */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={FADE_UP}
          id="trending"
          className="section py-12 md:py-16"
        >
          <div className="container-tight px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start lg:items-end mb-8 md:mb-12 gap-4">
              <motion.div variants={FADE_IN} className="max-w-full md:max-w-xl">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-electric to-blue-500">
                  Trending Now
                </h2>
                <p className="mt-2 text-base md:text-lg text-stone">
                  See what&apos;s gaining momentum in real-time across the Zora
                  ecosystem
                </p>
              </motion.div>
              <motion.div
                variants={FADE_IN}
                className="flex flex-wrap gap-2 justify-start md:justify-end w-full md:w-auto"
              >
                {["Highest Score", "Volume", "Recent"].map((btn) => (
                  <Button
                    key={btn}
                    variant="outline"
                    size="sm"
                    className="rounded-full border-ghost text-charcoal whitespace-nowrap"
                  >
                    {btn}
                  </Button>
                ))}
              </motion.div>
            </div>
            <motion.div
              variants={STAGGER_CONTAINER}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  variants={FADE_UP}
                  className="rounded-xl border bg-ghost text-charcoal shadow-sm overflow-hidden h-full flex flex-col"
                >
                  <div className="relative">
                    <Image
                      src={`/dashboard.svg?height=200&width=400&text=Coin%20${i}`}
                      alt={`Trending Coin ${i}`}
                      width={400}
                      height={200}
                      className="w-full object-cover"
                    />
                    <div className="absolute right-3 top-3 rounded-full bg-seafoam px-3 py-1 text-xs font-medium text-mint">
                      {85 + i}% Virality
                    </div>
                  </div>
                  <div className="p-4 md:p-5 flex-grow flex flex-col">
                    <h3 className="text-base md:text-lg font-medium">
                      Creator Coin #{i}
                    </h3>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs md:text-sm text-stone">
                        Volume: {0.5 * i} ETH
                      </div>
                      <div className="text-xs md:text-sm font-medium text-mint">
                        +{20 * i}% 24h
                      </div>
                    </div>
                    <div className="mt-auto pt-4">
                      <Link href="/dashboard">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full rounded-full border-electric text-electric hover:bg-sky text-xs md:text-sm"
                        >
                          Track this Coin
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div variants={FADE_UP} className="mt-8 flex justify-center">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="gap-1 rounded-full border-electric text-electric hover:bg-sky"
                >
                  View all trending <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Auto-Trade Dashboard Preview */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={FADE_UP}
          id="auto-trade"
          className="section py-12 md:py-16"
        >
          <div className="container-tight px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div
                variants={FADE_IN}
                className="space-y-6 md:space-y-8 order-2 lg:order-1"
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric to-blue-500">
                  Auto-Trade Dashboard
                </h2>
                <p className="text-base md:text-lg text-stone">
                  Set your parameters once and let our platform execute trades
                  automatically when conditions are met.
                </p>
                <ul className="space-y-4 md:space-y-5">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-sky p-2 mt-0.5">
                      <Lock className="h-4 w-4 md:h-5 md:w-5 text-electric" />
                    </div>
                    <div>
                      <p className="font-medium text-sm md:text-base">
                        Safety thresholds
                      </p>
                      <p className="text-xs md:text-sm text-stone">
                        Set maximum spend and stop-loss parameters
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-sky p-2 mt-0.5">
                      <BarChart2 className="h-4 w-4 md:h-5 md:w-5 text-electric" />
                    </div>
                    <div>
                      <p className="font-medium text-sm md:text-base">
                        Virality thresholds
                      </p>
                      <p className="text-xs md:text-sm text-stone">
                        Only trade when virality score exceeds your minimum
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-sky p-2 mt-0.5">
                      <Clock className="h-4 w-4 md:h-5 md:w-5 text-electric" />
                    </div>
                    <div>
                      <p className="font-medium text-sm md:text-base">
                        Time-based conditions
                      </p>
                      <p className="text-xs md:text-sm text-stone">
                        Set time windows for trading activity
                      </p>
                    </div>
                  </li>
                </ul>
                <div className="pt-2 flex justify-center sm:justify-start">
                  <Link href="/dashboard">
                    <Button className="gap-2 rounded-full bg-electric hover:bg-electric/90 w-full sm:w-auto">
                      Explore Auto-Trade <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                variants={FADE_IN}
                transition={{ duration: 0.4 }}
                className="relative h-[250px] md:h-[400px] w-full rounded-xl border bg-ghost p-2 shadow-sm order-1 lg:order-2"
              >
                <Image
                  src="/dashboard.svg?height=400&width=600&text=Auto-Trade%20Dashboard"
                  alt="Auto-Trade Dashboard"
                  width={600}
                  height={400}
                  className="h-full w-full rounded object-cover"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Tech Explained */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={FADE_UP}
          id="docs"
          className="section-alt py-12 md:py-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-sky/5"></div>
          <NeuralBackground />
          <div className="container-tight px-4 md:px-6 relative z-10">
            <motion.div
              variants={FADE_IN}
              className="flex flex-col max-w-2xl mx-auto text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-electric to-blue-500">
                The Technology
              </h2>
              <p className="mt-2 text-base md:text-lg text-stone">
                Our platform leverages cutting-edge AI to deliver accurate
                predictions
              </p>
            </motion.div>
            <motion.div
              variants={STAGGER_CONTAINER}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
            >
              {[
                {
                  title: "Vector Embeddings",
                  desc: "We analyse visual and textual content using advanced embedding techniques to identify patterns that correlate with virality.",
                },
                {
                  title: "Sentiment Analysis",
                  desc: "Our AI evaluates social signals and community sentiment to gauge potential market interest and momentum.",
                },
                {
                  title: "Smart Scoring",
                  desc: "Beyond simple metrics, our algorithm considers multiple factors to provide a comprehensive virality score.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={FADE_UP}
                  className="bento-card p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm h-full flex flex-col"
                >
                  <h3 className="text-lg md:text-xl font-medium mb-2 sm:mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-stone">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={FADE_UP}
          id="try-it"
          className="section-alt py-12 md:py-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-sky/5"></div>
          <NeuralBackground />
          <div className="container-tight px-4 md:px-6 relative z-10">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <motion.div variants={FADE_IN} className="space-y-4 md:space-y-6">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric to-blue-500">
                    Kickstart
                  </span>{" "}
                  your virality edge today
                </h2>
                <p className="text-base md:text-lg text-stone">
                  Become a top Zora trader with our AI-powered platform and get
                  ahead of the curve.
                </p>
                <form
                  onSubmit={handleEmailSubmit}
                  className="flex flex-col sm:flex-row gap-4 max-w-full sm:max-w-md"
                >
                  <div className="flex-1">
                    <Input
                      placeholder="Enter your email"
                      className="h-12 rounded-full"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="w-full sm:w-auto">
                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-full w-full sm:w-auto px-4 sm:px-8 bg-electric hover:bg-electric/90"
                    >
                      Get Started
                    </Button>
                  </div>
                </form>
              </motion.div>
              <motion.div
                variants={FADE_IN}
                className="relative h-[250px] md:h-[300px] w-full rounded-xl border bg-ghost p-2 shadow-sm"
              >
                <Image
                  src="/dashboard.svg?height=300&width=500&text=Dashboard%20Preview"
                  alt="Dashboard Preview"
                  width={500}
                  height={300}
                  className="h-full w-full rounded object-cover"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Using the Footer component */}
      <Footer />

      {/* Add ScrollToTop component */}
      <ScrollToTop />
    </div>
  );
}
