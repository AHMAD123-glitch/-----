import React, { useState, useEffect } from 'react';
import { ProjectInfo, WorkItem, MaterialItem, DailyLog } from './types';
import { initialProject, initialWorkItems, initialMaterials, initialDailyLogs } from './data/defaultData';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { QuantitiesTable } from './components/QuantitiesTable';
import { MaterialsManager } from './components/MaterialsManager';
import { DailyLogEntry } from './components/DailyLogEntry';
import { PdfReportModal } from './components/PdfReportModal';
import { AddWorkItemModal } from './components/AddWorkItemModal';
import { AddMaterialModal } from './components/AddMaterialModal';
import { AddDailyLogModal } from './components/AddDailyLogModal';
import { ProjectSettingsModal } from './components/ProjectSettingsModal';
import { CheckCircle, AlertCircle, HardHat, FileDown, Layers, Package, Calendar } from 'lucide-react';

const STORAGE_KEYS = {
  PROJECT: 'eng_analyst_project',
  WORK_ITEMS: 'eng_analyst_work_items',
  MATERIALS: 'eng_analyst_materials',
  DAILY_LOGS: 'eng_analyst_daily_logs',
};

export default function App() {
  // Persistence state
  const [project, setProject] = useState<ProjectInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECT);
    if (!saved) return initialProject;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...initialProject,
        ...parsed,
        approvalTitle1: parsed.approvalTitle1 || initialProject.approvalTitle1,
        approvalName1: parsed.approvalName1 || initialProject.approvalName1,
        approvalTitle2: parsed.approvalTitle2 || initialProject.approvalTitle2,
        approvalName2: parsed.approvalName2 || initialProject.approvalName2,
        approvalTitle3: parsed.approvalTitle3 || initialProject.approvalTitle3,
        approvalName3: parsed.approvalName3 || initialProject.approvalName3,
        name: parsed.name && !parsed.name.includes('أبراج الأفق') ? parsed.name : initialProject.name,
        contractor: parsed.contractor && !parsed.contractor.includes('الركائز') ? parsed.contractor : initialProject.contractor,
        siteEngineer: parsed.siteEngineer && !parsed.siteEngineer.includes('السعدي') ? parsed.siteEngineer : initialProject.siteEngineer,
        consultant: parsed.consultant && !parsed.consultant.includes('الرؤية') ? parsed.consultant : initialProject.consultant,
      };
    } catch {
      return initialProject;
    }
  });

  const [workItems, setWorkItems] = useState<WorkItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORK_ITEMS);
    return saved ? JSON.parse(saved) : initialWorkItems;
  });

  const [materials, setMaterials] = useState<MaterialItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    return saved ? JSON.parse(saved) : initialMaterials;
  });

  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    return saved ? JSON.parse(saved) : initialDailyLogs;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'overview' | 'boq' | 'materials' | 'dailylog'>('overview');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAddWorkItemOpen, setIsAddWorkItemOpen] = useState(false);
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [isAddDailyLogOpen, setIsAddDailyLogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(project));
  }, [project]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORK_ITEMS, JSON.stringify(workItems));
  }, [workItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handlers for Work Items
  const handleUpdateWorkItem = (updatedItem: WorkItem) => {
    setWorkItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    showToast(`تم تحديث كمية البند: ${updatedItem.code} بنجاح`);
  };

  const handleDeleteWorkItem = (id: string) => {
    setWorkItems((prev) => prev.filter((item) => item.id !== id));
    showToast('تم حذف البند من جدول الكميات');
  };

  const handleAddWorkItem = (newItem: WorkItem) => {
    setWorkItems((prev) => [...prev, newItem]);
    showToast(`تمت إضافة البند ${newItem.code} بنجاح`);
  };

  // Handlers for Materials
  const handleUpdateMaterial = (updatedMat: MaterialItem) => {
    setMaterials((prev) => prev.map((mat) => (mat.id === updatedMat.id ? updatedMat : mat)));
    showToast(`تم تحديث بيانات المادة: ${updatedMat.name}`);
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((mat) => mat.id !== id));
    showToast('تم حذف المادة من السجل');
  };

  const handleAddMaterial = (newMat: MaterialItem) => {
    setMaterials((prev) => [...prev, newMat]);
    showToast(`تم تسجيل المادة الجديدة: ${newMat.name}`);
  };

  // Handlers for Daily Logs
  const handleAddDailyLog = (newLog: DailyLog) => {
    setDailyLogs((prev) => [...prev, newLog]);
    showToast(`تم توثيق تقرير يومية ${newLog.dayName} بنجاح`);
  };

  const handleDeleteDailyLog = (id: string) => {
    setDailyLogs((prev) => prev.filter((log) => log.id !== id));
    showToast('تم حذف التقرير اليومي');
  };

  // Reset demo data
  const handleResetToDefault = () => {
    setProject(initialProject);
    setWorkItems(initialWorkItems);
    setMaterials(initialMaterials);
    setDailyLogs(initialDailyLogs);
    showToast('تمت استعادة البيانات النموذجية للمشروع');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Toast notification */}
      {toastMessage && (
        <div id="toast-notification" className="fixed bottom-5 left-5 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs animate-in fade-in slide-in-from-bottom-3 no-print">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        project={project}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPdf={() => setIsPdfModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onAddWorkItem={() => setIsAddWorkItemOpen(true)}
        onAddMaterial={() => setIsAddMaterialOpen(true)}
        onAddDailyLog={() => setIsAddDailyLogOpen(true)}
      />

      {/* Main Content Area */}
      <main id="app-main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 no-print">
        {/* KPI Top Summary Cards */}
        <SummaryCards
          project={project}
          workItems={workItems}
          materials={materials}
        />

        {/* Tab views */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <AnalyticsCharts
              workItems={workItems}
              materials={materials}
              dailyLogs={dailyLogs}
            />

            {/* Quick summary preview of BOQ & Materials in overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick BOQ Highlights */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">أبرز بنود الأعمال اليومية</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('boq')}
                    className="text-xs text-amber-400 hover:underline font-medium"
                  >
                    عرض الجدول بالكامل ←
                  </button>
                </div>
                <div className="divide-y divide-slate-700/50">
                  {workItems.slice(0, 4).map((item) => {
                    const totalQty = item.previousQuantity + item.todayQuantity;
                    const percent = item.plannedQuantity > 0 ? (totalQty / item.plannedQuantity) * 100 : 0;
                    return (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono text-amber-400 font-bold ml-2">{item.code}</span>
                          <span className="text-slate-200">{item.description}</span>
                        </div>
                        <div className="text-left flex items-center gap-3">
                          <span className="font-mono text-slate-300 font-semibold">{totalQty} {item.unit}</span>
                          <span className="font-mono text-emerald-400 font-bold w-12 text-left">{percent.toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Materials Highlights */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-white">رصيد المواد بالموقع</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('materials')}
                    className="text-xs text-purple-400 hover:underline font-medium"
                  >
                    إدارة المواد والمخزون ←
                  </button>
                </div>
                <div className="divide-y divide-slate-700/50">
                  {materials.slice(0, 4).map((mat) => {
                    const remaining = mat.totalDelivered - mat.totalUsed;
                    const isLow = remaining <= mat.minThreshold;
                    return (
                      <div key={mat.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-200 font-medium">{mat.name}</span>
                        </div>
                        <div className="text-left font-mono">
                          <span className={isLow ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            {remaining} {mat.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'boq' && (
          <div className="animate-in fade-in duration-300">
            <QuantitiesTable
              workItems={workItems}
              currency={project.currency}
              onUpdateWorkItem={handleUpdateWorkItem}
              onDeleteWorkItem={handleDeleteWorkItem}
              onOpenAddModal={() => setIsAddWorkItemOpen(true)}
            />
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="animate-in fade-in duration-300">
            <MaterialsManager
              materials={materials}
              currency={project.currency}
              onUpdateMaterial={handleUpdateMaterial}
              onDeleteMaterial={handleDeleteMaterial}
              onOpenAddModal={() => setIsAddMaterialOpen(true)}
            />
          </div>
        )}

        {activeTab === 'dailylog' && (
          <div className="animate-in fade-in duration-300">
            <DailyLogEntry
              dailyLogs={dailyLogs}
              onAddDailyLog={handleAddDailyLog}
              onDeleteDailyLog={handleDeleteDailyLog}
              onOpenAddModal={() => setIsAddDailyLogOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 text-slate-500 text-xs py-4 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <HardHat className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-slate-300">محلّل البيانات الهندسي</span>
            <span>— إدارة الكميات والمواد ونسب الإنجاز والتقارير التنفيذية</span>
          </div>
          <div className="text-[11px] text-slate-400">
            جميع الحسابات والتقارير معتمدة ومطابقة للمعايير الهندسية للمشاريع
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        project={project}
        workItems={workItems}
        materials={materials}
        dailyLogs={dailyLogs}
        onUpdateProject={(updated) => {
          setProject(updated);
          showToast('تم حفظ وتحديث بيانات التوقيعات والاعتمادات الرسمية بنجاح');
        }}
      />

      <AddWorkItemModal
        isOpen={isAddWorkItemOpen}
        onClose={() => setIsAddWorkItemOpen(false)}
        onAdd={handleAddWorkItem}
        existingCount={workItems.length}
      />

      <AddMaterialModal
        isOpen={isAddMaterialOpen}
        onClose={() => setIsAddMaterialOpen(false)}
        onAdd={handleAddMaterial}
      />

      <AddDailyLogModal
        isOpen={isAddDailyLogOpen}
        onClose={() => setIsAddDailyLogOpen(false)}
        onAdd={handleAddDailyLog}
        defaultEngineer={project.siteEngineer}
      />

      <ProjectSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        project={project}
        onUpdateProject={(updated) => {
          setProject(updated);
          showToast('تم تحديث بيانات المشروع والتعاقد');
        }}
        onResetToDefault={handleResetToDefault}
      />
    </div>
  );
}
