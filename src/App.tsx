import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { StudentDataView } from './components/StudentDataView';
import { AlertModal } from './components/AlertModal';
import { PreloadScreen } from './components/PreloadScreen';
import { ScrollToTop } from './components/ScrollToTop';
import { GsmisWebhookResponse, AlertModalType } from './types';
import { normalizeStudentData } from './utils/studentDataHelper';
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import { AlertCircle } from 'lucide-react';

function AppContent() {
  const [showPreload, setShowPreload] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<GsmisWebhookResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pop-up modal state
  const [alertType, setAlertType] = useState<AlertModalType>('none');
  const [customAlertMsg, setCustomAlertMsg] = useState<string>('');

  const handleLoginAndCheck = async (email: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    // Explicit manual demo handling
    if (email === 'demo.notdefended@kkumail.com') {
      setIsLoading(false);
      setAlertType('not_defended');
      return;
    }

    if (email === 'demo.notfound@kkumail.com') {
      setIsLoading(false);
      setAlertType('not_grad_student');
      return;
    }

    try {
      const response = await fetch('/api/check-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: GsmisWebhookResponse;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error(`เกิดข้อผิดพลาดในการดึงข้อมูล (HTTP ${response.status})`);
      }

      if (!response.ok) {
        throw new Error(data.message || `เกิดข้อผิดพลาดในการดึงข้อมูล (HTTP ${response.status})`);
      }

      // Check condition 1: Student not defended
      if (
        data.message === 'นักศึกษายังไม่สอบ วพ.' ||
        (data.message && data.message.includes('ยังไม่สอบ'))
      ) {
        setAlertType('not_defended');
        return;
      }

      // Check condition 2: Student not found / not graduate student
      if (
        data.message === 'ไม่พบนักศึกษาหรือไม่ใช้นักศึกษาระดับบัณฑิตศึกษา' ||
        (data.message && data.message.includes('ไม่พบนักศึกษา')) ||
        (data.message && data.message.includes('ไม่ใช้นักศึกษา'))
      ) {
        setAlertType('not_grad_student');
        return;
      }

      // Login Successful or student record returned
      setUserEmail(email);
      setStudentData(data);
    } catch (err: any) {
      console.error('Login/Check error:', err);
      setErrorMessage(err.message || 'ไม่สามารถเชื่อมต่อระบบ GSMIS ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUserEmail(null);
    setStudentData(null);
    setErrorMessage(null);
    setAlertType('none');
  };

  const handleRefresh = () => {
    if (userEmail) {
      handleLoginAndCheck(userEmail);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0C0A09] text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Brand Preload Splash Screen */}
      {showPreload && (
        <PreloadScreen
          minDuration={1600}
          onComplete={() => setShowPreload(false)}
        />
      )}
      
      {/* Navbar only shown when logged in */}
      {userEmail && (
        <Navbar
          userEmail={userEmail}
          studentInfo={studentData ? normalizeStudentData(studentData).student : undefined}
          onLogout={handleLogout}
        />
      )}

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="bg-rose-500 text-white px-4 py-3 text-xs sm:text-sm font-medium flex items-center justify-between shadow-md">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-white hover:text-rose-200 font-bold ml-4 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* View Routing: Login View or Student Dashboard */}
      {!userEmail || !studentData ? (
        <LoginView
          onLogin={handleLoginAndCheck}
          isLoading={isLoading}
          onTestDefendedPopup={() => setAlertType('not_defended')}
          onTestNotFoundPopup={() => setAlertType('not_grad_student')}
        />
      ) : (
        <main className="flex-1">
          <StudentDataView
            data={studentData}
            userEmail={userEmail}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />
        </main>
      )}

      {/* Pop-up Alert Modal */}
      <AlertModal
        isOpen={alertType !== 'none'}
        type={alertType}
        customMessage={customAlertMsg}
        onClose={() => setAlertType('none')}
      />

      {/* Floating Go To Top Button */}
      <ScrollToTop />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
