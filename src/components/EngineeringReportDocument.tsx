import React from 'react';
import { 
  ProjectInfo, 
  WorkItem, 
  MaterialItem, 
  DailyLog 
} from '../types';
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
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  HardHat, 
  FileText 
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
  project: ProjectInfo;
  workItems: WorkItem[];
  materials: MaterialItem[];
  dailyLogs: DailyLog[];
  reportDate: string;
  includeFinancials: boolean;
  lang: LanguageMode;
  approvals: ReportApprovals;
  containerId?: string;
  innerRef?: React.Ref<HTMLDivElement>;
}

export const EngineeringReportDocument: React.FC<EngineeringReportDocumentProps> = ({
  pageNumber,
  project,
  workItems,
  materials,
  dailyLogs,
  reportDate,
  includeFinancials,
  lang,
  approvals,
  containerId,
  innerRef,
}) => {
  const tAr = translations.ar;
  const tEn = translations.en;
  const t = translations[lang === 'bilingual' ? 'ar' : lang];
  const isRtl = lang !== 'en';

  const projectMetrics = calculateProjectMetrics(workItems);
  const latestLog = dailyLogs.length > 0 ? dailyLogs[0] : null;
  const trProject = getTranslatedProjectInfo(project, lang);

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
          padding: '28px 36px 20px 36px',
          margin: '0 auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* TOP SECTION: Header + Meta + KPIs + BOQ Table */}
        <div style={{ width: '100%' }}>
          {/* Official Engineering Header */}
          <header style={{ borderBottom: '2px solid #0f172a', paddingBottom: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '17px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.02em' }}>
                    {lang === 'en' ? tEn.systemTitle : tAr.systemTitle}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#0f172a', color: '#ffffff', padding: '2px 8px', borderRadius: '4px' }}>
                    {lang === 'en' ? tEn.badge : tAr.badge}
                  </span>
                </div>
                <p style={{ fontSize: '10px', color: '#475569', fontWeight: 600, margin: 0 }}>
                  {lang === 'en' ? tEn.systemSubTitle : tAr.systemSubTitle}
                </p>
                {lang === 'bilingual' && (
                  <p style={{ fontSize: '9px', color: '#64748b', fontStyle: 'italic', margin: '2px 0 0 0' }} dir="ltr">
                    {tEn.systemTitle} — {tEn.systemSubTitle}
                  </p>
                )}
              </div>

              {/* Metadata Card */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 10px', fontSize: '9.5px', minWidth: '220px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ color: '#64748b', padding: '2px 0', fontWeight: 600 }}>
                        {lang === 'bilingual' ? `${tAr.code} / ${tEn.code}` : t.code}:
                      </td>
                      <td style={{ fontWeight: 800, color: '#0f172a', textAlign: isRtl ? 'left' : 'right', padding: '2px 0' }}>
                        <span dir="ltr" className="pdf-tabular-num">{project.code}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ color: '#64748b', padding: '2px 0', fontWeight: 600 }}>
                        {lang === 'bilingual' ? `${tAr.date} / ${tEn.date}` : t.date}:
                      </td>
                      <td style={{ fontWeight: 600, color: '#1e293b', textAlign: isRtl ? 'left' : 'right', padding: '2px 0' }}>
                        <span dir="ltr" className="pdf-tabular-num">{reportDate}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ color: '#64748b', padding: '2px 0', fontWeight: 600 }}>
                        {lang === 'bilingual' ? `${tAr.approvalStatus} / ${tEn.approvalStatus}` : t.approvalStatus}:
                      </td>
                      <td style={{ textAlign: isRtl ? 'left' : 'right', padding: '2px 0' }}>
                        <span style={{ fontWeight: 800, color: '#065f46', backgroundColor: '#ecfdf5', padding: '2px 6px', borderRadius: '3px', border: '1px solid #a7f3d0', fontSize: '9px' }}>
                          {lang === 'bilingual' ? `${tAr.approvedOfficial} / ${tEn.approvedOfficial}` : t.approvedOfficial}
                        </span>
                      </td>
                    </tr>
                    {!includeFinancials && (
                      <tr>
                        <td colSpan={2} style={{ paddingTop: '4px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '8.5px', fontWeight: 700, color: '#b45309' }}>
                          {lang === 'bilingual' ? `${tAr.technicalOnlyNotice} / ${tEn.technicalOnlyNotice}` : t.technicalOnlyNotice}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Document Title Bar */}
            <div style={{ marginTop: '8px', textAlign: 'center', padding: '6px 12px', backgroundColor: '#f1f5f9', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
              <h1 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                {includeFinancials ? t.comprehensiveReportTitle : t.comprehensiveNoPriceReportTitle}
              </h1>
              {lang === 'bilingual' && (
                <p style={{ fontSize: '9.5px', fontWeight: 600, color: '#475569', margin: '2px 0 0 0' }} dir="ltr">
                  {includeFinancials ? tEn.comprehensiveReportTitle : tEn.comprehensiveNoPriceReportTitle}
                </p>
              )}
              <p style={{ fontSize: '11px', color: '#1e293b', fontWeight: 700, margin: '2px 0 0 0' }}>
                {trProject.name} {trProject.location ? `— ${trProject.location}` : ''}
              </p>
            </div>

            {/* Project 4 Core Parameters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '8px', fontSize: '9.5px' }}>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 8px' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '8.5px', fontWeight: 600, marginBottom: '2px' }}>
                  {lang === 'bilingual' ? `${tAr.projectName} / ${tEn.projectName}` : t.projectName}
                </span>
                <span style={{ color: '#0f172a', fontWeight: 800, display: 'block', lineHeight: 1.25 }}>
                  {trProject.name}
                </span>
              </div>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 8px' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '8.5px', fontWeight: 600, marginBottom: '2px' }}>
                  {lang === 'bilingual' ? `${tAr.client} / ${tEn.client}` : t.client}
                </span>
                <span style={{ color: '#0f172a', fontWeight: 800, display: 'block', lineHeight: 1.25 }}>
                  {trProject.client}
                </span>
              </div>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 8px' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '8.5px', fontWeight: 600, marginBottom: '2px' }}>
                  {lang === 'bilingual' ? `${tAr.contractor} / ${tEn.contractor}` : t.contractor}
                </span>
                <span style={{ color: '#0f172a', fontWeight: 800, display: 'block', lineHeight: 1.25 }}>
                  {trProject.contractor}
                </span>
              </div>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 8px' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '8.5px', fontWeight: 600, marginBottom: '2px' }}>
                  {lang === 'bilingual' ? `${tAr.consultant} / ${tEn.consultant}` : t.consultant}
                </span>
                <span style={{ color: '#0f172a', fontWeight: 800, display: 'block', lineHeight: 1.25 }}>
                  {trProject.consultant}
                </span>
              </div>
            </div>
          </header>

          {/* Executive KPIs Grid (Exact 722px) */}
          <section style={{ marginBottom: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: includeFinancials ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: '6px' }}>
              {/* KPI 1: Progress */}
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

          {/* TABLE 1: Cumulative BOQ Items (Exact 722px Width Layout) */}
          <section style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 10px', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
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

            <div style={{ borderLeft: '1px solid #cbd5e1', borderRight: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', overflow: 'hidden' }}>
              <table style={{ width: '722px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#0f172a', borderBottom: '1px solid #cbd5e1', fontSize: '9px', fontWeight: 800 }}>
                    <th style={{ width: '60px', padding: '6px 2px', textAlign: 'center', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                      {lang === 'bilingual' ? 'الكود / Code' : t.boqCode}
                    </th>
                    <th style={{ width: includeFinancials ? '272px' : '362px', padding: '6px 8px', textAlign: isRtl ? 'right' : 'left', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                      {lang === 'bilingual' ? 'بيان وتوصيف الأعمال / Scope Description' : t.boqDescription}
                    </th>
                    <th style={{ width: '45px', padding: '6px 2px', textAlign: 'center', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                      {lang === 'bilingual' ? 'الوحدة / Unit' : t.unit}
                    </th>
                    <th style={{ width: '65px', padding: '6px 2px', textAlign: 'center', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                      {lang === 'bilingual' ? 'المقرر / Plan' : t.plannedQty}
                    </th>
                    <th style={{ width: '60px', padding: '6px 2px', textAlign: 'center', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                      {lang === 'bilingual' ? 'اليوم / Today' : t.todayQty}
                    </th>
                    <th style={{ width: '65px', padding: '6px 2px', textAlign: 'center', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                      {lang === 'bilingual' ? 'المنفذ / Exec' : t.totalExecQty}
                    </th>
                    <th style={{ width: '65px', padding: '6px 2px', textAlign: 'center', borderRight: isRtl ? (includeFinancials ? 'none' : 'none') : (includeFinancials ? '1px solid #e2e8f0' : 'none'), borderLeft: isRtl ? (includeFinancials ? '1px solid #e2e8f0' : 'none') : 'none' }}>
                      {lang === 'bilingual' ? 'الإنجاز / %' : t.progressPercent}
                    </th>
                    {includeFinancials && (
                      <th style={{ width: '90px', padding: '6px 4px', textAlign: 'center' }}>
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
                          borderTop: '1px solid #e2e8f0'
                        }}
                      >
                        <td style={{ padding: '5px 2px', textAlign: 'center', fontWeight: 800, color: '#334155', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                          <span dir="ltr" className="pdf-tabular-num">{item.code}</span>
                        </td>
                        <td style={{ padding: '5px 8px', textAlign: isRtl ? 'right' : 'left', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', fontWeight: 600, color: '#0f172a', lineHeight: 1.35 }}>
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
                        <td style={{ padding: '5px 2px', textAlign: 'center', color: '#475569', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                          {itemUnit}
                        </td>
                        <td style={{ padding: '5px 2px', textAlign: 'center', fontWeight: 700, color: '#1e293b', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                          <span dir="ltr" className="pdf-tabular-num">{formatNumber(item.plannedQuantity)}</span>
                        </td>
                        <td style={{ padding: '5px 2px', textAlign: 'center', fontWeight: 800, color: '#b45309', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                          <span dir="ltr" className="pdf-tabular-num">+{formatNumber(item.todayQuantity)}</span>
                        </td>
                        <td style={{ padding: '5px 2px', textAlign: 'center', fontWeight: 800, color: '#0f172a', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                          <span dir="ltr" className="pdf-tabular-num">{formatNumber(totalExec)}</span>
                        </td>
                        <td style={{ padding: '5px 2px', textAlign: 'center', fontWeight: 800, whiteSpace: 'nowrap', borderRight: isRtl ? (includeFinancials ? 'none' : 'none') : (includeFinancials ? '1px solid #e2e8f0' : 'none'), borderLeft: isRtl ? (includeFinancials ? '1px solid #e2e8f0' : 'none') : 'none' }}>
                          <span dir="ltr" className="pdf-tabular-num" style={{ color: percent >= 100 ? '#047857' : '#1d4ed8', fontWeight: 800 }}>
                            {formatNumber(percent, 1)}%
                          </span>
                        </td>
                        {includeFinancials && (
                          <td style={{ padding: '5px 4px', textAlign: 'center', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                            <span dir="ltr" className="pdf-tabular-num">{formatCurrency(val, trProject.currency)}</span>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: '#f1f5f9', fontWeight: 800, fontSize: '9.5px', borderTop: '2px solid #cbd5e1' }}>
                    <td colSpan={2} style={{ padding: '6px 8px', textAlign: isRtl ? 'right' : 'left', borderRight: isRtl ? 'none' : '1px solid #cbd5e1', borderLeft: isRtl ? '1px solid #cbd5e1' : 'none', color: '#0f172a' }}>
                      {lang === 'bilingual' ? `${tAr.boqSummaryTitle} / ${tEn.boqSummaryTitle}` : t.boqSummaryTitle}
                    </td>
                    <td colSpan={4} style={{ padding: '6px 2px', textAlign: 'center', color: '#475569', borderRight: isRtl ? 'none' : '1px solid #cbd5e1', borderLeft: isRtl ? '1px solid #cbd5e1' : 'none' }}>
                      {workItems.length} {t.engineeringItems}
                    </td>
                    <td style={{ padding: '6px 2px', textAlign: 'center', fontWeight: 800, color: '#1d4ed8', borderRight: isRtl ? (includeFinancials ? 'none' : 'none') : (includeFinancials ? '1px solid #cbd5e1' : 'none'), borderLeft: isRtl ? (includeFinancials ? '1px solid #cbd5e1' : 'none') : 'none' }}>
                      <span dir="ltr" className="pdf-tabular-num">{formatNumber(projectMetrics.actualProgressPercent, 1)}%</span>
                    </td>
                    {includeFinancials && (
                      <td style={{ padding: '6px 4px', textAlign: 'center', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>
                        <span dir="ltr" className="pdf-tabular-num">{formatCurrency(projectMetrics.totalExecutedCost, trProject.currency)}</span>
                      </td>
                    )}
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </div>

        {/* BOTTOM SECTION: Page 1 Fixed Footer Bar */}
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
        padding: '28px 36px 20px 36px',
        margin: '0 auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* TOP SECTION: Continuity Header + Materials + Daily Log + Sign-offs */}
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
            <div style={{ textAlign: 'left', fontSize: '9.5px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '4px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>{t.date}: </span>
              <span style={{ fontWeight: 800, color: '#0f172a' }} dir="ltr" className="pdf-tabular-num">{reportDate}</span>
            </div>
          </div>
        </header>

        {/* SECTION 2: Materials & Inventory Table (Exact 722px Width Layout) */}
        <section style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 10px', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
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

          <div style={{ borderLeft: '1px solid #cbd5e1', borderRight: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', overflow: 'hidden' }}>
            <table style={{ width: '722px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#0f172a', borderBottom: '1px solid #cbd5e1', fontSize: '9px', fontWeight: 800 }}>
                  <th style={{ width: '222px', padding: '6px 8px', textAlign: isRtl ? 'right' : 'left', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                    {lang === 'bilingual' ? 'المادة والمواصفة / Material & Spec' : t.materialNameSpec}
                  </th>
                  <th style={{ width: '45px', padding: '6px 2px', textAlign: 'center', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                    {lang === 'bilingual' ? 'الوحدة / Unit' : t.unit}
                  </th>
                  <th style={{ width: '75px', padding: '6px 2px', textAlign: 'center', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                    {lang === 'bilingual' ? 'المطلوب / Req.' : t.totalRequired}
                  </th>
                  <th style={{ width: '75px', padding: '6px 2px', textAlign: 'center', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                    {lang === 'bilingual' ? 'المورّد / Deliv.' : t.totalDelivered}
                  </th>
                  <th style={{ width: '70px', padding: '6px 2px', textAlign: 'center', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                    {lang === 'bilingual' ? 'مستهلك اليوم / Today' : t.todayConsumed}
                  </th>
                  <th style={{ width: '75px', padding: '6px 2px', textAlign: 'center', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                    {lang === 'bilingual' ? 'المستهلك / Consumed' : t.totalConsumed}
                  </th>
                  <th style={{ width: '85px', padding: '6px 2px', textAlign: 'center', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none' }}>
                    {lang === 'bilingual' ? 'المتبقي / Stock' : t.remainingBalance}
                  </th>
                  <th style={{ width: '75px', padding: '6px 2px', textAlign: 'center' }}>
                    {lang === 'bilingual' ? 'الموقف / Status' : t.stockStatus}
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '9.5px' }}>
                {materials.map((mat, idx) => {
                  const remaining = mat.totalDelivered - mat.totalUsed;
                  const isLow = remaining <= mat.minThreshold;
                  const matName = getTranslatedMaterialName(mat.name, lang);
                  const matUnit = getTranslatedUnit(mat.unit, lang);

                  return (
                    <tr 
                      key={mat.id}
                      style={{ 
                        backgroundColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff',
                        borderTop: '1px solid #e2e8f0'
                      }}
                    >
                      <td style={{ padding: '5px 8px', textAlign: isRtl ? 'right' : 'left', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', fontWeight: 600, color: '#0f172a', lineHeight: 1.35 }}>
                        {lang === 'bilingual' ? (
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{mat.name}</div>
                            <div style={{ fontSize: '8.5px', color: '#64748b', fontStyle: 'italic' }} dir="ltr">
                              {getTranslatedMaterialName(mat.name, 'en')}
                            </div>
                          </div>
                        ) : (
                          matName
                        )}
                      </td>
                      <td style={{ padding: '5px 2px', textAlign: 'center', color: '#475569', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                        {matUnit}
                      </td>
                      <td style={{ padding: '5px 2px', textAlign: 'center', fontWeight: 700, color: '#1e293b', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                        <span dir="ltr" className="pdf-tabular-num">{formatNumber(mat.totalRequired)}</span>
                      </td>
                      <td style={{ padding: '5px 2px', textAlign: 'center', fontWeight: 800, color: '#1e3a8a', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                        <span dir="ltr" className="pdf-tabular-num">{formatNumber(mat.totalDelivered)}</span>
                      </td>
                      <td style={{ padding: '5px 2px', textAlign: 'center', fontWeight: 800, color: '#7e22ce', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                        <span dir="ltr" className="pdf-tabular-num">{formatNumber(mat.todayUsed)}</span>
                      </td>
                      <td style={{ padding: '5px 2px', textAlign: 'center', fontWeight: 700, color: '#1e293b', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                        <span dir="ltr" className="pdf-tabular-num">{formatNumber(mat.totalUsed)}</span>
                      </td>
                      <td style={{ padding: '5px 2px', textAlign: 'center', fontWeight: 800, color: '#0f172a', borderRight: isRtl ? 'none' : '1px solid #e2e8f0', borderLeft: isRtl ? '1px solid #e2e8f0' : 'none', whiteSpace: 'nowrap' }}>
                        <span dir="ltr" className="pdf-tabular-num">{formatNumber(remaining)}</span>
                      </td>
                      <td style={{ padding: '5px 2px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {isLow ? (
                          <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#be123c', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', padding: '2px 4px', borderRadius: '3px' }}>
                            {lang === 'bilingual' ? `${tAr.stockShortage} / ${tEn.stockShortage}` : t.stockShortage}
                          </span>
                        ) : (
                          <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#047857', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '2px 4px', borderRadius: '3px' }}>
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
        </section>

        {/* SECTION 3: Field Daily Logs & Observations */}
        {latestLog && (
          <section style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 10px', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
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

            <div style={{ borderLeft: '1px solid #cbd5e1', borderRight: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', padding: '8px 10px', backgroundColor: '#f8fafc', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px', fontSize: '9.5px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* Progress Summary */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0f172a', fontWeight: 800, marginBottom: '2px', paddingBottom: '2px', borderBottom: '1px solid #f1f5f9', fontSize: '10px' }}>
                  <ClipboardList style={{ width: '12px', height: '12px', color: '#2563eb' }} />
                  <span>{lang === 'bilingual' ? `${tAr.progressBlockTitle} / ${tEn.progressBlockTitle}` : t.progressBlockTitle}</span>
                </div>
                <p style={{ color: '#1e293b', lineHeight: 1.4, margin: 0 }}>
                  {latestLog.summary}
                </p>
                {lang === 'bilingual' && (
                  <p style={{ color: '#64748b', lineHeight: 1.35, fontSize: '8.5px', fontStyle: 'italic', margin: '2px 0 0 0' }} dir="ltr">
                    Site execution accomplished as scheduled with quality inspections conducted and approved.
                  </p>
                )}
              </div>

              {/* Obstacles & Corrective Actions */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0f172a', fontWeight: 800, marginBottom: '2px', paddingBottom: '2px', borderBottom: '1px solid #f1f5f9', fontSize: '10px' }}>
                  <AlertTriangle style={{ width: '12px', height: '12px', color: '#d97706' }} />
                  <span>{lang === 'bilingual' ? `${tAr.obstaclesBlockTitle} / ${tEn.obstaclesBlockTitle}` : t.obstaclesBlockTitle}</span>
                </div>
                <p style={{ color: '#1e293b', lineHeight: 1.4, margin: 0 }}>
                  {latestLog.obstacles || t.obstaclesDefault}
                </p>
                {lang === 'bilingual' && (
                  <p style={{ color: '#64748b', lineHeight: 1.35, fontSize: '8.5px', fontStyle: 'italic', margin: '2px 0 0 0' }} dir="ltr">
                    {tEn.obstaclesDefault}
                  </p>
                )}
              </div>

              {/* Safety & Quality Protocols */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0f172a', fontWeight: 800, marginBottom: '2px', paddingBottom: '2px', borderBottom: '1px solid #f1f5f9', fontSize: '10px' }}>
                  <ShieldCheck style={{ width: '12px', height: '12px', color: '#059669' }} />
                  <span>{lang === 'bilingual' ? `${tAr.hseBlockTitle} / ${tEn.hseBlockTitle}` : t.hseBlockTitle}</span>
                </div>
                <p style={{ color: '#1e293b', lineHeight: 1.4, margin: 0 }}>
                  {latestLog.safetyNotes || t.hseDefault}
                </p>
                {lang === 'bilingual' && (
                  <p style={{ color: '#64748b', lineHeight: 1.35, fontSize: '8.5px', fontStyle: 'italic', margin: '2px 0 0 0' }} dir="ltr">
                    {tEn.hseDefault}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: Official 3-Party Approvals & Signatures */}
        <section style={{ marginTop: '10px', paddingTop: '8px', borderTop: '2px solid #0f172a' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', textAlign: 'center' }}>
            {lang === 'bilingual' ? `${tAr.approvalsSectionTitle} / ${tEn.approvalsSectionTitle}` : t.approvalsSectionTitle}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', fontSize: '9.5px' }}>
            {/* Approval 1: Resident Engineer */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', minHeight: '115px' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '10.5px' }}>
                  {getApprovalTitle(approvals.approvalTitle1, 1)}
                </div>
                <div style={{ color: '#334155', marginTop: '2px', fontSize: '9.5px', fontWeight: 600 }}>
                  {getApprovalName(approvals.approvalName1, 1)}
                </div>
              </div>
              <div style={{ width: '100%', marginTop: '12px' }}>
                <div style={{ borderBottom: '2px dashed #94a3b8', width: '110px', margin: '0 auto' }}></div>
                <div style={{ fontSize: '8.5px', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
                  {t.signAndStamp}
                </div>
              </div>
            </div>

            {/* Approval 2: Contractor Rep */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', minHeight: '115px' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '10.5px' }}>
                  {getApprovalTitle(approvals.approvalTitle2, 2)}
                </div>
                <div style={{ color: '#334155', marginTop: '2px', fontSize: '9.5px', fontWeight: 600 }}>
                  {getApprovalName(approvals.approvalName2, 2)}
                </div>
              </div>
              <div style={{ width: '100%', marginTop: '12px' }}>
                <div style={{ borderBottom: '2px dashed #94a3b8', width: '110px', margin: '0 auto' }}></div>
                <div style={{ fontSize: '8.5px', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
                  {t.signAndStamp}
                </div>
              </div>
            </div>

            {/* Approval 3: Supervising Consultant */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', minHeight: '115px' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '10.5px' }}>
                  {getApprovalTitle(approvals.approvalTitle3, 3)}
                </div>
                <div style={{ color: '#334155', marginTop: '2px', fontSize: '9.5px', fontWeight: 600 }}>
                  {getApprovalName(approvals.approvalName3, 3)}
                </div>
              </div>
              <div style={{ width: '100%', marginTop: '12px' }}>
                <div style={{ borderBottom: '2px dashed #94a3b8', width: '110px', margin: '0 auto' }}></div>
                <div style={{ fontSize: '8.5px', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
                  {t.signAndStamp}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* BOTTOM SECTION: Page 2 Fixed Footer Bar */}
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
