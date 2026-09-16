import React, { useState } from 'react';
import { DailyLog } from '../types';
import { formatNumber } from '../utils/calculations';
import { 
  CalendarDays, 
  Sun, 
  CloudSun, 
  Users, 
  HardHat, 
  Truck, 
  AlertCircle, 
  ShieldCheck, 
  Plus, 
  Trash2,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface DailyLogEntryProps {
  dailyLogs: DailyLog[];
  onAddDailyLog: (log: DailyLog) => void;
  onDeleteDailyLog: (id: string) => void;
  onOpenAddModal: () => void;
}

export const DailyLogEntry: React.FC<DailyLogEntryProps> = ({
  dailyLogs,
  onAddDailyLog,
  onDeleteDailyLog,
  onOpenAddModal,
}) => {
  const [selectedLogId, setSelectedLogId] = useState<string>(dailyLogs[dailyLogs.length - 1]?.id || '');

  const activeLog = dailyLogs.find((l) => l.id === selectedLogId) || dailyLogs[dailyLogs.length - 1];

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-700/80">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              سجل الإنجاز اليومي وملاحظات الموقع (Site Daily Log)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            توثيق سير الأعمال الميدانية، القوى العاملة، حالة الطقس، ونسب الإنجاز اليومية المضافة
          </p>
        </div>

        <button
          id="btn-add-daily-log-screen"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل يومية جديدة</span>
        </button>
      </div>

      {/* Main layout: Log history list + Detailed View */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline / Days List (4 cols) */}
        <div className="lg:col-span-4 space-y-2 max-h-[600px] overflow-y-auto pr-1">
          <div className="text-xs font-semibold text-slate-400 px-1 mb-2">
            سجل الأيام السابقة ({dailyLogs.length} يوميات مسجلة)
          </div>

          {dailyLogs.map((log) => {
            const isSelected = (activeLog && activeLog.id === log.id);
            return (
              <div
                key={log.id}
                onClick={() => setSelectedLogId(log.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer text-right ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                    : 'bg-slate-900/40 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-xs ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                    {log.dayName}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {log.date}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-400/80" />
                    {log.temperature}° م
                  </span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px]">
                    +{log.dailyProgressGain}% إنجاز
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {log.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Log Detailed Sheet (8 cols) */}
        <div className="lg:col-span-8">
          {activeLog ? (
            <div className="bg-slate-900/60 border border-slate-700/70 rounded-xl p-5 space-y-5">
              {/* Top Banner for Active Log */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      يومية {activeLog.dayName} — {activeLog.date}
                    </h3>
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/30 font-medium">
                      معتمد
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>مسؤول التوثيق: <strong className="text-slate-200">{activeLog.loggedBy}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-left bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">نسبة الإنجاز المضافة اليوم</span>
                    <span className="text-sm font-bold font-mono text-amber-400">+{activeLog.dailyProgressGain}%</span>
                  </div>
                  {dailyLogs.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm('هل تريد حذف هذه اليومية؟')) {
                          onDeleteDailyLog(activeLog.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                      title="حذف اليومية"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>العمالة الفنية</span>
                  </div>
                  <div className="text-base font-bold font-mono text-white">
                    {activeLog.laborCount} <span className="text-xs font-normal text-slate-400">عامل</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <HardHat className="w-3.5 h-3.5 text-amber-400" />
                    <span>الكادر الهندسي</span>
                  </div>
                  <div className="text-base font-bold font-mono text-white">
                    {activeLog.engineersCount} <span className="text-xs font-normal text-slate-400">مهندسين</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>المعدات العاملة</span>
                  </div>
                  <div className="text-base font-bold font-mono text-white">
                    {activeLog.equipmentCount} <span className="text-xs font-normal text-slate-400">آليات</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>حالة الطقس</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-200">
                    {activeLog.temperature}°م — {activeLog.weather}
                  </div>
                </div>
              </div>

              {/* Sections: Summary, Obstacles, Safety */}
              <div className="space-y-4">
                {/* Daily Work Summary */}
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>بيان الأعمال المنفذة ومخرجات اليوم:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                    {activeLog.summary}
                  </p>
                </div>

                {/* Obstacles & Actions */}
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-300 mb-2">
                    <AlertCircle className="w-4 h-4 text-blue-400" />
                    <span>المعوقات الميدانية وإجراءات التغلب عليها:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                    {activeLog.obstacles || 'لا توجد معوقات تشغيلية مسجلة لهذا اليوم، والأعمال تسير بسلاسة.'}
                  </p>
                </div>

                {/* Safety & Quality */}
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>تقرير السلامة والصحة المهنية (HSE):</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                    {activeLog.safetyNotes || 'الالتزام التام بكافة معايير السلامة المهنية ومهمات الوقاية الشخصية.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
              لا توجد يوميات مسجلة حالياً.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
