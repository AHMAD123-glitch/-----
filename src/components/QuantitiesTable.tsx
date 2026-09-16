import React, { useState } from 'react';
import { WorkItem, WorkCategory, UnitType } from '../types';
import { formatNumber, formatCurrency } from '../utils/calculations';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Save, 
  X,
  Layers,
  ArrowUpDown
} from 'lucide-react';

interface QuantitiesTableProps {
  workItems: WorkItem[];
  currency: string;
  onUpdateWorkItem: (item: WorkItem) => void;
  onDeleteWorkItem: (id: string) => void;
  onOpenAddModal: () => void;
}

export const QuantitiesTable: React.FC<QuantitiesTableProps> = ({
  workItems,
  currency,
  onUpdateWorkItem,
  onDeleteWorkItem,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editTodayQty, setEditTodayQty] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>('');

  const categories: WorkCategory[] = [
    'أعمال ترابية ومدنية',
    'خرسانات وأساسات',
    'عزل ومباني',
    'تشطيبات داخلية وخارجية',
    'كهروميكانيك وشبكات',
    'أعمال الموقع العام',
  ];

  // Filter items
  const filteredItems = workItems.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const startEdit = (item: WorkItem) => {
    setEditingItemId(item.id);
    setEditTodayQty(item.todayQuantity);
    setEditNotes(item.notes || '');
  };

  const cancelEdit = () => {
    setEditingItemId(null);
  };

  const saveEdit = (item: WorkItem) => {
    onUpdateWorkItem({
      ...item,
      todayQuantity: Math.max(0, editTodayQty),
      notes: editNotes,
    });
    setEditingItemId(null);
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
      {/* Header with Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-700/80">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              جدول حصر الكميات ونسب الإنجاز اليومية (BOQ)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            إدخال وتحديث الكميات المنفذة يومياً واحتساب نسب التقدم المئوية وقيمتها المالية تلقائياً
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="بحث بالبند أو الكود..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-1.5 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-3 pr-8 py-1.5 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition appearance-none cursor-pointer"
            >
              <option value="all">كافة فئات الأعمال ({workItems.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({workItems.filter((i) => i.category === cat).length})
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button
            id="btn-add-work-item-table"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة بند جديد</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-right text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400">
              <th className="py-3 px-3 font-semibold w-20">كود البند</th>
              <th className="py-3 px-3 font-semibold min-w-[240px]">بيان الأعمال الهندسية</th>
              <th className="py-3 px-2 font-semibold text-center w-16">الوحدة</th>
              <th className="py-3 px-3 font-semibold text-center w-24">الكمية المخططة</th>
              <th className="py-3 px-3 font-semibold text-center w-24">المنجز سابقاً</th>
              <th className="py-3 px-3 font-semibold text-center w-28 bg-amber-500/10 text-amber-300">
                منجز اليوم (تحديث)
              </th>
              <th className="py-3 px-3 font-semibold text-center w-28">إجمالي المنفذ</th>
              <th className="py-3 px-4 font-semibold text-center min-w-[160px]">نسبة الإنجاز %</th>
              <th className="py-3 px-3 font-semibold text-center w-28">القيمة المنجزة</th>
              <th className="py-3 px-2 font-semibold text-center w-20">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400">
                  لا توجد بنود تطابق شروط البحث الحالية.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isEditing = editingItemId === item.id;
                const totalExecuted = item.previousQuantity + (isEditing ? editTodayQty : item.todayQuantity);
                const actualPercent = item.plannedQuantity > 0 
                  ? Math.min(100, (totalExecuted / item.plannedQuantity) * 100) 
                  : 0;
                const itemExecutedValue = totalExecuted * item.unitRate;
                const isComplete = actualPercent >= 100;

                return (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-slate-750/50 transition ${
                      isEditing ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    {/* Code */}
                    <td className="py-3 px-3 font-mono font-bold text-amber-400/90 whitespace-nowrap">
                      {item.code}
                    </td>

                    {/* Description & Category */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-200">{item.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        {item.notes && (
                          <span className="text-[11px] text-slate-400 truncate max-w-[280px]">
                            • {item.notes}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Unit */}
                    <td className="py-3 px-2 text-center font-mono text-slate-300 font-semibold">
                      {item.unit}
                    </td>

                    {/* Planned Qty */}
                    <td className="py-3 px-3 text-center font-mono text-slate-300">
                      {formatNumber(item.plannedQuantity)}
                    </td>

                    {/* Previous Qty */}
                    <td className="py-3 px-3 text-center font-mono text-slate-400">
                      {formatNumber(item.previousQuantity)}
                    </td>

                    {/* Today Qty (Editable) */}
                    <td className="py-3 px-3 text-center bg-amber-500/5">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={editTodayQty}
                            onChange={(e) => setEditTodayQty(parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 bg-slate-900 border border-amber-400 rounded text-center text-xs font-mono font-bold text-amber-300 focus:outline-none"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div 
                          onClick={() => startEdit(item)}
                          className="cursor-pointer font-mono font-bold text-amber-400 hover:text-amber-300 hover:underline py-1 px-2 rounded bg-amber-500/10 inline-block"
                          title="اضغط لتعديل كمية اليوم"
                        >
                          +{formatNumber(item.todayQuantity)}
                        </div>
                      )}
                    </td>

                    {/* Total Executed */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-100">
                      {formatNumber(totalExecuted)}
                    </td>

                    {/* Progress Percentage & Bar */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                        <span className={isComplete ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                          {formatNumber(actualPercent, 1)}%
                        </span>
                        <span className="text-slate-500 text-[10px]">
                          المخطط: {item.plannedPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isComplete
                              ? 'bg-emerald-500'
                              : actualPercent >= item.plannedPercent
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, actualPercent)}%` }}
                        />
                      </div>
                    </td>

                    {/* Executed Value */}
                    <td className="py-3 px-3 text-center font-mono text-xs text-slate-300">
                      {formatCurrency(itemExecutedValue, currency)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            id={`btn-save-${item.id}`}
                            onClick={() => saveEdit(item)}
                            className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                            title="حفظ"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`btn-cancel-${item.id}`}
                            onClick={cancelEdit}
                            className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
                            title="إلغاء"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            id={`btn-edit-${item.id}`}
                            onClick={() => startEdit(item)}
                            className="p-1 text-slate-400 hover:text-amber-400 rounded transition"
                            title="تعديل كمية اليوم والملاحظات"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`btn-delete-${item.id}`}
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف البند: ${item.description}؟`)) {
                                onDeleteWorkItem(item.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded transition"
                            title="حذف البند"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary footer */}
      <div className="mt-4 pt-3 border-t border-slate-700/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div>
          إجمالي البنود المعروضة: <strong className="text-slate-200">{filteredItems.length}</strong> من أصل <strong className="text-slate-200">{workItems.length}</strong> بنداً
        </div>
        <div className="flex items-center gap-4 font-mono">
          <span>
            إجمالي التكلفة التقديرية المنجزة: <strong className="text-amber-400">{formatCurrency(filteredItems.reduce((acc, i) => acc + (i.previousQuantity + i.todayQuantity) * i.unitRate, 0), currency)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
