import React, { useRef, useState, useEffect } from 'react';
import { ProjectInfo, WorkItem, MaterialItem, DailyLog } from '../types';
import { 
  calculateProjectMetrics, 
  formatCurrency, 
  formatNumber 
} from '../utils/calculations';
import { 
  translations, 
  LanguageMode, 
  getTranslatedUnit, 
  getTranslatedItemDesc, 
  getTranslatedMaterialName,
  getTranslatedProjectInfo 
} from '../utils/translations';
import { 
  FileDown, 
  Printer, 
  X, 
  FileText,
  Loader2,
  Edit2,
  ChevronDown,
  ChevronUp,
  Save,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  ClipboardList,
  Languages
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
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [reportDate, setReportDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [includeFinancials, setIncludeFinancials] = useState<boolean>(true);
  
  // Language Selection: 'ar' | 'en' | 'bilingual'
  const [lang, setLang] = useState<LanguageMode>('ar');

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
    project.approvalName2 || 'شركة إيكاد — مشروع تطوير مطار الأمير محمد بن عبدالعزيز الدولي'
  );

  const [approvalTitle3, setApprovalTitle3] = useState<string>(
    project.approvalTitle3 || 'المكتب الاستشاري'
  );
  const [approvalName3, setApprovalName3] = useState<string>(
    project.approvalName3 || 'المكتب الاستشاري للمشروع'
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

  const t = translations[lang === 'en' ? 'en' : 'ar'];
  const tAr = translations.ar;
  const tEn = translations.en;
  const isRtl = lang !== 'en';

  const projectMetrics = calculateProjectMetrics(workItems);
  const latestLog = dailyLogs[dailyLogs.length - 1];
  const trProject = getTranslatedProjectInfo(project, lang);

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
    setApprovalName2('شركة إيكاد — مشروع تطوير مطار الأمير محمد بن عبدالعزيز الدولي');
    setApprovalTitle3('المكتب الاستشاري');
    setApprovalName3('المكتب الاستشاري للمشروع');
  };

  // High precision page-by-page PDF capture with explicit dimensions
  const handleDownloadPdf = async () => {
    if (!page1Ref.current || !page2Ref.current) return;

    try {
      setIsGenerating(true);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // Capture Page 1
      const canvas1 = await html2canvas(page1Ref.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        width: 794,
      });
      const img1 = canvas1.toDataURL('image/jpeg', 0.98);
      pdf.addImage(img1, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

      // Capture Page 2
      const canvas2 = await html2canvas(page2Ref.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        width: 794,
      });
      const img2 = canvas2.toDataURL('image/jpeg', 0.98);
      pdf.addPage();
      pdf.addImage(img2, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

      const prefix = lang === 'en' ? 'Engineering_Report' : lang === 'bilingual' ? 'Bilingual_Engineering_Report' : 'تقرير_هندسي_معتمد';
      const fileName = `${prefix}_${project.code}_${reportDate}.pdf`;
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

  // Helper for approval title display based on language
  const getApprovalTitle = (arTitle: string, index: 1 | 2 | 3) => {
    if (lang === 'ar') return arTitle;
    const enDefault = index === 1 ? tEn.defaultApprovalTitle1 : index === 2 ? tEn.defaultApprovalTitle2 : tEn.defaultApprovalTitle3;
    if (lang === 'en') return enDefault;
    return `${arTitle} / ${enDefault}`;
  };

  const getApprovalName = (arName: string, index: 1 | 2 | 3) => {
    if (lang === 'ar') return arName;
    const enDefault = index === 1 ? tEn.defaultApprovalName1 : index === 2 ? tEn.defaultApprovalName2 : tEn.defaultApprovalName3;
    if (lang === 'en') return enDefault;
    return `${arName} / ${enDefault}`;
  };

  return (
    <div id="pdf-modal-backdrop" className="pdf-modal-backdrop fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div id="pdf-modal-card" className="pdf-modal-card bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden">
        
        {/* ========================================================
            TOP TOOLBAR / CONTROL BAR (Non-printed)
           ======================================================== */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col gap-3.5 no-print">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>تصدير وطباعة التقرير الهندسي المعتمد (PDF)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    A4 معتمد (صفحتين)
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  تنسيق منظم ومطابق لصفحة A4 بالمليمتر، خالي من التداخل والتقطيع مع دعم اللغتين
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

              <button
                id="btn-trigger-print"
                type="button"
                onClick={handlePrint}
                title="طباعة المستند مباشرة أو تصديره إلى PDF من المتصفح"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>طباعة المستند (Print)</span>
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
                    <span>جاري التصدير...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    <span>تصدير ملف PDF</span>
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

          {/* Options Row: Language Selection & Financial Checkbox */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            {/* Bilingual Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-amber-400" />
                <span>لغة التقرير المطلوبة:</span>
              </span>
              <div className="inline-flex items-center p-1 bg-slate-800 rounded-lg border border-slate-700 gap-1 text-xs">
                <button
                  type="button"
                  id="btn-lang-ar"
                  onClick={() => setLang('ar')}
                  className={`px-3 py-1 rounded transition font-medium ${
                    lang === 'ar' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  العربية فقط
                </button>
                <button
                  type="button"
                  id="btn-lang-en"
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 rounded transition font-medium ${
                    lang === 'en' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  English Only
                </button>
                <button
                  type="button"
                  id="btn-lang-bilingual"
                  onClick={() => setLang('bilingual')}
                  className={`px-3 py-1 rounded transition font-medium ${
                    lang === 'bilingual' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  ثنائي اللغة (Bilingual)
                </button>
              </div>
            </div>

            {/* Financials Toggle & Report Date */}
            <div className="flex items-center gap-4">
              <label 
                className="flex items-center gap-2 cursor-pointer bg-slate-800/90 hover:bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 hover:border-amber-500/50 transition select-none group"
              >
                <input
                  type="checkbox"
                  checked={includeFinancials}
                  onChange={(e) => setIncludeFinancials(e.target.checked)}
                  className="w-3.5 h-3.5 accent-amber-500 rounded cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-200 group-hover:text-amber-300">
                  {lang === 'en' ? 'Include Financial Values' : 'تضمين الأسعار والقيم المالية'}
                </span>
              </label>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>{lang === 'en' ? 'Report Date:' : 'تاريخ التقرير:'}</span>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-0.5 rounded focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Editable Signatures Form Drawer */}
          {showSignaturesEditor && (
            <div className="p-4 bg-slate-800/95 border border-amber-500/30 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
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

        {/* ========================================================
            DOCUMENT PAGES CONTAINER (Scrollable Preview)
           ======================================================== */}
        <div className="pdf-modal-scroll-area p-4 sm:p-6 overflow-y-auto overflow-x-auto bg-slate-950/70 flex flex-col items-center gap-8">
          
          {/* ========================================================
              PAGE 1 (EXACT A4: 794px x 1123px)
             ======================================================== */}
          <div
            ref={page1Ref}
            id="report-page-1"
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`pdf-a4-page shadow-2xl border border-slate-300 text-slate-900 ${
              isRtl ? 'text-right' : 'text-left'
            }`}
          >
            {/* Top Content Area */}
            <div>
              {/* Official Header Bar */}
              <header className="border-b-2 border-slate-900 pb-3 mb-3">
                <div className="flex items-start justify-between gap-4 pb-2 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-lg font-bold text-slate-950">
                        {lang === 'en' ? tEn.systemTitle : tAr.systemTitle}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                        {lang === 'en' ? tEn.badge : tAr.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium">
                      {lang === 'en' ? tEn.systemSubTitle : tAr.systemSubTitle}
                    </p>
                    {lang === 'bilingual' && (
                      <p className="text-[9px] text-slate-500 italic mt-0.5" dir="ltr">
                        {tEn.systemTitle} — {tEn.systemSubTitle}
                      </p>
                    )}
                  </div>

                  {/* Metadata Table */}
                  <div className="bg-slate-50 border border-slate-300 rounded p-2 text-[10px] min-w-[210px]">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr>
                          <td className="text-slate-500 py-0.5 font-medium">
                            {lang === 'bilingual' ? `${tAr.code} / ${tEn.code}` : t.code}
                          </td>
                          <td className={`font-bold text-slate-900 py-0.5 ${isRtl ? 'text-left' : 'text-right'}`}>
                            <span dir="ltr">{project.code}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-slate-500 py-0.5 font-medium">
                            {lang === 'bilingual' ? `${tAr.date} / ${tEn.date}` : t.date}
                          </td>
                          <td className={`text-slate-800 py-0.5 font-medium ${isRtl ? 'text-left' : 'text-right'}`}>
                            <span dir="ltr">{reportDate}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-slate-500 py-0.5 font-medium">
                            {lang === 'bilingual' ? `${tAr.approvalStatus} / ${tEn.approvalStatus}` : t.approvalStatus}
                          </td>
                          <td className={`py-0.5 ${isRtl ? 'text-left' : 'text-right'}`}>
                            <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 text-[9px]">
                              {lang === 'bilingual' ? `${tAr.approvedOfficial} / ${tEn.approvedOfficial}` : t.approvedOfficial}
                            </span>
                          </td>
                        </tr>
                        {!includeFinancials && (
                          <tr>
                            <td colSpan={2} className="pt-1 border-t border-slate-200 text-center text-[9px] font-bold text-amber-700">
                              {lang === 'bilingual' ? `${tAr.technicalOnlyNotice} / ${tEn.technicalOnlyNotice}` : t.technicalOnlyNotice}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Main Title Banner */}
                <div className="mt-2.5 text-center py-2 bg-slate-100 rounded border border-slate-200">
                  <h1 className="text-sm font-bold text-slate-950 leading-tight">
                    {includeFinancials ? t.comprehensiveReportTitle : t.comprehensiveNoPriceReportTitle}
                  </h1>
                  {lang === 'bilingual' && (
                    <p className="text-[10px] font-semibold text-slate-700 mt-0.5" dir="ltr">
                      {includeFinancials ? tEn.comprehensiveReportTitle : tEn.comprehensiveNoPriceReportTitle}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-800 mt-0.5 font-bold">
                    {trProject.name} {trProject.location ? `— ${trProject.location}` : ''}
                  </p>
                </div>

                {/* Project Info 4 Cards */}
                <div className="grid grid-cols-4 gap-2 mt-2 text-[10px]">
                  <div className="bg-slate-50 border border-slate-200 rounded p-2">
                    <span className="text-slate-500 block text-[9px] font-medium mb-0.5">
                      {lang === 'bilingual' ? `${tAr.projectName} / ${tEn.projectName}` : t.projectName}
                    </span>
                    <span className="text-slate-950 font-bold leading-tight block">
                      {trProject.name}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded p-2">
                    <span className="text-slate-500 block text-[9px] font-medium mb-0.5">
                      {lang === 'bilingual' ? `${tAr.client} / ${tEn.client}` : t.client}
                    </span>
                    <span className="text-slate-900 font-bold leading-tight block">
                      {trProject.client}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded p-2">
                    <span className="text-slate-500 block text-[9px] font-medium mb-0.5">
                      {lang === 'bilingual' ? `${tAr.contractor} / ${tEn.contractor}` : t.contractor}
                    </span>
                    <span className="text-slate-900 font-bold leading-tight block">
                      {trProject.contractor}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded p-2">
                    <span className="text-slate-500 block text-[9px] font-medium mb-0.5">
                      {lang === 'bilingual' ? `${tAr.consultant} / ${tEn.consultant}` : t.consultant}
                    </span>
                    <span className="text-slate-900 font-bold leading-tight block">
                      {trProject.consultant}
                    </span>
                  </div>
                </div>
              </header>

              {/* Executive KPIs Grid */}
              <section className="mb-3">
                <div className={`grid gap-2 ${includeFinancials ? 'grid-cols-4' : 'grid-cols-3'}`}>
                  {/* KPI 1: Progress */}
                  <div className="bg-slate-50 border border-slate-300 rounded p-2 text-center flex flex-col justify-between">
                    <span className="text-[10px] font-semibold text-slate-600 block">
                      {lang === 'bilingual' ? `${tAr.actualProgress} / ${tEn.actualProgress}` : t.actualProgress}
                    </span>
                    <div className="my-0.5">
                      <span className="text-lg font-bold text-blue-700" dir="ltr">
                        {formatNumber(projectMetrics.actualProgressPercent, 1)}%
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-medium block">
                      {t.plannedProgress}: <span dir="ltr">{formatNumber(projectMetrics.plannedProgressPercent, 1)}%</span>
                    </span>
                  </div>

                  {/* KPI 2: SPI */}
                  <div className="bg-slate-50 border border-slate-300 rounded p-2 text-center flex flex-col justify-between">
                    <span className="text-[10px] font-semibold text-slate-600 block">
                      {lang === 'bilingual' ? `${tAr.scheduleIndex} / ${tEn.scheduleIndex}` : t.scheduleIndex}
                    </span>
                    <div className="my-0.5">
                      <span className={`text-lg font-bold ${
                        projectMetrics.spi >= 1 ? 'text-emerald-700' : 'text-rose-700'
                      }`} dir="ltr">
                        {projectMetrics.spi.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-medium block">
                      {projectMetrics.variance >= 0 
                        ? `+${projectMetrics.variance}% ${t.aheadOfSchedule}` 
                        : `${projectMetrics.variance}% ${t.scheduleDelay}`}
                    </span>
                  </div>

                  {/* KPI 3: Financials */}
                  {includeFinancials && (
                    <div className="bg-slate-50 border border-slate-300 rounded p-2 text-center flex flex-col justify-between">
                      <span className="text-[10px] font-semibold text-slate-600 block">
                        {lang === 'bilingual' ? `${tAr.executedValue} / ${tEn.executedValue}` : t.executedValue}
                      </span>
                      <div className="my-0.5">
                        <span className="text-sm font-bold text-slate-900" dir="ltr">
                          {formatCurrency(projectMetrics.totalExecutedCost, trProject.currency)}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-medium block">
                        {t.contractValue}: <span dir="ltr">{formatCurrency(project.totalContractValue, trProject.currency)}</span>
                      </span>
                    </div>
                  )}

                  {/* KPI 4: Workforce */}
                  <div className="bg-slate-50 border border-slate-300 rounded p-2 text-center flex flex-col justify-between">
                    <span className="text-[10px] font-semibold text-slate-600 block">
                      {lang === 'bilingual' ? `${tAr.workforce} / ${tEn.workforce}` : t.workforce}
                    </span>
                    <div className="my-0.5">
                      <span className="text-lg font-bold text-amber-700" dir="ltr">
                        {latestLog?.laborCount || 0}
                      </span>
                      <span className="text-[10px] text-slate-600 font-bold mx-1">
                        {t.workers}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-medium block">
                      + <span dir="ltr">{latestLog?.equipmentCount || 0}</span> {t.equipmentOperating}
                    </span>
                  </div>
                </div>
              </section>

              {/* TABLE 1: BOQ Items (Exact fixed layout, perfectly fitting Page 1) */}
              <section className="mb-2">
                <div className="flex items-center justify-between bg-slate-100 border border-slate-300 px-2.5 py-1.5 rounded-t">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <h2 className="text-[11px] font-bold text-slate-900">
                      {lang === 'bilingual' ? `${tAr.boqSectionTitle} / ${tEn.boqSectionTitle}` : t.boqSectionTitle}
                    </h2>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {t.totalItems}: {workItems.length}
                  </span>
                </div>

                <div className="border-x border-b border-slate-300 overflow-hidden">
                  <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 border-b border-slate-300 text-[9px] font-bold">
                        <th style={{ width: '60px' }} className={`py-1.5 px-1 text-center ${isRtl ? 'border-l' : 'border-r'} border-slate-200`}>
                          {lang === 'bilingual' ? 'الكود / Code' : t.boqCode}
                        </th>
                        <th style={{ width: includeFinancials ? '250px' : '330px' }} className={`py-1.5 px-2 ${isRtl ? 'text-right border-l' : 'text-left border-r'} border-slate-200`}>
                          {lang === 'bilingual' ? 'بيان وتوصيف الأعمال / Scope Description' : t.boqDescription}
                        </th>
                        <th style={{ width: '45px' }} className={`py-1.5 px-1 text-center ${isRtl ? 'border-l' : 'border-r'} border-slate-200`}>
                          {lang === 'bilingual' ? 'الوحدة / Unit' : t.unit}
                        </th>
                        <th style={{ width: '65px' }} className={`py-1.5 px-1 text-center ${isRtl ? 'border-l' : 'border-r'} border-slate-200`}>
                          {lang === 'bilingual' ? 'المقرر / Plan' : t.plannedQty}
                        </th>
                        <th style={{ width: '60px' }} className={`py-1.5 px-1 text-center ${isRtl ? 'border-l' : 'border-r'} border-slate-200`}>
                          {lang === 'bilingual' ? 'اليوم / Today' : t.todayQty}
                        </th>
                        <th style={{ width: '65px' }} className={`py-1.5 px-1 text-center ${isRtl ? 'border-l' : 'border-r'} border-slate-200`}>
                          {lang === 'bilingual' ? 'المنفذ / Exec' : t.totalExecQty}
                        </th>
                        <th style={{ width: '60px' }} className={`py-1.5 px-1 text-center ${includeFinancials ? (isRtl ? 'border-l' : 'border-r') + ' border-slate-200' : ''}`}>
                          {lang === 'bilingual' ? 'الإنجاز / %' : t.progressPercent}
                        </th>
                        {includeFinancials && (
                          <th style={{ width: '80px' }} className="py-1.5 px-1.5 text-center">
                            {lang === 'bilingual' ? 'القيمة / Value' : t.executedCost}
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[9.5px]">
                      {workItems.map((item, idx) => {
                        const totalExec = item.previousQuantity + item.todayQuantity;
                        const percent = item.plannedQuantity > 0 
                          ? Math.min(100, (totalExec / item.plannedQuantity) * 100) 
                          : 0;
                        const val = totalExec * item.unitRate;
                        const itemDesc = getTranslatedItemDesc(item.code, item.description, lang);
                        const itemUnit = getTranslatedUnit(item.unit, lang);

                        return (
                          <tr 
                            key={item.id} 
                            className={idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}
                          >
                            <td className={`py-1 px-1 text-center font-bold text-slate-800 ${isRtl ? 'border-l' : 'border-r'} border-slate-200 whitespace-nowrap`}>
                              <span dir="ltr">{item.code}</span>
                            </td>
                            <td className={`py-1 px-2 ${isRtl ? 'text-right border-l' : 'text-left border-r'} border-slate-200 font-medium text-slate-900 leading-tight`}>
                              {lang === 'bilingual' ? (
                                <div>
                                  <div className="font-semibold text-slate-950">{item.description}</div>
                                  <div className="text-[8.5px] text-slate-600 font-normal italic" dir="ltr">
                                    {getTranslatedItemDesc(item.code, item.description, 'en')}
                                  </div>
                                </div>
                              ) : (
                                itemDesc
                              )}
                            </td>
                            <td className={`py-1 px-1 text-center text-slate-700 ${isRtl ? 'border-l' : 'border-r'} border-slate-200 whitespace-nowrap`}>
                              {itemUnit}
                            </td>
                            <td className={`py-1 px-1 text-center font-semibold text-slate-800 ${isRtl ? 'border-l' : 'border-r'} border-slate-200 whitespace-nowrap`}>
                              <span dir="ltr">{formatNumber(item.plannedQuantity)}</span>
                            </td>
                            <td className={`py-1 px-1 text-center font-bold text-amber-700 ${isRtl ? 'border-l' : 'border-r'} border-slate-200 whitespace-nowrap`}>
                              <span dir="ltr">+{formatNumber(item.todayQuantity)}</span>
                            </td>
                            <td className={`py-1 px-1 text-center font-bold text-slate-900 ${isRtl ? 'border-l' : 'border-r'} border-slate-200 whitespace-nowrap`}>
                              <span dir="ltr">{formatNumber(totalExec)}</span>
                            </td>
                            <td className={`py-1 px-1 text-center font-bold whitespace-nowrap ${
                              includeFinancials ? (isRtl ? 'border-l' : 'border-r') + ' border-slate-200' : ''
                            }`}>
                              <span dir="ltr" className={percent >= 100 ? 'text-emerald-700 font-extrabold' : 'text-blue-700'}>
                                {formatNumber(percent, 1)}%
                              </span>
                            </td>
                            {includeFinancials && (
                              <td className="py-1 px-1.5 text-center font-semibold text-slate-900 whitespace-nowrap">
                                <span dir="ltr">{formatCurrency(val, trProject.currency)}</span>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>

                    <tfoot>
                      <tr className="bg-slate-100 font-bold text-[9.5px] border-t-2 border-slate-300">
                        <td colSpan={2} className={`py-1.5 px-2 ${isRtl ? 'text-right border-l' : 'text-left border-r'} border-slate-200 text-slate-900`}>
                          {lang === 'bilingual' ? `${tAr.boqSummaryTitle} / ${tEn.boqSummaryTitle}` : t.boqSummaryTitle}
                        </td>
                        <td colSpan={4} className={`py-1.5 px-1 text-center text-slate-600 ${isRtl ? 'border-l' : 'border-r'} border-slate-200`}>
                          {workItems.length} {t.engineeringItems}
                        </td>
                        <td className={`py-1.5 px-1 text-center font-bold text-blue-800 ${
                          includeFinancials ? (isRtl ? 'border-l' : 'border-r') + ' border-slate-200' : ''
                        }`}>
                          <span dir="ltr">{formatNumber(projectMetrics.actualProgressPercent, 1)}%</span>
                        </td>
                        {includeFinancials && (
                          <td className="py-1.5 px-1.5 text-center font-bold text-slate-950 whitespace-nowrap">
                            <span dir="ltr">{formatCurrency(projectMetrics.totalExecutedCost, trProject.currency)}</span>
                          </td>
                        )}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>
            </div>

            {/* Fixed Footer Bar with Page Numbering for Page 1 */}
            <footer className="pt-2 border-t border-slate-300 text-[9.5px] text-slate-500 flex items-center justify-between mt-auto">
              <div>
                <span>{t.confidentialNotice}</span>
              </div>
              <div className="font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded border border-slate-300">
                {lang === 'bilingual' ? 'صفحة 1 من 2 | Page 1 of 2' : t.pageNumber(1, 2)}
              </div>
            </footer>
          </div>

          {/* ========================================================
              PAGE 2 (EXACT A4: 794px x 1123px)
             ======================================================== */}
          <div
            ref={page2Ref}
            id="report-page-2"
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`pdf-a4-page shadow-2xl border border-slate-300 text-slate-900 ${
              isRtl ? 'text-right' : 'text-left'
            }`}
          >
            {/* Top Content Area */}
            <div>
              {/* Page 2 Continuity Header */}
              <header className="border-b-2 border-slate-900 pb-2.5 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-950 block">
                      {lang === 'en' ? tEn.systemTitle : tAr.systemTitle}
                    </span>
                    <span className="text-[10.5px] text-slate-600 font-semibold">
                      {trProject.name} — <span dir="ltr">{project.code}</span>
                    </span>
                  </div>
                  <div className="text-left text-[10px] bg-slate-100 border border-slate-300 px-2.5 py-1 rounded">
                    <span className="text-slate-500 font-medium">{t.date} </span>
                    <span className="font-bold text-slate-900" dir="ltr">{reportDate}</span>
                  </div>
                </div>
              </header>

              {/* SECTION 2: Materials & Inventory Table */}
              <section className="mb-3">
                <div className="flex items-center justify-between bg-slate-100 border border-slate-300 px-2.5 py-1.5 rounded-t">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    <h2 className="text-[11px] font-bold text-slate-900">
                      {lang === 'bilingual' ? `${tAr.materialsSectionTitle} / ${tEn.materialsSectionTitle}` : t.materialsSectionTitle}
                    </h2>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {materials.length} {t.basicMaterials}
                  </span>
                </div>

                <div className="border-x border-b border-slate-300 overflow-hidden">
                  <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 border-b border-slate-300 text-[9px] font-bold">
                        <th style={{ width: '220px' }} className={`py-1.5 px-2 ${isRtl ? 'text-right border-l' : 'text-left border-r'} border-slate-200`}>
                          {lang === 'bilingual' ? 'المادة والمواصفة / Material & Spec' : t.materialNameSpec}
                        </th>
                        <th style={{ width: '45px' }} className={`py-1.5 px-1 text-center ${isRtl ? 'border-l' : 'border-r'} border-slate-200`}>
                          {lang === 'bilingual' ? 'الوحدة / Unit' : t.unit}
                        </th>
                        <th style={{ width: '70px' }} className={`py-1.5 px-1 text-center ${isRtl ? 'border-l' : 'border-r'} border-slate-200`}>
                          {lang === 'bilingual' ? 'المطلوب / Req.' : t.totalRequired}
                        </th>
                        <th style={{ width: '70px' }} className={`py-1.5 px-1 text-center ${isRtl ? 'border-l' : 'border-r'} border-slate-200`}>
                          {lang === 'bilingual' ? 'المورّد / Deliv.' : t.totalDelivered}
                        </th>
                        <th style={{ width: '70px' }} className={`py-1.5 px-1 text-center ${isRtl ? 'border-l' : 'border-r'} border-slate-200`}>
                          {lang === 'bilingual' ? 'مستهلك اليوم / Today' : t.todayConsumed}
                        </th>
                        <th style={{ width: '70px' }} className={`py-1.5 px-1 text-center ${isRtl ? 'border-l' : 'border-r'} border-slate-200`}>
                          {lang === 'bilingual' ? 'المستهلك / Consumed' : t.totalConsumed}
                        </th>
                        <th style={{ width: '70px' }} className={`py-1.5 px-1 text-center ${isRtl ? 'border-l' : 'border-r'} border-slate-200`}>
                          {lang === 'bilingual' ? 'المتبقي / Stock' : t.remainingBalance}
                        </th>
                        <th style={{ width: '70px' }} className="py-1.5 px-1 text-center">
                          {lang === 'bilingual' ? 'الموقف / Status' : t.stockStatus}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[9.5px]">
                      {materials.map((mat, idx) => {
                        const remaining = mat.totalDelivered - mat.totalUsed;
                        const isLow = remaining <= mat.minThreshold;
                        const matName = getTranslatedMaterialName(mat.name, lang);
                        const matUnit = getTranslatedUnit(mat.unit, lang);

                        return (
                          <tr 
                            key={mat.id}
                            className={idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}
                          >
                            <td className={`py-1 px-2 ${isRtl ? 'text-right border-l' : 'text-left border-r'} border-slate-200 font-medium text-slate-900 leading-tight`}>
                              {lang === 'bilingual' ? (
                                <div>
                                  <div className="font-semibold text-slate-950">{mat.name}</div>
                                  <div className="text-[8.5px] text-slate-600 font-normal italic" dir="ltr">
                                    {getTranslatedMaterialName(mat.name, 'en')}
                                  </div>
                                </div>
                              ) : (
                                matName
                              )}
                            </td>
                            <td className={`py-1 px-1 text-center text-slate-700 ${isRtl ? 'border-l' : 'border-r'} border-slate-200 whitespace-nowrap`}>
                              {matUnit}
                            </td>
                            <td className={`py-1 px-1 text-center font-semibold text-slate-800 ${isRtl ? 'border-l' : 'border-r'} border-slate-200 whitespace-nowrap`}>
                              <span dir="ltr">{formatNumber(mat.totalRequired)}</span>
                            </td>
                            <td className={`py-1 px-1 text-center font-bold text-blue-900 ${isRtl ? 'border-l' : 'border-r'} border-slate-200 whitespace-nowrap`}>
                              <span dir="ltr">{formatNumber(mat.totalDelivered)}</span>
                            </td>
                            <td className={`py-1 px-1 text-center font-bold text-purple-700 ${isRtl ? 'border-l' : 'border-r'} border-slate-200 whitespace-nowrap`}>
                              <span dir="ltr">{formatNumber(mat.todayUsed)}</span>
                            </td>
                            <td className={`py-1 px-1 text-center font-semibold text-slate-800 ${isRtl ? 'border-l' : 'border-r'} border-slate-200 whitespace-nowrap`}>
                              <span dir="ltr">{formatNumber(mat.totalUsed)}</span>
                            </td>
                            <td className={`py-1 px-1 text-center font-bold text-slate-900 ${isRtl ? 'border-l' : 'border-r'} border-slate-200 whitespace-nowrap`}>
                              <span dir="ltr">{formatNumber(remaining)}</span>
                            </td>
                            <td className="py-1 px-1 text-center whitespace-nowrap">
                              {isLow ? (
                                <span className="text-[8.5px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1 py-0.5 rounded">
                                  {lang === 'bilingual' ? `${tAr.stockShortage} / ${tEn.stockShortage}` : t.stockShortage}
                                </span>
                              ) : (
                                <span className="text-[8.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.5 rounded">
                                  {lang === 'bilingual' ? `${tAr.stockAdequate} / ${tEn.stockAdequate}` : t.stockAdequate}
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

              {/* SECTION 3: Site Observations / Daily Log */}
              {latestLog && (
                <section className="mb-3">
                  <div className="flex items-center justify-between bg-slate-100 border border-slate-300 px-2.5 py-1.5 rounded-t">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <h2 className="text-[11px] font-bold text-slate-900">
                        {lang === 'bilingual' ? `${tAr.logsSectionTitle} / ${tEn.logsSectionTitle}` : t.logsSectionTitle} (<span dir="ltr">{latestLog.dayName} {latestLog.date}</span>)
                      </h2>
                    </div>
                    <span className="text-[9px] text-slate-600 font-medium">
                      {t.documentedBy} {latestLog.loggedBy}
                    </span>
                  </div>

                  <div className="border-x border-b border-slate-300 p-2.5 space-y-2 bg-slate-50/50 rounded-b text-[9.5px]">
                    {/* Paragraph 1 */}
                    <div className="bg-white border border-slate-200 rounded p-2">
                      <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-0.5 pb-0.5 border-b border-slate-100 text-[10px]">
                        <ClipboardList className="w-3 h-3 text-blue-600" />
                        <span>{lang === 'bilingual' ? `${tAr.progressBlockTitle} / ${tEn.progressBlockTitle}` : t.progressBlockTitle}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed">
                        {latestLog.summary}
                      </p>
                      {lang === 'bilingual' && (
                        <p className="text-slate-600 leading-relaxed text-[8.5px] italic mt-0.5" dir="ltr">
                          Field activities progressed on schedule with milestone accomplishments recorded today.
                        </p>
                      )}
                    </div>

                    {/* Paragraph 2 */}
                    <div className="bg-white border border-slate-200 rounded p-2">
                      <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-0.5 pb-0.5 border-b border-slate-100 text-[10px]">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        <span>{lang === 'bilingual' ? `${tAr.obstaclesBlockTitle} / ${tEn.obstaclesBlockTitle}` : t.obstaclesBlockTitle}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed">
                        {latestLog.obstacles || t.obstaclesDefault}
                      </p>
                      {lang === 'bilingual' && (
                        <p className="text-slate-600 leading-relaxed text-[8.5px] italic mt-0.5" dir="ltr">
                          {tEn.obstaclesDefault}
                        </p>
                      )}
                    </div>

                    {/* Paragraph 3 */}
                    <div className="bg-white border border-slate-200 rounded p-2">
                      <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-0.5 pb-0.5 border-b border-slate-100 text-[10px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{lang === 'bilingual' ? `${tAr.hseBlockTitle} / ${tEn.hseBlockTitle}` : t.hseBlockTitle}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed">
                        {latestLog.safetyNotes || t.hseDefault}
                      </p>
                      {lang === 'bilingual' && (
                        <p className="text-slate-600 leading-relaxed text-[8.5px] italic mt-0.5" dir="ltr">
                          {tEn.hseDefault}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* SECTION 4: Official Sign-offs & Approvals */}
              <section className="mt-3 pt-2.5 border-t-2 border-slate-900">
                <div className="text-[11px] font-bold text-slate-900 mb-2.5 text-center">
                  {lang === 'bilingual' ? `${tAr.approvalsSectionTitle} / ${tEn.approvalsSectionTitle}` : t.approvalsSectionTitle}
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center text-[9.5px]">
                  {/* Sign 1 */}
                  <div className="flex flex-col items-center justify-between bg-slate-50 border border-slate-300 rounded p-2 min-h-[110px]">
                    <div className="w-full">
                      <div className="font-bold text-slate-900 text-center text-[10.5px]">
                        {getApprovalTitle(approvalTitle1, 1)}
                      </div>
                      <div className="text-slate-700 mt-0.5 text-center text-[9.5px] leading-tight font-medium">
                        {getApprovalName(approvalName1, 1)}
                      </div>
                    </div>
                    <div className="w-full mt-3">
                      <div className="border-b-2 border-dashed border-slate-400 w-28 mx-auto"></div>
                      <div className="text-[8.5px] text-slate-500 font-medium mt-1">
                        {t.signAndStamp}
                      </div>
                    </div>
                  </div>

                  {/* Sign 2 */}
                  <div className="flex flex-col items-center justify-between bg-slate-50 border border-slate-300 rounded p-2 min-h-[110px]">
                    <div className="w-full">
                      <div className="font-bold text-slate-900 text-center text-[10.5px]">
                        {getApprovalTitle(approvalTitle2, 2)}
                      </div>
                      <div className="text-slate-700 mt-0.5 text-center text-[9.5px] leading-tight font-medium">
                        {getApprovalName(approvalName2, 2)}
                      </div>
                    </div>
                    <div className="w-full mt-3">
                      <div className="border-b-2 border-dashed border-slate-400 w-28 mx-auto"></div>
                      <div className="text-[8.5px] text-slate-500 font-medium mt-1">
                        {t.signAndStamp}
                      </div>
                    </div>
                  </div>

                  {/* Sign 3 */}
                  <div className="flex flex-col items-center justify-between bg-slate-50 border border-slate-300 rounded p-2 min-h-[110px]">
                    <div className="w-full">
                      <div className="font-bold text-slate-900 text-center text-[10.5px]">
                        {getApprovalTitle(approvalTitle3, 3)}
                      </div>
                      <div className="text-slate-700 mt-0.5 text-center text-[9.5px] leading-tight font-medium">
                        {getApprovalName(approvalName3, 3)}
                      </div>
                    </div>
                    <div className="w-full mt-3">
                      <div className="border-b-2 border-dashed border-slate-400 w-28 mx-auto"></div>
                      <div className="text-[8.5px] text-slate-500 font-medium mt-1">
                        {t.signAndStamp}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Fixed Footer Bar with Page Numbering for Page 2 */}
            <footer className="pt-2 border-t border-slate-300 text-[9.5px] text-slate-500 flex items-center justify-between mt-auto">
              <div>
                <span>{t.confidentialNotice}</span>
              </div>
              <div className="font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded border border-slate-300">
                {lang === 'bilingual' ? 'صفحة 2 من 2 | Page 2 of 2' : t.pageNumber(2, 2)}
              </div>
            </footer>
          </div>

        </div>
      </div>
    </div>
  );
};
