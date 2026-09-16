import React from 'react';
import { ProjectInfo, WorkItem, MaterialItem } from '../types';
import { 
  calculateProjectMetrics, 
  calculateMaterialMetrics, 
  formatCurrency, 
  formatNumber 
} from '../utils/calculations';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  Coins, 
  Boxes,
  Compass
} from 'lucide-react';

interface SummaryCardsProps {
  project: ProjectInfo;
  workItems: WorkItem[];
  materials: MaterialItem[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  project,
  workItems,
  materials,
}) => {
  const projectMetrics = calculateProjectMetrics(workItems);
  const materialMetrics = calculateMaterialMetrics(materials);

  const isAhead = projectMetrics.variance >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Actual Progress */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">نسبة الإنجاز الفعلي التراكمي</span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-white font-mono">
            {formatNumber(projectMetrics.actualProgressPercent, 1)}%
          </span>
          <span className="text-xs text-slate-400">
            المخطط: {formatNumber(projectMetrics.plannedProgressPercent, 1)}%
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-3 w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, projectMetrics.actualProgressPercent)}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">معدل الإنجاز العام</span>
          <span className="text-blue-400 font-semibold">
            {workItems.filter(w => (w.previousQuantity + w.todayQuantity) >= w.plannedQuantity).length} من {workItems.length} بند مكتمل
          </span>
        </div>
      </div>

      {/* Schedule Variance & SPI */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">مؤشر الجدول الزمني (SPI)</span>
          <div className={`w-8 h-8 rounded-lg ${isAhead ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'} border flex items-center justify-center`}>
            {isAhead ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-3xl font-black font-mono ${isAhead ? 'text-emerald-400' : 'text-rose-400'}`}>
            {projectMetrics.spi.toFixed(2)}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isAhead ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
          }`}>
            {isAhead ? `متقدم +${projectMetrics.variance}%` : `متأخر ${projectMetrics.variance}%`}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          {projectMetrics.spi >= 1.0 
            ? 'المشروع يسير بوتيرة متقدمة ومطابقة للجدول الزمني المعتمد.' 
            : 'يوجد انحراف طفيف يتطلب تكثيف الورديات وتسريع التوريدات.'}
        </p>
      </div>

      {/* Executed Value */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">القيمة التقديرية المنفذة</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-2xl font-black text-amber-400 font-mono">
            {formatCurrency(projectMetrics.totalExecutedCost, project.currency)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>قيمة العقد الإجمالية:</span>
          <span className="font-medium text-slate-300 font-mono">
            {formatCurrency(project.totalContractValue, project.currency)}
          </span>
        </div>
        <div className="mt-2 w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-amber-400 h-1.5 rounded-full" 
            style={{ width: `${Math.min(100, (projectMetrics.totalExecutedCost / project.totalContractValue) * 100)}%` }}
          />
        </div>
      </div>

      {/* Materials & Stock Health */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">موقف المواد والتوريدات</span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Boxes className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-white font-mono">
            {materials.length}
          </span>
          <span className="text-xs text-slate-400">مادة تحت الرقابة</span>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          {materialMetrics.lowStockAlertCount > 0 ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{materialMetrics.lowStockAlertCount} مادة وصلت حد الطلب الأدنى</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>المخزون كافٍ لجميع البنود</span>
            </span>
          )}
        </div>
        <div className="mt-2 text-[11px] text-slate-400">
          نسبة استهلاك المورّد بالموقع: <strong className="text-purple-300 font-mono">{formatNumber(materialMetrics.overallConsumptionPercent, 1)}%</strong>
        </div>
      </div>
    </div>
  );
};
