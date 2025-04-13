/**
 * @fileoverview Root layout component that wraps the entire application.
 * Provides font configuration, theme support, and Web3 connectivity.
 */

import type React from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Web3Provider from "@/components/Web3Provider";
import { ThemeProvider } from "@/components/theme-provider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

// Configure display font for headings
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: "CloutChain — AI-Powered Zora Virality Prediction",
  description:
    "Predict Zora virality in real time and automate your trading strategy with AI-powered analytics.",
};

/**
 * Root layout component that provides theme and web3 context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} Root layout with providers
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en" className={`${jakarta.variable} ${grotesk.variable}`}>
      <body className={jakarta.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Web3Provider>{children}</Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
