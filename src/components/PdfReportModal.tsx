import React, { useRef, useState, useEffect } from 'react';
import { ProjectInfo, WorkItem, MaterialItem, DailyLog } from '../types';
import { 
  EngineeringReportDocument, 
  ReportApprovals 
} from './EngineeringReportDocument';
import { 
  translations, 
  LanguageMode 
} from '../utils/translations';
import { 
  FileDown, 
  Printer, 
  X, 
  Loader2, 
  Edit2, 
  Save, 
  RotateCcw, 
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Languages,
  DollarSign,
  CheckCircle2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectInfo;
  workItems: WorkItem[];
  materials: MaterialItem[];
  dailyLogs: DailyLog[];
  onUpdateProject?: (updated: ProjectInfo) => void;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  onClose,
  project,
  workItems,
  materials,
  dailyLogs,
  onUpdateProject,
}) => {
  // On-screen visible preview refs
  const previewPage1Ref = useRef<HTMLDivElement>(null);
  const previewPage2Ref = useRef<HTMLDivElement>(null);

  // Dedicated off-screen render refs (strictly fixed at 794px x 1123px, unaffected by screen size)
  const offscreenPage1Ref = useRef<HTMLDivElement>(null);
  const offscreenPage2Ref = useRef<HTMLDivElement>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [reportDate, setReportDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [includeFinancials, setIncludeFinancials] = useState<boolean>(true);
  
  // Language Selection: 'ar' | 'en' | 'bilingual'
  const [lang, setLang] = useState<LanguageMode>('ar');

  // Zoom control for preview (1.0 = 100%, 0.8 = 80%, 0.6 = 60%)
  const [previewZoom, setPreviewZoom] = useState<number>(0.85);

  // Signatures state
  const [showSignaturesEditor, setShowSignaturesEditor] = useState<boolean>(false);
  
  const [approvalTitle1, setApprovalTitle1] = useState<string>(
    project.approvalTitle1 || 'مهندس الموقع المنفذ'
  );
  const [approvalName1, setApprovalName1] = useState<string>(
    project.approvalName1 || 'أحمد هليل الذبياني'
  );

  const [approvalTitle2, setApprovalTitle2] = useState<string>(
    project.approvalTitle2 || 'عن الشركة المنفذة'
  );
  const [approvalName2, setApprovalName2] = useState<string>(
    project.approvalName2 || 'شركة إيكاد للمقاولات للمشاريع المتطورة'
  );

  const [approvalTitle3, setApprovalTitle3] = useState<string>(
    project.approvalTitle3 || 'المكتب الاستشاري للمشروع'
  );
  const [approvalName3, setApprovalName3] = useState<string>(
    project.approvalName3 || 'مكتب استشاري جلوبس الهندسي'
  );

  useEffect(() => {
    if (project.approvalTitle1) setApprovalTitle1(project.approvalTitle1);
    if (project.approvalName1) setApprovalName1(project.approvalName1);
    if (project.approvalTitle2) setApprovalTitle2(project.approvalTitle2);
    if (project.approvalName2) setApprovalName2(project.approvalName2);
    if (project.approvalTitle3) setApprovalTitle3(project.approvalTitle3);
    if (project.approvalName3) setApprovalName3(project.approvalName3);
  }, [project]);

  if (!isOpen) return null;

  const t = translations[lang === 'bilingual' ? 'ar' : lang];
  const tAr = translations.ar;
  const tEn = translations.en;
  const isRtl = lang !== 'en';

  const approvals: ReportApprovals = {
    approvalTitle1,
    approvalName1,
    approvalTitle2,
    approvalName2,
    approvalTitle3,
    approvalName3,
  };

  const handleSaveSignatures = () => {
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        approvalTitle1,
        approvalName1,
        approvalTitle2,
        approvalName2,
        approvalTitle3,
        approvalName3,
      });
    }
    setShowSignaturesEditor(false);
  };

  const handleResetSignatures = () => {
    setApprovalTitle1('مهندس الموقع المنفذ');
    setApprovalName1('أحمد هليل الذبياني');
    setApprovalTitle2('عن الشركة المنفذة');
    setApprovalName2('شركة إيكاد للمقاولات للمشاريع المتطورة');
    setApprovalTitle3('المكتب الاستشاري للمشروع');
    setApprovalName3('مكتب استشاري جلوبس الهندسي');
  };

  // ========================================================
  // RADICAL HIGH-PRECISION PDF GENERATION ALGORITHM
  // 1. Captures from the dedicated off-screen unconstrained container
  // 2. Strict 794px x 1123px dimensions (exact A4 ratio 0.707)
  // 3. Ultra-crisp 2.5x resolution (1985 x 2807 px)
  // 4. Injected into A4 jsPDF with 0, 0, 210, 297 mm
  // ========================================================
  const handleDownloadPdf = async () => {
    const page1El = offscreenPage1Ref.current || previewPage1Ref.current;
    const page2El = offscreenPage2Ref.current || previewPage2Ref.current;

    if (!page1El || !page2El) return;

    try {
      setIsGenerating(true);
      setDownloadSuccess(false);

      // Initialize A4 Portrait Document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const captureOptions = {
        scale: 2.5, // 2.5x scale provides crisp 300-DPI equivalent vector-like clarity
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
      };

      // Capture Page 1 from isolated off-screen node
      const canvas1 = await html2canvas(page1El, captureOptions);
      const img1 = canvas1.toDataURL('image/jpeg', 0.98);
      pdf.addImage(img1, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

      // Capture Page 2 from isolated off-screen node
      pdf.addPage();
      const canvas2 = await html2canvas(page2El, captureOptions);
      const img2 = canvas2.toDataURL('image/jpeg', 0.98);
      pdf.addImage(img2, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

      // File name formatting
      const prefix = lang === 'en' 
        ? 'Official_Engineering_Report' 
        : lang === 'bilingual' 
          ? 'Bilingual_Engineering_Report' 
          : 'تقرير_هندسي_معتمد';
      const cleanProjectCode = (project.code || 'PROJECT').replace(/[^a-zA-Z0-9-_]/g, '_');
      const fileName = `${prefix}_${cleanProjectCode}_${reportDate}.pdf`;

      pdf.save(fileName);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback to native window print
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  // Direct Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Dedicated Clean Print Window (Opens pure standalone window with Cairo font & A4 rules)
  const handleOpenCleanPrintWindow = () => {
    const page1El = offscreenPage1Ref.current || previewPage1Ref.current;
    const page2El = offscreenPage2Ref.current || previewPage2Ref.current;
    if (!page1El || !page2El) return;

    const printWin = window.open('', '_blank', 'width=900,height=1000');
    if (!printWin) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="${isRtl ? 'rtl' : 'ltr'}" lang="${lang === 'en' ? 'en' : 'ar'}">
      <head>
        <meta charset="utf-8" />
        <title>Engineering Report - ${project.code}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          * {
            box-sizing: border-box;
            font-family: 'Cairo', system-ui, -apple-system, sans-serif;
            letter-spacing: 0 !important;
            font-feature-settings: "tnum" 1 !important;
          }
          body {
            margin: 0;
            padding: 0;
            background: #f1f5f9;
            color: #0f172a;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .pdf-a4-page {
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 auto 20px auto;
            background: #ffffff !important;
            padding: 10mm 14mm 10mm 14mm !important;
            box-sizing: border-box !important;
            page-break-after: always !important;
            break-after: page !important;
            overflow: hidden !important;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          }
          .pdf-tabular-num {
            font-family: monospace !important;
            direction: ltr !important;
            display: inline-block !important;
          }
          @media print {
            body {
              background: #ffffff !important;
            }
            .pdf-a4-page {
              margin: 0 auto !important;
              box-shadow: none !important;
            }
            .pdf-a4-page:last-child {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
          }
        </style>
      </head>
      <body>
        ${page1El.outerHTML}
        ${page2El.outerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.focus();
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  };

  return (
    <div 
      id="pdf-modal-backdrop" 
      className="pdf-modal-backdrop fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
    >
      <div 
        id="pdf-modal-card" 
        className="pdf-modal-card bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden"
      >
        
        {/* ========================================================
            MODAL CONTROLS & SETTINGS TOOLBAR (Hidden in print)
           ======================================================== */}
        <div id="pdf-modal-toolbar" className="no-print p-4 bg-slate-900/95 border-b border-slate-700 space-y-3 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Title & Status */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
                <FileDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>منظومة التصدير والطباعة الهندسية المعتمدة (A4)</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                    Official v2.0
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  كود المشروع: <span className="text-slate-200 font-mono font-bold">{project.code}</span> — {project.name}
                </p>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Clean Print Window */}
              <button
                type="button"
                onClick={handleOpenCleanPrintWindow}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-semibold transition"
                title="فتح في نافذة طباعة نظيفة ومستقلة"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                <span>نافذة طباعة مستقلة</span>
              </button>

              {/* Direct Print */}
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-semibold transition"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>طباعة المستند</span>
              </button>

              {/* High-Precision PDF Download */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري معالجة وتصدير PDF...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>تم التصدير بنجاح!</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    <span>تحميل ملف PDF معتمد</span>
                  </>
                )}
              </button>

              {/* Close Modal */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Secondary Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-800 text-xs">
            
            {/* Left: Language + Financials Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Language Selection */}
              <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-lg p-1">
                <Languages className="w-3.5 h-3.5 text-slate-400 ml-1" />
                <button
                  type="button"
                  onClick={() => setLang('ar')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                    lang === 'ar' 
                      ? 'bg-amber-500 text-slate-950 shadow-sm' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  العربية
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                    lang === 'en' 
                      ? 'bg-amber-500 text-slate-950 shadow-sm' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLang('bilingual')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                    lang === 'bilingual' 
                      ? 'bg-amber-500 text-slate-950 shadow-sm' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  عربي + English
                </button>
              </div>

              {/* Financial Columns Toggle */}
              <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-lg p-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400 ml-1" />
                <button
                  type="button"
                  onClick={() => setIncludeFinancials(true)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                    includeFinancials 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  مع الأسعار والقيم
                </button>
                <button
                  type="button"
                  onClick={() => setIncludeFinancials(false)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                    !includeFinancials 
                      ? 'bg-amber-600 text-white shadow-sm' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  بدون أسعار (فني وميداني فقط)
                </button>
              </div>

              {/* Report Date */}
              <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1">
                <span className="text-slate-400 text-[11px]">تاريخ التقرير:</span>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="bg-transparent text-white text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Right: Zoom + Edit Signatures */}
            <div className="flex items-center gap-2">
              {/* Preview Zoom Controls */}
              <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 rounded-lg p-1 text-slate-300">
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.max(0.5, Number((z - 0.1).toFixed(2))))}
                  className="p-1 hover:text-white hover:bg-slate-700 rounded transition"
                  title="تصغير المعاينة"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 font-mono text-[11px] text-amber-400 font-bold">
                  {Math.round(previewZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.min(1.2, Number((z + 0.1).toFixed(2))))}
                  className="p-1 hover:text-white hover:bg-slate-700 rounded transition"
                  title="تكبير المعاينة"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Edit Signatures Toggle */}
              <button
                type="button"
                onClick={() => setShowSignaturesEditor(!showSignaturesEditor)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  showSignaturesEditor 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                <span>تعديل التوقيعات والاعتمادات</span>
              </button>
            </div>
          </div>

          {/* Signature Editor Dropdown Panel */}
          {showSignaturesEditor && (
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 mt-2 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>تعديل بيانات وتسميات أطراف الاعتماد والمصادقة الرسمية</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetSignatures}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>استعادة الافتراضي</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSignatures}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-bold transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>حفظ التوقيعات</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* 1 */}
                <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-700 space-y-1.5">
                  <span className="font-semibold text-amber-400 block text-[11px]">الاعتماد الأول (مهندس الموقع):</span>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">المسمى:</label>
                    <input
                      type="text"
                      value={approvalTitle1}
                      onChange={(e) => setApprovalTitle1(e.target.value)}
                      className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">الاسم:</label>
                    <input
                      type="text"
                      value={approvalName1}
                      onChange={(e) => setApprovalName1(e.target.value)}
                      className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* 2 */}
                <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-700 space-y-1.5">
                  <span className="font-semibold text-amber-400 block text-[11px]">الاعتماد الثاني (الشركة المنفذة):</span>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">المسمى:</label>
                    <input
                      type="text"
                      value={approvalTitle2}
                      onChange={(e) => setApprovalTitle2(e.target.value)}
                      className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">الاسم / الشركة:</label>
                    <input
                      type="text"
                      value={approvalName2}
                      onChange={(e) => setApprovalName2(e.target.value)}
                      className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* 3 */}
                <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-700 space-y-1.5">
                  <span className="font-semibold text-amber-400 block text-[11px]">الاعتماد الثالث (المكتب الاستشاري):</span>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">المسمى:</label>
                    <input
                      type="text"
                      value={approvalTitle3}
                      onChange={(e) => setApprovalTitle3(e.target.value)}
                      className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">اسم المكتب الاستشاري:</label>
                    <input
                      type="text"
                      value={approvalName3}
                      onChange={(e) => setApprovalName3(e.target.value)}
                      className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            DOCUMENT PAGES PREVIEW AREA (Scrollable & Zoomable)
           ======================================================== */}
        <div className="pdf-modal-scroll-area p-4 sm:p-6 overflow-y-auto overflow-x-auto bg-slate-950/70 flex flex-col items-center gap-8">
          
          {/* Zoom Wrapper for Page 1 */}
          <div 
            style={{ 
              transform: `scale(${previewZoom})`, 
              transformOrigin: 'top center',
              marginBottom: `${(1123 * (previewZoom - 1))}px`,
              transition: 'transform 0.15s ease-out'
            }}
            className="shrink-0"
          >
            <EngineeringReportDocument
              pageNumber={1}
              innerRef={previewPage1Ref}
              containerId="preview-page-1"
              project={project}
              workItems={workItems}
              materials={materials}
              dailyLogs={dailyLogs}
              reportDate={reportDate}
              includeFinancials={includeFinancials}
              lang={lang}
              approvals={approvals}
            />
          </div>

          {/* Zoom Wrapper for Page 2 */}
          <div 
            style={{ 
              transform: `scale(${previewZoom})`, 
              transformOrigin: 'top center',
              marginBottom: `${(1123 * (previewZoom - 1))}px`,
              transition: 'transform 0.15s ease-out'
            }}
            className="shrink-0"
          >
            <EngineeringReportDocument
              pageNumber={2}
              innerRef={previewPage2Ref}
              containerId="preview-page-2"
              project={project}
              workItems={workItems}
              materials={materials}
              dailyLogs={dailyLogs}
              reportDate={reportDate}
              includeFinancials={includeFinancials}
              lang={lang}
              approvals={approvals}
            />
          </div>

        </div>

        {/* ========================================================
            DEDICATED OFF-SCREEN RENDER CONTAINER
            Guarantees 100% stable 794px x 1123px capture without any
            parent flexbox shrinkage, screen responsiveness, or scroll offsets.
           ======================================================== */}
        <div 
          id="pdf-offscreen-render-container"
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: '-99999px',
            top: 0,
            width: '794px',
            minWidth: '794px',
            maxWidth: '794px',
            height: 'auto',
            zIndex: -99999,
            pointerEvents: 'none',
            opacity: 1,
            overflow: 'visible',
            backgroundColor: '#ffffff',
          }}
        >
          <EngineeringReportDocument
            pageNumber={1}
            innerRef={offscreenPage1Ref}
            containerId="offscreen-page-1"
            project={project}
            workItems={workItems}
            materials={materials}
            dailyLogs={dailyLogs}
            reportDate={reportDate}
            includeFinancials={includeFinancials}
            lang={lang}
            approvals={approvals}
          />
          <div style={{ height: '20px' }}></div>
          <EngineeringReportDocument
            pageNumber={2}
            innerRef={offscreenPage2Ref}
            containerId="offscreen-page-2"
            project={project}
            workItems={workItems}
            materials={materials}
            dailyLogs={dailyLogs}
            reportDate={reportDate}
            includeFinancials={includeFinancials}
            lang={lang}
            approvals={approvals}
          />
        </div>

      </div>
    </div>
  );
};
