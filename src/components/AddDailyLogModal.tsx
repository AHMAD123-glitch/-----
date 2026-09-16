import React, { useState } from 'react';
import { DailyLog } from '../types';
import { X, CalendarDays, Sun } from 'lucide-react';

interface AddDailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (log: DailyLog) => void;
  defaultEngineer: string;
}

export const AddDailyLogModal: React.FC<AddDailyLogModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  defaultEngineer,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dayName, setDayName] = useState('اليوم');
  const [weather, setWeather] = useState('مشمس ومعتدل');
  const [temperature, setTemperature] = useState<number>(32);
  const [laborCount, setLaborCount] = useState<number>(45);
  const [engineersCount, setEngineersCount] = useState<number>(4);
  const [equipmentCount, setEquipmentCount] = useState<number>(6);
  const [dailyProgressGain, setDailyProgressGain] = useState<number>(0.8);
  const [summary, setSummary] = useState('');
  const [obstacles, setObstacles] = useState('');
  const [safetyNotes, setSafetyNotes] = useState('الالتزام التام بكافة تدابير واشتراطات السلامة ومهمات الوقاية الشخصية.');
  const [loggedBy, setLoggedBy] = useState(defaultEngineer);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;

    const newLog: DailyLog = {
      id: `log-${Date.now()}`,
      date,
      dayName,
      weather,
      temperature: Number(temperature),
      laborCount: Number(laborCount),
      engineersCount: Number(engineersCount),
      equipmentCount: Number(equipmentCount),
      dailyProgressGain: Number(dailyProgressGain),
      summary: summary.trim(),
      obstacles: obstacles.trim(),
      safetyNotes: safetyNotes.trim(),
      loggedBy,
    };

    onAdd(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">تسجيل تقرير ويومية موقع جديدة</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">التاريخ</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">اسم اليوم</label>
              <input
                type="text"
                placeholder="مثال: الأربعاء"
                value={dayName}
                onChange={(e) => setDayName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">حالة الطقس</label>
              <input
                type="text"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">الحرارة (°م)</label>
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">عدد العمال</label>
              <input
                type="number"
                min="0"
                value={laborCount}
                onChange={(e) => setLaborCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">عدد المهندسين</label>
              <input
                type="number"
                min="0"
                value={engineersCount}
                onChange={(e) => setEngineersCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">عدد المعدات</label>
              <input
                type="number"
                min="0"
                value={equipmentCount}
                onChange={(e) => setEquipmentCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">إنجاز اليوم المضاف %</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={dailyProgressGain}
                onChange={(e) => setDailyProgressGain(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              ملخص أعمال ومخرجات اليوم بالتفصيل <span className="text-amber-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="مثال: تم صب 150 م³ من الخرسانة المسلحة للأساسات، واستكمال تركيب حديد تسليح الأعمدة..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              المعوقات الميدانية والحلول المقترحة (إن وجدت)
            </label>
            <input
              type="text"
              placeholder="مثال: تأخر توريد شاحنة رمل ساعة واحدة تم تعويضه..."
              value={obstacles}
              onChange={(e) => setObstacles(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">ملاحظات السلامة والصحة المهنية (HSE)</label>
              <input
                type="text"
                value={safetyNotes}
                onChange={(e) => setSafetyNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">مسؤول التوثيق (المهندس)</label>
              <input
                type="text"
                required
                value={loggedBy}
                onChange={(e) => setLoggedBy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold"
            >
              حفظ وتوثيق اليومية
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
