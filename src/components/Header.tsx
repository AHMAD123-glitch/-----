import React from 'react';
import { ProjectInfo } from '../types';
import { 
  HardHat, 
  FileText, 
  BarChart3, 
  Layers, 
  Package, 
  CalendarDays, 
  FileDown, 
  Settings, 
  Plus, 
  Clock
} from 'lucide-react';

interface HeaderProps {
  project: ProjectInfo;
  activeTab: 'overview' | 'boq' | 'materials' | 'dailylog';
  setActiveTab: (tab: 'overview' | 'boq' | 'materials' | 'dailylog') => void;
  onOpenPdf: () => void;
  onOpenSettings: () => void;
  onAddWorkItem: () => void;
  onAddMaterial: () => void;
  onAddDailyLog: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  activeTab,
  setActiveTab,
  onOpenPdf,
  onOpenSettings,
  onAddWorkItem,
  onAddMaterial,
  onAddDailyLog,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-lg no-print">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Brand & Project Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  محلّل البيانات الهندسي
                </h1>
                <span className="text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  إصدار مهندسي المواقع
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="font-medium text-slate-200">{project.name}</span>
                <span>•</span>
                <span className="font-mono text-amber-400/90">{project.code}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {activeTab === 'boq' && (
              <button
                id="btn-add-work-item"
                onClick={onAddWorkItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة بند كميات</span>
              </button>
            )}

            {activeTab === 'materials' && (
              <button
                id="btn-add-material"
                onClick={onAddMaterial}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة مادة جديدة</span>
              </button>
            )}

            {activeTab === 'dailylog' && (
              <button
                id="btn-add-daily-log"
                onClick={onAddDailyLog}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>تسجيل يومية عمل</span>
              </button>
            )}

            <button
              id="btn-project-settings"
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              title="بيانات المشروع والعقد"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>بيانات المشروع</span>
            </button>

            <button
              id="btn-export-pdf"
              onClick={onOpenPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-950/40 transition active:scale-95"
            >
              <FileDown className="w-4 h-4" />
              <span>تصدير تقرير PDF</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-t border-slate-800/80 pt-2 pb-1 overflow-x-auto scrollbar-none">
          <button
            id="tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'overview'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>لوحة المؤشرات والرسوم البيانية</span>
          </button>

          <button
            id="tab-boq"
            onClick={() => setActiveTab('boq')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'boq'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>جدول الكميات والإنجاز (BOQ)</span>
          </button>

          <button
            id="tab-materials"
            onClick={() => setActiveTab('materials')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'materials'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>المواد والتوريدات الميدانية</span>
          </button>

          <button
            id="tab-dailylog"
            onClick={() => setActiveTab('dailylog')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'dailylog'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>سجل الإنجاز اليومي والطقس</span>
          </button>
        </div>
      </div>
    </header>
  );
};
