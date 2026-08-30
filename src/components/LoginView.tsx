import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Mail,
  Sun,
  Moon,
  Globe,
  Settings2,
  GraduationCap,
  LogIn
} from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useLanguage } from '../LanguageContext';
import { GSKKULogo } from './GSKKULogo';
import { MascotVisual } from './MascotVisual';

interface LoginViewProps {
  onLogin: (email: string) => void;
  isLoading: boolean;
  onTestDefendedPopup?: () => void;
  onTestNotFoundPopup?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  isLoading,
  onTestDefendedPopup,
  onTestNotFoundPopup,
}) => {
  const defaultEmail = 'pongsathon.po@kkumail.com';
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [customEmail, setCustomEmail] = useState(defaultEmail);
  const [showDevMenu, setShowDevMenu] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEmail.trim()) {
      onLogin(customEmail.trim());
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] dark:bg-[#0C0A09] text-stone-900 dark:text-stone-100 flex flex-col justify-between relative overflow-hidden transition-colors duration-300">
      {/* --- BACKGROUND DECORATIVE GEOMETRY & RECOGNIZABLE THESIS BOOK WATERMARK --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Subtle Warm Gradient Arc at top-left and bottom-right */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D09B2C]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[550px] h-[550px] bg-[#EB5E10]/10 dark:bg-[#EB5E10]/5 rounded-full blur-3xl" />

        {/* KKU Brand Geometric Lines (Orange + Gold + Din Daeng) at bottom-right */}
        <svg
          className="absolute right-0 bottom-0 w-[500px] h-[400px] opacity-[0.08] dark:opacity-[0.05]"
          viewBox="0 0 500 400"
          fill="none"
        >
          <path d="M 100 400 C 250 350, 350 200, 500 150 L 500 400 Z" fill="#EB5E10" />
          <path d="M 220 400 C 320 320, 420 220, 500 200 L 500 400 Z" fill="#D09B2C" />
          <path d="M 350 400 C 420 360, 470 300, 500 280 L 500 400 Z" fill="#9E3820" />
        </svg>

        {/* ========================================================================= */}
        {/* RECOGNIZABLE ACADEMIC THESIS BOOK & MANUSCRIPT WATERMARK                  */}
        {/* ========================================================================= */}
        {/* 1. Large Open Thesis Manuscript on Left / Center Background */}
        <svg
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-[720px] h-[640px] opacity-[0.065] dark:opacity-[0.04] text-stone-800 dark:text-stone-200"
          viewBox="0 0 720 640"
          fill="none"
          stroke="currentColor"
        >
          {/* Hardcover Spine & Outer Cover Shadow */}
          <rect x="60" y="50" width="600" height="520" rx="14" strokeWidth="2.5" strokeDasharray="6 3" />
          
          {/* Left Page (Hardcover Binding Margin 1.5 inch) */}
          <rect x="75" y="65" width="275" height="490" rx="6" strokeWidth="1.5" />
          {/* Center Spine Crease & Bookmark Ribbon */}
          <line x1="360" y1="50" x2="360" y2="570" strokeWidth="3" />
          <path d="M 352 50 L 368 50 L 368 180 L 360 168 L 352 180 Z" fill="currentColor" stroke="none" opacity="0.4" />
          
          {/* Right Page */}
          <rect x="370" y="65" width="275" height="490" rx="6" strokeWidth="1.5" />

          {/* Left Page: Thesis Title, Abstract & KKU Seal */}
          {/* Header Title: THESIS / DISSERTATION */}
          <text x="212" y="110" textAnchor="middle" fontSize="13" fontWeight="bold" fill="currentColor" stroke="none" letterSpacing="2">
            KHON KAEN UNIVERSITY
          </text>
          <text x="212" y="130" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" letterSpacing="1.5">
            GRADUATE SCHOOL • THESIS
          </text>
          
          {/* Subtle Thesis Title Simulation */}
          <line x1="110" y1="160" x2="315" y2="160" strokeWidth="2.5" />
          <line x1="130" y1="175" x2="295" y2="175" strokeWidth="2" />
          
          {/* Author & Academic Degree Metadata */}
          <line x1="160" y1="205" x2="265" y2="205" strokeWidth="1.2" />
          <line x1="175" y1="218" x2="250" y2="218" strokeWidth="1" />

          {/* Simulated Body Paragraphs with KKU Thesis Margins */}
          <line x1="100" y1="255" x2="325" y2="255" strokeWidth="1" />
          <line x1="100" y1="272" x2="325" y2="272" strokeWidth="1" />
          <line x1="100" y1="289" x2="325" y2="289" strokeWidth="1" />
          <line x1="100" y1="306" x2="280" y2="306" strokeWidth="1" />

          <line x1="120" y1="335" x2="325" y2="335" strokeWidth="1" />
          <line x1="100" y1="352" x2="325" y2="352" strokeWidth="1" />
          <line x1="100" y1="369" x2="325" y2="369" strokeWidth="1" />
          <line x1="100" y1="386" x2="260" y2="386" strokeWidth="1" />

          <line x1="120" y1="415" x2="325" y2="415" strokeWidth="1" />
          <line x1="100" y1="432" x2="325" y2="432" strokeWidth="1" />
          <line x1="100" y1="449" x2="310" y2="449" strokeWidth="1" />

          {/* Academic Seal / Graduation Seal at bottom of left page */}
          <circle cx="212" cy="505" r="22" strokeWidth="1.5" />
          <circle cx="212" cy="505" r="18" strokeWidth="1" strokeDasharray="3 2" />
          <path d="M 205 505 L 210 510 L 220 500" strokeWidth="2" />

          {/* Right Page: Chapter 1 / Table of Contents Structure */}
          <text x="507" y="110" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" stroke="none" letterSpacing="2">
            CHAPTER I : INTRODUCTION
          </text>
          <text x="507" y="128" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none">
            บทที่ ๑ : บทนำและวัตถุประสงค์
          </text>

          {/* Right Page Content Lines & Subsections */}
          <line x1="410" y1="160" x2="490" y2="160" strokeWidth="2" />
          <line x1="430" y1="180" x2="620" y2="180" strokeWidth="1" />
          <line x1="395" y1="197" x2="620" y2="197" strokeWidth="1" />
          <line x1="395" y1="214" x2="620" y2="214" strokeWidth="1" />
          <line x1="395" y1="231" x2="570" y2="231" strokeWidth="1" />

          {/* Dotted Leader Line (Table of Contents Style) */}
          <line x1="410" y1="270" x2="480" y2="270" strokeWidth="1.5" />
          <line x1="485" y1="270" x2="600" y2="270" strokeWidth="1" strokeDasharray="3 4" />
          <text x="615" y="274" fontSize="10" fill="currentColor" stroke="none">1</text>

          <line x1="410" y1="300" x2="495" y2="300" strokeWidth="1.5" />
          <line x1="500" y1="300" x2="600" y2="300" strokeWidth="1" strokeDasharray="3 4" />
          <text x="615" y="304" fontSize="10" fill="currentColor" stroke="none">14</text>

          <line x1="410" y1="330" x2="510" y2="330" strokeWidth="1.5" />
          <line x1="515" y1="330" x2="600" y2="330" strokeWidth="1" strokeDasharray="3 4" />
          <text x="615" y="334" fontSize="10" fill="currentColor" stroke="none">38</text>

          <line x1="430" y1="370" x2="620" y2="370" strokeWidth="1" />
          <line x1="395" y1="387" x2="620" y2="387" strokeWidth="1" />
          <line x1="395" y1="404" x2="620" y2="404" strokeWidth="1" />
          <line x1="395" y1="421" x2="550" y2="421" strokeWidth="1" />

          {/* Page numbers at bottom */}
          <text x="212" y="540" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none">- i -</text>
          <text x="507" y="540" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none">1</text>
        </svg>

        {/* 2. Top-Right Secondary Thesis Guidelines Layout Watermark */}
        <svg
          className="absolute right-12 top-16 w-80 h-72 opacity-[0.045] dark:opacity-[0.03] text-stone-700 dark:text-stone-300"
          viewBox="0 0 240 200"
          fill="none"
          stroke="currentColor"
        >
          <rect x="20" y="10" width="180" height="180" rx="8" strokeWidth="1.5" />
          <rect x="35" y="25" width="150" height="150" strokeWidth="1" strokeDasharray="4 3" />
          {/* Margin markers 1.5" / 1.0" */}
          <line x1="35" y1="50" x2="185" y2="50" strokeWidth="1.2" />
          <line x1="60" y1="70" x2="175" y2="70" strokeWidth="1" />
          <line x1="45" y1="85" x2="175" y2="85" strokeWidth="1" />
          <line x1="45" y1="100" x2="150" y2="100" strokeWidth="1" />
          <line x1="60" y1="120" x2="175" y2="120" strokeWidth="1" />
          <line x1="45" y1="135" x2="165" y2="135" strokeWidth="1" />
        </svg>
      </div>

      {/* --- TOP BAR: LOGO & COMPACT CONTROLS --- */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex items-center justify-between">
        {/* GS KKU Official Logo (Top Left) */}
        <div className="flex items-center">
          <GSKKULogo size="md" />
        </div>

        {/* Right Utility Buttons (Dark/Light, Lang, Dev Test) */}
        <div className="flex items-center space-x-2">
          {/* TH / EN Language Switch Button */}
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700 shadow-2xs transition-all cursor-pointer"
            title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
          >
            <Globe className="w-3.5 h-3.5 text-[#EB5E10]" />
            <span className="font-mono">{language === 'th' ? '🇬🇧 EN' : '🇹🇭 TH'}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-600 dark:text-amber-400 border border-stone-200/80 dark:border-stone-700 shadow-2xs transition-all cursor-pointer"
            title={isDark ? t('lightMode') : t('darkMode')}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
          </button>

          {/* Dev Test Menu Toggle (Compact & Unobtrusive) */}
          <div className="relative">
            <button
              onClick={() => setShowDevMenu(!showDevMenu)}
              aria-label="Developer test menu"
              className={`p-2 rounded-xl border text-xs font-medium transition cursor-pointer flex items-center gap-1 shadow-2xs ${
                showDevMenu
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 border-stone-200/80 dark:border-stone-700'
              }`}
              title={t('devTestTitle')}
            >
              <Settings2 className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">Dev Test</span>
            </button>

            {/* Dev Test Dropdown */}
            {showDevMenu && (
              <div className="absolute right-0 mt-2 w-72 p-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-800">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <Settings2 className="w-3.5 h-3.5 text-[#EB5E10]" />
                    {t('devTestTitle')}
                  </span>
                  <button
                    onClick={() => setShowDevMenu(false)}
                    className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs cursor-pointer"
                  >
                    {t('devTestClose')}
                  </button>
                </div>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onLogin('demo.notdefended@kkumail.com');
                      setShowDevMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 text-[11px] font-medium transition cursor-pointer"
                  >
                    {t('devTestNotDefended')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLogin('demo.notfound@kkumail.com');
                      setShowDevMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 text-[11px] font-medium transition cursor-pointer"
                  >
                    {t('devTestNotFound')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLogin(defaultEmail);
                      setShowDevMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-[11px] font-medium transition cursor-pointer"
                  >
                    {t('devTestSuccess')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- MAIN HERO BODY (CENTERED HERO & CARD) --- */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center text-center space-y-6 sm:space-y-8">
          
          {/* === HERO HEADLINE & BRANDING (CENTERED) === */}
          <div className="flex flex-col items-center space-y-3 sm:space-y-4 max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#EB5E10]/10 dark:bg-[#EB5E10]/20 border border-[#EB5E10]/30 text-[#EB5E10] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('portalBadge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.25]">
              <span className="text-stone-900 dark:text-stone-100 block">
                {t('loginHeroTitle1')}
              </span>
              <span className="text-[#9E3820] dark:text-[#EB5E10] block font-['Prompt',sans-serif] mt-1">
                {t('loginHeroTitle2')}
              </span>
            </h1>

            {/* English Subtitle */}
            <p className="text-xs sm:text-sm font-bold text-[#D09B2C] tracking-[0.18em] uppercase font-sans">
              {t('loginHeroSubtitle')}
            </p>
          </div>

          {/* === LOGIN CARD (CENTERED) === */}
          <div className="w-full flex justify-center">
            
            {/* --- COMPACT CENTERED LOGIN CARD --- */}
            <div className="w-full max-w-[420px] bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-900/5 dark:shadow-black/30 relative z-20 space-y-5 text-left">
              
              {/* Card Header: Icon + Title */}
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-[#EB5E10] text-white flex items-center justify-center mx-auto shadow-md shadow-[#EB5E10]/20 mb-2.5">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                  {t('studentLoginTitle')}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-normal">
                  {t('studentLoginSubtitle')} <br />
                  <span className="font-mono text-[#EB5E10] dark:text-amber-400">
                    (@kkumail.com {language === 'th' ? 'หรือ' : 'or'} @kku.ac.th)
                  </span>
                </p>
              </div>

              {/* Action 1: SSO KKU Login Button (GS KKU Orange) */}
              <button
                type="button"
                onClick={() => onLogin(defaultEmail)}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-[#EB5E10] hover:bg-[#D44E09] active:bg-[#B83A08] text-white font-semibold text-sm shadow-md shadow-[#EB5E10]/20 hover:shadow-lg hover:shadow-[#EB5E10]/30 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span>{isLoading ? t('loggingIn') : t('googleLoginBtn')}</span>
              </button>

              {/* Divider */}
              <div className="relative flex py-0.5 items-center">
                <div className="flex-grow border-t border-stone-200 dark:border-stone-800" />
                <span className="flex-shrink mx-3 text-[11px] text-stone-400 uppercase font-medium">
                  {t('orUseEmail')}
                </span>
                <div className="flex-grow border-t border-stone-200 dark:border-stone-800" />
              </div>

              {/* Action 2: Custom Email Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder={t('emailPlaceholder')}
                      required
                      className="w-full bg-[#FAF7F2] dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#EB5E10] focus:ring-1 focus:ring-[#EB5E10] transition-colors"
                    />
                  </div>
                </div>

                {/* Secondary Button: Din Daeng / Rust */}
                <button
                  type="submit"
                  disabled={isLoading || !customEmail.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#9E3820] hover:bg-[#852C16] text-white font-medium text-xs sm:text-sm shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <span>{t('verifying')}</span>
                  ) : (
                    <>
                      <span>{t('verifyBtn')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Note */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 text-center">
                <p className="text-[10.5px] text-stone-500 leading-tight">
                  {t('webhookNotice')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center text-[11px] text-stone-500 border-t border-stone-200/60 dark:border-stone-800/60">
        <p>{t('footerText')}</p>
      </footer>
    </div>
  );
};
