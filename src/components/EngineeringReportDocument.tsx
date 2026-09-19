import React from 'react';
import { ProjectInfo, WorkItem, MaterialItem, DailyLog } from '../types';
import { 
  calculateProjectMetrics, 
  formatCurrency, 
  formatNumber 
} from '../utils/calculations';
import { 
  LanguageMode, 
  translations, 
  getTranslatedItemDesc, 
  getTranslatedMaterialName, 
  getTranslatedUnit, 
  getTranslatedProjectInfo 
} from '../utils/translations';
import { 
  ClipboardList, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export interface ReportApprovals {
  approvalTitle1: string;
  approvalName1: string;
  approvalTitle2: string;
  approvalName2: string;
  approvalTitle3: string;
  approvalName3: string;
}

interface EngineeringReportDocumentProps {
  pageNumber: 1 | 2;
  innerRef?: React.RefObject<HTMLDivElement>;
  containerId?: string;
  project: ProjectInfo;
  workItems: WorkItem[];
  materials: MaterialItem[];
  dailyLogs: DailyLog[];
  reportDate: string;
  includeFinancials: boolean;
  lang: LanguageMode;
  approvals: ReportApprovals;
}

export const EngineeringReportDocument: React.FC<EngineeringReportDocumentProps> = ({
  pageNumber,
  innerRef,
  containerId,
  project,
  workItems,
  materials,
  dailyLogs,
  reportDate,
  includeFinancials,
  lang,
  approvals,
}) => {
  const tAr = translations.ar;
  const tEn = translations.en;
  const t = translations[lang === 'bilingual' ? 'ar' : lang];
  const isRtl = lang !== 'en';

  const projectMetrics = calculateProjectMetrics(workItems);
  const latestLog = dailyLogs.length > 0 ? dailyLogs[0] : null;
  const trProject = getTranslatedProjectInfo(project, lang);

  // Identify any materials that are at or below minimum threshold
  const lowStockMaterials = materials.filter((m) => (m.totalDelivered - m.totalUsed) <= m.minThreshold);

  // Helper for approval title display
  const getApprovalTitle = (arTitle: string, index: 1 | 2 | 3) => {
    if (lang === 'ar') return arTitle;
    const enDefault = index === 1 ? tEn.defaultApprovalTitle1 : index === 2 ? tEn.defaultApprovalTitle2 : tEn.defaultApprovalTitle3;
    if (lang === 'en') return enDefault;
    return `${arTitle} / ${enDefault}`;
  };

  const getApprovalName = (arName: string, index: 1 | 2 | 3) => {
    if (lang === 'ar') return arName;
    const enDefault = index === 1 ? tEn.defaultApprovalName1 : index === 2 ? tEn.defaultApprovalName2 : tEn.defaultApprovalName3;
    if (lang === 'en') return enDefault;
    return `${arName} / ${enDefault}`;
  };

  // ========================================================
  // PAGE 1: Master Header + Project Info + KPIs + BOQ Table
  // ========================================================
  if (pageNumber === 1) {
    return (
      <div
        ref={innerRef}
        id={containerId || 'report-doc-page-1'}
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`pdf-a4-page ${isRtl ? 'text-right' : 'text-left'}`}
        style={{
          width: '794px',
          minWidth: '794px',
          maxWidth: '794px',
          height: '1123px',
          minHeight: '1123px',
          maxHeight: '1123px',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          fontFamily: "'Cairo', system-ui, -apple-system, sans-serif",
          padding: '24px 28px',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        {/* TOP CONTENT WRAPPER */}
        <div style={{ width: '100%' }}>
          
          {/* 1. MASTER HEADER */}
          <header style={{ borderBottom: '2.5px solid #0f172a', paddingBottom: '10px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              
              {/* Logo / Emblems & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div 
                  style={{ 
                    width: '42px', 
                    height: '42px', 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#f59e0b',
                    flexShrink: 0
                  }}
                >
                  <ClipboardList style={{ width: '24px', height: '24px' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h1 style={{ fontSize: '15px', fontWeight: 800, color: '#090d16', margin: 0, lineHeight: 1.2 }}>
                      {lang === 'en' ? tEn.systemTitle : tAr.systemTitle}
                    </h1>
                    <span 
                      style={{ 
                        fontSize: '9px', 
                        fontWeight: 700, 
                        backgroundColor: '#ecfdf5', 
                        color: '#047857', 
                        border: '1px solid #a7f3d0', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <CheckCircle2 style={{ width: '10px', height: '10px' }} />
                      <span>{lang === 'bilingual' ? `${tAr.badge} / ${tEn.badge}` : t.badge}</span>
                    </span>
                  </div>
                  <p style={{ fontSize: '9.5px', color: '#475569', margin: '3px 0 0 0', fontWeight: 500, lineHeight: 1.3 }}>
                    {lang === 'en' ? tEn.systemSubTitle : tAr.systemSubTitle}
                  </p>
                </div>
              </div>

              {/* Meta details box */}
              <div 
                style={{ 
                  textAlign: isRtl ? 'left' : 'right', 
                  fontSize: '9.5px', 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #cbd5e1', 
                  padding: '6px 10px', 
                  borderRadius: '6px',
                  minWidth: '170px',
                  flexShrink: 0
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', gap: '8px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>{t.code}</span>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }} dir="ltr">
                    {project.code}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', gap: '8px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>{t.date}</span>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }} dir="ltr">
                    {reportDate}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>{t.approvalStatus}</span>
                  <span style={{ fontWeight: 800, color: '#047857' }}>
                    {t.approvedOfficial}
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-Banner Title */}
            <div 
              style={{ 
                marginTop: '8px', 
                backgroundColor: '#0f172a', 
                color: '#ffffff', 
                padding: '5px 12px', 
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              <span>
                {includeFinancials ? (
                  lang === 'bilingual' 
                    ? `${tAr.comprehensiveReportTitle} / ${tEn.comprehensiveReportTitle}` 
                    : t.comprehensiveReportTitle
                ) : (
                  lang === 'bilingual'
                    ? `${tAr.comprehensiveNoPriceReportTitle} / ${tEn.comprehensiveNoPriceReportTitle}`
                    : t.comprehensiveNoPriceReportTitle
                )}
              </span>
              <span style={{ fontSize: '9px', color: '#fbbf24', fontWeight: 600 }}>
                {!includeFinancials && `[ ${t.technicalOnlyNotice} ]`}
              </span>
            </div>
          </header>

          {/* 2. PROJECT IDENTIFICATION CARD (Full Width 100%) */}
          <section 
            style={{ 
              width: '100%',
              backgroundColor: '#ffffff', 
              border: '1px solid #cbd5e1', 
              borderRadius: '6px', 
              padding: '8px 12px', 
              marginBottom: '10px' 
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '9.5px' }}>
              
              {/* Project Name */}
              <div style={{ borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', paddingLeft: isRtl ? '8px' : '0', paddingRight: isRtl ? '0' : '8px' }}>
                <span style={{ color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                  {t.projectName}
                </span>
                <span style={{ fontWeight: 800, color: '#0f172a', display: 'block', lineHeight: 1.3 }}>
                  {trProject.name}
                </span>
              </div>

              {/* Client */}
              <div style={{ borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', paddingLeft: isRtl ? '8px' : '0', paddingRight: isRtl ? '0' : '8px' }}>
                <span style={{ color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                  {t.client}
                </span>
                <span style={{ fontWeight: 700, color: '#1e293b', display: 'block', lineHeight: 1.3 }}>
                  {trProject.client}
                </span>
              </div>

              {/* Main Contractor */}
              <div style={{ borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', paddingLeft: isRtl ? '8px' : '0', paddingRight: isRtl ? '0' : '8px' }}>
                <span style={{ color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                  {t.contractor}
                </span>
                <span style={{ fontWeight: 700, color: '#1e293b', display: 'block', lineHeight: 1.3 }}>
                  {trProject.contractor}
                </span>
              </div>

              {/* Consultant */}
              <div>
                <span style={{ color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                  {t.consultant}
                </span>
                <span style={{ fontWeight: 700, color: '#1e293b', display: 'block', lineHeight: 1.3 }}>
                  {trProject.consultant}
                </span>
              </div>
            </div>
          </section>

          {/* 3. EXECUTIVE KPI CARDS (Full Width 100%) */}
          <section style={{ width: '100%', marginBottom: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: includeFinancials ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: '8px' }}>
              
              {/* KPI 1: Actual Progress */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 8px', textAlign: 'center' }}>
                <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#475569', display: 'block' }}>
                  {lang === 'bilingual' ? `${tAr.actualProgress} / ${tEn.actualProgress}` : t.actualProgress}
                </span>
                <div style={{ margin: '2px 0' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#1d4ed8' }}>
                    <span dir="ltr" className="pdf-tabular-num">{formatNumber(projectMetrics.actualProgressPercent, 1)}%</span>
                  </span>
                </div>
                <span style={{ fontSize: '8.5px', color: '#64748b', fontWeight: 600, display: 'block' }}>
                  {t.plannedProgress}: <span dir="ltr" className="pdf-tabular-num">{formatNumber(projectMetrics.plannedProgressPercent, 1)}%</span>
                </span>
              </div>

              {/* KPI 2: Schedule Performance Index */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 8px', textAlign: 'center' }}>
                <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#475569', display: 'block' }}>
                  {lang === 'bilingual' ? `${tAr.scheduleIndex} / ${tEn.scheduleIndex}` : t.scheduleIndex}
                </span>
                <div style={{ margin: '2px 0' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: projectMetrics.spi >= 1 ? '#047857' : '#b91c1c' }}>
                    <span dir="ltr" className="pdf-tabular-num">{projectMetrics.spi.toFixed(2)}</span>
                  </span>
                </div>
                <span style={{ fontSize: '8.5px', color: '#64748b', fontWeight: 600, display: 'block' }}>
                  {projectMetrics.variance >= 0 
                    ? `+${projectMetrics.variance}% ${t.aheadOfSchedule}` 
                    : `${projectMetrics.variance}% ${t.scheduleDelay}`}
                </span>
              </div>

              {/* KPI 3: Financials (Conditional) */}
              {includeFinancials && (
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#475569', display: 'block' }}>
                    {lang === 'bilingual' ? `${tAr.executedValue} / ${tEn.executedValue}` : t.executedValue}
                  </span>
                  <div style={{ margin: '2px 0' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                      <span dir="ltr" className="pdf-tabular-num">{formatCurrency(projectMetrics.totalExecutedCost, trProject.currency)}</span>
                    </span>
                  </div>
                  <span style={{ fontSize: '8.5px', color: '#64748b', fontWeight: 600, display: 'block' }}>
                    {t.contractValue}: <span dir="ltr" className="pdf-tabular-num">{formatCurrency(project.totalContractValue, trProject.currency)}</span>
                  </span>
                </div>
              )}

              {/* KPI 4: Labor & Equipment */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 8px', textAlign: 'center' }}>
                <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#475569', display: 'block' }}>
                  {lang === 'bilingual' ? `${tAr.workforce} / ${tEn.workforce}` : t.workforce}
                </span>
                <div style={{ margin: '2px 0' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#b45309' }}>
                    <span dir="ltr" className="pdf-tabular-num">{latestLog?.laborCount || 0}</span>
                  </span>
                  <span style={{ fontSize: '9.5px', color: '#475569', fontWeight: 700, margin: '0 4px' }}>
                    {t.workers}
                  </span>
                </div>
                <span style={{ fontSize: '8.5px', color: '#64748b', fontWeight: 600, display: 'block' }}>
                  + <span dir="ltr" className="pdf-tabular-num">{latestLog?.equipmentCount || 0}</span> {t.equipmentOperating}
                </span>
              </div>
            </div>
          </section>

          {/* 4. TABLE 1: CUMULATIVE BOQ ITEMS (Spans 100% full width from right to left) */}
          <section style={{ width: '100%', marginBottom: '8px' }}>
            
            {/* Section Bar */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                backgroundColor: '#f1f5f9', 
                border: '1px solid #cbd5e1', 
                padding: '6px 10px', 
                borderTopLeftRadius: '4px', 
                borderTopRightRadius: '4px' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                <h2 style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {lang === 'bilingual' ? `${tAr.boqSectionTitle} / ${tEn.boqSectionTitle}` : t.boqSectionTitle}
                </h2>
              </div>
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#475569', backgroundColor: '#ffffff', padding: '2px 6px', borderRadius: '3px', border: '1px solid #e2e8f0' }}>
                {t.totalItems}: {workItems.length}
              </span>
            </div>

            {/* Table wrapper */}
            <div style={{ width: '100%', borderLeft: '1px solid #cbd5e1', borderRight: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '8%' }} />
                  <col style={{ width: includeFinancials ? '32%' : '41%' }} />
                  <col style={{ width: '6%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '9%' }} />
                  {includeFinancials && <col style={{ width: '13%' }} />}
                </colgroup>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#0f172a', borderBottom: '1.5px solid #cbd5e1', fontSize: '9.5px', fontWeight: 800, height: '32px' }}>
                    <th style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                      {lang === 'bilingual' ? 'الكود / Code' : t.boqCode}
                    </th>
                    <th style={{ padding: '6px 8px', textAlign: isRtl ? 'right' : 'left', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                      {lang === 'bilingual' ? 'بيان وتوصيف الأعمال / Scope Description' : t.boqDescription}
                    </th>
                    <th style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                      {lang === 'bilingual' ? 'الوحدة / Unit' : t.unit}
                    </th>
                    <th style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                      {lang === 'bilingual' ? 'المقرر / Plan' : t.plannedQty}
                    </th>
                    <th style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                      {lang === 'bilingual' ? 'اليوم / Today' : t.todayQty}
                    </th>
                    <th style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                      {lang === 'bilingual' ? 'المنفذ / Exec' : t.totalExecQty}
                    </th>
                    <th style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle', borderRight: isRtl ? (includeFinancials ? 'none' : 'none') : (includeFinancials ? '1px solid #e2e8f0' : 'none'), borderLeft: isRtl ? (includeFinancials ? '1px solid #e2e8f0' : 'none') : 'none' }}>
                      {lang === 'bilingual' ? 'الإنجاز / %' : t.progressPercent}
                    </th>
                    {includeFinancials && (
                      <th style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle' }}>
                        {lang === 'bilingual' ? 'القيمة / Value' : t.executedCost}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody style={{ fontSize: '9.5px' }}>
                  {workItems.map((item, idx) => {
                    const totalExec = item.previousQuantity + item.todayQuantity;
                    const percent = item.plannedQuantity > 0 
                      ? Math.min(100, (totalExec / item.plannedQuantity) * 100) 
                      : 0;
                    const val = totalExec * item.unitRate;
                    const itemDesc = getTranslatedItemDesc(item.code, item.description, lang);
                    const itemUnit = getTranslatedUnit(item.unit, lang);

                    return (
                      <tr 
                        key={item.id} 
                        style={{ 
                          backgroundColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff',
                          borderTop: '1px solid #e2e8f0',
                          height: '34px',
                          minHeight: '34px'
                        }}
                      >
                        {/* Code */}
                        <td style={{ padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800, color: '#334155', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                          <span dir="ltr" className="pdf-tabular-num">{item.code}</span>
                        </td>

                        {/* Description */}
                        <td style={{ padding: '5px 8px', textAlign: isRtl ? 'right' : 'left', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>
                          {lang === 'bilingual' ? (
                            <div>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.description}</div>
                              <div style={{ fontSize: '8.5px', color: '#64748b', fontStyle: 'italic' }} dir="ltr">
                                {getTranslatedItemDesc(item.code, item.description, 'en')}
                              </div>
                            </div>
                          ) : (
                            itemDesc
                          )}
                        </td>

                        {/* Unit */}
                        <td style={{ padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle', color: '#475569', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                          {itemUnit}
                        </td>

                        {/* Planned Qty */}
                        <td style={{ padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 700, color: '#1e293b', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                          <span dir="ltr" className="pdf-tabular-num">{formatNumber(item.plannedQuantity)}</span>
                        </td>

                        {/* Today Executed */}
                        <td style={{ padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800, color: '#b45309', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                          <span dir="ltr" className="pdf-tabular-num">+{formatNumber(item.todayQuantity)}</span>
                        </td>

                        {/* Total Cumulative Executed */}
                        <td style={{ padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800, color: '#0f172a', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                          <span dir="ltr" className="pdf-tabular-num">{formatNumber(totalExec)}</span>
                        </td>

                        {/* Progress % */}
                        <td style={{ padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800, whiteSpace: 'nowrap', borderRight: isRtl ? (includeFinancials ? 'none' : 'none') : (includeFinancials ? '1px solid #e2e8f0' : 'none'), borderLeft: isRtl ? (includeFinancials ? '1px solid #e2e8f0' : 'none') : 'none' }}>
                          <span dir="ltr" className="pdf-tabular-num" style={{ color: percent >= 100 ? '#047857' : '#1d4ed8', fontWeight: 800 }}>
                            {formatNumber(percent, 1)}%
                          </span>
                        </td>

                        {/* Financial Value */}
                        {includeFinancials && (
                          <td style={{ padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                            <span dir="ltr" className="pdf-tabular-num">{formatCurrency(val, trProject.currency)}</span>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: '#f1f5f9', fontWeight: 800, fontSize: '9.5px', borderTop: '2px solid #cbd5e1', height: '32px' }}>
                    <td colSpan={2} style={{ padding: '6px 8px', textAlign: isRtl ? 'right' : 'left', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #cbd5e1', borderLeft: isRtl ? '1px solid #cbd5e1' : 'none', color: '#0f172a' }}>
                      {lang === 'bilingual' ? `${tAr.boqSummaryTitle} / ${tEn.boqSummaryTitle}` : t.boqSummaryTitle}
                    </td>
                    <td colSpan={4} style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle', color: '#475569', borderRight: isRtl ? 'none' : '1px solid #cbd5e1', borderLeft: isRtl ? '1px solid #cbd5e1' : 'none' }}>
                      {workItems.length} {t.engineeringItems}
                    </td>
                    <td style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800, color: '#1d4ed8', borderRight: isRtl ? (includeFinancials ? 'none' : 'none') : (includeFinancials ? '1px solid #cbd5e1' : 'none'), borderLeft: isRtl ? (includeFinancials ? '1px solid #cbd5e1' : 'none') : 'none' }}>
                      <span dir="ltr" className="pdf-tabular-num">{formatNumber(projectMetrics.actualProgressPercent, 1)}%</span>
                    </td>
                    {includeFinancials && (
                      <td style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>
                        <span dir="ltr" className="pdf-tabular-num">{formatCurrency(projectMetrics.totalExecutedCost, trProject.currency)}</span>
                      </td>
                    )}
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </div>

        {/* 5. PAGE 1 FIXED BOTTOM FOOTER BAR */}
        <footer style={{ width: '100%', paddingTop: '8px', borderTop: '1px solid #cbd5e1', fontSize: '9.5px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div>
            <span>{t.confidentialNotice}</span>
          </div>
          <div style={{ fontWeight: 800, color: '#0f172a', padding: '2px 8px', backgroundColor: '#f1f5f9', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '9.5px' }}>
            {lang === 'bilingual' ? 'صفحة 1 من 2 | Page 1 of 2' : t.pageNumber(1, 2)}
          </div>
        </footer>
      </div>
    );
  }

  // ========================================================
  // PAGE 2: Materials + Daily Logs + Official Signatures
  // ========================================================
  return (
    <div
      ref={innerRef}
      id={containerId || 'report-doc-page-2'}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`pdf-a4-page ${isRtl ? 'text-right' : 'text-left'}`}
      style={{
        width: '794px',
        minWidth: '794px',
        maxWidth: '794px',
        height: '1123px',
        minHeight: '1123px',
        maxHeight: '1123px',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontFamily: "'Cairo', system-ui, -apple-system, sans-serif",
        padding: '24px 28px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      {/* TOP CONTENT WRAPPER */}
      <div style={{ width: '100%' }}>
        
        {/* Page 2 Continuity Header */}
        <header style={{ borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#090d16', display: 'block' }}>
                {lang === 'en' ? tEn.systemTitle : tAr.systemTitle}
              </span>
              <span style={{ fontSize: '10px', color: '#475569', fontWeight: 600 }}>
                {trProject.name} — <span dir="ltr" className="pdf-tabular-num">{project.code}</span>
              </span>
            </div>
            <div style={{ textAlign: isRtl ? 'left' : 'right', fontSize: '9.5px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '4px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>{t.date}: </span>
              <span style={{ fontWeight: 800, color: '#0f172a' }} dir="ltr" className="pdf-tabular-num">{reportDate}</span>
            </div>
          </div>
        </header>

        {/* SECTION 2: Materials & Inventory Table (Spans 100% full width from right to left) */}
        <section style={{ width: '100%', marginBottom: '10px' }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              backgroundColor: '#f1f5f9', 
              border: '1px solid #cbd5e1', 
              padding: '6px 10px', 
              borderTopLeftRadius: '4px', 
              borderTopRightRadius: '4px' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9333ea' }}></div>
              <h2 style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {lang === 'bilingual' ? `${tAr.materialsSectionTitle} / ${tEn.materialsSectionTitle}` : t.materialsSectionTitle}
              </h2>
            </div>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#475569', backgroundColor: '#ffffff', padding: '2px 6px', borderRadius: '3px', border: '1px solid #e2e8f0' }}>
              {materials.length} {t.basicMaterials}
            </span>
          </div>

          <div style={{ width: '100%', borderLeft: '1px solid #cbd5e1', borderRight: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '25%' }} />
                <col style={{ width: '6%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '15%' }} />
              </colgroup>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#0f172a', borderBottom: '1.5px solid #cbd5e1', fontSize: '9.5px', fontWeight: 800, height: '32px' }}>
                  <th style={{ padding: '6px 8px', textAlign: isRtl ? 'right' : 'left', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                    {lang === 'bilingual' ? 'المادة والمواصفة / Material & Spec' : t.materialNameSpec}
                  </th>
                  <th style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                    {lang === 'bilingual' ? 'الوحدة / Unit' : t.unit}
                  </th>
                  <th style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                    {lang === 'bilingual' ? 'المطلوب / Req.' : t.totalRequired}
                  </th>
                  <th style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                    {lang === 'bilingual' ? 'المورّد / Deliv.' : t.totalDelivered}
                  </th>
                  <th style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                    {lang === 'bilingual' ? 'مستهلك اليوم / Today' : t.todayConsumed}
                  </th>
                  <th style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                    {lang === 'bilingual' ? 'المستهلك / Consumed' : t.totalConsumed}
                  </th>
                  <th style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                    {lang === 'bilingual' ? 'المتبقي / Stock' : t.remainingBalance}
                  </th>
                  <th style={{ padding: '6px 4px', textAlign: 'center', verticalAlign: 'middle' }}>
                    {lang === 'bilingual' ? 'الموقف / Status' : t.stockStatus}
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '9.5px' }}>
                {materials.map((mat, idx) => {
                  const remaining = mat.totalDelivered - mat.totalUsed;
                  const isLow = remaining <= mat.minThreshold;
                  const matUnit = getTranslatedUnit(mat.unit, lang);
                  const enMaterialName = getTranslatedMaterialName(mat.name, 'en');

                  return (
                    <tr 
                      key={mat.id}
                      style={{ 
                        backgroundColor: isLow ? '#fff7ed' : (idx % 2 === 1 ? '#f8fafc' : '#ffffff'),
                        borderTop: '1px solid #e2e8f0',
                        height: '34px',
                        minHeight: '34px'
                      }}
                    >
                      {/* Material Name - Pure, clear Arabic or English, never corrupted */}
                      <td style={{ padding: '5px 8px', textAlign: isRtl ? 'right' : 'left', verticalAlign: 'middle', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>
                        {lang === 'ar' ? (
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{mat.name}</span>
                        ) : lang === 'en' ? (
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{enMaterialName}</span>
                        ) : (
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{mat.name}</div>
                            <div style={{ fontSize: '8.5px', color: '#64748b', fontStyle: 'italic' }} dir="ltr">
                              {enMaterialName}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Unit */}
                      <td style={{ padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle', color: '#475569', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                        {matUnit}
                      </td>

                      {/* Total Required */}
                      <td style={{ padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 700, color: '#1e293b', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                        <span dir="ltr" className="pdf-tabular-num">{formatNumber(mat.totalRequired)}</span>
                      </td>

                      {/* Total Delivered */}
                      <td style={{ padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800, color: '#1e3a8a', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                        <span dir="ltr" className="pdf-tabular-num">{formatNumber(mat.totalDelivered)}</span>
                      </td>

                      {/* Today Consumed */}
                      <td style={{ padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800, color: '#7e22ce', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                        <span dir="ltr" className="pdf-tabular-num">{formatNumber(mat.todayUsed)}</span>
                      </td>

                      {/* Total Consumed */}
                      <td style={{ padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 700, color: '#1e293b', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                        <span dir="ltr" className="pdf-tabular-num">{formatNumber(mat.totalUsed)}</span>
                      </td>

                      {/* Remaining Stock */}
                      <td style={{ padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800, color: isLow ? '#b91c1c' : '#0f172a', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                        <span dir="ltr" className="pdf-tabular-num">{formatNumber(remaining)}</span>
                      </td>

                      {/* Status & Safety Threshold Badge */}
                      <td style={{ padding: '5px 4px', textAlign: 'center', verticalAlign: 'middle' }}>
                        {isLow ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                            <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#be123c', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', padding: '1.5px 5px', borderRadius: '3px', whiteSpace: 'nowrap' }}>
                              {lang === 'bilingual' ? '⚠️ نقص بالمخزون' : '⚠️ تنبيه مخزون منخفض'}
                            </span>
                            <span style={{ fontSize: '8px', color: '#991b1b', fontWeight: 700, whiteSpace: 'nowrap' }}>
                              {lang === 'en' ? `Min: ${formatNumber(mat.minThreshold)}` : `حد الطلب: ${formatNumber(mat.minThreshold)} ${mat.unit}`}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#047857', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '2px 6px', borderRadius: '3px', whiteSpace: 'nowrap' }}>
                            {lang === 'bilingual' ? `${tAr.stockAdequate} / ${tEn.stockAdequate}` : t.stockAdequate}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* LOW STOCK ACTION BANNER (Fills the requirement of complete Low Stock Alert data) */}
          {lowStockMaterials.length > 0 && (
            <div 
              style={{ 
                marginTop: '6px', 
                backgroundColor: '#fffbeb', 
                border: '1px solid #fde68a', 
                borderRight: isRtl ? '4px solid #d97706' : '1px solid #fde68a',
                borderLeft: isRtl ? '1px solid #fde68a' : '4px solid #d97706',
                borderRadius: '4px', 
                padding: '5px 10px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                fontSize: '9px',
                color: '#92400e'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle style={{ width: '13px', height: '13px', color: '#d97706', flexShrink: 0 }} />
                <div>
                  <span style={{ fontWeight: 800, color: '#b45309' }}>
                    {lang === 'en' ? 'Low Stock Alert & Immediate Procurement Action:' : 'تنبيه مخزون منخفض وإجراء التوريد الفوري:'}
                  </span>
                  <span style={{ margin: '0 4px', fontWeight: 600 }}>
                    {lowStockMaterials.map(m => (
                      lang === 'en' 
                        ? `${getTranslatedMaterialName(m.name, 'en')} (Available: ${formatNumber(m.totalDelivered - m.totalUsed)} ${m.unit} | Min Required Buffer: ${formatNumber(m.minThreshold)} ${m.unit})`
                        : `مادة (${m.name}) الرصيد الحالي بالموقع (${formatNumber(m.totalDelivered - m.totalUsed)} ${m.unit}) — أقل من حد الأمان الأدنى (${formatNumber(m.minThreshold)} ${m.unit}).`
                    )).join(' | ')}
                  </span>
                </div>
              </div>
              <span style={{ backgroundColor: '#fef3c7', border: '1px solid #f59e0b', color: '#b45309', fontWeight: 800, padding: '2px 6px', borderRadius: '3px', whiteSpace: 'nowrap', fontSize: '8.5px' }}>
                {lang === 'en' ? 'Urgent PO' : 'أمر توريد عاجل'}
              </span>
            </div>
          )}
        </section>

        {/* SECTION 3: Field Daily Logs & Observations */}
        {latestLog && (
          <section style={{ width: '100%', marginBottom: '10px' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                backgroundColor: '#f1f5f9', 
                border: '1px solid #cbd5e1', 
                padding: '6px 10px', 
                borderTopLeftRadius: '4px', 
                borderTopRightRadius: '4px' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></div>
                <h2 style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {lang === 'bilingual' ? `${tAr.logsSectionTitle} / ${tEn.logsSectionTitle}` : t.logsSectionTitle} (<span dir="ltr" className="pdf-tabular-num">{latestLog.dayName} {latestLog.date}</span>)
                </h2>
              </div>
              <span style={{ fontSize: '9px', color: '#475569', fontWeight: 600 }}>
                {t.documentedBy} {latestLog.loggedBy}
              </span>
            </div>

            <div 
              style={{ 
                width: '100%',
                backgroundColor: '#ffffff', 
                borderLeft: '1px solid #cbd5e1', 
                borderRight: '1px solid #cbd5e1', 
                borderBottom: '1px solid #cbd5e1', 
                padding: '8px 10px', 
                borderBottomLeftRadius: '4px', 
                borderBottomRightRadius: '4px' 
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px', fontSize: '9px' }}>
                
                {/* 1: Summary of Works */}
                <div style={{ borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', paddingLeft: isRtl ? '8px' : '0', paddingRight: isRtl ? '0' : '8px' }}>
                  <span style={{ fontWeight: 800, color: '#1e3a8a', display: 'block', marginBottom: '2px' }}>
                    {t.progressBlockTitle}
                  </span>
                  <p style={{ color: '#334155', margin: 0, lineHeight: 1.35 }}>
                    {latestLog.summary}
                  </p>
                </div>

                {/* 2: Obstacles & Mitigations */}
                <div style={{ borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', paddingLeft: isRtl ? '8px' : '0', paddingRight: isRtl ? '0' : '8px' }}>
                  <span style={{ fontWeight: 800, color: '#b45309', display: 'block', marginBottom: '2px' }}>
                    {t.obstaclesBlockTitle}
                  </span>
                  <p style={{ color: '#334155', margin: 0, lineHeight: 1.35 }}>
                    {latestLog.obstacles || t.obstaclesDefault}
                  </p>
                </div>

                {/* 3: HSE & Quality */}
                <div>
                  <span style={{ fontWeight: 800, color: '#047857', display: 'block', marginBottom: '2px' }}>
                    {t.hseBlockTitle}
                  </span>
                  <p style={{ color: '#334155', margin: 0, lineHeight: 1.35 }}>
                    {latestLog.safetyNotes || t.hseDefault}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: Official Project Sign-offs & Certifications */}
        <section style={{ width: '100%', marginBottom: '8px' }}>
          <div 
            style={{ 
              backgroundColor: '#f1f5f9', 
              border: '1px solid #cbd5e1', 
              padding: '6px 10px', 
              borderTopLeftRadius: '4px', 
              borderTopRightRadius: '4px' 
            }}
          >
            <h2 style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {lang === 'bilingual' ? `${tAr.approvalsSectionTitle} / ${tEn.approvalsSectionTitle}` : t.approvalsSectionTitle}
            </h2>
          </div>

          <div 
            style={{ 
              width: '100%',
              backgroundColor: '#ffffff', 
              borderLeft: '1px solid #cbd5e1', 
              borderRight: '1px solid #cbd5e1', 
              borderBottom: '1px solid #cbd5e1', 
              padding: '10px 12px', 
              borderBottomLeftRadius: '4px', 
              borderBottomRightRadius: '4px' 
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              
              {/* Approval 1 */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 10px', textAlign: 'center', backgroundColor: '#fafafa' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', display: 'block' }}>
                  {getApprovalTitle(approvals.approvalTitle1, 1)}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', display: 'block', margin: '4px 0 16px 0' }}>
                  {getApprovalName(approvals.approvalName1, 1)}
                </span>
                <div style={{ borderTop: '1px dashed #94a3b8', paddingTop: '4px', fontSize: '8.5px', color: '#64748b' }}>
                  {t.signAndStamp}
                </div>
              </div>

              {/* Approval 2 */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 10px', textAlign: 'center', backgroundColor: '#fafafa' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', display: 'block' }}>
                  {getApprovalTitle(approvals.approvalTitle2, 2)}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', display: 'block', margin: '4px 0 16px 0' }}>
                  {getApprovalName(approvals.approvalName2, 2)}
                </span>
                <div style={{ borderTop: '1px dashed #94a3b8', paddingTop: '4px', fontSize: '8.5px', color: '#64748b' }}>
                  {t.signAndStamp}
                </div>
              </div>

              {/* Approval 3 */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 10px', textAlign: 'center', backgroundColor: '#fafafa' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', display: 'block' }}>
                  {getApprovalTitle(approvals.approvalTitle3, 3)}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', display: 'block', margin: '4px 0 16px 0' }}>
                  {getApprovalName(approvals.approvalName3, 3)}
                </span>
                <div style={{ borderTop: '1px dashed #94a3b8', paddingTop: '4px', fontSize: '8.5px', color: '#64748b' }}>
                  {t.signAndStamp}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* PAGE 2 FIXED BOTTOM FOOTER BAR */}
      <footer style={{ width: '100%', paddingTop: '8px', borderTop: '1px solid #cbd5e1', fontSize: '9.5px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div>
          <span>{t.confidentialNotice}</span>
        </div>
        <div style={{ fontWeight: 800, color: '#0f172a', padding: '2px 8px', backgroundColor: '#f1f5f9', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '9.5px' }}>
          {lang === 'bilingual' ? 'صفحة 2 من 2 | Page 2 of 2' : t.pageNumber(2, 2)}
        </div>
      </footer>
    </div>
  );
};
