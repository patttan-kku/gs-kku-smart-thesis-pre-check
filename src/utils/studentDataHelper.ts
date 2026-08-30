import { GsmisWebhookResponse, StudentInfo, FormItem, ThesisInfo, AdvisorInfo } from '../types';

export function normalizeStudentData(raw: GsmisWebhookResponse): {
  student: StudentInfo;
  thesis: ThesisInfo | null;
  advisor: AdvisorInfo | null;
  advisors: AdvisorInfo[];
  forms: FormItem[];
} {
  const s = raw.student || {};

  const studentcode =
    raw.stdcode ||
    raw.code ||
    s.studentcode ||
    s.stdcode ||
    s.code ||
    '';

  const prenameTh = raw.prename || s.prename || (raw as any).prefix || (s as any).prefix || '';
  let firstnameTh = raw.firstname || s.firstname || (raw as any).first_name || (s as any).first_name || (raw as any).fname || (s as any).fname || '';
  let lastnameTh = raw.lastname || s.lastname || (raw as any).last_name || (s as any).last_name || (raw as any).lname || (s as any).lname || '';

  const rawStudentName = s.studentname || (raw as any).studentname || (raw as any).student_name || (raw as any).name || '';
  if (rawStudentName && (!firstnameTh || !lastnameTh)) {
    const cleaned = rawStudentName.replace(/^(นาย|นางสาว|นาง|ดร\.|อาจารย์|ผศ\.|รศ\.|ศ\.|Mr\.|Mrs\.|Miss|Dr\.)\s*/i, '').trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      if (!firstnameTh) firstnameTh = parts[0];
      if (!lastnameTh) lastnameTh = parts.slice(1).join(' ');
    } else if (parts.length === 1 && !firstnameTh) {
      firstnameTh = parts[0];
    }
  }

  const studentname =
    rawStudentName ||
    [prenameTh, firstnameTh, lastnameTh].filter(Boolean).join(' ') ||
    'นักศึกษา';

  const prenameEn = raw.prenameeng || s.prenameeng || '';
  let firstnameEn = raw.firstnameeng || s.firstnameeng || (raw as any).first_name_en || (s as any).first_name_en || '';
  let lastnameEn = raw.lastnameeng || s.lastnameeng || (raw as any).last_name_en || (s as any).last_name_en || '';
  const rawStudentNameEng = s.studentnameeng || (raw as any).studentnameeng || '';
  if (rawStudentNameEng && (!firstnameEn || !lastnameEn)) {
    const cleanedEn = rawStudentNameEng.replace(/^(Mr\.|Mrs\.|Miss|Dr\.|Assoc\.\s*Prof\.|Asst\.\s*Prof\.)\s*/i, '').trim();
    const partsEn = cleanedEn.split(/\s+/).filter(Boolean);
    if (partsEn.length >= 2) {
      if (!firstnameEn) firstnameEn = partsEn[0];
      if (!lastnameEn) lastnameEn = partsEn.slice(1).join(' ');
    } else if (partsEn.length === 1 && !firstnameEn) {
      firstnameEn = partsEn[0];
    }
  }

  const studentnameeng =
    rawStudentNameEng ||
    [prenameEn, firstnameEn, lastnameEn].filter(Boolean).join(' ') ||
    '';

  const facultyname =
    raw.faculty ||
    s.faculty ||
    s.facultyname ||
    '';

  const facultynameeng =
    raw.facultyeng ||
    s.facultyeng ||
    '';

  const student: StudentInfo = {
    ...s,
    studentcode,
    stdcode: studentcode,
    code: studentcode,
    prename: prenameTh,
    firstname: firstnameTh,
    lastname: lastnameTh,
    prenameeng: prenameEn,
    firstnameeng: firstnameEn,
    lastnameeng: lastnameEn,
    studentname,
    studentnameeng,
    facultyname: facultyname || 'คณะมนุษยศาสตร์และสังคมศาสตร์',
    facultyeng: facultynameeng || 'Humanities and Social Sciences',
    programname: s.programname || 'สาขาวิชาสารสนเทศศาสตร์และนวัตกรรมดิจิทัล',
    levelname: s.levelname || 'ปริญญาโท (Master Degree)',
    studentstatusthai: s.studentstatusthai || 'ปกติ (Active)',
    email: raw.email || s.email || '',
    contact_mobile: s.contact_mobile || '08x-xxx-xxxx',
    admit_date: s.admit_date || '2567',
  };

  const thesis: ThesisInfo | null = raw.thesis || {
    name: 'การพัฒนาระบบตรวจสอบวิทยานิพนธ์ด้วยปัญญาประดิษฐ์',
    nameeng: 'Development of AI-Powered Thesis Verification System',
    type: 'วิทยานิพนธ์ (Thesis)',
    status: 'อนุมัติหัวข้อแล้ว (Approved)',
    code: raw.thesiscorrects?.code || 'GS-THESIS-2567',
  };

  // Comprehensive Advisor Extraction (from raw.advisor, raw.advisors, raw.advisor_name, majoradvisor, thesis.advisor, etc.)
  let extractedAdvisors: AdvisorInfo[] = [];

  if (Array.isArray(raw.advisors) && raw.advisors.length > 0) {
    extractedAdvisors = raw.advisors.map((adv: any) => {
      if (typeof adv === 'string') {
        return { name: adv, position: 'กรรมการที่ปรึกษา' };
      }
      return adv;
    });
  } else if (raw.advisor) {
    if (typeof raw.advisor === 'string') {
      extractedAdvisors = [{ name: raw.advisor, position: 'ประธานกรรมการที่ปรึกษา', advisor_type: 'อาจารย์ที่ปรึกษาหลัก' }];
    } else {
      extractedAdvisors = [raw.advisor];
    }
  } else if (raw.advisor_name || raw.advisorname || raw.majoradvisor) {
    const advName = raw.advisor_name || raw.advisorname || raw.majoradvisor;
    extractedAdvisors = [
      {
        name: advName,
        nameeng: raw.advisor_name_en || raw.advisornameeng || '',
        position: 'ประธานกรรมการที่ปรึกษา',
        advisor_type: 'อาจารย์ที่ปรึกษาหลัก',
      }
    ];
  } else if (raw.thesis?.advisor || (raw.thesis as any)?.advisor_name) {
    const adv = raw.thesis.advisor || (raw.thesis as any).advisor_name;
    if (typeof adv === 'string') {
      extractedAdvisors = [{ name: adv, position: 'ประธานกรรมการที่ปรึกษา' }];
    } else {
      extractedAdvisors = [adv];
    }
  } else if ((s as any)?.advisor || (s as any)?.advisor_name) {
    const adv = (s as any).advisor || (s as any).advisor_name;
    if (typeof adv === 'string') {
      extractedAdvisors = [{ name: adv, position: 'ประธานกรรมการที่ปรึกษา' }];
    } else {
      extractedAdvisors = [adv];
    }
  }

  // Fallback default advisor if none parsed
  if (extractedAdvisors.length === 0) {
    extractedAdvisors = [
      {
        name: 'รศ.ดร. ที่ปรึกษา วิทยานิพนธ์',
        nameeng: 'Assoc. Prof. Dr. Thesis Advisor',
        position: 'ประธานกรรมการที่ปรึกษา',
        advisor_type: 'อาจารย์ที่ปรึกษาหลัก',
      }
    ];
  }

  const primaryAdvisor: AdvisorInfo | null = extractedAdvisors[0] || null;

  const defaultForms: FormItem[] = [
    {
      code: 'GS25',
      code_name_th: 'บว. 25',
      name_th: 'คำร้องขอสอบวิทยานิพนธ์/การศึกษาอิสระ',
      name_en: 'Request for Thesis / Independent Study Examination',
      status: 'Approved',
      is_finished: true,
      signatures_order: 4,
    },
    {
      code: 'GS26',
      code_name_th: 'บว. 26',
      name_th: 'แบบเสนอแต่งตั้งคณะกรรมการสอบ',
      name_en: 'Appointment of Examination Committee',
      status: 'Approved',
      is_finished: true,
      signatures_order: 4,
    },
    {
      code: 'GS27',
      code_name_th: 'บว. 27',
      name_th: 'ใบแจ้งผลการสอบ',
      name_en: 'Examination Result Report',
      status: 'Approved',
      is_finished: true,
      signatures_order: 4,
    },
    {
      code: 'GS28',
      code_name_th: 'บว. 28',
      name_th: 'ใบรับรองการแก้ไข',
      name_en: 'Certificate of Revision',
      status: 'Approved',
      is_finished: true,
      signatures_order: 4,
    },
  ];

  const forms: FormItem[] =
    raw.forms && raw.forms.length > 0 ? raw.forms : defaultForms;

  return { student, thesis, advisor: primaryAdvisor, advisors: extractedAdvisors, forms };
}
