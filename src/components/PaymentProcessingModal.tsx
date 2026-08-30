import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CreditCard, ExternalLink, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface PaymentProcessingModalProps {
  isOpen: boolean;
  status: 'idle' | 'loading' | 'success' | 'error';
  paymentData: {
    url?: string;
    ref2?: string;
    message?: string;
  } | null;
  errorMessage?: string;
  onClose: () => void;
  onProceedPayment?: (url: string) => void;
}

export const PaymentProcessingModal: React.FC<PaymentProcessingModalProps> = ({
  isOpen,
  status,
  paymentData,
  errorMessage,
  onClose,
  onProceedPayment,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={status !== 'loading' ? onClose : undefined}
          className="fixed inset-0 bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-2xl z-10 text-stone-900 dark:text-stone-100 p-6"
        >
          {/* Close button (available when not loading) */}
          {status !== 'loading' && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Loading State */}
          {status === 'loading' && (
            <div className="flex flex-col items-center text-center py-4 space-y-4">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#EB5E10]/10 dark:bg-[#EB5E10]/20 text-[#EB5E10]">
                <Loader2 className="w-8 h-8 animate-spin" />
                <div className="absolute inset-0 rounded-full border-2 border-[#EB5E10]/30 animate-ping pointer-events-none" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  กำลังสร้างรายการชำระค่าปรับ...
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto leading-relaxed">
                  ระบบกำลังส่งข้อมูลไปยัง Webhook บัณฑิตวิทยาลัยเพื่อสร้างลิงก์ชำระเงิน กรุณารอสักครู่
                </p>
              </div>

              <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-[#EB5E10] to-[#D09B2C] h-full w-2/3 animate-pulse rounded-full" />
              </div>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && paymentData && (
            <div className="flex flex-col items-center text-center py-2 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  สร้างรายการชำระเงินสำเร็จ
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {paymentData.message || 'พร้อมเข้าสู่หน้าชำระค่าปรับการส่งวิทยานิพนธ์ล่าช้า'}
                </p>
              </div>

              {/* Ref Number info */}
              {paymentData.ref2 && (
                <div className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 text-left space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 dark:text-stone-400">เลขอ้างอิง (Ref 2):</span>
                    <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{paymentData.ref2}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="w-full space-y-2 pt-2">
                {paymentData.url ? (
                  <button
                    onClick={() => {
                      if (paymentData.url) {
                        if (onProceedPayment) {
                          onProceedPayment(paymentData.url);
                        } else {
                          window.open(paymentData.url, '_blank', 'noopener,noreferrer');
                        }
                      }
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#EB5E10] to-[#D09B2C] hover:from-[#d54f0a] hover:to-[#be8b23] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer transform active:scale-[0.99]"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>ไปยังหน้าระบบชำระเงิน (GS Checkout)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <p className="text-xs text-amber-600">ไม่พบ URL สำหรับชำระเงิน</p>
                )}

                <button
                  onClick={onClose}
                  className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors"
                >
                  ปิดหน้าต่างนี้
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="flex flex-col items-center text-center py-2 space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  ไม่สามารถสร้างรายการชำระเงินได้
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto">
                  {errorMessage || 'เกิดข้อผิดพลาดในการติดต่อกับระบบ Webhook กรุณาลองใหม่อีกครั้ง'}
                </p>
              </div>

              <div className="w-full space-y-2 pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white text-xs font-bold transition-colors"
                >
                  ตกลง
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
