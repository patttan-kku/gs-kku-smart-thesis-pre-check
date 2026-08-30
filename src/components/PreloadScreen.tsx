import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GSKKULogo } from './GSKKULogo';
import { Sparkles, ShieldCheck, Database, Cpu } from 'lucide-react';

interface PreloadScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

export const PreloadScreen: React.FC<PreloadScreenProps> = ({
  onComplete,
  minDuration = 1800,
}) => {
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('กำลังเริ่มต้นระบบ...');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / minDuration) * 100));
      setProgress(pct);

      if (pct < 30) {
        setStageText('กำลังเริ่มต้นระบบความปลอดภัย...');
      } else if (pct < 65) {
        setStageText('เชื่อมโยงฐานข้อมูล GSMIS บัณฑิตวิทยาลัย...');
      } else if (pct < 90) {
        setStageText('เตรียมโมเดล AI ตรวจสอบวิทยานิพนธ์...');
      } else {
        setStageText('ระบบพร้อมให้บริการ');
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          onComplete?.();
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="preload-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#FAF7F2] dark:bg-[#0C0A09] text-stone-900 dark:text-stone-100 overflow-hidden select-none p-6 sm:p-10"
        >
          {/* Ambient Background Brand Glows */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#EB5E10]/15 dark:bg-[#EB5E10]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#D09B2C]/15 dark:bg-[#D09B2C]/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/40 dark:bg-stone-900/40 rounded-full blur-2xl pointer-events-none" />

          {/* Top Logo Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full flex items-center justify-between max-w-4xl pt-2"
          >
            <GSKKULogo size="sm" />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 backdrop-blur-md shadow-2xs text-[11px] font-semibold text-[#EB5E10]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI E-Thesis Checker</span>
            </div>
          </motion.div>

          {/* Center Visual & Title */}
          <div className="relative flex flex-col items-center text-center my-auto py-4 space-y-6 max-w-lg z-10">
            {/* Mascot Visual with Floating Animation */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
              transition={{
                scale: { duration: 0.6, ease: 'easeOut' },
                opacity: { duration: 0.6 },
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="relative inline-flex flex-col items-center"
            >
              {/* Outer Golden Glow Circle */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#EB5E10]/20 via-[#D09B2C]/20 to-transparent blur-xl pointer-events-none" />
              
              <div className="relative w-36 sm:w-44 h-44 sm:h-52 flex items-center justify-center">
                <img
                  src="/mascot_sniper.webp"
                  alt="E-Thesis SNIPER"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain drop-shadow-xl"
                  loading="eager"
                />
              </div>

              {/* Floor Shadow */}
              <div className="w-28 h-2 bg-stone-900/15 dark:bg-black/40 rounded-full blur-[3px] -mt-1" />
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-2"
            >
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight font-sans">
                GS KKU Thesis AI Checker
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium max-w-md mx-auto leading-relaxed">
                ระบบตรวจสอบรูปแบบวิทยานิพนธ์ บัณฑิตวิทยาลัย มหาวิทยาลัยขอนแก่น
              </p>
            </motion.div>

            {/* Progress Bar & Stage Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-xs space-y-2.5 pt-2"
            >
              {/* Sleek Gradient Track */}
              <div className="relative w-full h-2 rounded-full bg-stone-200/80 dark:bg-stone-800 overflow-hidden p-0.5 shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#EB5E10] via-[#D09B2C] to-[#EB5E10] shadow-sm"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>

              {/* Stage Text & Percentage */}
              <div className="flex items-center justify-between text-xs font-medium text-stone-600 dark:text-stone-400 px-0.5">
                <span className="truncate max-w-[220px] text-left text-[11.5px]">
                  {stageText}
                </span>
                <span className="font-mono font-bold text-[#EB5E10] text-xs">
                  {progress}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* Footer Features Badge List */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-2xl flex items-center justify-center gap-4 sm:gap-6 text-[11px] text-stone-500 dark:text-stone-400 flex-wrap pb-2 border-t border-stone-200/60 dark:border-stone-800/60 pt-4"
          >
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#EB5E10]" />
              <span>GSMIS Database</span>
            </div>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#D09B2C]" />
              <span>AI Thesis Validation</span>
            </div>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Digital Signature Check</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
