import React, { useState } from 'react';
import { WorkItem, WorkCategory, UnitType } from '../types';
import { X, Plus, Layers } from 'lucide-react';

interface AddWorkItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: WorkItem) => void;
  existingCount: number;
}

export const AddWorkItemModal: React.FC<AddWorkItemModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingCount,
}) => {
  const [code, setCode] = useState(`BOQ-${String(existingCount + 1).padStart(2, '0')}`);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WorkCategory>('خرسانات وأساسات');
  const [unit, setUnit] = useState<UnitType>('م³');
  const [plannedQuantity, setPlannedQuantity] = useState<number>(100);
  const [previousQuantity, setPreviousQuantity] = useState<number>(0);
  const [todayQuantity, setTodayQuantity] = useState<number>(0);
  const [unitRate, setUnitRate] = useState<number>(250);
  const [plannedPercent, setPlannedPercent] = useState<number>(10);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newItem: WorkItem = {
      id: `w-${Date.now()}`,
      code,
      description,
      category,
      unit,
      plannedQuantity: Number(plannedQuantity),
      previousQuantity: Number(previousQuantity),
      todayQuantity: Number(todayQuantity),
      unitRate: Number(unitRate),
      plannedPercent: Number(plannedPercent),
      notes: notes.trim() || undefined,
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">إضافة بند أعمال جديد (BOQ)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">كود البند</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">فئة العمل</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WorkCategory)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="أعمال ترابية ومدنية">أعمال ترابية ومدنية</option>
                <option value="خرسانات وأساسات">خرسانات وأساسات</option>
                <option value="عزل ومباني">عزل ومباني</option>
                <option value="تشطيبات داخلية وخارجية">تشطيبات داخلية وخارجية</option>
                <option value="كهروميكانيك وشبكات">كهروميكانيك وشبكات</option>
                <option value="أعمال الموقع العام">أعمال الموقع العام</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">بيان الأعمال بالتفصيل</label>
            <input
              type="text"
              required
              placeholder="مثال: صب خرسانة مسلحة للأعمدة C35..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">الوحدة</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitType)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="م³">م³ (متر مكعب)</option>
                <option value="م²">م² (متر مربع)</option>
                <option value="م.ط">م.ط (متر طولي)</option>
                <option value="طن">طن</option>
                <option value="كجم">كجم</option>
                <option value="عدد">عدد</option>
                <option value="نقطة">نقطة</option>
                <option value="مقطوعية">مقطوعية</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">الكمية المقررة بالعقد</label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={plannedQuantity || ''}
                onChange={(e) => setPlannedQuantity(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">سعر الوحدة التقديري</label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={unitRate || ''}
                onChange={(e) => setUnitRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">الكمية السابقة</label>
              <input
                type="number"
                min="0"
                step="any"
                value={previousQuantity}
                onChange={(e) => setPreviousQuantity(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">كمية اليوم</label>
              <input
                type="number"
                min="0"
                step="any"
                value={todayQuantity}
                onChange={(e) => setTodayQuantity(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">النسبة المخططة %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={plannedPercent}
                onChange={(e) => setPlannedPercent(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">ملاحظات هندسية إضافية</label>
            <input
              type="text"
              placeholder="مثال: تم اعتماد العينة من الاستشاري..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
            />
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
              حفظ وإدراج البند
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
