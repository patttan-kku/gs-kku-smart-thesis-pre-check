import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  FileSignature,
  ScanLine,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building,
  User,
  BookOpen,
  Calendar,
  Layers,
  HelpCircle,
  ImageIcon,
  Maximize2,
  X
} from 'lucide-react';
import { N8nCheckThesisResult, UploadedFileMeta } from '../types';

interface ThesisValidationResultCardProps {
  result?: N8nCheckThesisResult | null;
  webhookStatus?: string;
  webhookError?: string | null;
  thesisFileMeta?: UploadedFileMeta;
  coverFileMeta?: UploadedFileMeta;
  studentEmail?: string;
}

export const ThesisValidationResultCard: React.FC<ThesisValidationResultCardProps> = ({
  result,
  webhookStatus,
  webhookError,
  thesisFileMeta,
  coverFileMeta,
  studentEmail,
}) => {
  const [showCoverViewer, setShowCoverViewer] = useState(false);

  if (!result && !webhookError) {
    return null;
  }

  // Case: n8n failed or success !== true
  if (!result || result.success !== true) {
    return (
      <div className="bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-700/60 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-300">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
              ระบบไม่สามารถตรวจสอบวิทยานิพนธ์ได้สำเร็จ กรุณาลองใหม่อีกครั้ง
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
              {webhookError || result?.error || 'เซิร์ฟเวอร์ตรวจสอบ AI ขัดข้องชั่วคราวหรือไม่สามารถอ่านข้อมูลจากไฟล์ได้'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isOverallValid = result.overall_valid === true;
  const signatureData = result.digital_signature;
  const signatureSummary = signatureData?.evaluation_summary;
  const signatureChecks = signatureSummary?.['รายละเอียดการเช็ค'];
  const isSignatureValid = signatureData?.is_signature_valid === true;

  const coverData = result.cover_analysis?.result;
  const isCoverValid = coverData?.overall_cover_valid === true;

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5 animate-in fade-in duration-300">
      
      {/* 1. Header & Overall Result Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EB5E10]/10 text-[#EB5E10] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>ผลการตรวจสอบวิทยานิพนธ์ด้วย AI</span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                n8n Live Engine
              </span>
            </h3>
            {thesisFileMeta?.fileName && (
              <p className="text-xs text-stone-500 dark:text-stone-400 font-mono truncate max-w-md">
                ไฟล์: {thesisFileMeta.originalName || thesisFileMeta.fileName}
              </p>
            )}
          </div>
        </div>

        {/* Overall Status Badge */}
        <div>
          {isOverallValid ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ผ่านการตรวจสอบเบื้องต้น</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-[#EB5E10]/40 text-[#EB5E10] text-xs font-bold shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-[#EB5E10]" />
              <span>พบรายการที่ต้องแก้ไข</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Success Email Confirmation Notice */}
      <div className="p-3.5 rounded-xl bg-[#EB5E10]/5 dark:bg-[#EB5E10]/10 border border-[#EB5E10]/20 flex items-start gap-2.5 text-xs text-stone-700 dark:text-stone-300">
        <ShieldCheck className="w-4 h-4 text-[#EB5E10] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          ระบบได้รับและประมวลผลไฟล์ของคุณเรียบร้อยแล้ว ผลการตรวจสอบจะถูกส่งไปยังอีเมลมหาวิทยาลัยของคุณ {studentEmail ? `(${studentEmail})` : ''}
        </p>
      </div>

      {/* 3. Detailed Results Grid: Cover Analysis & Digital Signature */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* ========================================================= */}
        {/* Section A: Digital Signature Result                       */}
        {/* ========================================================= */}
        <div className="p-4 rounded-xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <FileSignature className="w-4 h-4 text-[#D09B2C]" />
                <span>ลายเซ็นดิจิทัล (Digital Signature)</span>
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
                  isSignatureValid
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                }`}
              >
                {isSignatureValid ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>ผ่าน</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>ไม่ผ่าน</span>
                  </>
                )}
              </span>
            </div>

            {signatureData ? (
              <div className="pt-2 space-y-2.5 text-xs text-stone-600 dark:text-stone-300">
                {/* Meta details */}
                <div className="space-y-1.5 bg-white dark:bg-stone-900 p-2.5 rounded-lg border border-stone-200/60 dark:border-stone-800">
                  <div className="flex justify-between">
                    <span className="text-stone-500">สถานะการตรวจสอบ:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {signatureSummary?.['สถานะการตรวจสอบ'] || (isSignatureValid ? 'ผ่านเกณฑ์ (PASS)' : 'ไม่ผ่านเกณฑ์ (FAIL)')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">อีเมลผู้ลงนาม:</span>
                    <span className="font-medium text-stone-700 dark:text-stone-300">
                      {signatureSummary?.['อีเมลผู้ลงนาม'] || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">วันหมดอายุใบรับรอง:</span>
                    <span className="font-medium text-stone-700 dark:text-stone-300">
                      {signatureSummary?.['วันหมดอายุใบรับรอง'] || '-'}
                    </span>
                  </div>
                </div>

                {/* Boolean Checks List */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                    รายการตรวจสอบย่อย
                  </span>
                  
                  {/* พบโครงสร้างลายเซ็น */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 text-xs">
                    <span className="text-stone-700 dark:text-stone-300">พบโครงสร้างลายเซ็น</span>
                    {signatureChecks?.['พบโครงสร้างลายเซ็น'] === true ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11.5px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>พบสมบูรณ์</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600 font-semibold text-[11.5px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>ไม่พบโครงสร้าง</span>
                      </span>
                    )}
                  </div>

                  {/* ออกโดยมหาวิทยาลัย */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 text-xs">
                    <span className="text-stone-700 dark:text-stone-300">ออกโดยมหาวิทยาลัย</span>
                    {signatureChecks?.['ออกโดยมหาวิทยาลัย'] === true ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11.5px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>รับรองโดย มข.</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-stone-500 font-semibold text-[11.5px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span>ยังไม่รับรอง</span>
                      </span>
                    )}
                  </div>

                  {/* สถานะอายุใบรับรอง */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 text-xs">
                    <span className="text-stone-700 dark:text-stone-300">สถานะอายุใบรับรอง</span>
                    {signatureChecks?.['สถานะอายุใบรับรอง'] === true ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11.5px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ใบรับรองยังไม่หมดอายุ</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600 font-semibold text-[11.5px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>หมดอายุหรือระบุไม่ได้</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-4 text-center">
                ยังไม่มีผลการตรวจในส่วนนี้
              </p>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* Section B: Cover Analysis Result                          */}
        {/* ========================================================= */}
        <div className="p-4 rounded-xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <ScanLine className="w-4 h-4 text-[#EB5E10]" />
                <span>ผลการตรวจหน้าปกวิทยานิพนธ์ (Cover Analysis)</span>
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
                  isCoverValid
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                    : 'bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300'
                }`}
              >
                {isCoverValid ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>ผ่านเกณฑ์</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-3 h-3 text-stone-500" />
                    <span>ต้องปรับปรุง</span>
                  </>
                )}
              </span>
            </div>

            {coverData ? (
              <div className="pt-2 space-y-2.5 text-xs text-stone-600 dark:text-stone-300">
                {/* Meta details */}
                <div className="space-y-1.5 bg-white dark:bg-stone-900 p-2.5 rounded-lg border border-stone-200/60 dark:border-stone-800">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">ตรามหาวิทยาลัย:</span>
                    {coverData.logo_detected ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ตรวจพบตรา มข.</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>ไม่พบตรา</span>
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">ขนาดตรา:</span>
                    <span className="font-medium text-stone-700 dark:text-stone-300">
                      {coverData.logo_size_evaluation || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">ตำแหน่งตรา:</span>
                    <span className="font-medium text-stone-700 dark:text-stone-300">
                      {coverData.logo_position_evaluation || '-'}
                    </span>
                  </div>
                  {coverData.thesis_title_text && (
                    <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
                      <span className="text-stone-500 block text-[11px]">ชื่อวิทยานิพนธ์ที่ตรวจพบ:</span>
                      <span className="font-medium text-stone-800 dark:text-stone-200 line-clamp-2">
                        {coverData.thesis_title_text}
                      </span>
                    </div>
                  )}
                  {coverData.author_name_text && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">ชื่อผู้เขียน:</span>
                      <span className="font-medium text-stone-700 dark:text-stone-300">
                        {coverData.author_name_text}
                      </span>
                    </div>
                  )}
                  {coverData.university_name_text && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">มหาวิทยาลัย:</span>
                      <span className="font-medium text-stone-700 dark:text-stone-300">
                        {coverData.university_name_text}
                      </span>
                    </div>
                  )}
                  {coverData.publication_year_text && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">ปีการศึกษา:</span>
                      <span className="font-medium text-stone-700 dark:text-stone-300">
                        {coverData.publication_year_text}
                      </span>
                    </div>
                  )}
                </div>

                {/* reasoning_th ONLY (Strict Rule: Do not display cover_analysis.reasoning) */}
                {coverData.reasoning_th && (
                  <div className="bg-white dark:bg-stone-900 p-2.5 rounded-lg border border-stone-200/60 dark:border-stone-800 space-y-1">
                    <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                      คำอธิบายผลการตรวจหน้าปก
                    </span>
                    <p className="text-[11.5px] text-stone-700 dark:text-stone-300 leading-relaxed">
                      {coverData.reasoning_th}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-4 text-center">
                ยังไม่มีผลการตรวจในส่วนนี้
              </p>
            )}
          </div>
        </div>

      </div>

      {/* 4. Footer link to Supabase files (PDF and Cover PNG) */}
      {(thesisFileMeta?.url || coverFileMeta?.url) && (
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-t border-stone-100 dark:border-stone-800">
          <span className="text-[11px] text-stone-400 font-mono">
            จัดเก็บไฟล์ต้นฉบับ: Supabase Storage / Thesis
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {coverFileMeta?.url && (
              <a
                href={coverFileMeta.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold transition"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>เปิดดูภาพหน้าปก (PNG)</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            )}
            {thesisFileMeta?.url && (
              <a
                href={thesisFileMeta.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition"
              >
                <span>เปิดดูไฟล์เล่มเต็ม (PDF)</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#EB5E10]" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Cover Image Viewer Modal if clicked */}
      {showCoverViewer && coverFileMeta?.url && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowCoverViewer(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-4 space-y-3 border border-stone-200 dark:border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#EB5E10]" />
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ภาพหน้าปกวิทยานิพนธ์ (Cover Page 1)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowCoverViewer(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-stone-100 dark:bg-stone-950 p-2 rounded-xl border border-stone-200 dark:border-stone-800">
              <img
                src={coverFileMeta.url}
                alt="Thesis Cover"
                className="max-h-[65vh] w-auto object-contain rounded shadow"
              />
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-mono text-stone-400 truncate">{coverFileMeta.fileName}</span>
              <a
                href={coverFileMeta.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#EB5E10] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>เปิดในแท็บใหม่</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
