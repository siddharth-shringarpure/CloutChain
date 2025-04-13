"use client";

import type React from "react";

import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 hover:bg-gray-800/50 transition-all duration-300"
    >
      <div className="h-12 w-12 rounded-lg bg-purple-900/30 flex items-center justify-center mb-4 text-purple-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
