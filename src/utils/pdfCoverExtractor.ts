import * as pdfjsLib from 'pdfjs-dist';
// Import worker directly via Vite URL so it works offline and bundled locally
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker || `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  } catch (err) {
    console.warn('pdfjs worker configuration warning:', err);
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    } catch {
      // ignore
    }
  }
}

export interface PdfCoverResult {
  file: File;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  fileName: string;
}

/**
 * Extracts and renders the first page (cover) of a PDF file to a PNG image.
 *
 * @param pdfFile The uploaded PDF file
 * @param studentCode Student ID for naming convention
 * @returns Promise with PNG File, dataUrl, Blob, and dimensions
 */
export async function convertPdfFirstPageToPng(
  pdfFile: File | Blob,
  studentCode: string = 'student'
): Promise<PdfCoverResult> {
  const arrayBuffer = await pdfFile.arrayBuffer();
  
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
    cMapPacked: true,
  });

  const pdfDoc = await loadingTask.promise;

  if (pdfDoc.numPages < 1) {
    throw new Error('เอกสาร PDF ไม่มีหน้าที่สามารถแสดงผลได้ (PDF has 0 pages)');
  }

  // Page 1 is the thesis cover page
  const page = await pdfDoc.getPage(1);

  // Use 2.0 scale for sharp, high-definition PNG rendering
  const viewport = page.getViewport({ scale: 2.0 });

  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  const context = canvas.getContext('2d', { alpha: false });
  if (!context) {
    throw new Error('ไม่สามารถสร้าง Canvas 2D context ได้');
  }

  // Ensure solid white background for cover page
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
    canvas: canvas,
  };

  await page.render(renderContext).promise;

  const dataUrl = canvas.toDataURL('image/png', 0.95);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('การแปลงภาพ Canvas เป็น PNG ล้มเหลว'));
      },
      'image/png',
      0.95
    );
  });

  const timestamp = Date.now();
  const sanitizedStudentCode = String(studentCode).replace(/[^a-zA-Z0-9_-]/g, '_');
  const pngFileName = `cover_${sanitizedStudentCode}_${timestamp}.png`;
  const pngFile = new File([blob], pngFileName, {
    type: 'image/png',
    lastModified: timestamp,
  });

  return {
    file: pngFile,
    dataUrl,
    blob,
    width: canvas.width,
    height: canvas.height,
    fileName: pngFileName,
  };
}
