import React from 'react';
import { AlertTriangle, UserX, X, ExternalLink } from 'lucide-react';
import { AlertModalType } from '../types';
import { useLanguage } from '../LanguageContext';

interface AlertModalProps {
  isOpen: boolean;
  type: AlertModalType;
  customMessage?: string;
  onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  type,
  customMessage,
  onClose,
}) => {
  const { t } = useLanguage();

  if (!isOpen || type === 'none') return null;

  const isNotGrad = type === 'not_grad_student';
  const isNotDefended = type === 'not_defended';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isNotGrad
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                    : 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                }`}
              >
                {isNotGrad ? <UserX className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white">
                  {isNotGrad && t('alertNotGradTitle')}
                  {isNotDefended && t('alertNotDefendedTitle')}
                  {!isNotGrad && !isNotDefended && t('alertSystemTitle')}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">{t('alertGsSystem')}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-white p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Message Box */}
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium leading-relaxed ${
              isNotGrad
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
            }`}
          >
            <p className="text-sm font-bold mb-1">
              {isNotGrad && t('alertNotGradHeading')}
              {isNotDefended && t('alertNotDefendedHeading')}
              {!isNotGrad && !isNotDefended && (customMessage || t('alertSystemTitle'))}
            </p>
            <p className="text-[11.5px] opacity-90">
              {isNotGrad && t('alertNotGradDesc')}
              {isNotDefended && t('alertNotDefendedDesc')}
            </p>
          </div>

          {/* GSMIS Portal Link */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <a
              href="https://gs.kku.ac.th"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold border border-stone-200 dark:border-stone-700 transition"
            >
              <span>{t('goToGsmis')}</span>
              <ExternalLink className="w-4 h-4 text-stone-400" />
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#EB5E10] hover:bg-[#D44E09] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              {t('acknowledgeBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
