import React from 'react';
import { LogOut, ShieldCheck, User, Sun, Moon, Globe } from 'lucide-react';
import { StudentInfo } from '../types';
import { useTheme } from '../ThemeContext';
import { useLanguage } from '../LanguageContext';
import { GSKKULogo } from './GSKKULogo';

interface NavbarProps {
  userEmail: string | null;
  studentInfo?: StudentInfo;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userEmail,
  studentInfo,
  onLogout,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  // Construct First Name + Last Name cleanly
  const studentFullName = (() => {
    if (language === 'th') {
      if (studentInfo?.firstname && studentInfo?.lastname) {
        return `${studentInfo.prename ? studentInfo.prename : ''}${studentInfo.firstname} ${studentInfo.lastname}`.trim();
      }
      if (studentInfo?.studentname) return studentInfo.studentname;
    } else {
      if (studentInfo?.firstnameeng && studentInfo?.lastnameeng) {
        return `${studentInfo.prenameeng ? studentInfo.prenameeng + ' ' : ''}${studentInfo.firstnameeng} ${studentInfo.lastnameeng}`.trim();
      }
      if (studentInfo?.studentnameeng) return studentInfo.studentnameeng;
      if (studentInfo?.firstname && studentInfo?.lastname) {
        return `${studentInfo.firstname} ${studentInfo.lastname}`.trim();
      }
    }
    return studentInfo?.studentname || studentInfo?.firstname || userEmail?.split('@')[0] || 'นักศึกษา';
  })();

  const studentCode = studentInfo?.studentcode || studentInfo?.stdcode || userEmail || '';

  return (
    <header className="bg-white/95 dark:bg-[#141210]/95 backdrop-blur-md border-b border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100 sticky top-0 z-40 transition-colors duration-200 shadow-2xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <GSKKULogo size="sm" />
            <div className="hidden md:flex flex-col border-l border-stone-200 dark:border-stone-800 pl-3">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-none">
                {t('appName')}
              </span>
              <span className="text-[10px] font-semibold text-[#D09B2C] uppercase tracking-wider font-sans mt-0.5">
                {t('systemTitle')}
              </span>
            </div>
            <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EB5E10]/10 dark:bg-[#EB5E10]/20 text-[#EB5E10] border border-[#EB5E10]/20">
              <ShieldCheck className="w-3 h-3" />
              {t('gsmisVerified')}
            </span>
          </div>

          {/* Right Controls: TH/EN, Theme, Profile, Logout */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* TH / EN Language Switcher */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language between Thai and English"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-100/90 dark:bg-stone-800/90 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs font-semibold transition cursor-pointer shadow-2xs"
              title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
            >
              <Globe className="w-3.5 h-3.5 text-[#EB5E10]" />
              <span className="font-mono">{language === 'th' ? '🇬🇧 EN' : '🇹🇭 TH'}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme mode"
              className="p-2 rounded-xl bg-stone-100/90 dark:bg-stone-800/90 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-amber-400 border border-stone-200 dark:border-stone-700 transition cursor-pointer flex items-center justify-center shadow-2xs"
              title={isDark ? t('lightMode') : t('darkMode')}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700" />
              )}
            </button>

            {/* User Profile Pill & Logout */}
            {userEmail && (
              <div className="flex items-center space-x-2 sm:space-x-3 pl-1 sm:pl-2 border-l border-stone-200 dark:border-stone-800">
                <div
                  className="flex flex-col text-right max-w-[130px] sm:max-w-[220px]"
                  title={`${studentFullName} (${studentCode})`}
                >
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate">
                    {studentFullName}
                  </span>
                  <span className="text-[11px] text-[#EB5E10] font-mono font-medium truncate">
                    {studentCode}
                  </span>
                </div>

                <div className="w-9 h-9 rounded-xl bg-[#EB5E10]/10 dark:bg-[#EB5E10]/20 border border-[#EB5E10]/20 flex items-center justify-center text-[#EB5E10] shrink-0">
                  <User className="w-4 h-4" />
                </div>

                <button
                  onClick={onLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100/90 dark:bg-stone-800/90 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-stone-700 dark:text-stone-300 hover:text-rose-700 dark:hover:text-rose-300 border border-stone-200 dark:border-stone-700 hover:border-rose-300 dark:hover:border-rose-800 transition cursor-pointer shrink-0"
                  title={t('logout')}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{t('logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
