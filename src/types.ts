export type WorkCategory = 
  | 'أعمال ترابية ومدنية'
  | 'خرسانات وأساسات'
  | 'عزل ومباني'
  | 'تشطيبات داخلية وخارجية'
  | 'كهروميكانيك وشبكات'
  | 'أعمال الموقع العام';

export type UnitType = 'م³' | 'م²' | 'م.ط' | 'طن' | 'كجم' | 'عدد' | 'نقطة' | 'مقطوعية';

export interface WorkItem {
  id: string;
  code: string;
  description: string;
  category: WorkCategory;
  unit: UnitType;
  plannedQuantity: number;
  previousQuantity: number;
  todayQuantity: number;
  unitRate: number; // سعر الوحدة التقديري
  plannedPercent: number; // النسبة المخططة المفترضة
  notes?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  totalRequired: number; // إجمالي الكمية المطلوبة للمشروع
  totalDelivered: number; // إجمالي المورد للموقع
  todayUsed: number; // المستهلك اليوم
  totalUsed: number; // إجمالي المستهلك حتى الآن
  minThreshold: number; // حد الطلب الأدنى
  costPerUnit: number; // تكلفة الوحدة
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  dayName: string;
  weather: string;
  temperature: number;
  laborCount: number;
  engineersCount: number;
  equipmentCount: number;
  dailyProgressGain: number; // % تقدم اليوم
  summary: string;
  obstacles: string;
  safetyNotes: string;
  loggedBy: string;
}

export interface ProjectInfo {
  name: string;
  code: string;
  location: string;
  client: string;
  contractor: string;
  consultant: string;
  siteEngineer: string;
  projectManager: string;
  startDate: string;
  targetEndDate: string;
  totalContractValue: number; // ريال / درهم / جنيه
  currency: string;
}

export interface DayProgressPoint {
  date: string;
  dayLabel: string;
  plannedCumulative: number;
  actualCumulative: number;
  dailyExecutedQty: number;
}
