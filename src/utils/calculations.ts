import { WorkItem, MaterialItem, DailyLog, DayProgressPoint } from '../types';

export function calculateProjectMetrics(workItems: WorkItem[]) {
  let totalPlannedCost = 0;
  let totalExecutedCost = 0;
  let weightedActualProgress = 0;
  let weightedPlannedProgress = 0;

  workItems.forEach((item) => {
    const itemTotalPlannedCost = item.plannedQuantity * item.unitRate;
    const totalExecutedQty = item.previousQuantity + item.todayQuantity;
    const itemActualCost = Math.min(totalExecutedQty, item.plannedQuantity) * item.unitRate;

    const actualPercent = item.plannedQuantity > 0 
      ? Math.min(100, (totalExecutedQty / item.plannedQuantity) * 100)
      : 0;

    totalPlannedCost += itemTotalPlannedCost;
    totalExecutedCost += itemActualCost;
    
    // Weighted progress by financial weight
    weightedActualProgress += actualPercent * itemTotalPlannedCost;
    weightedPlannedProgress += item.plannedPercent * itemTotalPlannedCost;
  });

  const actualProgressPercent = totalPlannedCost > 0 ? (weightedActualProgress / totalPlannedCost) : 0;
  const plannedProgressPercent = totalPlannedCost > 0 ? (weightedPlannedProgress / totalPlannedCost) : 0;
  const variance = actualProgressPercent - plannedProgressPercent;
  const spi = plannedProgressPercent > 0 ? (actualProgressPercent / plannedProgressPercent) : 1;

  return {
    totalPlannedCost,
    totalExecutedCost,
    actualProgressPercent: Number(actualProgressPercent.toFixed(1)),
    plannedProgressPercent: Number(plannedProgressPercent.toFixed(1)),
    variance: Number(variance.toFixed(1)),
    spi: Number(spi.toFixed(2)),
  };
}

export function calculateMaterialMetrics(materials: MaterialItem[]) {
  let lowStockAlertCount = 0;
  let totalMaterialValue = 0;
  let totalDeliveredValue = 0;
  let totalUsedValue = 0;

  materials.forEach((mat) => {
    const remainingInStock = mat.totalDelivered - mat.totalUsed;
    if (remainingInStock <= mat.minThreshold) {
      lowStockAlertCount++;
    }
    totalMaterialValue += mat.totalRequired * mat.costPerUnit;
    totalDeliveredValue += mat.totalDelivered * mat.costPerUnit;
    totalUsedValue += mat.totalUsed * mat.costPerUnit;
  });

  return {
    lowStockAlertCount,
    totalMaterialValue,
    totalDeliveredValue,
    totalUsedValue,
    overallConsumptionPercent: totalDeliveredValue > 0 ? (totalUsedValue / totalDeliveredValue) * 100 : 0,
  };
}

export function formatCurrency(amount: number, currency: string = 'ر.س'): string {
  return `${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${currency}`;
}

export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  });
}

export function generateSCurveData(dailyLogs: DailyLog[], currentActualProgress: number): DayProgressPoint[] {
  // Sort logs by date
  const sortedLogs = [...dailyLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const points: DayProgressPoint[] = [];
  let cumulativeActual = Math.max(0, currentActualProgress - sortedLogs.reduce((acc, log) => acc + log.dailyProgressGain, 0));
  let cumulativePlanned = cumulativeActual - 1.5;

  sortedLogs.forEach((log) => {
    cumulativeActual += log.dailyProgressGain;
    cumulativePlanned += (log.dailyProgressGain * 0.96) + 0.05; // realistic baseline plan

    points.push({
      date: log.date,
      dayLabel: log.dayName.split(' ')[0], // e.g. "الأحد"
      actualCumulative: Number(Math.min(100, cumulativeActual).toFixed(1)),
      plannedCumulative: Number(Math.min(100, cumulativePlanned).toFixed(1)),
      dailyExecutedQty: log.dailyProgressGain,
    });
  });

  return points;
}
