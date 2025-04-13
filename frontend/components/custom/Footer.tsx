"use client";

/**
 * @fileoverview Footer component that provides navigation links.
 * Uses Framer Motion for subtle animations to enhance user experience.
 * TODO: Add social media links and newsletter signup
 */

import Link from "next/link";
import { motion } from "framer-motion";

// Constants for animation settings
const ANIMATION_DURATION = 0.5;
const HOVER_SCALE = 1.05;

export function Footer() {
  // Navigation links for the footer
  const footerLinks = [
    { href: "/about", label: "About" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="border-t bg-snow"
    >
      <div className="container-tight px-4 py-6 sm:py-8">
        {/* Upper section with logo and navigation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: ANIMATION_DURATION }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0"
        >
          {/* Logo section */}
          <motion.div
            whileHover={{ scale: HOVER_SCALE }}
            className="flex items-center gap-2 font-display font-medium"
          >
            <Link href="/">
              <span>CloutChain</span>
            </Link>
          </motion.div>

          {/* Navigation links */}
          <div className="flex gap-4 sm:gap-6">
            {footerLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                <Link
                  href={link.href}
                  className="text-xs sm:text-sm text-stone transition-colors hover:text-charcoal"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Lower section with description and copyright */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: ANIMATION_DURATION, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t gap-4 sm:gap-0"
        >
          {/* Platform description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: ANIMATION_DURATION, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xs sm:text-sm text-stone max-w-md text-center sm:text-left"
          >
            AI-powered virality prediction and auto-trading platform. Helping
            you discover trending content before anyone else.
          </motion.p>

          {/* Copyright notice */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: ANIMATION_DURATION, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-xs text-stone"
          >
            © {new Date().getFullYear()} CloutChain. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
