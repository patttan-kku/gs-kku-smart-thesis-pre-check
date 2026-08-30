import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      // Calculate progress percentage
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setScrollProgress(progress);

      // Show button once scrolled past 250px
      if (scrollTop > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
        >
          <button
            onClick={scrollToTop}
            id="go-to-top-btn"
            aria-label="Scroll to top"
            title="ขึ้นไปด้านบนสุด (Go to Top)"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 shadow-lg hover:shadow-xl border border-stone-200/80 dark:border-stone-800 hover:border-[#EB5E10]/50 dark:hover:border-[#EB5E10]/50 transition-all duration-300 transform active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#EB5E10]/40"
          >
            {/* SVG Circular Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 48 48">
              {/* Background ring */}
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-stone-200/60 dark:text-stone-800"
              />
              {/* Animated Progress ring */}
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="url(#gradient-kku)"
                strokeWidth="2.5"
                strokeDasharray={125.66} // 2 * PI * 20
                strokeDashoffset={125.66 - (125.66 * scrollProgress) / 100}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-150 ease-out"
              />
              <defs>
                <linearGradient id="gradient-kku" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EB5E10" />
                  <stop offset="100%" stopColor="#D09B2C" />
                </linearGradient>
              </defs>
            </svg>

            {/* Icon & Hover Effect */}
            <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full group-hover:bg-[#EB5E10]/10 dark:group-hover:bg-[#EB5E10]/20 transition-colors">
              <ArrowUp className="w-5 h-5 text-[#EB5E10] group-hover:-translate-y-0.5 transition-transform duration-200" />
            </div>

            {/* Subtle Tooltip on Hover for Large Screens */}
            <span className="hidden md:block absolute -top-9 px-2.5 py-1 bg-stone-900/90 dark:bg-stone-800 text-white text-[11px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md">
              ขึ้นไปด้านบน
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
