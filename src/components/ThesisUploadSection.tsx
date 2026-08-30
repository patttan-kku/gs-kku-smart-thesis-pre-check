import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Eye,
  Maximize2
} from 'lucide-react';
import { UploadThesisResponse } from '../types';
import { useLanguage } from '../LanguageContext';
import { SUPABASE_URL } from '../supabaseClient';
import { convertPdfFirstPageToPng, PdfCoverResult } from '../utils/pdfCoverExtractor';

interface ThesisUploadSectionProps {
  studentCode: string;
  studentEmail: string;
  workflowStage?: 'idle' | 'uploading_supabase' | 'checking_format' | 'checking_signature' | 'completed';
  onWorkflowStageChange?: (stage: 'idle' | 'uploading_supabase' | 'checking_format' | 'checking_signature' | 'completed') => void;
  uploadResult?: UploadThesisResponse | null;
  onUploadResultChange?: (result: UploadThesisResponse | null) => void;
}

export const ThesisUploadSection: React.FC<ThesisUploadSectionProps> = ({
  studentCode,
  studentEmail,
  workflowStage = 'idle',
  onWorkflowStageChange,
  uploadResult: externalUploadResult,
  onUploadResultChange,
}) => {
  const { t } = useLanguage();
  const [thesisFile, setThesisFile] = useState<File | null>(null);
  const [coverResult, setCoverResult] = useState<PdfCoverResult | null>(null);
  const [isConvertingCover, setIsConvertingCover] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [internalUploadResult, setInternalUploadResult] = useState<UploadThesisResponse | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const uploadResult = externalUploadResult !== undefined ? externalUploadResult : internalUploadResult;

  const setEffectiveUploadResult = (result: UploadThesisResponse | null) => {
    setInternalUploadResult(result);
    onUploadResultChange?.(result);
  };

  const setEffectiveWorkflowStage = (stage: 'idle' | 'uploading_supabase' | 'checking_format' | 'checking_signature' | 'completed') => {
    onWorkflowStageChange?.(stage);
  };

  useEffect(() => {
    console.log('Supabase Project URL:', SUPABASE_URL);
  }, []);

  // Process PDF to extract page 1 as PNG cover
  const processPdfFile = async (file: File) => {
    setThesisFile(file);
    setErrorMessage(null);
    setCoverResult(null);

    // If PDF file, auto-convert page 1 to PNG
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      setIsConvertingCover(true);
      try {
        const cover = await convertPdfFirstPageToPng(file, studentCode);
        setCoverResult(cover);
        console.log('PDF Page 1 converted to PNG successfully:', {
          fileName: cover.fileName,
          size: `${(cover.blob.size / 1024).toFixed(1)} KB`,
          dimensions: `${cover.width}x${cover.height}px`,
        });
      } catch (err: any) {
        console.warn('PDF cover extraction error (will proceed with PDF only):', err.message);
      } finally {
        setIsConvertingCover(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processPdfFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processPdfFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveFile = () => {
    setThesisFile(null);
    setCoverResult(null);
    setErrorMessage(null);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thesisFile) {
      setErrorMessage(t('pleaseSelectThesisFile'));
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);
    setErrorMessage(null);
    setEffectiveUploadResult(null);
    setEffectiveWorkflowStage('uploading_supabase');

    const formData = new FormData();
    formData.append('studentCode', studentCode || '675080020-3');
    formData.append('studentEmail', studentEmail);
    formData.append('thesisFile', thesisFile);

    // Attach converted PNG cover file if available
    if (coverResult?.file) {
      formData.append('coverFile', coverResult.file);
    }

    // Timers for natural progression during AI check
    const formatTimer = setTimeout(() => {
      setUploadProgress(55);
      setEffectiveWorkflowStage('checking_format');
    }, 1200);

    const signatureTimer = setTimeout(() => {
      setUploadProgress(80);
      setEffectiveWorkflowStage('checking_signature');
    }, 2800);

    try {
      setUploadProgress(35);
      const res = await fetch('/api/upload-thesis', {
        method: 'POST',
        body: formData,
      });

      clearTimeout(formatTimer);
      clearTimeout(signatureTimer);
      setUploadProgress(95);

      const contentType = res.headers.get('content-type') || '';
      let data: UploadThesisResponse;

      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const rawText = await res.text();
        console.error('Non-JSON response from upload endpoint:', rawText);
        throw new Error(
          res.ok
            ? 'การตอบกลับจากเซิร์ฟเวอร์ไม่อยู่ในรูปแบบ JSON'
            : `การเชื่อมต่อเซิร์ฟเวอร์ขัดข้อง (HTTP ${res.status})`
        );
      }

      if (!res.ok || !data.success || !data.thesis) {
        console.error('Supabase upload error:', data.details || data.error || data.message);
        throw new Error(data.details || data.error || data.message || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์ไปยัง Supabase Storage');
      }

      console.log('Supabase upload success:', data);
      console.log('SUPABASE UPLOAD RESULT', {
        project: SUPABASE_URL,
        bucket: 'Thesis',
        thesisPath: data.thesis.path,
        coverPath: data.cover?.path,
      });

      setUploadProgress(100);
      setEffectiveUploadResult(data);
      setEffectiveWorkflowStage('completed');
      setShowSuccessModal(true);
    } catch (err: any) {
      clearTimeout(formatTimer);
      clearTimeout(signatureTimer);
      console.error('Upload failed:', err);
      setErrorMessage(err.message || 'ไม่สามารถอัปโหลดไฟล์ไปยัง Supabase Storage ได้');
      setEffectiveWorkflowStage('idle');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div
        id="thesis-upload-container"
        className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 transition-colors duration-200"
      >
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-[#EB5E10]" />
              <span>{t('uploadSectionTitle')}</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {t('uploadSectionDesc')}
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-semibold">
            <ShieldCheck className="w-3 h-3" />
            {t('readyToReceive')}
          </span>
        </div>

        {/* Upload Dropzone Form */}
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#EB5E10]" />
                {t('thesisFileLabel')}
              </span>
              <span className="text-[11px] text-stone-400">{t('fileExtNote')}</span>
            </div>

            {/* Drop area */}
            {!thesisFile ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed rounded-xl p-5 sm:p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] border-stone-300 dark:border-stone-700 hover:border-[#EB5E10]/60 bg-stone-50/50 dark:bg-stone-950/50"
                onClick={() => document.getElementById('thesis-input')?.click()}
              >
                <input
                  id="thesis-input"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="space-y-1.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EB5E10]/10 text-[#EB5E10] flex items-center justify-center mx-auto">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                    {t('noFileYetTitle')}
                  </p>
                  <p className="text-[11px] text-stone-400 font-normal max-w-sm mx-auto">
                    {t('clickOrDrag')} (ระบบจะแปลงหน้าแรกเป็น PNG อัตโนมัติ)
                  </p>
                </div>
              </div>
            ) : (
              /* Selected Files View (2 Files: PDF + PNG Cover) */
              <div className="space-y-2.5 p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850/60 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200/70 dark:border-stone-800">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#EB5E10]" />
                    <span>รายการไฟล์พร้อมส่งตรวจ (2 Files: PDF + PNG)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-xs text-stone-400 hover:text-rose-500 flex items-center gap-1 cursor-pointer transition"
                    title="Remove and select another"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>เปลี่ยนไฟล์</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {/* 1. PDF File Card */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700/80 shadow-2xs">
                    <div className="flex items-center space-x-3 overflow-hidden text-left">
                      <div className="w-9 h-9 rounded-lg bg-[#EB5E10]/10 text-[#EB5E10] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-[#EB5E10]/10 text-[#EB5E10]">PDF</span>
                          <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                            {thesisFile.name}
                          </p>
                        </div>
                        <p className="text-[10.5px] text-stone-400 font-mono mt-0.5">
                          {(thesisFile.size / (1024 * 1024)).toFixed(2)} MB • เล่มวิทยานิพนธ์ฉบับเต็ม
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. PNG Cover Image Card (Generated from Page 1) */}
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700/80 shadow-2xs">
                    {isConvertingCover ? (
                      <div className="flex items-center gap-2.5 text-stone-500 dark:text-stone-400 py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#EB5E10]" />
                        <span className="text-xs">{t('coverConverting')}</span>
                      </div>
                    ) : coverResult ? (
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2.5">
                          {/* Thumbnail preview */}
                          <div
                            onClick={() => setShowCoverModal(true)}
                            className="relative w-12 h-16 rounded-md bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 overflow-hidden shrink-0 cursor-pointer group shadow-xs hover:ring-2 hover:ring-[#EB5E10]/50 transition-all"
                            title="คลิกเพื่อดูภาพขยายหน้าปก"
                          >
                            <img
                              src={coverResult.dataUrl}
                              alt="Thesis Cover Page 1"
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye className="w-4 h-4" />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                                PNG หน้าแรก (Cover)
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> แปลงสำเร็จ
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate mt-1" title={coverResult.fileName}>
                              {coverResult.fileName}
                            </p>
                            <p className="text-[10.5px] text-stone-400 font-mono mt-0.5">
                              {(coverResult.blob.size / 1024).toFixed(1)} KB • {coverResult.width}x{coverResult.height}px
                            </p>
                          </div>
                        </div>

                        {/* Action buttons to view cover */}
                        <div className="flex items-center gap-2 pt-1 border-t border-stone-100 dark:border-stone-800">
                          <button
                            type="button"
                            onClick={() => setShowCoverModal(true)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition cursor-pointer"
                          >
                            <Maximize2 className="w-3.5 h-3.5 text-[#EB5E10]" />
                            <span>ดูภาพหน้าปก</span>
                          </button>
                          <a
                            href={coverResult.dataUrl}
                            target="_blank"
                            rel="noreferrer"
                            download={coverResult.fileName}
                            className="inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 hover:text-stone-900 text-xs font-medium transition cursor-pointer"
                            title="เปิดดูในแท็บใหม่ / ดาวน์โหลด"
                          >
                            <span>เปิดไฟล์</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs py-2">
                        <ImageIcon className="w-4 h-4 shrink-0" />
                        <span>ระบบจะแปลงภาพหน้าแรกเมื่อเลือกไฟล์ PDF</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* AI Validation Loading Visual State */}
          {isUploading && (
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-850 border border-[#EB5E10]/30 space-y-3.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#EB5E10] animate-spin shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    กำลังอัปโหลด PDF + PNG และตรวจสอบด้วย AI...
                  </span>
                </div>
                <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                  n8n Webhook & Supabase
                </span>
              </div>

              {/* 4 Process Visual Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {/* 1. รับไฟล์แล้ว */}
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>1. รับ PDF + PNG</span>
                </div>

                {/* 2. ตรวจหน้าปก */}
                <div className={`flex items-center gap-1.5 p-2 rounded-lg text-[11px] font-medium border transition-all ${
                  workflowStage === 'checking_format'
                    ? 'bg-[#EB5E10]/10 border-[#EB5E10] text-[#EB5E10] shadow-2xs'
                    : workflowStage === 'checking_signature' || workflowStage === 'completed'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}>
                  {workflowStage === 'checking_format' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#EB5E10] shrink-0" />
                  ) : workflowStage === 'checking_signature' || workflowStage === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 flex items-center justify-center text-[9px] font-bold">2</span>
                  )}
                  <span>2. ตรวจหน้าปก</span>
                </div>

                {/* 3. ตรวจลายเซ็นดิจิทัล */}
                <div className={`flex items-center gap-1.5 p-2 rounded-lg text-[11px] font-medium border transition-all ${
                  workflowStage === 'checking_signature'
                    ? 'bg-[#D09B2C]/10 border-[#D09B2C] text-[#D09B2C] shadow-2xs'
                    : workflowStage === 'completed'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}>
                  {workflowStage === 'checking_signature' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D09B2C] shrink-0" />
                  ) : workflowStage === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 flex items-center justify-center text-[9px] font-bold">3</span>
                  )}
                  <span>3. ตรวจลายเซ็น</span>
                </div>

                {/* 4. ประมวลผลผลการตรวจ */}
                <div className={`flex items-center gap-1.5 p-2 rounded-lg text-[11px] font-medium border transition-all ${
                  workflowStage === 'completed'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}>
                  {workflowStage === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 flex items-center justify-center text-[9px] font-bold">4</span>
                  )}
                  <span>4. ประมวลผล</span>
                </div>
              </div>
            </div>
          )}

          {/* Success Result in form with PDF + Cover PNG */}
          {uploadResult && uploadResult.success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('uploadSuccessModalTitle')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(true)}
                  className="text-[11px] text-[#EB5E10] hover:underline font-semibold cursor-pointer"
                >
                  ดูข้อความแจ้งเตือน
                </button>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {t('uploadSuccessModalMessage')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* PDF Link */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/90 dark:bg-stone-900/90 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-mono">
                  <span className="truncate max-w-[200px]">📄 {uploadResult.thesis?.fileName}</span>
                  {uploadResult.thesis?.url && (
                    <a
                      href={uploadResult.thesis.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#EB5E10] hover:underline flex items-center gap-1 text-[11px] font-sans font-semibold shrink-0 ml-2"
                    >
                      <span>{t('viewFile')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Cover PNG Link */}
                {uploadResult.cover && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/90 dark:bg-stone-900/90 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-mono">
                    <span className="truncate max-w-[200px]">🖼️ {uploadResult.cover?.fileName}</span>
                    {uploadResult.cover?.url && (
                      <a
                        href={uploadResult.cover.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#EB5E10] hover:underline flex items-center gap-1 text-[11px] font-sans font-semibold shrink-0 ml-2"
                      >
                        <span>ดูภาพ PNG</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Controls */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
              {t('autoNaming')}
            </span>
            <button
              type="submit"
              disabled={isUploading || !thesisFile || isConvertingCover}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#EB5E10] hover:bg-[#D44E09] text-white font-semibold text-xs sm:text-sm shadow-sm shadow-[#EB5E10]/20 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('uploadingText')}</span>
                </>
              ) : isConvertingCover ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('coverConverting')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t('uploadAndValidateBtn')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* COVER IMAGE PREVIEW MODAL                                                 */}
      {/* ========================================================================= */}
      {showCoverModal && coverResult && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowCoverModal(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-white dark:bg-stone-900 rounded-2xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#EB5E10]" />
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {t('coverPreviewTitle')}
                </h4>
                <span className="text-[11px] font-mono text-stone-400">
                  ({coverResult.width}x{coverResult.height}px)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowCoverModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-stone-100 dark:bg-stone-950 p-2 rounded-xl border border-stone-200 dark:border-stone-800">
              <img
                src={coverResult.dataUrl}
                alt="Thesis Cover Preview"
                className="max-h-[65vh] w-auto object-contain rounded shadow-md"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-1">
              <span className="font-mono truncate">{coverResult.fileName}</span>
              <button
                type="button"
                onClick={() => setShowCoverModal(false)}
                className="px-4 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-semibold transition"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUCCESS NOTIFICATION MODAL (GS KKU Brand, Elegant, Informative)           */}
      {/* ========================================================================= */}
      {showSuccessModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-[20px] shadow-2xl p-6 sm:p-7 text-center space-y-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Soft Ambient Brand Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#EB5E10]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#D09B2C]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button Top Right */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Success Icon */}
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            {/* Title & Message */}
            <div className="space-y-2 py-1">
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                {t('uploadSuccessModalTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-sm mx-auto whitespace-pre-line">
                {t('uploadSuccessModalMessage')}
              </p>
            </div>

            {/* Primary Acknowledge Button */}
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 px-6 rounded-xl bg-[#EB5E10] hover:bg-[#D44E09] active:bg-[#B83A08] text-white font-semibold text-sm shadow-md shadow-[#EB5E10]/25 transition-all cursor-pointer mt-2"
            >
              {t('uploadSuccessModalBtn')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
