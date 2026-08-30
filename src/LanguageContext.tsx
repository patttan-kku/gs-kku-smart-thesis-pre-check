import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'th' | 'en';

export interface Translations {
  [key: string]: {
    th: string;
    en: string;
  };
}

export const translations = {
  // Brand & Nav
  appName: {
    th: 'ระบบตรวจสอบวิทยานิพนธ์',
    en: 'Thesis Validation System',
  },
  appSubname: {
    th: 'ระดับบัณฑิตศึกษา มข.',
    en: 'Graduate School KKU',
  },
  systemTitle: {
    th: 'AI Thesis Validation System',
    en: 'AI Thesis Validation System',
  },
  gsmisVerified: {
    th: 'GSMIS เชื่อมต่อแล้ว',
    en: 'GSMIS Verified',
  },
  logout: {
    th: 'ออกจากระบบ',
    en: 'Sign Out',
  },
  lightMode: {
    th: 'โหมดสว่าง',
    en: 'Light Mode',
  },
  darkMode: {
    th: 'โหมดมืด',
    en: 'Dark Mode',
  },

  // Login View
  portalBadge: {
    th: 'AI Thesis Validation Portal • GS KKU',
    en: 'AI Thesis Validation Portal • GS KKU',
  },
  loginHeroTitle1: {
    th: 'ระบบตรวจสอบวิทยานิพนธ์',
    en: 'Thesis Validation System',
  },
  loginHeroTitle2: {
    th: 'ระดับบัณฑิตศึกษา มข.',
    en: 'Graduate School KKU',
  },
  loginHeroSubtitle: {
    th: 'AI THESIS VALIDATION SYSTEM',
    en: 'AI THESIS VALIDATION SYSTEM',
  },
  loginHeroDesc: {
    th: 'เชื่อมต่อฐานข้อมูล GSMIS บัณฑิตวิทยาลัย และระบบ AI อัตโนมัติ เพื่อตรวจสอบรูปแบบเล่มวิทยานิพนธ์ (Format Check) และลายเซ็นดิจิทัล (Digital Signature) ก่อนยื่นขออนุมัติ',
    en: 'Connected with Graduate School GSMIS database and automated AI to verify thesis formatting and digital signatures prior to official submission.',
  },

  // Workflow Cards (4 cards on Login page - NO TURNITIN)
  step01Title: {
    th: 'ตรวจรูปแบบเล่ม',
    en: 'Format Check',
  },
  step01Sub: {
    th: 'FORMAT CHECK',
    en: 'FORMAT CHECK',
  },
  step02Title: {
    th: 'ตรวจโครงสร้างเนื้อหา',
    en: 'Structure Check',
  },
  step02Sub: {
    th: 'STRUCTURE AI',
    en: 'STRUCTURE AI',
  },
  step03Title: {
    th: 'ตรวจลายเซ็นดิจิทัล',
    en: 'Digital Signature',
  },
  step03Sub: {
    th: 'DIGITAL SIGN',
    en: 'DIGITAL SIGN',
  },
  step04Title: {
    th: 'เชื่อมต่อระบบ GSMIS',
    en: 'GSMIS Integration',
  },
  step04Sub: {
    th: 'GSMIS SYNC',
    en: 'GSMIS SYNC',
  },

  // Trust Badges
  badgeMfa: {
    th: 'Google 2MFA Secured',
    en: 'Google 2MFA Secured',
  },
  badgeWebhook: {
    th: 'Realtime n8n Webhook',
    en: 'Realtime n8n Webhook',
  },
  badgeDatabase: {
    th: 'GSMIS Database 2567-2568',
    en: 'GSMIS Database 2024-2025',
  },

  // Login Card
  studentLoginTitle: {
    th: 'เข้าสู่ระบบนักศึกษา',
    en: 'Student Login',
  },
  studentLoginSubtitle: {
    th: 'ใช้บัญชีมหาวิทยาลัยขอนแก่น',
    en: 'Use your Khon Kaen University account',
  },
  googleLoginBtn: {
    th: 'เข้าสู่ระบบด้วย SSO KKU',
    en: 'Sign in with KKU SSO',
  },
  loggingIn: {
    th: 'กำลังเข้าสู่ระบบ...',
    en: 'Signing in...',
  },
  orUseEmail: {
    th: 'หรือเข้าสู่ระบบด้วยอีเมลมหาวิทยาลัย',
    en: 'Or sign in with KKU email',
  },
  emailPlaceholder: {
    th: 'student@kkumail.com หรือ @kku.ac.th',
    en: 'student@kkumail.com or @kku.ac.th',
  },
  verifyBtn: {
    th: 'ดึงข้อมูลและตรวจสอบสิทธิ์',
    en: 'Retrieve Data & Verify Eligibility',
  },
  verifying: {
    th: 'กำลังตรวจสอบสิทธิ์...',
    en: 'Verifying Eligibility...',
  },
  webhookNotice: {
    th: 'ระบบจะตรวจสอบข้อมูลสดจากฐานข้อมูลบัณฑิตวิทยาลัย มข. ผ่าน n8n Webhook',
    en: 'Live verification via Graduate School KKU database & n8n Webhook',
  },
  footerText: {
    th: 'บัณฑิตวิทยาลัย มหาวิทยาลัยขอนแก่น (Graduate School KKU) • AI Thesis Validation Service',
    en: 'Graduate School, Khon Kaen University (GS KKU) • AI Thesis Validation Service',
  },

  // Dev Test Menu
  devTestTitle: {
    th: 'เครื่องมือทดสอบระบบ (Dev Test)',
    en: 'Developer Test Tools',
  },
  devTestClose: {
    th: 'ปิด',
    en: 'Close',
  },
  devTestNotDefended: {
    th: '⚠️ ทดสอบ: ยังไม่สอบ วพ.',
    en: '⚠️ Test: Not Defended Yet',
  },
  devTestNotFound: {
    th: '❌ ทดสอบ: ไม่พบสิทธิ์ ป.โท/เอก',
    en: '❌ Test: Not a Grad Student',
  },
  devTestSuccess: {
    th: '✅ ทดสอบ: บัญชีผ่านเกณฑ์ (Live)',
    en: '✅ Test: Fully Eligible (Live)',
  },

  // Dashboard / After Login
  welcomeBack: {
    th: 'สวัสดี',
    en: 'Welcome',
  },
  dashboardHeadline: {
    th: 'พร้อมตรวจสอบวิทยานิพนธ์ของคุณแล้วหรือยัง?',
    en: 'Ready to validate your thesis with AI?',
  },
  dashboardSubheadline: {
    th: 'ระบบ AI ของบัณฑิตวิทยาลัยจะช่วยตรวจสอบรูปแบบ การจัดหน้า ลายเซ็นดิจิทัล และความสมบูรณ์ของเล่มวิทยานิพนธ์อย่างแม่นยำ',
    en: 'The Graduate School AI system will precisely verify your layout formatting, margins, digital signatures, and thesis completeness.',
  },
  startValidationCTA: {
    th: 'เริ่มตรวจสอบวิทยานิพนธ์',
    en: 'Start Thesis Validation',
  },
  uploadThesisCTA: {
    th: 'อัปโหลดไฟล์วิทยานิพนธ์',
    en: 'Upload Thesis File',
  },
  refreshGsmis: {
    th: 'รีเฟรชข้อมูล GSMIS',
    en: 'Refresh GSMIS Data',
  },
  eligibleBannerTitle: {
    th: 'ผ่านเกณฑ์การตรวจสอบสิทธิ์ครบถ้วน',
    en: 'All Eligibility Criteria Passed',
  },
  eligibleBannerBadge: {
    th: 'พร้อมส่งตรวจวิทยานิพนธ์',
    en: 'Ready for Thesis Validation',
  },
  eligibleBannerDesc: {
    th: 'ข้อมูลนักศึกษา, หัวข้อวิทยานิพนธ์ และแบบฟอร์มคำร้อง บว. 25, 26, 27, 28 ผ่านการอนุมัติในระบบ GSMIS ครบถ้วน สามารถอัปโหลดไฟล์ด้านล่างได้ทันที',
    en: 'Student information, approved thesis title, and forms GS 25, 26, 27, 28 are fully approved in GSMIS. You can upload your thesis below.',
  },
  ineligibleBannerTitle: {
    th: 'ตรวจสอบสิทธิ์: มีรายการที่ต้องดำเนินการเพิ่มเติม',
    en: 'Action Required: Pending Prerequisites',
  },
  ineligibleBannerBadge: {
    th: 'รอการดำเนินการ',
    en: 'Pending Requirements',
  },
  ineligibleBannerDesc: {
    th: 'พบข้อมูลที่ยังไม่ครบถ้วน กรุณาตรวจสอบ Checklist ด้านล่าง และดำเนินการในระบบ GSMIS ให้เรียบร้อยก่อนส่งตรวจ',
    en: 'Incomplete requirements detected. Please review the checklist below and complete actions in the GSMIS system.',
  },

  // 4 Compact Visual Workflow Steps (Dashboard)
  workflowHeader: {
    th: 'ขั้นตอนการตรวจสอบวิทยานิพนธ์ (Workflow)',
    en: 'Thesis Validation Workflow',
  },
  cWfStep1Title: {
    th: 'อัพโหลดไฟล์',
    en: 'Upload File',
  },
  cWfStep1Sub: {
    th: '',
    en: '',
  },
  cWfStep2Title: {
    th: 'ตรวจสอบรูปเล่ม',
    en: 'Thesis Layout Check',
  },
  cWfStep2Sub: {
    th: '',
    en: '',
  },
  cWfStep3Title: {
    th: 'ตรวจสอบลายเซ็นดิจิทัล',
    en: 'Digital Signature Verification',
  },
  cWfStep3Sub: {
    th: '',
    en: '',
  },
  cWfStep4Title: {
    th: 'ตรวจสอบเรียบร้อย',
    en: 'Validation Complete',
  },
  cWfStep4Sub: {
    th: '',
    en: '',
  },
  readyToValidateDesc: {
    th: 'พร้อมตรวจสอบวิทยานิพนธ์ของคุณแล้ว',
    en: 'Ready to validate your thesis with AI',
  },
  noFileYetTitle: {
    th: 'ยังไม่ได้อัปโหลดไฟล์วิทยานิพนธ์',
    en: 'No thesis file uploaded yet',
  },
  noFileYetDesc: {
    th: 'ลากไฟล์ PDF หรือ DOCX มาวางที่นี่ หรือคลิกปุ่มด้านล่างเพื่อเริ่มการตรวจสอบ',
    en: 'Drag and drop your PDF or DOCX file here or click below to start validation',
  },
  quickDetailsTab: {
    th: 'ข้อมูลวิทยานิพนธ์ & บว. 25-28',
    en: 'Thesis & GS Forms Overview',
  },

  // Upload Success Modal
  uploadSuccessModalTitle: {
    th: 'อัปโหลดไฟล์สำเร็จ',
    en: 'Upload Successful',
  },
  uploadSuccessModalMessage: {
    th: 'ระบบได้ตรวจสอบไฟล์วิทยานิพนธ์ของคุณเรียบร้อยแล้ว กรุณาตรวจสอบผล ที่หน้าระบบ หรือ อีเมลของท่าน',
    en: 'Your thesis file has been verified. Please check the results on the system page or in your email.',
  },
  uploadSuccessModalBtn: {
    th: 'รับทราบ',
    en: 'OK',
  },
  coverFileLabel: {
    th: 'ภาพหน้าปกวิทยานิพนธ์ (PNG หน้าแรก)',
    en: 'Thesis Cover Image (PNG Page 1)',
  },
  coverConverting: {
    th: 'กำลังแปลงหน้าปกหน้าแรกเป็นไฟล์ภาพ PNG...',
    en: 'Converting first page to PNG cover image...',
  },
  coverConvertedBadge: {
    th: 'แปลงจากหน้าแรกอัตโนมัติ (PNG)',
    en: 'Auto-converted from Page 1 (PNG)',
  },
  coverPreviewTitle: {
    th: 'ตัวอย่างภาพหน้าปก (Cover PNG Preview)',
    en: 'Thesis Cover PNG Preview',
  },

  // Status Cards (Dashboard)
  statusSubmissionElig: {
    th: 'สิทธิ์การยื่น',
    en: 'Submission Eligibility',
  },
  statusThesisFile: {
    th: 'ไฟล์วิทยานิพนธ์',
    en: 'Thesis File',
  },
  statusFormatCheck: {
    th: 'การตรวจรูปแบบ',
    en: 'Format Check',
  },
  statusDigitalSign: {
    th: 'ลายเซ็นดิจิทัล',
    en: 'Digital Signature',
  },
  statusOverall: {
    th: 'สถานะภาพรวม',
    en: 'Overall Status',
  },
  statusConnected: {
    th: 'GSMIS Connected',
    en: 'GSMIS Connected',
  },
  statusNotUploaded: {
    th: 'ยังไม่ได้อัปโหลด',
    en: 'Not Uploaded',
  },
  statusUploadedReady: {
    th: 'อัปโหลดเรียบร้อย',
    en: 'Uploaded & Ready',
  },
  statusPendingReview: {
    th: 'รอตรวจ',
    en: 'Pending Review',
  },
  statusPassed: {
    th: 'ผ่านเกณฑ์',
    en: 'Passed',
  },
  statusNeedsEdit: {
    th: 'ต้องแก้ไข',
    en: 'Needs Revision',
  },
  statusReadyToSubmit: {
    th: 'พร้อมส่ง',
    en: 'Ready to Submit',
  },
  statusNotReady: {
    th: 'ยังไม่พร้อม',
    en: 'Not Ready Yet',
  },

  // Student Profile Summary
  studentInfoTitle: {
    th: 'ข้อมูลนักศึกษา',
    en: 'Student Information',
  },
  studentCodeLabel: {
    th: 'รหัสนักศึกษา:',
    en: 'Student ID:',
  },
  educationLevelLabel: {
    th: 'ระดับการศึกษา:',
    en: 'Degree Level:',
  },
  facultyLabel: {
    th: 'คณะ:',
    en: 'Faculty:',
  },
  programLabel: {
    th: 'หลักสูตร/สาขาวิชา:',
    en: 'Program / Major:',
  },
  officialEmailLabel: {
    th: 'อีเมลทางการ:',
    en: 'Official Email:',
  },
  eligStatusLabel: {
    th: 'สถานะสิทธิ์:',
    en: 'Eligibility Status:',
  },
  gsmisStatusLabel: {
    th: 'GSMIS Status:',
    en: 'GSMIS Status:',
  },
  activeStatus: {
    th: 'ปกติ (Active)',
    en: 'Active',
  },
  advisorInfoTitle: {
    th: 'อาจารย์ที่ปรึกษาวิทยานิพนธ์',
    en: 'Thesis Advisor',
  },
  mainAdvisorBadge: {
    th: 'ที่ปรึกษาหลัก',
    en: 'Main Advisor',
  },
  thesisDetailsTitle: {
    th: 'หัวข้อวิทยานิพนธ์',
    en: 'Thesis Title',
  },
  thesisTitleTh: {
    th: 'ชื่อภาษาไทย:',
    en: 'Thai Title:',
  },
  thesisTitleEn: {
    th: 'ชื่อภาษาอังกฤษ:',
    en: 'English Title:',
  },
  thesisCode: {
    th: 'รหัสวิทยานิพนธ์:',
    en: 'Thesis Code:',
  },

  // Upload Section (NO TURNITIN)
  uploadSectionTitle: {
    th: 'อัปโหลดไฟล์วิทยานิพนธ์เพื่อตรวจสอบรูปแบบ (Supabase Storage)',
    en: 'Upload Thesis File for Validation (Supabase Storage)',
  },
  uploadSectionDesc: {
    th: 'ระบบจะจัดเก็บไฟล์ลงในโฟลเดอร์ Thesis/ และตั้งชื่อไฟล์ตามรหัสนักศึกษาโดยอัตโนมัติ',
    en: 'Files are securely stored in the Thesis/ directory and automatically named with your student ID.',
  },
  readyToReceive: {
    th: 'พร้อมรับไฟล์',
    en: 'Ready to Receive',
  },
  thesisFileLabel: {
    th: 'ไฟล์เล่มวิทยานิพนธ์ฉบับสมบูรณ์ (PDF / DOCX)',
    en: 'Full Thesis Document (PDF / DOCX)',
  },
  fileExtNote: {
    th: 'นามสกุล .pdf, .docx',
    en: 'Supports .pdf, .docx',
  },
  clickOrDrag: {
    th: 'คลิกเพื่อเลือกไฟล์ หรือ ลากไฟล์มาวางที่นี่',
    en: 'Click to select file or drag & drop here',
  },
  autoNaming: {
    th: 'ตั้งชื่ออัตโนมัติ: thesis_{studentCode}_timestamp.pdf',
    en: 'Auto named: thesis_{studentCode}_timestamp.pdf',
  },
  uploadAndValidateBtn: {
    th: 'อัปโหลดไฟล์และเริ่มตรวจรูปแบบ AI',
    en: 'Upload & Start AI Validation',
  },
  uploadingText: {
    th: 'กำลังอัปโหลดและประมวลผล...',
    en: 'Uploading and processing...',
  },
  uploadSuccess: {
    th: 'อัปโหลดไฟล์สำเร็จ',
    en: 'Upload Successful',
  },
  viewFile: {
    th: 'ดูไฟล์',
    en: 'View File',
  },
  pleaseSelectThesisFile: {
    th: 'กรุณาเลือกไฟล์เล่มวิทยานิพนธ์ (.pdf หรือ .docx)',
    en: 'Please select a thesis file (.pdf or .docx)',
  },

  // Tabs & Forms
  tabForms: {
    th: 'แบบฟอร์มคำร้องออนไลน์',
    en: 'Online GS Forms',
  },
  tabTimeline: {
    th: 'ชำระค่าปรับการส่งเล่มล่าช้า',
    en: 'Late Submission Fine',
  },
  tabPublications: {
    th: 'ผลงานตีพิมพ์/เผยแพร่',
    en: 'Publications',
  },
  approvedStatus: {
    th: 'อนุมัติแล้ว',
    en: 'Approved',
  },
  pendingStatus: {
    th: 'รอดำเนินการ',
    en: 'Pending',
  },
  englishSkillTitle: {
    th: 'ผลการทดสอบภาษาอังกฤษ:',
    en: 'English Proficiency Test:',
  },
  englishPassed: {
    th: 'ผ่านเกณฑ์ (Passed)',
    en: 'Passed',
  },
  englishNotPassed: {
    th: 'ยังไม่ผ่านเกณฑ์',
    en: 'Not Passed',
  },

  // Modals
  alertNotGradTitle: {
    th: 'แจ้งเตือนสถานะนักศึกษา',
    en: 'Student Status Alert',
  },
  alertNotDefendedTitle: {
    th: 'แจ้งเตือนขั้นตอนวิทยานิพนธ์',
    en: 'Thesis Examination Alert',
  },
  alertSystemTitle: {
    th: 'แจ้งเตือนระบบ',
    en: 'System Notification',
  },
  alertGsSystem: {
    th: 'ระบบตรวจสอบสิทธิ์ บัณฑิตวิทยาลัย มข.',
    en: 'Graduate School KKU Eligibility System',
  },
  alertNotGradHeading: {
    th: 'ไม่พบนักศึกษาหรือคุณไม่ใช้นักศึกษาระดับบัณฑิตศึกษา',
    en: 'Student Record Not Found / Not a Graduate Student',
  },
  alertNotGradDesc: {
    th: 'ระบบไม่พบข้อมูลในฐานข้อมูลนักศึกษาระดับบัณฑิตศึกษา (ป.โท / ป.เอก) กรุณาตรวจสอบอีเมล KKU หรือติดต่อฝ่ายบริการการศึกษา',
    en: 'No matching record in the Graduate School database (Master / Ph.D.). Please check your KKU email or contact GS Education Services.',
  },
  alertNotDefendedHeading: {
    th: 'ให้สอบวิทยานิพนธ์ให้เรียบร้อย',
    en: 'Thesis Defense Examination Required',
  },
  alertNotDefendedDesc: {
    th: 'นักศึกษายังไม่มีข้อมูลการสอบวิทยานิพนธ์/หัวข้อวิทยานิพนธ์ที่ผ่านการอนุมัติในระบบ GSMIS กรุณาดำเนินการสอบและยื่นเอกสารให้ครบถ้วนก่อนส่งตรวจไฟล์',
    en: 'No approved thesis defense examination recorded in GSMIS. Please complete your defense examination and required GS forms first.',
  },
  goToGsmis: {
    th: 'ไปยังระบบสารสนเทศ GSMIS บัณฑิตวิทยาลัย',
    en: 'Go to Graduate School GSMIS Portal',
  },
  acknowledgeBtn: {
    th: 'รับทราบ',
    en: 'Acknowledge',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'th',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: keyof typeof translations, fallback?: string) => fallback || String(key),
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('gskku_lang');
      if (saved === 'th' || saved === 'en') return saved;
      return 'th'; // Default to Thai
    } catch {
      return 'th';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gskku_lang', language);
      document.documentElement.lang = language;
    } catch (e) {
      console.warn('Language persistence error:', e);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'th' ? 'en' : 'th'));
  };

  const t = (key: keyof typeof translations, fallback?: string): string => {
    const entry = translations[key];
    if (!entry) return fallback || String(key);
    return entry[language] || entry.th || fallback || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
