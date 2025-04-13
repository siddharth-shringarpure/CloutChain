"use client";

/**
 * @fileoverview Component that provides a smooth scroll-to-top button that appears
 * when the user scrolls down the page. Uses Framer Motion for animations.
 * NB: Smooth scrolling behaviour doesn't seem to work properly.
 */

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SCROLL_THRESHOLD = 300; // Show button after scrolling this many pixels

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // handles showing/hiding the button based on scroll position
  const toggleVisibility = (): void => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Attach scroll listener when component mounts
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const handleScrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleScrollToTop}
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-electric shadow-lg transition-all hover:bg-electric/90"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6 text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
