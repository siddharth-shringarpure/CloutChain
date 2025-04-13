"use client";

/**
 * @fileoverview Header component providing navigation and mobile menu functionality.
 * Implements smooth scrolling and animated transitions using Framer Motion.
 * TODO: Add user authentication state management??
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Animation constants
const MENU_ANIMATION_DURATION = 0.3;
const HOVER_SCALE = 1.05;
const TAP_SCALE = 0.95;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /**
   * Handles smooth scrolling to target sections
   * @param {React.MouseEvent<HTMLAnchorElement>} e - Click event
   * @param {string} targetId - ID of target element to scroll to
   */
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false); // Close mobile menu first

    // Wait for DOM updates before scrolling
    setTimeout(() => {
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerHeight =
          document.querySelector("header")?.offsetHeight || 0;
        const scrollPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  // Handle initial URL hash for direct section navigation
  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        setTimeout(() => {
          const headerHeight =
            document.querySelector("header")?.offsetHeight || 0;
          const scrollPosition = targetElement.offsetTop - headerHeight;

          window.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          });
        }, 300);
      }
    }
  }, []);

  const navItems = ["how-it-works", "trending", "auto-trade"];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b bg-snow/95 backdrop-blur supports-[backdrop-filter]:bg-snow/60 select-none"
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2 font-display font-medium"
        >
          <Link href="/">CloutChain</Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="hidden md:flex items-center gap-8"
        >
          {navItems.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: MENU_ANIMATION_DURATION,
                delay: 0.3 + i * 0.1,
              }}
            >
              <a
                href={`#${item}`}
                onClick={(e) => handleSmoothScroll(e, item)}
                className="text-sm font-medium text-stone transition-colors hover:text-charcoal"
              >
                {item
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </a>
            </motion.div>
          ))}
        </motion.nav>

        {/* auth buttons & mobile menu */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-4"
        >
          <Link
            href="/signin"
            className="hidden sm:block text-sm font-medium text-stone transition-colors hover:text-charcoal"
          >
            Sign in
          </Link>

          <motion.div
            whileHover={{ scale: HOVER_SCALE }}
            whileTap={{ scale: TAP_SCALE }}
            className="hidden sm:block"
          >
            <Button className="rounded-full px-6 bg-electric hover:bg-electric/90">
              Get started
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden p-2"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: MENU_ANIMATION_DURATION }}
            className="md:hidden bg-snow border-t"
          >
            <nav className="flex flex-col py-4 px-6 space-y-4">
              {navItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 + i * 0.05 }}
                >
                  <a
                    href={`#${item}`}
                    onClick={(e) => handleSmoothScroll(e, item)}
                    className="block py-2 text-base font-medium text-stone transition-colors hover:text-charcoal"
                  >
                    {item
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </a>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
                className="pt-2"
              >
                <Link
                  href="/signin"
                  className="block py-2 text-base font-medium text-stone transition-colors hover:text-charcoal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.35 }}
                className="pt-2"
              >
                <Button
                  className="w-full rounded-full px-6 bg-electric hover:bg-electric/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get started
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
