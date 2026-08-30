export interface StudentInfo {
  studentcode?: string;
  stdcode?: string;
  code?: string;
  studentname?: string;
  studentnameeng?: string;
  prename?: string;
  firstname?: string;
  lastname?: string;
  prenameeng?: string;
  firstnameeng?: string;
  lastnameeng?: string;
  nationid?: string;
  prefixid?: string;
  facultyid?: string;
  faculty?: string;
  facultyeng?: string;
  facultyname?: string;
  programname?: string;
  levelname?: string;
  studentstatusthai?: string;
  email?: string;
  contact_mobile?: string;
  admit_date?: string;
  levelid?: string | number;
}

export interface FormItem {
  code?: string;
  code_name_th?: string;
  name_th?: string;
  name_en?: string;
  status?: string;
  is_finished?: boolean | string;
  signatures_order?: number;
  approved_date?: string;
}

export interface ThesisInfo {
  name?: string;
  nameeng?: string;
  type?: string;
  status?: string;
  code?: string;
}

export interface AdvisorInfo {
  name?: string;
  nameeng?: string;
  position?: string;
  advisor_type?: string;
}

export interface EnglishSkill {
  is_eng_passed?: string | boolean;
  eng_passed_comment?: string;
}

export interface ThesisLog {
  thesiseventid?: string;
  eventdate?: string;
  description?: string;
}

export interface PublicationItem {
  title?: string;
  type?: string;
  typeeng?: string;
  approved_on?: string;
}

export interface GsmisWebhookResponse {
  message?: string;
  student?: StudentInfo;
  thesis?: ThesisInfo;
  advisor?: AdvisorInfo;
  advisors?: AdvisorInfo[];
  forms?: FormItem[];
  englishskill?: EnglishSkill;
  thesislogs?: ThesisLog[];
  publications?: PublicationItem[];
  thesiscorrects?: {
    code?: string;
  };
  // Direct raw fields mapping
  stdcode?: string;
  code?: string;
  prename?: string;
  firstname?: string;
  lastname?: string;
  prenameeng?: string;
  firstnameeng?: string;
  lastnameeng?: string;
  faculty?: string;
  facultyeng?: string;
  [key: string]: any;
}

export interface UploadedFileMeta {
  originalName: string;
  fileName: string;
  path: string;
  url?: string;
}

export interface DigitalSignatureDetailChecks {
  'พบโครงสร้างลายเซ็น'?: boolean;
  'ออกโดยมหาวิทยาลัย'?: boolean;
  'สถานะอายุใบรับรอง'?: boolean;
  [key: string]: any;
}

export interface DigitalSignatureEvaluationSummary {
  'สถานะการตรวจสอบ'?: string;
  'อีเมลผู้ลงนาม'?: string;
  'วันหมดอายุใบรับรอง'?: string;
  'รายละเอียดการเช็ค'?: DigitalSignatureDetailChecks;
  [key: string]: any;
}

export interface DigitalSignatureResult {
  is_signature_valid?: boolean;
  evaluation_summary?: DigitalSignatureEvaluationSummary;
  [key: string]: any;
}

export interface CoverAnalysisResultDetail {
  logo_detected?: boolean;
  logo_size_evaluation?: string;
  logo_position_evaluation?: string;
  thesis_title_text?: string;
  author_name_text?: string;
  university_name_text?: string;
  publication_year_text?: string;
  overall_cover_valid?: boolean;
  reasoning_th?: string;
  [key: string]: any;
}

export interface CoverAnalysisResult {
  result?: CoverAnalysisResultDetail;
  // Note: we never display internal AI reasoning in UI
  reasoning?: string;
  [key: string]: any;
}

export interface N8nCheckThesisResult {
  success?: boolean;
  digital_signature?: DigitalSignatureResult;
  cover_analysis?: CoverAnalysisResult;
  overall_valid?: boolean;
  error?: string;
  [key: string]: any;
}

export interface UploadThesisResponse {
  success: boolean;
  message: string;
  storage?: string;
  verified?: boolean;
  thesis?: UploadedFileMeta;
  cover?: UploadedFileMeta;
  turnitin?: UploadedFileMeta;
  error?: string;
  details?: string;
  checkThesisWebhook?: {
    endpoint: string;
    status: string;
    result?: N8nCheckThesisResult;
    error?: string | null;
  };
}

export type AlertModalType = 'none' | 'not_defended' | 'not_grad_student' | 'custom';
