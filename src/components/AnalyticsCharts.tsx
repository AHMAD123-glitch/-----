import React, { useState } from 'react';
import { WorkItem, MaterialItem, DailyLog } from '../types';
import { generateSCurveData, calculateProjectMetrics, formatNumber, formatCurrency } from '../utils/calculations';
import { 
  TrendingUp, 
  BarChart2, 
  Layers, 
  Package, 
  Calendar, 
  Info,
  ChevronLeft,
  Users
} from 'lucide-react';

interface AnalyticsChartsProps {
  workItems: WorkItem[];
  materials: MaterialItem[];
  dailyLogs: DailyLog[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  workItems,
  materials,
  dailyLogs,
}) => {
  const metrics = calculateProjectMetrics(workItems);
  const sCurvePoints = generateSCurveData(dailyLogs, metrics.actualProgressPercent);
  const [activeHoverPoint, setActiveHoverPoint] = useState<number | null>(null);

  // Group work items by category to calculate category completion
  const categories = Array.from(new Set(workItems.map((w) => w.category)));
  const categoryStats = categories.map((cat) => {
    const items = workItems.filter((w) => w.category === cat);
    const plannedCost = items.reduce((sum, i) => sum + i.plannedQuantity * i.unitRate, 0);
    const executedCost = items.reduce((sum, i) => {
      const totQty = i.previousQuantity + i.todayQuantity;
      return sum + Math.min(totQty, i.plannedQuantity) * i.unitRate;
    }, 0);
    const avgPercent = plannedCost > 0 ? (executedCost / plannedCost) * 100 : 0;
    return {
      category: cat,
      plannedCost,
      executedCost,
      percent: Number(avgPercent.toFixed(1)),
      itemCount: items.length,
    };
  });

  // Calculate S-Curve SVG dimensions
  const svgWidth = 720;
  const svgHeight = 260;
  const paddingX = 50;
  const paddingY = 40;
  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingY * 2;

  // Find min and max for chart scaling
  const allYValues = sCurvePoints.flatMap((p) => [p.actualCumulative, p.plannedCumulative]);
  const minY = Math.max(0, Math.floor(Math.min(...allYValues) / 10) * 10 - 5);
  const maxY = Math.min(100, Math.ceil(Math.max(...allYValues) / 10) * 10 + 5);
  const yRange = Math.max(10, maxY - minY);

  const getX = (index: number) => {
    if (sCurvePoints.length <= 1) return paddingX + innerWidth / 2;
    return paddingX + (index / (sCurvePoints.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return svgHeight - paddingY - ((clamped - minY) / yRange) * innerHeight;
  };

  // Generate path strings for SVG S-Curve
  const actualPath = sCurvePoints.reduce((acc, point, idx) => {
    const x = getX(idx);
    const y = getY(point.actualCumulative);
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
  }, '');

  const plannedPath = sCurvePoints.reduce((acc, point, idx) => {
    const x = getX(idx);
    const y = getY(point.plannedCumulative);
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
  }, '');

  // Fill area under actual path
  const areaPath = sCurvePoints.length > 0 
    ? `${actualPath} L ${getX(sCurvePoints.length - 1)} ${svgHeight - paddingY} L ${getX(0)} ${svgHeight - paddingY} Z`
    : '';

  return (
    <div className="space-y-6">
      {/* S-Curve Main Chart */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-700/80 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                منحنى الإنجاز التراكمي (S-Curve) — الفعلي مقابل المخطط
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              مقارنة مسار التقدم اليومي الفعلي مع خط الأساس المخطط للمشروع
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block shadow-sm shadow-blue-500/50" />
              <span className="text-slate-300 font-medium">الإنجاز الفعلي التراكمي</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-400 inline-block" />
              <span className="text-slate-400 font-medium">المخطط المعتمد</span>
            </div>
          </div>
        </div>

        {/* SVG Chart Container */}
        <div className="mt-4 w-full overflow-x-auto">
          <div className="min-w-[620px]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines & Y Axis Labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const val = minY + ratio * yRange;
                const yPos = svgHeight - paddingY - ratio * innerHeight;
                return (
                  <g key={i}>
                    <line
                      x1={paddingX}
                      y1={yPos}
                      x2={svgWidth - paddingX}
                      y2={yPos}
                      stroke="#334155"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 10}
                      y={yPos + 4}
                      textAnchor="end"
                      fill="#94a3b8"
                      fontSize="10"
                      fontFamily="JetBrains Mono, Cairo"
                    >
                      {formatNumber(val, 0)}%
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area under Actual Progress */}
              {areaPath && (
                <path d={areaPath} fill="url(#actualGradient)" />
              )}

              {/* Planned Line (Dashed Amber) */}
              {plannedPath && (
                <path
                  d={plannedPath}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                />
              )}

              {/* Actual Line (Solid Blue) */}
              {actualPath && (
                <path
                  d={actualPath}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              )}

              {/* Data Points */}
              {sCurvePoints.map((pt, idx) => {
                const x = getX(idx);
                const yAct = getY(pt.actualCumulative);
                const isHovered = activeHoverPoint === idx;

                return (
                  <g 
                    key={idx} 
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveHoverPoint(idx)}
                    onMouseLeave={() => setActiveHoverPoint(null)}
                  >
                    {/* Hover vertical indicator line */}
                    {isHovered && (
                      <line
                        x1={x}
                        y1={paddingY}
                        x2={x}
                        y2={svgHeight - paddingY}
                        stroke="#60a5fa"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Actual Point dot */}
                    <circle
                      cx={x}
                      cy={yAct}
                      r={isHovered ? 6 : 4}
                      fill="#3b82f6"
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      className="transition-all duration-200"
                    />

                    {/* X-axis label */}
                    <text
                      x={x}
                      y={svgHeight - 12}
                      textAnchor="middle"
                      fill={isHovered ? '#f8fafc' : '#94a3b8'}
                      fontSize="10"
                      fontWeight={isHovered ? '700' : '500'}
                      fontFamily="Cairo"
                    >
                      {pt.dayLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Hover / Selected Day Insight */}
        {activeHoverPoint !== null && sCurvePoints[activeHoverPoint] && (
          <div className="mt-3 p-3 bg-slate-900/90 border border-blue-500/30 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">
                يومية: {sCurvePoints[activeHoverPoint].dayLabel} ({sCurvePoints[activeHoverPoint].date})
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-blue-400">
                الإنجاز الفعلي: <strong>{formatNumber(sCurvePoints[activeHoverPoint].actualCumulative, 1)}%</strong>
              </span>
              <span className="text-amber-400">
                المخطط: <strong>{formatNumber(sCurvePoints[activeHoverPoint].plannedCumulative, 1)}%</strong>
              </span>
            </div>
            <div className="text-emerald-400 font-mono font-semibold">
              + {formatNumber(sCurvePoints[activeHoverPoint].dailyExecutedQty, 2)}% زيادة إنجاز اليوم
            </div>
          </div>
        )}
      </div>

      {/* Two Column Grid: Category Progress & Top Materials Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Completion Breakdown */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                نسبة الإنجاز حسب فئات الأعمال الهندسية
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {categories.length} فئات رئيسية
            </span>
          </div>

          <div className="space-y-4">
            {categoryStats.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-200">{item.category}</span>
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-700/50 px-1.5 py-0.5 rounded">
                      {item.itemCount} بنود
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-bold">
                      {formatNumber(item.percent, 1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      item.percent >= 90
                        ? 'bg-emerald-500'
                        : item.percent >= 60
                        ? 'bg-blue-500'
                        : item.percent >= 30
                        ? 'bg-amber-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(100, item.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Materials Consumption & Storage Level */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white">
                موقف استهلاك المواد الأساسية بالموقع
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">المستهلك vs المورّد</span>
          </div>

          <div className="space-y-4">
            {materials.slice(0, 5).map((mat) => {
              const remaining = mat.totalDelivered - mat.totalUsed;
              const usedPercent = mat.totalDelivered > 0 ? (mat.totalUsed / mat.totalDelivered) * 100 : 0;
              const isLow = remaining <= mat.minThreshold;

              return (
                <div key={mat.id} className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-700/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-200">{mat.name}</span>
                      {isLow && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-semibold border border-rose-500/30">
                          نقص مخزون
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-slate-300">
                      متبقي: <strong className={isLow ? 'text-rose-400' : 'text-emerald-400'}>{formatNumber(remaining)} {mat.unit}</strong>
                    </span>
                  </div>

                  {/* Dual bar: Used vs Remaining */}
                  <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden flex">
                    <div
                      className="bg-purple-500 h-2"
                      style={{ width: `${Math.min(100, usedPercent)}%` }}
                      title={`مستهلك: ${formatNumber(usedPercent, 1)}%`}
                    />
                    <div
                      className="bg-emerald-500/70 h-2"
                      style={{ width: `${Math.max(0, 100 - usedPercent)}%` }}
                      title="رصيد متوفر"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>مستهلك: {formatNumber(mat.totalUsed)} {mat.unit} ({formatNumber(usedPercent, 1)}%)</span>
                    <span>المورّد للموقع: {formatNumber(mat.totalDelivered)} {mat.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Progress & Workforce Bar */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              سجل الطاقة البشرية والمعدات وتقدم الأيام الأخيرة
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">آخر {dailyLogs.length} أيام عمل</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {dailyLogs.map((log) => (
            <div key={log.id} className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-semibold text-slate-200">{log.dayName.split(' ')[0]}</span>
                  <span className="font-mono text-[10px]">{log.temperature}°C</span>
                </div>
                <div className="text-xs text-slate-300 line-clamp-1">{log.weather}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-baseline justify-between">
                <span className="text-[10px] text-slate-400">الإنجاز:</span>
                <span className="text-xs font-bold font-mono text-amber-400">+{log.dailyProgressGain}%</span>
              </div>

              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span>العمالة:</span>
                <span className="font-semibold text-slate-300 font-mono">{log.laborCount} فرد</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
