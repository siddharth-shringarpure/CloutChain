"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  delay?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300"
    >
      <Quote className="h-6 w-6 text-purple-400 mb-4" />
      <p className="text-gray-300 mb-6">{quote}</p>
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center">
          <span className="text-white font-bold">{author.charAt(0)}</span>
        </div>
        <div className="ml-3">
          <h4 className="text-white font-medium">{author}</h4>
          <p className="text-gray-400 text-sm">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
