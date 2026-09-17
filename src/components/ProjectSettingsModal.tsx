import React, { useState } from 'react';
import { ProjectInfo } from '../types';
import { X, Settings, RotateCcw, Building, MapPin, User, DollarSign } from 'lucide-react';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectInfo;
  onUpdateProject: (info: ProjectInfo) => void;
  onResetToDefault: () => void;
}

export const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdateProject,
  onResetToDefault,
}) => {
  const [formData, setFormData] = useState<ProjectInfo>({ ...project });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProject(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">بيانات المشروع والتعاقد</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">اسم المشروع الرسمي</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">كود المشروع (رقم العقد)</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">موقع المشروع</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">الجهة المالكة (العميل)</label>
              <input
                type="text"
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">المقاول العام المنفذ</label>
              <input
                type="text"
                required
                value={formData.contractor}
                onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">الاستشاري الهندسي المشرف</label>
              <input
                type="text"
                required
                value={formData.consultant}
                onChange={(e) => setFormData({ ...formData, consultant: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">مهندس الموقع المعتمد</label>
              <input
                type="text"
                required
                value={formData.siteEngineer}
                onChange={(e) => setFormData({ ...formData, siteEngineer: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">قيمة العقد الإجمالية</label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={formData.totalContractValue}
                onChange={(e) => setFormData({ ...formData, totalContractValue: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">العملة</label>
              <input
                type="text"
                required
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white text-center font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Section: Official Signatures & Approvals */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-400">بيانات الاعتمادات والتوقيعات الرسمية في التقارير</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/80">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">المسمى الأول:</label>
                <input
                  type="text"
                  value={formData.approvalTitle1 || 'مهندس الموقع المنفذ'}
                  onChange={(e) => setFormData({ ...formData, approvalTitle1: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">الاسم الأول:</label>
                <input
                  type="text"
                  value={formData.approvalName1 || 'أحمد هليل الذبياني'}
                  onChange={(e) => setFormData({ ...formData, approvalName1: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/80">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">المسمى الثاني:</label>
                <input
                  type="text"
                  value={formData.approvalTitle2 || 'عن الشركة المنفذة'}
                  onChange={(e) => setFormData({ ...formData, approvalTitle2: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">الاسم أو الشركة الثانية:</label>
                <input
                  type="text"
                  value={formData.approvalName2 || 'شركة إيكاد — مشروع تطوير مطار الأمير محمد بن عبدالعزيز الدولي — المدينة المنورة'}
                  onChange={(e) => setFormData({ ...formData, approvalName2: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/80">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">المسمى الثالث:</label>
                <input
                  type="text"
                  value={formData.approvalTitle3 || 'المكتب الاستشاري'}
                  onChange={(e) => setFormData({ ...formData, approvalTitle3: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">اسم المكتب الاستشاري:</label>
                <input
                  type="text"
                  value={formData.approvalName3 || 'المكتب الاستشاري للمشروع'}
                  onChange={(e) => setFormData({ ...formData, approvalName3: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (confirm('هل تريد استعادة البيانات الافتراضية للمشروع التجريبي؟')) {
                  onResetToDefault();
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-rose-400 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة البيانات النموذجية</span>
            </button>

            <div className="flex items-center gap-2">
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
                حفظ التعديلات
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
