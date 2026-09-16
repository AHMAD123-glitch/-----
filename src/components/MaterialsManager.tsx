import React, { useState } from 'react';
import { MaterialItem } from '../types';
import { formatNumber, formatCurrency } from '../utils/calculations';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowDownToLine, 
  Save, 
  X,
  Truck
} from 'lucide-react';

interface MaterialsManagerProps {
  materials: MaterialItem[];
  currency: string;
  onUpdateMaterial: (material: MaterialItem) => void;
  onDeleteMaterial: (id: string) => void;
  onOpenAddModal: () => void;
}

export const MaterialsManager: React.FC<MaterialsManagerProps> = ({
  materials,
  currency,
  onUpdateMaterial,
  onDeleteMaterial,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTodayUsed, setEditTodayUsed] = useState<number>(0);
  const [deliveryModalItem, setDeliveryModalItem] = useState<MaterialItem | null>(null);
  const [newDeliveryQty, setNewDeliveryQty] = useState<number>(0);

  const filteredMaterials = materials.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEdit = (mat: MaterialItem) => {
    setEditingId(mat.id);
    setEditTodayUsed(mat.todayUsed);
  };

  const saveEdit = (mat: MaterialItem) => {
    // Difference in today's usage adds to total used
    const diff = editTodayUsed - mat.todayUsed;
    onUpdateMaterial({
      ...mat,
      todayUsed: Math.max(0, editTodayUsed),
      totalUsed: Math.max(0, mat.totalUsed + diff),
    });
    setEditingId(null);
  };

  const handleAddDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryModalItem || newDeliveryQty <= 0) return;

    onUpdateMaterial({
      ...deliveryModalItem,
      totalDelivered: deliveryModalItem.totalDelivered + Number(newDeliveryQty),
    });

    setDeliveryModalItem(null);
    setNewDeliveryQty(0);
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-700/80">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              إدارة ومتابعة المواد والتوريدات الميدانية
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            مراقبة المخزون، الوارد، المستهلك اليومي، وتنبيهات وصول المواد إلى حد الطلب الأدنى
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="بحث في المواد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-1.5 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <button
            id="btn-add-material-screen"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مادة جديدة</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-right text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400">
              <th className="py-3 px-3 font-semibold min-w-[200px]">المادة والمواصفة</th>
              <th className="py-3 px-2 font-semibold text-center w-16">الوحدة</th>
              <th className="py-3 px-3 font-semibold text-center w-24">إجمالي المطلوب</th>
              <th className="py-3 px-3 font-semibold text-center w-24">المورّد للموقع</th>
              <th className="py-3 px-3 font-semibold text-center w-28 bg-purple-500/10 text-purple-300">
                مستهلك اليوم
              </th>
              <th className="py-3 px-3 font-semibold text-center w-24">إجمالي المستهلك</th>
              <th className="py-3 px-3 font-semibold text-center w-28">الرصيد بالمخزن</th>
              <th className="py-3 px-3 font-semibold text-center w-28">حالة المخزون</th>
              <th className="py-3 px-3 font-semibold text-center w-24">سعر الوحدة</th>
              <th className="py-3 px-3 font-semibold text-center w-28">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredMaterials.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400">
                  لا توجد مواد مطابقة للبحث.
                </td>
              </tr>
            ) : (
              filteredMaterials.map((mat) => {
                const isEditing = editingId === mat.id;
                const remaining = mat.totalDelivered - (isEditing ? (mat.totalUsed + (editTodayUsed - mat.todayUsed)) : mat.totalUsed);
                const isLow = remaining <= mat.minThreshold;
                const usedPercent = mat.totalDelivered > 0 ? (mat.totalUsed / mat.totalDelivered) * 100 : 0;

                return (
                  <tr key={mat.id} className="hover:bg-slate-750/50 transition">
                    {/* Name & Category */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{mat.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{mat.category}</div>
                    </td>

                    {/* Unit */}
                    <td className="py-3 px-2 text-center font-mono text-slate-300">
                      {mat.unit}
                    </td>

                    {/* Total Required */}
                    <td className="py-3 px-3 text-center font-mono text-slate-400">
                      {formatNumber(mat.totalRequired)}
                    </td>

                    {/* Total Delivered */}
                    <td className="py-3 px-3 text-center font-mono text-blue-400 font-bold">
                      {formatNumber(mat.totalDelivered)}
                    </td>

                    {/* Today Used (Editable) */}
                    <td className="py-3 px-3 text-center bg-purple-500/5">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={editTodayUsed}
                          onChange={(e) => setEditTodayUsed(parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 bg-slate-900 border border-purple-400 rounded text-center text-xs font-mono font-bold text-purple-300 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <div
                          onClick={() => startEdit(mat)}
                          className="cursor-pointer font-mono font-bold text-purple-400 hover:text-purple-300 hover:underline py-1 px-2 rounded bg-purple-500/10 inline-block"
                          title="اضغط لتعديل استهلاك اليوم"
                        >
                          {formatNumber(mat.todayUsed)}
                        </div>
                      )}
                    </td>

                    {/* Total Used */}
                    <td className="py-3 px-3 text-center font-mono text-slate-200">
                      {formatNumber(mat.totalUsed)}
                      <span className="text-[10px] text-slate-500 block">({formatNumber(usedPercent, 0)}%)</span>
                    </td>

                    {/* Remaining */}
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      <span className={isLow ? 'text-rose-400' : 'text-emerald-400'}>
                        {formatNumber(remaining)} {mat.unit}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>تحت الحد الأدنى</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>مستقر ومتاح</span>
                        </span>
                      )}
                    </td>

                    {/* Unit Cost */}
                    <td className="py-3 px-3 text-center font-mono text-slate-300">
                      {formatCurrency(mat.costPerUnit, currency)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => saveEdit(mat)}
                            className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                            title="حفظ"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
                            title="إلغاء"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setDeliveryModalItem(mat)}
                            className="p-1 text-slate-300 hover:text-blue-400 rounded transition"
                            title="تسجيل توريد شحنة جديدة"
                          >
                            <Truck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => startEdit(mat)}
                            className="p-1 text-slate-300 hover:text-purple-400 rounded transition"
                            title="تعديل استهلاك اليوم"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف المادة: ${mat.name}؟`)) {
                                onDeleteMaterial(mat.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded transition"
                            title="حذف المادة"
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

      {/* Quick delivery modal */}
      {deliveryModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">تسجيل توريد شحنة جديدة</h3>
              </div>
              <button 
                onClick={() => setDeliveryModalItem(null)} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDelivery} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">المادة</label>
                <div className="p-2.5 bg-slate-800 rounded-lg text-xs font-semibold text-white">
                  {deliveryModalItem.name}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  الكمية المورّدة حديثاً ({deliveryModalItem.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  value={newDeliveryQty || ''}
                  onChange={(e) => setNewDeliveryQty(parseFloat(e.target.value) || 0)}
                  placeholder="أدخل الكمية المستلمة..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              <div className="text-xs text-slate-400 bg-slate-800/60 p-2.5 rounded-lg">
                سيتم إضافة الكمية إلى رصيد المورّد السابق ({formatNumber(deliveryModalItem.totalDelivered)} {deliveryModalItem.unit}) ليصبح الإجمالي الجديد ({formatNumber(deliveryModalItem.totalDelivered + Number(newDeliveryQty))} {deliveryModalItem.unit}).
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeliveryModalItem(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  تأكيد إضافة الشحنة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
