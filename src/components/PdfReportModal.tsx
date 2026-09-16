import React, { useRef, useState } from 'react';
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
  Loader2
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
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  onClose,
  project,
  workItems,
  materials,
  dailyLogs,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportDate, setReportDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [reportType, setReportType] = useState<'daily' | 'comprehensive'>('comprehensive');

  if (!isOpen) return null;

  const projectMetrics = calculateProjectMetrics(workItems);
  const materialMetrics = calculateMaterialMetrics(materials);
  const latestLog = dailyLogs[dailyLogs.length - 1];

  const handleDownloadPdf = async () => {
    if (!printAreaRef.current) return;

    try {
      setIsGenerating(true);
      const element = printAreaRef.current;

      // Capture high-resolution canvas
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution for crisp text
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
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

      // Handle multi-page if content overflows A4
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
      // Fallback to native print if html2canvas faces sandbox restrictions
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Modal Top Control Bar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                تصدير التقرير الهندسي المعتمد (PDF)
              </h3>
              <p className="text-xs text-slate-400">
                معاينة مباشرة للوثيقة الهندسية الجاهزة للطباعة والتصدير
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
                تقرير الإنجاز اليومي
              </button>
            </div>

            <button
              id="btn-trigger-print"
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>طباعة المستند</span>
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
                  <span>جاري إنشاء PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>تحميل ملف PDF</span>
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

        {/* Scrollable Printable Document Container */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-slate-950/60 flex justify-center">
          {/* A4 Sheet Container */}
          <div
            ref={printAreaRef}
            id="printable-report"
            className="w-full max-w-4xl bg-white text-slate-900 p-8 sm:p-10 shadow-2xl rounded-sm border border-slate-200 text-right selection:bg-amber-200 font-sans"
            style={{ minHeight: '1100px' }}
          >
            {/* Header / Engineering Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-slate-950 tracking-tight">
                      محلّل البيانات الهندسي
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-900 text-white px-2 py-0.5 rounded">
                      ENGINEERING REPORT
                    </span>
                  </div>
                  <h1 className="text-lg font-bold text-slate-800 mt-1">
                    {reportType === 'comprehensive' ? 'تقرير المتابعة الفنية الشاملة لحصر الكميات والمواد' : 'التقرير اليومي المعتمد لسير الأعمال بالموقع'}
                  </h1>
                </div>

                <div className="text-left font-mono text-xs text-slate-600">
                  <div className="font-bold text-slate-900">رقم الوثيقة: {project.code}</div>
                  <div>التاريخ: {reportDate}</div>
                  <div>حالة التقرير: معتمد رسمي</div>
                </div>
              </div>

              {/* Project Meta Details Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">اسم المشروع:</span>
                  <strong className="text-slate-900 font-bold">{project.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">الجهة المالكة (العميل):</span>
                  <strong className="text-slate-900">{project.client}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">المقاول العام المنفذ:</span>
                  <strong className="text-slate-900">{project.contractor}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">الاستشاري الهندسي المشرف:</span>
                  <strong className="text-slate-900">{project.consultant}</strong>
                </div>
              </div>
            </div>

            {/* Executive KPIs Box */}
            <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg mb-6">
              <div className="text-center border-l border-slate-200 last:border-none">
                <span className="text-[11px] text-slate-600 block">نسبة الإنجاز الفعلي</span>
                <span className="text-xl font-black text-blue-700 font-mono">
                  {formatNumber(projectMetrics.actualProgressPercent, 1)}%
                </span>
                <span className="text-[10px] text-slate-500 block">
                  المخطط: {formatNumber(projectMetrics.plannedProgressPercent, 1)}%
                </span>
              </div>

              <div className="text-center border-l border-slate-200 last:border-none">
                <span className="text-[11px] text-slate-600 block">مؤشر الجدول (SPI)</span>
                <span className={`text-xl font-black font-mono ${projectMetrics.spi >= 1 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {projectMetrics.spi.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {projectMetrics.variance >= 0 ? `+${projectMetrics.variance}% تقدم` : `${projectMetrics.variance}% تأخير`}
                </span>
              </div>

              <div className="text-center border-l border-slate-200 last:border-none">
                <span className="text-[11px] text-slate-600 block">القيمة المنفذة للأعمال</span>
                <span className="text-base font-black text-slate-900 font-mono">
                  {formatCurrency(projectMetrics.totalExecutedCost, project.currency)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  من إجمالي العقد
                </span>
              </div>

              <div className="text-center">
                <span className="text-[11px] text-slate-600 block">القوة العاملة باليوم</span>
                <span className="text-xl font-black text-amber-700 font-mono">
                  {latestLog?.laborCount || 0}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  فرد + {latestLog?.equipmentCount || 0} معدات
                </span>
              </div>
            </div>

            {/* Table 1: Work Items & Completion Rates (BOQ) */}
            <div className="mb-6 print-break-inside-avoid">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-r-4 border-amber-500 pr-2">
                  أولاً: جدول حصر الكميات ونسب الإنجاز التراكمية المعتمدة
                </h2>
                <span className="text-[11px] text-slate-500 font-mono">
                  إجمالي البنود: {workItems.length}
                </span>
              </div>

              <table className="w-full text-right text-[11px] border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                    <th className="p-2 border border-slate-300 w-16">الكود</th>
                    <th className="p-2 border border-slate-300">بيان الأعمال الهندسية</th>
                    <th className="p-2 border border-slate-300 text-center w-14">الوحدة</th>
                    <th className="p-2 border border-slate-300 text-center w-20">الكمية المقررة</th>
                    <th className="p-2 border border-slate-300 text-center w-20">منجز اليوم</th>
                    <th className="p-2 border border-slate-300 text-center w-20">إجمالي المنفذ</th>
                    <th className="p-2 border border-slate-300 text-center w-20">نسبة الإنجاز</th>
                    <th className="p-2 border border-slate-300 text-center w-28">القيمة المنفذة</th>
                  </tr>
                </thead>
                <tbody>
                  {workItems.map((item) => {
                    const totalExec = item.previousQuantity + item.todayQuantity;
                    const percent = item.plannedQuantity > 0 
                      ? Math.min(100, (totalExec / item.plannedQuantity) * 100) 
                      : 0;
                    const val = totalExec * item.unitRate;

                    return (
                      <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="p-2 border border-slate-200 font-mono font-bold text-slate-700">
                          {item.code}
                        </td>
                        <td className="p-2 border border-slate-200 font-medium">
                          {item.description}
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-mono">
                          {item.unit}
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-mono">
                          {formatNumber(item.plannedQuantity)}
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-mono font-semibold text-amber-700">
                          +{formatNumber(item.todayQuantity)}
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-mono font-bold text-slate-900">
                          {formatNumber(totalExec)}
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-mono font-bold">
                          <span className={percent >= 100 ? 'text-emerald-700' : 'text-blue-700'}>
                            {formatNumber(percent, 1)}%
                          </span>
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-mono text-slate-800">
                          {formatCurrency(val, project.currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table 2: Materials & Inventory Status */}
            <div className="mb-6 print-break-inside-avoid">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-r-4 border-purple-600 pr-2">
                  ثانياً: موقف المواد والتوريدات والمخزون بالموقع
                </h2>
                <span className="text-[11px] text-slate-500 font-mono">
                  {materials.length} مواد أساسية
                </span>
              </div>

              <table className="w-full text-right text-[11px] border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                    <th className="p-2 border border-slate-300">المادة والمواصفة الفنية</th>
                    <th className="p-2 border border-slate-300 text-center w-14">الوحدة</th>
                    <th className="p-2 border border-slate-300 text-center w-20">إجمالي المطلوب</th>
                    <th className="p-2 border border-slate-300 text-center w-20">المورّد للموقع</th>
                    <th className="p-2 border border-slate-300 text-center w-20">مستهلك اليوم</th>
                    <th className="p-2 border border-slate-300 text-center w-20">إجمالي المستهلك</th>
                    <th className="p-2 border border-slate-300 text-center w-24">الرصيد المتبقي بالمخزن</th>
                    <th className="p-2 border border-slate-300 text-center w-24">موقف الكفاية</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((mat) => {
                    const remaining = mat.totalDelivered - mat.totalUsed;
                    const isLow = remaining <= mat.minThreshold;

                    return (
                      <tr key={mat.id} className="border-b border-slate-200">
                        <td className="p-2 border border-slate-200 font-medium">
                          {mat.name}
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-mono">
                          {mat.unit}
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-mono">
                          {formatNumber(mat.totalRequired)}
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-mono font-bold text-blue-800">
                          {formatNumber(mat.totalDelivered)}
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-mono font-semibold text-purple-700">
                          {formatNumber(mat.todayUsed)}
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-mono">
                          {formatNumber(mat.totalUsed)}
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-mono font-bold text-slate-900">
                          {formatNumber(remaining)} {mat.unit}
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-semibold">
                          {isLow ? (
                            <span className="text-rose-700 font-bold">نقص بالمخزون</span>
                          ) : (
                            <span className="text-emerald-700">كافٍ ومستقر</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table 3: Latest Site Observations & Daily Log */}
            {latestLog && (
              <div className="mb-6 p-4 bg-slate-50 border border-slate-300 rounded-lg print-break-inside-avoid">
                <h3 className="text-xs font-bold text-slate-900 mb-2 border-r-4 border-blue-600 pr-2">
                  ثالثاً: ملخص الأعمال اليومية وملاحظات مهندس الموقع ({latestLog.dayName} {latestLog.date})
                </h3>
                <div className="text-xs text-slate-700 space-y-2">
                  <div>
                    <strong className="text-slate-900">سير العمل والمنجزات: </strong>
                    <span>{latestLog.summary}</span>
                  </div>
                  <div>
                    <strong className="text-slate-900">المعوقات الميدانية: </strong>
                    <span>{latestLog.obstacles || 'لا توجد معوقات تؤثر على المسار الحرج للمشروع.'}</span>
                  </div>
                  <div>
                    <strong className="text-slate-900">السلامة والصحة المهنية (HSE): </strong>
                    <span>{latestLog.safetyNotes || 'الالتزام التام بكافة تدابير واشتراطات السلامة.'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Signatures & Official Approvals Footer */}
            <div className="mt-8 pt-6 border-t-2 border-slate-300 print-break-inside-avoid">
              <div className="text-xs font-bold text-slate-700 mb-6 text-center">
                الاعتمادات والمصادقات الرسمية
              </div>
              <div className="grid grid-cols-3 gap-6 text-center text-xs">
                <div>
                  <div className="font-bold text-slate-900">مهندس الموقع المنفذ</div>
                  <div className="text-slate-600 mt-1">{project.siteEngineer}</div>
                  <div className="mt-8 border-b border-dashed border-slate-400 w-36 mx-auto"></div>
                  <div className="text-[10px] text-slate-400 mt-1">التوقيع والختم</div>
                </div>

                <div>
                  <div className="font-bold text-slate-900">مدير المشروع (المقاول)</div>
                  <div className="text-slate-600 mt-1">{project.projectManager}</div>
                  <div className="mt-8 border-b border-dashed border-slate-400 w-36 mx-auto"></div>
                  <div className="text-[10px] text-slate-400 mt-1">التوقيع والختم</div>
                </div>

                <div>
                  <div className="font-bold text-slate-900">المهندس المقيم (الاستشاري)</div>
                  <div className="text-slate-600 mt-1">{project.consultant}</div>
                  <div className="mt-8 border-b border-dashed border-slate-400 w-36 mx-auto"></div>
                  <div className="text-[10px] text-slate-400 mt-1">التوقيع والختم</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
