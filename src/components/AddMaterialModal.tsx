import React, { useState } from 'react';
import { MaterialItem } from '../types';
import { X, Package } from 'lucide-react';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (material: MaterialItem) => void;
}

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('خرسانات وركام');
  const [unit, setUnit] = useState('طن');
  const [totalRequired, setTotalRequired] = useState<number>(100);
  const [totalDelivered, setTotalDelivered] = useState<number>(20);
  const [todayUsed, setTodayUsed] = useState<number>(0);
  const [totalUsed, setTotalUsed] = useState<number>(0);
  const [minThreshold, setMinThreshold] = useState<number>(10);
  const [costPerUnit, setCostPerUnit] = useState<number>(150);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMat: MaterialItem = {
      id: `m-${Date.now()}`,
      name,
      category,
      unit,
      totalRequired: Number(totalRequired),
      totalDelivered: Number(totalDelivered),
      todayUsed: Number(todayUsed),
      totalUsed: Number(totalUsed),
      minThreshold: Number(minThreshold),
      costPerUnit: Number(costPerUnit),
    };

    onAdd(newMat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">إضافة مادة توريد جديدة للموقع</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">اسم المادة والمواصفة الفنية</label>
            <input
              type="text"
              required
              placeholder="مثال: إسمنت مقاوم للأملاح SRC 50 كجم..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">تصنيف المادة</label>
              <input
                type="text"
                required
                placeholder="تسليح / خرسانات / عزل..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">وحدة القياس</label>
              <input
                type="text"
                required
                placeholder="طن / م³ / كيس / حبة / رول..."
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">إجمالي المطلوب</label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={totalRequired || ''}
                onChange={(e) => setTotalRequired(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">المورّد للموقع</label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={totalDelivered || ''}
                onChange={(e) => setTotalDelivered(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-blue-300 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">مستهلك اليوم</label>
              <input
                type="number"
                min="0"
                step="any"
                value={todayUsed}
                onChange={(e) => setTodayUsed(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-purple-300 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">إجمالي المستهلك سابقاً</label>
              <input
                type="number"
                min="0"
                step="any"
                value={totalUsed}
                onChange={(e) => setTotalUsed(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">حد المخزون الأدنى</label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={minThreshold || ''}
                onChange={(e) => setMinThreshold(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-rose-300 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">سعر الوحدة</label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={costPerUnit || ''}
                onChange={(e) => setCostPerUnit(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
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
              إضافة المادة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
