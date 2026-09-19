export type LanguageMode = 'ar' | 'en' | 'bilingual';

export interface TranslationDict {
  systemTitle: string;
  systemSubTitle: string;
  badge: string;
  code: string;
  date: string;
  approvalStatus: string;
  approvedOfficial: string;
  technicalOnlyNotice: string;
  comprehensiveReportTitle: string;
  comprehensiveNoPriceReportTitle: string;
  dailyReportTitle: string;
  projectName: string;
  client: string;
  contractor: string;
  consultant: string;
  actualProgress: string;
  plannedProgress: string;
  scheduleIndex: string;
  aheadOfSchedule: string;
  scheduleDelay: string;
  executedValue: string;
  contractValue: string;
  workforce: string;
  workers: string;
  equipmentOperating: string;
  boqSectionTitle: string;
  totalItems: string;
  boqCode: string;
  boqDescription: string;
  unit: string;
  plannedQty: string;
  todayQty: string;
  totalExecQty: string;
  progressPercent: string;
  executedCost: string;
  boqSummaryTitle: string;
  engineeringItems: string;
  materialsSectionTitle: string;
  basicMaterials: string;
  materialNameSpec: string;
  totalRequired: string;
  totalDelivered: string;
  todayConsumed: string;
  totalConsumed: string;
  remainingBalance: string;
  stockStatus: string;
  stockShortage: string;
  stockAdequate: string;
  logsSectionTitle: string;
  documentedBy: string;
  progressBlockTitle: string;
  obstaclesBlockTitle: string;
  obstaclesDefault: string;
  hseBlockTitle: string;
  hseDefault: string;
  approvalsSectionTitle: string;
  signAndStamp: string;
  defaultApprovalTitle1: string;
  defaultApprovalName1: string;
  defaultApprovalTitle2: string;
  defaultApprovalName2: string;
  defaultApprovalTitle3: string;
  defaultApprovalName3: string;
  confidentialNotice: string;
  pageNumber: (current: number, total: number) => string;
}

export const translations: Record<'ar' | 'en', TranslationDict> = {
  ar: {
    systemTitle: 'محلّل البيانات الهندسي',
    systemSubTitle: 'منظومة المتابعة الفنية الميدانية وإدارة الكميات ونسب الإنجاز والمواد',
    badge: 'تقرير هندسي معتمد',
    code: 'كود المشروع:',
    date: 'تاريخ التحرير:',
    approvalStatus: 'حالة الاعتماد:',
    approvedOfficial: 'معتمد رسمي',
    technicalOnlyNotice: 'نسخة فنية (خالية من الأسعار)',
    comprehensiveReportTitle: 'تقرير المتابعة الفنية الشاملة لحصر الكميات والمواد والتكاليف',
    comprehensiveNoPriceReportTitle: 'تقرير المتابعة الفنية الميدانية لحصر الكميات ونسب الإنجاز',
    dailyReportTitle: 'التقرير اليومي المعتمد لسير الأعمال والأنشطة بالموقع',
    projectName: 'اسم المشروع:',
    client: 'الجهة المالكة (العميل):',
    contractor: 'المقاول العام المنفذ:',
    consultant: 'الاستشاري الهندسي المشرف:',
    actualProgress: 'نسبة الإنجاز الفعلي',
    plannedProgress: 'المخطط التعاقدي',
    scheduleIndex: 'مؤشر الجدول الزمني (SPI)',
    aheadOfSchedule: 'متقدم عن الجدول الزمني',
    scheduleDelay: 'انحراف زمني عن المخطط',
    executedValue: 'القيمة المنفذة للأعمال',
    contractValue: 'إجمالي قيمة العقد',
    workforce: 'القوة العاملة والمعدات',
    workers: 'فرد',
    equipmentOperating: 'معدات تشغيلية',
    boqSectionTitle: 'أولاً: جدول حصر الكميات ونسب الإنجاز التراكمية المعتمدة',
    totalItems: 'إجمالي البنود',
    boqCode: 'الكود',
    boqDescription: 'بيان وتوصيف الأعمال الهندسية',
    unit: 'الوحدة',
    plannedQty: 'الكمية المقررة',
    todayQty: 'منجز اليوم',
    totalExecQty: 'إجمالي المنفذ',
    progressPercent: 'نسبة الإنجاز',
    executedCost: 'القيمة المنفذة',
    boqSummaryTitle: 'المتوسط الوزني ونسب الإنجاز الكلية',
    engineeringItems: 'بنود أعمال هندسية',
    materialsSectionTitle: 'ثانياً: موقف المواد والتوريدات والمخزون الميداني بالموقع',
    basicMaterials: 'مواد أساسية',
    materialNameSpec: 'المادة والمواصفة الفنية',
    totalRequired: 'المطلوب كلياً',
    totalDelivered: 'المورّد للموقع',
    todayConsumed: 'مستهلك اليوم',
    totalConsumed: 'إجمالي المستهلك',
    remainingBalance: 'الرصيد المتبقي',
    stockStatus: 'موقف الكفاية',
    stockShortage: 'نقص بالمخزون',
    stockAdequate: 'كافٍ ومستقر',
    logsSectionTitle: 'ثالثاً: سجل الملاحظات التنفيذية واليوميات الميدانية',
    documentedBy: 'توثيق:',
    progressBlockTitle: 'سير الأعمال والمنجزات الميدانية:',
    obstaclesBlockTitle: 'المعوقات الميدانية والإجراءات التصحيحية:',
    obstaclesDefault: 'سير الأعمال يسير بانتظام تام، ولا توجد أي معوقات تؤثر على المسار الحرج للمشروع.',
    hseBlockTitle: 'السلامة والصحة المهنية والبيئة (HSE):',
    hseDefault: 'الالتزام التام بكافة تدابير واشتراطات السلامة المهنية ومهمات الوقاية الشخصية في الموقع.',
    approvalsSectionTitle: 'رابعاً: الاعتمادات والمصادقات الرسمية المعتمدة للمشروع',
    signAndStamp: 'التوقيع والختم الرسمي',
    defaultApprovalTitle1: 'مهندس الموقع المنفذ',
    defaultApprovalName1: 'أحمد هليل الذبياني',
    defaultApprovalTitle2: 'عن الشركة المنفذة',
    defaultApprovalName2: 'شركة إيكاد — مشروع تطوير مطار الأمير محمد بن عبدالعزيز الدولي',
    defaultApprovalTitle3: 'المكتب الاستشاري',
    defaultApprovalName3: 'المكتب الاستشاري للمشروع',
    confidentialNotice: 'وثيقة هندسية رسمية معتمدة — غير قابلة للتداول دون تصريح رسمي',
    pageNumber: (cur, tot) => `صفحة ${cur} من ${tot}`,
  },
  en: {
    systemTitle: 'Engineering Data Analyst',
    systemSubTitle: 'Site Technical Supervision, BOQ Tracking, Progress & Materials Management',
    badge: 'APPROVED ENGINEERING REPORT',
    code: 'Project Code:',
    date: 'Report Date:',
    approvalStatus: 'Status:',
    approvedOfficial: 'Official Approved',
    technicalOnlyNotice: 'Technical Edition (Prices Excluded)',
    comprehensiveReportTitle: 'Comprehensive Technical Report for BOQ, Materials & Cost Tracking',
    comprehensiveNoPriceReportTitle: 'Field Technical Progress & BOQ Execution Report',
    dailyReportTitle: 'Approved Daily Site Progress & Activities Report',
    projectName: 'Project Name:',
    client: 'Owner / Client:',
    contractor: 'Main Contractor:',
    consultant: 'Supervising Consultant:',
    actualProgress: 'Actual Progress',
    plannedProgress: 'Planned Target',
    scheduleIndex: 'Schedule Index (SPI)',
    aheadOfSchedule: 'Ahead of Schedule',
    scheduleDelay: 'Schedule Variance / Delay',
    executedValue: 'Executed Work Value',
    contractValue: 'Total Contract Value',
    workforce: 'Workforce & Equipment',
    workers: 'Workers',
    equipmentOperating: 'Operating Equipment',
    boqSectionTitle: 'Part 1: Bill of Quantities (BOQ) & Cumulative Progress',
    totalItems: 'Total Items',
    boqCode: 'Code',
    boqDescription: 'Engineering Work Description & Scope',
    unit: 'Unit',
    plannedQty: 'Planned Qty',
    todayQty: "Today's Qty",
    totalExecQty: 'Total Executed',
    progressPercent: 'Progress %',
    executedCost: 'Executed Value',
    boqSummaryTitle: 'Weighted Cumulative Progress Summary',
    engineeringItems: 'Engineering Work Items',
    materialsSectionTitle: 'Part 2: Site Materials, Deliveries & Inventory Status',
    basicMaterials: 'Major Materials',
    materialNameSpec: 'Material & Technical Specification',
    totalRequired: 'Total Required',
    totalDelivered: 'Delivered to Site',
    todayConsumed: "Today's Usage",
    totalConsumed: 'Total Consumed',
    remainingBalance: 'Remaining Stock',
    stockStatus: 'Stock Status',
    stockShortage: 'Low Stock Alert',
    stockAdequate: 'Stable & Adequate',
    logsSectionTitle: 'Part 3: Daily Site Observations & Execution Log',
    documentedBy: 'Logged by:',
    progressBlockTitle: 'Site Progress & Key Achievements:',
    obstaclesBlockTitle: 'Site Obstacles & Corrective Actions:',
    obstaclesDefault: 'Works are progressing smoothly on schedule with no critical path impediments.',
    hseBlockTitle: 'Health, Safety & Environment (HSE):',
    hseDefault: 'Full compliance with all HSE protocols, personal protective equipment (PPE), and site regulations.',
    approvalsSectionTitle: 'Part 4: Official Project Sign-offs & Certifications',
    signAndStamp: 'Signature & Official Stamp',
    defaultApprovalTitle1: 'Site Execution Engineer',
    defaultApprovalName1: 'Eng. Ahmad H. Al-Dhubyani',
    defaultApprovalTitle2: 'Main Contractor Representative',
    defaultApprovalName2: 'ICAD Co. — Madinah Int. Airport Development Project',
    defaultApprovalTitle3: 'Supervising Consultant',
    defaultApprovalName3: 'Project Engineering Consultant',
    confidentialNotice: 'Official Engineering Document — Confidential & Restricted Distribution',
    pageNumber: (cur, tot) => `Page ${cur} of ${tot}`,
  }
};

// Item descriptions translations dictionary
export const itemTranslations: Record<string, { enDesc: string; enUnit: string }> = {
  'BOQ-01': {
    enDesc: 'Excavation and site grading down to approved foundation formation levels',
    enUnit: 'm³',
  },
  'BOQ-02': {
    enDesc: 'Structural backfilling with selected engineered soil, compaction & density testing',
    enUnit: 'm³',
  },
  'BOQ-03': {
    enDesc: 'Plain blinding concrete beneath foundations (C20, 10cm thickness)',
    enUnit: 'm³',
  },
  'BOQ-04': {
    enDesc: 'Reinforced concrete for strip footings & isolated pads (C35 sulfate resistant)',
    enUnit: 'm³',
  },
  'BOQ-05': {
    enDesc: 'High-tensile steel reinforcement (Grade 60) for footings, necks & retaining walls',
    enUnit: 'ton',
  },
  'BOQ-06': {
    enDesc: 'Positive waterproofing for footings & column necks with bitumastic emulsion & 4mm membrane',
    enUnit: 'm²',
  },
  'BOQ-07': {
    enDesc: 'Solid and hollow concrete blockwork (20cm thick) for perimeter walls & partitions',
    enUnit: 'm²',
  },
  'BOQ-08': {
    enDesc: 'Under-slab water supply piping, storm drainage & grounding network installation',
    enUnit: 'l.m.',
  },
  'BOQ-09': {
    enDesc: 'Internal & external cementitious plastering and polymer-modified rendering',
    enUnit: 'm²',
  },
};

// Material names translations dictionary
export const materialTranslations: Record<string, { enName: string; enUnit: string }> = {
  // Exact names from defaultData
  'حديد تسليح سابك (أقطار مختلفة 8-25 ملم)': {
    enName: 'SABIC Steel Rebar (8-25mm Assorted Diameters)',
    enUnit: 'ton',
  },
  'خرسانة جاهزة C35 مقاوم للكبريتات SRC': {
    enName: 'Ready-Mix Concrete C35 (Sulfate Resistant SRC)',
    enUnit: 'm³',
  },
  'إسمنت بورتلاندي عادي (أكياس 50 كجم)': {
    enName: 'Ordinary Portland Cement (50kg Bags)',
    enUnit: 'bags',
  },
  'رمل أحمر مغسول ناعم للبناء واللياسة': {
    enName: 'Washed Red Sand for Plaster & Masonry',
    enUnit: 'm³',
  },
  'طابوق إسمنتي بركاني معزول (20×20×40)': {
    enName: 'Insulated Volcanic Concrete Blocks (20x20x40 cm)',
    enUnit: 'nos.',
  },
  'طابوق إسمنتي بركاني معزول (20x20x40)': {
    enName: 'Insulated Volcanic Concrete Blocks (20x20x40 cm)',
    enUnit: 'nos.',
  },
  'لفائف ممبرين عازل مائي 4 ملم بوليستر': {
    enName: 'Waterproofing Membrane 4mm Polyester',
    enUnit: 'rolls',
  },
  'مواسير صرف UPVC ضغط عالي قطر 6 بوصة': {
    enName: 'Heavy-Duty UPVC Drainage Pipes (6 inch)',
    enUnit: 'l.m.',
  },
  // Alternative names & additions
  'خرسانة جاهزة C35 مقاومة للأملاح': {
    enName: 'Ready-Mix Concrete C35 (Sulfate Resistant)',
    enUnit: 'm³',
  },
  'خرسانة عادية C20 للنظافة': {
    enName: 'Plain Blinding Concrete C20',
    enUnit: 'm³',
  },
  'حديد تسليح سابك (أقطار مختلفة)': {
    enName: 'SABIC Deformed Steel Rebar (Assorted Diameters)',
    enUnit: 'ton',
  },
  'لفائف عزل مائي بيتوميني (سماكة 4 ملم)': {
    enName: 'Bituminous Waterproofing Membrane (4mm thick)',
    enUnit: 'm²',
  },
  'بلوك أسمنتي مفرغ 20×20×40 سم': {
    enName: 'Hollow Concrete Blocks (20x20x40 cm)',
    enUnit: 'nos.',
  },
  'أنابيب صرف UPVC ضغط عالي 4 بوصة': {
    enName: 'Heavy-Duty UPVC Drainage Pipes (4 inch)',
    enUnit: 'l.m.',
  },
  'أسمنت بورتلاندي عادي (أكياس 50 كجم)': {
    enName: 'Ordinary Portland Cement (50kg bags)',
    enUnit: 'bags',
  },
  'رمل صبيز وتربة ردم مدرجة (A-1-a)': {
    enName: 'Selected Sub-base / Graded Backfill Soil (A-1-a)',
    enUnit: 'm³',
  },
};

export const unitTranslations: Record<string, string> = {
  'م³': 'm³',
  'م²': 'm²',
  'م.ط': 'l.m.',
  'طن': 'ton',
  'كجم': 'kg',
  'عدد': 'nos.',
  'حبة': 'nos.',
  'رول': 'rolls',
  'نقطة': 'pt.',
  'مقطوعية': 'lump sum',
  'كيس': 'bags',
};

export function getTranslatedUnit(unit: string, lang: LanguageMode): string {
  const en = unitTranslations[unit] || unit;
  if (lang === 'en') return en;
  if (lang === 'bilingual') return `${unit} (${en})`;
  return unit;
}

export function getTranslatedItemDesc(code: string, originalDesc: string, lang: LanguageMode): string {
  const tr = itemTranslations[code];
  if (!tr) return originalDesc;
  if (lang === 'en') return tr.enDesc;
  if (lang === 'bilingual') return `${originalDesc} / ${tr.enDesc}`;
  return originalDesc;
}

export function getTranslatedMaterialName(originalName: string, lang: LanguageMode): string {
  // Normalize string for lookup
  const cleanKey = originalName.trim();
  const tr = materialTranslations[cleanKey];

  if (tr) {
    if (lang === 'en') return tr.enName;
    if (lang === 'bilingual') return `${cleanKey} / ${tr.enName}`;
    return cleanKey;
  }

  // Fallback fuzzy search if key contains common keywords
  if (lang === 'en') {
    if (cleanKey.includes('حديد تسليح')) return 'Steel Rebar (Assorted Diameters)';
    if (cleanKey.includes('خرسانة جاهزة')) return 'Ready-Mix Concrete';
    if (cleanKey.includes('إسمنت') || cleanKey.includes('أسمنت')) return 'Portland Cement Bags';
    if (cleanKey.includes('رمل')) return 'Washed Sand Aggregate';
    if (cleanKey.includes('طابوق') || cleanKey.includes('بلوك') || cleanKey.includes('بلك')) return 'Concrete Masonry Blocks';
    if (cleanKey.includes('ممبرين') || cleanKey.includes('عزل')) return 'Waterproofing Membrane';
    if (cleanKey.includes('مواسير') || cleanKey.includes('أنابيب')) return 'Drainage Pipes';
    return cleanKey;
  }

  return cleanKey;
}

export function getTranslatedProjectInfo(project: {
  name: string;
  client: string;
  contractor: string;
  consultant: string;
  currency: string;
  location?: string;
}, lang: LanguageMode) {
  if (lang === 'ar') {
    return {
      name: project.name,
      client: project.client,
      contractor: project.contractor,
      consultant: project.consultant,
      currency: project.currency || 'ر.س',
      location: project.location || '',
    };
  }

  // English counterparts for default airport project
  const enName = project.name.includes('مطار') 
    ? 'Prince Mohammad bin Abdulaziz International Airport Development — Madinah'
    : project.name;
  const enClient = project.client.includes('الطيران') 
    ? 'General Authority of Civil Aviation (GACA)'
    : project.client;
  const enContractor = project.contractor.includes('إيكاد') 
    ? 'ICAD Construction Co.'
    : project.contractor;
  const enConsultant = project.consultant.includes('استشاري') 
    ? 'Project Engineering Consultant'
    : project.consultant;
  const enCurrency = (project.currency === 'ر.س' || !project.currency) ? 'SAR' : project.currency;
  const enLocation = project.location?.includes('المدينة') 
    ? 'Madinah, Kingdom of Saudi Arabia'
    : (project.location || '');

  if (lang === 'en') {
    return {
      name: enName,
      client: enClient,
      contractor: enContractor,
      consultant: enConsultant,
      currency: enCurrency,
      location: enLocation,
    };
  }

  // Bilingual: both
  return {
    name: `${project.name}\n${enName}`,
    client: `${project.client} / ${enClient}`,
    contractor: `${project.contractor} / ${enContractor}`,
    consultant: `${project.consultant} / ${enConsultant}`,
    currency: `${project.currency || 'ر.س'} (${enCurrency})`,
    location: `${project.location || ''} / ${enLocation}`,
  };
}
