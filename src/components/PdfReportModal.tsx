import React, { useRef, useState, useEffect } from 'react';
import { ProjectInfo, WorkItem, MaterialItem, DailyLog } from '../types';
import { 
  calculateProjectMetrics, 
  calculateMaterialMetrics, 
  formatCurrency, 
  formatNumber 
} from '../utils/calculations';
import { 
  FileDown, 
  Printer, 
  X, 
  CheckCircle2, 
  HardHat, 
  Building2, 
  Calendar, 
  FileText,
  Loader2,
  CheckSquare,
  Square,
  Edit2,
  ChevronDown,
  ChevronUp,
  Save,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  ClipboardList,
  Layers,
  Package,
  TrendingUp,
  Check
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportDate, setReportDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [reportType, setReportType] = useState<'comprehensive' | 'daily'>('comprehensive');

  // Option 1: Checkbox for including prices/financials (Default TRUE)
  const [includeFinancials, setIncludeFinancials] = useState<boolean>(true);

  // Option 2: Signatures state with defaults
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
    project.approvalName2 || 'شركة إيكاد — مشروع تطوير مطار الأمير محمد بن عبدالعزيز الدولي — المدينة المنورة'
  );

  const [approvalTitle3, setApprovalTitle3] = useState<string>(
    project.approvalTitle3 || 'المكتب الاستشاري'
  );
  const [approvalName3, setApprovalName3] = useState<string>(
    project.approvalName3 || 'المكتب الاستشاري للمشروع'
  );

  // Keep state updated when project prop updates
  useEffect(() => {
    if (project.approvalTitle1) setApprovalTitle1(project.approvalTitle1);
    if (project.approvalName1) setApprovalName1(project.approvalName1);
    if (project.approvalTitle2) setApprovalTitle2(project.approvalTitle2);
    if (project.approvalName2) setApprovalName2(project.approvalName2);
    if (project.approvalTitle3) setApprovalTitle3(project.approvalTitle3);
    if (project.approvalName3) setApprovalName3(project.approvalName3);
  }, [project]);

  if (!isOpen) return null;

  const projectMetrics = calculateProjectMetrics(workItems);
  const materialMetrics = calculateMaterialMetrics(materials);
  const latestLog = dailyLogs[dailyLogs.length - 1];

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
    setApprovalName2('شركة إيكاد — مشروع تطوير مطار الأمير محمد بن عبدالعزيز الدولي — المدينة المنورة');
    setApprovalTitle3('المكتب الاستشاري');
    setApprovalName3('المكتب الاستشاري للمشروع');
  };

  const handleDownloadPdf = async () => {
    if (!printAreaRef.current) return;

    try {
      setIsGenerating(true);
      const element = printAreaRef.current;

      // High-resolution canvas capture
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution for crisp text & borders
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Multi-page handling with clean continuation
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const fileName = `تقرير_هندسي_${project.code}_${reportDate}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('Error generating PDF:', err);
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden">
        
        {/* Modal Top Control Bar (Non-printed) */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col gap-3 no-print">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>تصدير وطباعة التقرير الهندسي المعتمد (PDF)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    نسخة منسقة
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  تنسيق منظم ومنفصل للعناوين والجداول والفقرات والبيانات
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSignaturesEditor(!showSignaturesEditor)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  showSignaturesEditor
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>تعديل الاعتمادات</span>
                {showSignaturesEditor ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setReportType('comprehensive')}
                  className={`px-2.5 py-1 rounded font-medium transition ${
                    reportType === 'comprehensive' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
                  }`}
                >
                  تقرير شامل
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('daily')}
                  className={`px-2.5 py-1 rounded font-medium transition ${
                    reportType === 'daily' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
                  }`}
                >
                  تقرير يومي
                </button>
              </div>

              <button
                id="btn-trigger-print"
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>طباعة</span>
              </button>

              <button
                id="btn-save-pdf"
                type="button"
                disabled={isGenerating}
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-lg text-xs font-bold transition shadow"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري التجهيز...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    <span>تصدير PDF</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Option Bar: Customization and Checkbox */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-800/80">
            <div className="flex items-center gap-4">
              <label 
                id="checkbox-include-financials-label"
                className="flex items-center gap-2 cursor-pointer bg-slate-800/90 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-amber-500/50 transition select-none group"
              >
                <input
                  type="checkbox"
                  id="checkbox-include-financials"
                  checked={includeFinancials}
                  onChange={(e) => setIncludeFinancials(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-200 group-hover:text-amber-300">
                  تضمين الأسعار والقيم المالية
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                  includeFinancials 
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}>
                  {includeFinancials ? 'مُفعّل' : 'تم الحذف'}
                </span>
              </label>

              {!includeFinancials && (
                <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-md">
                  تم حذف جميع المبالغ والأسعار. التقرير الآن فني بحت (كميات، نسب إنجاز، ملاحظات).
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>تاريخ التقرير:</span>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Editable Signatures Form Drawer */}
          {showSignaturesEditor && (
            <div className="p-4 bg-slate-800/90 border border-amber-500/30 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>تعديل بيانات وتوقيعات أطراف الاعتماد</span>
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
                <div className="p-2.5 bg-slate-900/70 rounded-lg border border-slate-700 space-y-1.5">
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
                <div className="p-2.5 bg-slate-900/70 rounded-lg border border-slate-700 space-y-1.5">
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
                <div className="p-2.5 bg-slate-900/70 rounded-lg border border-slate-700 space-y-1.5">
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

        {/* Scrollable Printable Document Container */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-slate-950/60 flex justify-center">
          
          {/* Printable Sheet (Formatted precisely for standard A4 and clear print view) */}
          <div
            ref={printAreaRef}
            id="printable-report"
            className="w-full max-w-4xl bg-white text-slate-900 p-8 sm:p-11 shadow-2xl rounded-sm border border-slate-300 text-right selection:bg-amber-100 font-sans"
            style={{ 
              minHeight: '1120px', 
              boxSizing: 'border-box',
              fontFamily: "'Cairo', system-ui, -apple-system, sans-serif" 
            }}
          >
            {/* ========================================================
                1. HEADER: Clear, separated titles & official letterhead
               ======================================================== */}
            <header className="border-b-2 border-slate-900 pb-5 mb-6">
              
              {/* Top Bar: Title & Metadata Card (Cleanly separated) */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
                {/* Right: Main Branding & System Title */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-2xl font-black text-slate-950 tracking-tight">
                      محلّل البيانات الهندسي
                    </span>
                    <span className="text-[11px] font-bold tracking-wider bg-slate-900 text-white px-2.5 py-0.5 rounded">
                      ENGINEERING REPORT
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    منظومة المتابعة الفنية الميدانية وإدارة الكميات ونسب الإنجاز والمواد
                  </p>
                </div>

                {/* Left: Document Metadata Box (Clear separated framing) */}
                <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs min-w-[210px] space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500 text-[11px]">كود المشروع:</span>
                    <span className="font-mono font-bold text-slate-900">{project.code}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500 text-[11px]">تاريخ التحرير:</span>
                    <span className="font-mono text-slate-800">{reportDate}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500 text-[11px]">حالة الاعتماد:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                      معتمد رسمي
                    </span>
                  </div>
                  {!includeFinancials && (
                    <div className="pt-1 mt-1 border-t border-slate-200 text-center text-[10px] font-bold text-amber-700">
                      نسخة فنية (خالية من الأسعار)
                    </div>
                  )}
                </div>
              </div>

              {/* Main Report Title Banner (Centered, separated & clear) */}
              <div className="mt-4 text-center py-2.5 bg-slate-100/80 rounded-lg border border-slate-200">
                <h1 className="text-lg font-black text-slate-950 tracking-wide">
                  {reportType === 'comprehensive'
                    ? (includeFinancials 
                        ? 'تقرير المتابعة الفنية الشاملة لحصر الكميات والمواد والتكاليف' 
                        : 'تقرير المتابعة الفنية الميدانية لحصر الكميات ونسب الإنجاز')
                    : 'التقرير اليومي المعتمد لسير الأعمال والأنشطة بالموقع'}
                </h1>
                <p className="text-xs text-slate-700 mt-1 font-semibold">
                  {project.name} {project.location ? `— ${project.location}` : ''}
                </p>
              </div>

              {/* Project Meta Information Cards (Organized 4-cell layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <span className="text-slate-500 block text-[11px] font-medium mb-1">اسم المشروع:</span>
                  <span className="text-slate-950 font-bold leading-snug block">{project.name}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <span className="text-slate-500 block text-[11px] font-medium mb-1">الجهة المالكة (العميل):</span>
                  <span className="text-slate-900 font-bold leading-snug block">{project.client}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <span className="text-slate-500 block text-[11px] font-medium mb-1">المقاول العام المنفذ:</span>
                  <span className="text-slate-900 font-bold leading-snug block">{project.contractor}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <span className="text-slate-500 block text-[11px] font-medium mb-1">الاستشاري الهندسي المشرف:</span>
                  <span className="text-slate-900 font-bold leading-snug block">{project.consultant}</span>
                </div>
              </div>
            </header>

            {/* ========================================================
                EXECUTIVE KPIs: Generous spacing, no border collisions
               ======================================================== */}
            <section className="mb-7 print-break-inside-avoid">
              <div className={`grid gap-3.5 ${includeFinancials ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}>
                
                {/* KPI 1 */}
                <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 text-center flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-600 block mb-1">نسبة الإنجاز الفعلي</span>
                  <div className="my-1">
                    <span className="text-2xl font-black text-blue-700 font-mono tracking-tight">
                      {formatNumber(projectMetrics.actualProgressPercent, 1)}%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    المخطط التعاقدي: {formatNumber(projectMetrics.plannedProgressPercent, 1)}%
                  </span>
                </div>

                {/* KPI 2 */}
                <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 text-center flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-600 block mb-1">مؤشر الجدول الزمني (SPI)</span>
                  <div className="my-1">
                    <span className={`text-2xl font-black font-mono tracking-tight ${
                      projectMetrics.spi >= 1 ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {projectMetrics.spi.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    {projectMetrics.variance >= 0 
                      ? `+${projectMetrics.variance}% متقدم عن الجدول` 
                      : `${projectMetrics.variance}% انحراف زمني`}
                  </span>
                </div>

                {/* KPI 3: Only when financials are enabled */}
                {includeFinancials && (
                  <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 text-center flex flex-col justify-between">
                    <span className="text-xs font-semibold text-slate-600 block mb-1">القيمة المنفذة للأعمال</span>
                    <div className="my-1">
                      <span className="text-lg font-black text-slate-900 font-mono tracking-tight">
                        {formatCurrency(projectMetrics.totalExecutedCost, project.currency)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      إجمالي العقد: {formatCurrency(project.totalContractValue, project.currency)}
                    </span>
                  </div>
                )}

                {/* KPI 4 */}
                <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 text-center flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-600 block mb-1">القوة العاملة والمعدات</span>
                  <div className="my-1">
                    <span className="text-2xl font-black text-amber-700 font-mono tracking-tight">
                      {latestLog?.laborCount || 0}
                    </span>
                    <span className="text-xs text-slate-600 font-bold mr-1">فرد</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    + {latestLog?.equipmentCount || 0} معدات تشغيلية
                  </span>
                </div>
              </div>
            </section>

            {/* ========================================================
                TABLE 1: BOQ & Work Items (Precise alignment & clearance)
               ======================================================== */}
            <section className="mb-7 print-break-inside-avoid">
              {/* Section Title Header */}
              <div className="flex items-center justify-between bg-slate-100 border border-slate-300 px-3.5 py-2.5 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <h2 className="text-xs font-bold text-slate-900">
                    أولاً: جدول حصر الكميات ونسب الإنجاز التراكمية المعتمدة
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  إجمالي البنود: {workItems.length}
                </span>
              </div>

              {/* Table Container with proper borders & cell margins */}
              <div className="border-x border-b border-slate-300 overflow-hidden">
                <table className="w-full text-right text-xs border-collapse" style={{ tableLayout: 'fixed' }}>
                  <thead>
                    <tr className="bg-slate-50 text-slate-800 border-b border-slate-300 text-[11px] font-bold">
                      <th className="py-2.5 px-3 text-center border-l border-slate-200 w-[11%]">الكود</th>
                      <th className={`py-2.5 px-3 text-right border-l border-slate-200 ${includeFinancials ? 'w-[32%]' : 'w-[45%]'}`}>
                        بيان وتوصيف الأعمال الهندسية
                      </th>
                      <th className="py-2.5 px-2 text-center border-l border-slate-200 w-[7%]">الوحدة</th>
                      <th className="py-2.5 px-2.5 text-center border-l border-slate-200 w-[12%]">الكمية المقررة</th>
                      <th className="py-2.5 px-2.5 text-center border-l border-slate-200 w-[11%]">منجز اليوم</th>
                      <th className="py-2.5 px-2.5 text-center border-l border-slate-200 w-[12%]">إجمالي المنفذ</th>
                      <th className={`py-2.5 px-2.5 text-center ${includeFinancials ? 'border-l border-slate-200 w-[10%]' : 'w-[15%]'}`}>
                        نسبة الإنجاز
                      </th>
                      {includeFinancials && (
                        <th className="py-2.5 px-3 text-center w-[15%]">
                          القيمة المنفذة
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    {workItems.map((item, idx) => {
                      const totalExec = item.previousQuantity + item.todayQuantity;
                      const percent = item.plannedQuantity > 0 
                        ? Math.min(100, (totalExec / item.plannedQuantity) * 100) 
                        : 0;
                      const val = totalExec * item.unitRate;

                      return (
                        <tr 
                          key={item.id} 
                          className={idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}
                        >
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800 border-l border-slate-200 whitespace-nowrap">
                            {item.code}
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium text-slate-900 border-l border-slate-200 leading-relaxed">
                            {item.description}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono text-slate-700 border-l border-slate-200 whitespace-nowrap">
                            {item.unit}
                          </td>
                          <td className="py-2.5 px-2.5 text-center font-mono text-slate-800 border-l border-slate-200 whitespace-nowrap">
                            {formatNumber(item.plannedQuantity)}
                          </td>
                          <td className="py-2.5 px-2.5 text-center font-mono font-bold text-amber-700 border-l border-slate-200 whitespace-nowrap">
                            +{formatNumber(item.todayQuantity)}
                          </td>
                          <td className="py-2.5 px-2.5 text-center font-mono font-bold text-slate-900 border-l border-slate-200 whitespace-nowrap">
                            {formatNumber(totalExec)}
                          </td>
                          <td className={`py-2.5 px-2.5 text-center font-mono font-bold whitespace-nowrap ${
                            includeFinancials ? 'border-l border-slate-200' : ''
                          }`}>
                            <span className={percent >= 100 ? 'text-emerald-700 font-extrabold' : 'text-blue-700'}>
                              {formatNumber(percent, 1)}%
                            </span>
                          </td>
                          {includeFinancials && (
                            <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-900 whitespace-nowrap">
                              {formatCurrency(val, project.currency)}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>

                  {/* Summary Footer Row */}
                  <tfoot>
                    <tr className="bg-slate-100 font-bold text-[11px] border-t-2 border-slate-300">
                      <td colSpan={2} className="py-2.5 px-3 text-right text-slate-900 border-l border-slate-200">
                        المتوسط الوزني ونسب الإنجاز الكلية
                      </td>
                      <td colSpan={includeFinancials ? 4 : 4} className="py-2.5 px-2.5 text-center text-slate-600 border-l border-slate-200">
                        {workItems.length} بنود أعمال هندسية
                      </td>
                      <td className={`py-2.5 px-2.5 text-center font-mono font-black text-blue-800 ${
                        includeFinancials ? 'border-l border-slate-200' : ''
                      }`}>
                        {formatNumber(projectMetrics.actualProgressPercent, 1)}%
                      </td>
                      {includeFinancials && (
                        <td className="py-2.5 px-3 text-center font-mono font-black text-slate-950 whitespace-nowrap">
                          {formatCurrency(projectMetrics.totalExecutedCost, project.currency)}
                        </td>
                      )}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {/* ========================================================
                TABLE 2: Materials & Inventory Status (Clear columns)
               ======================================================== */}
            <section className="mb-7 print-break-inside-avoid">
              {/* Section Title Header */}
              <div className="flex items-center justify-between bg-slate-100 border border-slate-300 px-3.5 py-2.5 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>
                  <h2 className="text-xs font-bold text-slate-900">
                    ثانياً: موقف المواد والتوريدات والمخزون الميداني بالموقع
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {materials.length} مواد أساسية
                </span>
              </div>

              {/* Table Container */}
              <div className="border-x border-b border-slate-300 overflow-hidden">
                <table className="w-full text-right text-xs border-collapse" style={{ tableLayout: 'fixed' }}>
                  <thead>
                    <tr className="bg-slate-50 text-slate-800 border-b border-slate-300 text-[11px] font-bold">
                      <th className="py-2.5 px-3 text-right border-l border-slate-200 w-[27%]">
                        المادة والمواصفة الفنية
                      </th>
                      <th className="py-2.5 px-2 text-center border-l border-slate-200 w-[7%]">الوحدة</th>
                      <th className="py-2.5 px-2.5 text-center border-l border-slate-200 w-[11%]">المطلوب كلياً</th>
                      <th className="py-2.5 px-2.5 text-center border-l border-slate-200 w-[11%]">المورّد للموقع</th>
                      <th className="py-2.5 px-2.5 text-center border-l border-slate-200 w-[11%]">مستهلك اليوم</th>
                      <th className="py-2.5 px-2.5 text-center border-l border-slate-200 w-[11%]">إجمالي المستهلك</th>
                      <th className="py-2.5 px-2.5 text-center border-l border-slate-200 w-[11%]">الرصيد المتبقي</th>
                      <th className="py-2.5 px-2.5 text-center w-[11%]">موقف الكفاية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    {materials.map((mat, idx) => {
                      const remaining = mat.totalDelivered - mat.totalUsed;
                      const isLow = remaining <= mat.minThreshold;

                      return (
                        <tr 
                          key={mat.id}
                          className={idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}
                        >
                          <td className="py-2.5 px-3 text-right font-medium text-slate-900 border-l border-slate-200 leading-relaxed">
                            {mat.name}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono text-slate-700 border-l border-slate-200 whitespace-nowrap">
                            {mat.unit}
                          </td>
                          <td className="py-2.5 px-2.5 text-center font-mono text-slate-800 border-l border-slate-200 whitespace-nowrap">
                            {formatNumber(mat.totalRequired)}
                          </td>
                          <td className="py-2.5 px-2.5 text-center font-mono font-bold text-blue-900 border-l border-slate-200 whitespace-nowrap">
                            {formatNumber(mat.totalDelivered)}
                          </td>
                          <td className="py-2.5 px-2.5 text-center font-mono font-bold text-purple-700 border-l border-slate-200 whitespace-nowrap">
                            {formatNumber(mat.todayUsed)}
                          </td>
                          <td className="py-2.5 px-2.5 text-center font-mono text-slate-800 border-l border-slate-200 whitespace-nowrap">
                            {formatNumber(mat.totalUsed)}
                          </td>
                          <td className="py-2.5 px-2.5 text-center font-mono font-bold text-slate-900 border-l border-slate-200 whitespace-nowrap">
                            {formatNumber(remaining)}
                          </td>
                          <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                            {isLow ? (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                                نقص بالمخزون
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                كافٍ ومستقر
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ========================================================
                3. SITE OBSERVATIONS: Clearly organized paragraphs
               ======================================================== */}
            {latestLog && (
              <section className="mb-8 print-break-inside-avoid">
                {/* Section Title Header */}
                <div className="flex items-center justify-between bg-slate-100 border border-slate-300 px-3.5 py-2.5 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    <h2 className="text-xs font-bold text-slate-900">
                      ثالثاً: سجل الملاحظات التنفيذية واليوميات الميدانية ({latestLog.dayName} {latestLog.date})
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-slate-600">
                    توثيق: {latestLog.loggedBy}
                  </span>
                </div>

                {/* Paragraph Content Blocks */}
                <div className="border-x border-b border-slate-300 p-4 space-y-3.5 bg-slate-50/50 rounded-b-lg text-xs">
                  
                  {/* Paragraph 1: Progress Summary */}
                  <div className="bg-white border border-slate-200 rounded-lg p-3.5">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-1.5 pb-1 border-b border-slate-100">
                      <ClipboardList className="w-4 h-4 text-blue-600" />
                      <span>سير الأعمال والمنجزات الميدانية:</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed text-[11px] pr-5">
                      {latestLog.summary}
                    </p>
                  </div>

                  {/* Paragraph 2: Obstacles & Actions */}
                  <div className="bg-white border border-slate-200 rounded-lg p-3.5">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-1.5 pb-1 border-b border-slate-100">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span>المعوقات الميدانية والإجراءات التصحيحية:</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed text-[11px] pr-5">
                      {latestLog.obstacles || 'سير الأعمال يسير بانتظام تام، ولا توجد أي معوقات تؤثر على المسار الحرج للمشروع.'}
                    </p>
                  </div>

                  {/* Paragraph 3: Health, Safety & Environment (HSE) */}
                  <div className="bg-white border border-slate-200 rounded-lg p-3.5">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-1.5 pb-1 border-b border-slate-100">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>السلامة والصحة المهنية والبيئة (HSE):</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed text-[11px] pr-5">
                      {latestLog.safetyNotes || 'الالتزام التام بكافة تدابير واشتراطات السلامة المهنية ومهمات الوقاية الشخصية في الموقع.'}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* ========================================================
                4. SIGNATURES & APPROVALS: Clear, separated & editable
               ======================================================== */}
            <footer className="mt-8 pt-6 border-t-2 border-slate-900 print-break-inside-avoid">
              <div className="text-xs font-bold text-slate-800 mb-6 text-center">
                الاعتمادات والمصادقات الرسمية المعتمدة للمشروع
              </div>

              <div className="grid grid-cols-3 gap-6 text-center text-xs">
                {/* Signature 1 */}
                <div className="flex flex-col items-center bg-slate-50/60 border border-slate-200 rounded-lg p-3.5">
                  <input
                    type="text"
                    value={approvalTitle1}
                    onChange={(e) => setApprovalTitle1(e.target.value)}
                    className="font-bold text-slate-900 text-center w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white focus:outline-none pb-1 transition cursor-text text-xs"
                    title="انقر لتعديل المسمى"
                  />
                  <textarea
                    rows={2}
                    value={approvalName1}
                    onChange={(e) => setApprovalName1(e.target.value)}
                    className="text-slate-700 mt-1 text-center w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white focus:outline-none resize-none transition cursor-text leading-snug text-[11px]"
                    title="انقر لتعديل الاسم"
                  />
                  <div className="mt-8 border-b-2 border-dashed border-slate-400 w-36 mx-auto"></div>
                  <div className="text-[10px] text-slate-500 font-medium mt-1.5">التوقيع والختم</div>
                </div>

                {/* Signature 2 */}
                <div className="flex flex-col items-center bg-slate-50/60 border border-slate-200 rounded-lg p-3.5">
                  <input
                    type="text"
                    value={approvalTitle2}
                    onChange={(e) => setApprovalTitle2(e.target.value)}
                    className="font-bold text-slate-900 text-center w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white focus:outline-none pb-1 transition cursor-text text-xs"
                    title="انقر لتعديل المسمى"
                  />
                  <textarea
                    rows={2}
                    value={approvalName2}
                    onChange={(e) => setApprovalName2(e.target.value)}
                    className="text-slate-700 mt-1 text-center w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white focus:outline-none resize-none transition cursor-text leading-snug text-[11px]"
                    title="انقر لتعديل الاسم أو الوصف"
                  />
                  <div className="mt-8 border-b-2 border-dashed border-slate-400 w-36 mx-auto"></div>
                  <div className="text-[10px] text-slate-500 font-medium mt-1.5">التوقيع والختم</div>
                </div>

                {/* Signature 3 */}
                <div className="flex flex-col items-center bg-slate-50/60 border border-slate-200 rounded-lg p-3.5">
                  <input
                    type="text"
                    value={approvalTitle3}
                    onChange={(e) => setApprovalTitle3(e.target.value)}
                    className="font-bold text-slate-900 text-center w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white focus:outline-none pb-1 transition cursor-text text-xs"
                    title="انقر لتعديل المسمى"
                  />
                  <textarea
                    rows={2}
                    value={approvalName3}
                    onChange={(e) => setApprovalName3(e.target.value)}
                    className="text-slate-700 mt-1 text-center w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white focus:outline-none resize-none transition cursor-text leading-snug text-[11px]"
                    title="انقر لتعديل الاسم"
                  />
                  <div className="mt-8 border-b-2 border-dashed border-slate-400 w-36 mx-auto"></div>
                  <div className="text-[10px] text-slate-500 font-medium mt-1.5">التوقيع والختم</div>
                </div>
              </div>

              {/* End of Official Report Notice */}
              <div className="text-center text-[10px] text-slate-400 mt-6 pt-3 border-t border-slate-200 font-mono">
                — نهاية التقرير الهندسي المعتمد — تم الإصدار عبر «محلّل البيانات الهندسي» —
              </div>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
};
