import { LanguageMode } from '../types';

export type CropSupplyStatus =
  | 'SELF_SUFFICIENT'
  | 'SURPLUS'
  | 'IMPORT_DEPENDENT'
  | 'HIGH_B2B_DEMAND'
  | 'SEASONAL_DEFICIT'
  | 'DEFICIT'
  | 'NEAR_SELF_SUFFICIENT'
  | 'BALANCED';

export interface CropDemandMetric {
  id: string;
  nameEn: string;
  nameBn: string;
  categoryEn: string;
  categoryBn: string;
  /** Annual demand in Million Metric Tons (1M MT = 1 Billion KG) */
  demandMillionMT: number;
  /** Annual domestic production in Million Metric Tons */
  productionMillionMT: number;
  /** Domestic production share (%) capped at 100 for bar visualization */
  domesticSharePct: number;
  /** Import gap (%) = max(0, 100 - effective domestic coverage) */
  importGapPct: number;
  /** Optional post-harvest loss percentage (e.g. Onion ~25%) */
  postHarvestLossPct?: number;
  status: CropSupplyStatus;
  statusLabelEn: string;
  statusLabelBn: string;
  noteEn: string;
  noteBn: string;
  keyDistrictsEn: string[];
  keyDistrictsBn: string[];
}

export interface AgroHubRegion {
  id: string;
  nameEn: string;
  nameBn: string;
  zoneTagEn: string;
  zoneTagBn: string;
  /** Approximate SVG coordinates on 0..400 x 0..500 Bangladesh stylized map */
  mapCoords: { x: number; y: number; radius: number };
  districtsEn: string[];
  districtsBn: string[];
  primaryCrops: {
    id: string;
    nameEn: string;
    nameBn: string;
    detailEn: string;
    detailBn: string;
  }[];
  peakHarvestWindowEn: string;
  peakHarvestWindowBn: string;
  coldStorageCapacityMT: number;
  coldStorageHubsCount: number;
  activeB2BBuyerDemandEn: string;
  activeB2BBuyerDemandBn: string;
  activeBuyersCount: number;
  monthlyDemandVolumeMT: number;
  highlightEn: string;
  highlightBn: string;
}

export type ForecastCategory = 'RAMADAN_SURGE' | 'INSTITUTIONAL_B2B';

export interface SixMonthForecastItem {
  id: string;
  cropNameEn: string;
  cropNameBn: string;
  subItemsEn?: string;
  subItemsBn?: string;
  category: ForecastCategory;
  categoryLabelEn: string;
  categoryLabelBn: string;
  peakMonthsEn: string;
  peakMonthsBn: string;
  growthMinPct: number;
  growthMaxPct: number;
  sourcingDistrictsEn: string[];
  sourcingDistrictsBn: string[];
  driverEn: string;
  driverBn: string;
  projectedVolumeMT: string;
  projectedVolumeBn: string;
  defaultListingCropEn: string;
  defaultListingCropBn: string;
  urgency: 'CRITICAL' | 'HIGH' | 'STRATEGIC';
}

export interface MonthlyDemandTrendPoint {
  monthKey: string;
  monthEn: string;
  monthBn: string;
  spicesAndIftarIndex: number;
  institutionalB2BIndex: number;
  seasonalFruitsIndex: number;
  eventTagEn?: string;
  eventTagBn?: string;
}

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/**
 * Formats a quantity given in Million Metric Tons into either KG or MT in EN or BN.
 * 1 Million MT = 1 Billion KG = 100 Crore KG = 10 Lakh MT.
 */
export function formatAgriQuantity(
  millionMT: number,
  unit: 'KG' | 'MT',
  lang: LanguageMode
): string {
  if (lang === 'BN') {
    if (unit === 'MT') {
      if (millionMT >= 10) {
        const croreMT = (millionMT / 10).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
        return `${toBengaliDigits(croreMT)} কোটি মে.টন`;
      }
      const lakhMT = (millionMT * 10).toFixed(1).replace(/\.0$/, '');
      return `${toBengaliDigits(lakhMT)} লক্ষ মে.টন`;
    }
    // KG in Crore KG (1M MT = 100 Crore KG)
    const croreKg = Math.round(millionMT * 100);
    return `${toBengaliDigits(croreKg.toLocaleString('en-US'))} কোটি কেজি`;
  }

  if (unit === 'MT') {
    const val = millionMT >= 1 ? millionMT.toFixed(1).replace(/\.0$/, '') : millionMT.toFixed(2).replace(/0$/, '');
    return `${val}M MT`;
  }

  // KG in English
  if (millionMT >= 1) {
    const val = millionMT.toFixed(1).replace(/\.0$/, '');
    return `${val}B KG`;
  }
  const millionKg = Math.round(millionMT * 1000);
  return `${millionKg.toLocaleString('en-US')}M KG`;
}

export const nationalCropDemandData: CropDemandMetric[] = [
  {
    id: 'rice',
    nameEn: 'Rice',
    nameBn: 'চাল',
    categoryEn: 'Staple Grain',
    categoryBn: 'প্রধান খাদ্যশস্য',
    demandMillionMT: 38.5,
    productionMillionMT: 40.0,
    domesticSharePct: 100,
    importGapPct: 0,
    status: 'SELF_SUFFICIENT',
    statusLabelEn: 'Self-Sufficient',
    statusLabelBn: 'স্বয়ংসম্পূর্ণ',
    noteEn: 'Boro (54%), Aman (38%), and Aus (8%) harvests sustain full domestic food security.',
    noteBn: 'বোরো (৫৪%), আমন (৩৮%) ও আউশ (৮%) উৎপাদনে পূর্ণ খাদ্য স্বয়ংসম্পূর্ণতা বজায় রয়েছে।',
    keyDistrictsEn: ['Dinajpur', 'Naogaon', 'Bogura', 'Sunamganj'],
    keyDistrictsBn: ['দিনাজপুর', 'নওগাঁ', 'বগুড়া', 'সুনামগঞ্জ']
  },
  {
    id: 'potato',
    nameEn: 'Potato',
    nameBn: 'আলু',
    categoryEn: 'Tuber / Cash Crop',
    categoryBn: 'কন্দাল ফসল',
    demandMillionMT: 8.8,
    productionMillionMT: 11.2,
    domesticSharePct: 100,
    importGapPct: 0,
    status: 'SURPLUS',
    statusLabelEn: 'Surplus',
    statusLabelBn: 'উদ্বৃত্ত',
    noteEn: '2.4M+ MT annual surplus requires cold-storage optimization and export expansion.',
    noteBn: 'বার্ষিক ২.৪+ মিলিয়ন মে.টন উদ্বৃত্ত থাকায় হিমাগার সংরক্ষণ ও রপ্তানি সম্প্রসারণ জরুরি।',
    keyDistrictsEn: ['Munshiganj', 'Bogura', 'Rangpur', 'Joypurhat'],
    keyDistrictsBn: ['মুন্সিগঞ্জ', 'বগুড়া', 'রংপুর', 'জয়পুরহাট']
  },
  {
    id: 'wheat',
    nameEn: 'Wheat',
    nameBn: 'গম',
    categoryEn: 'Staple Grain',
    categoryBn: 'খাদ্যশস্য',
    demandMillionMT: 8.0,
    productionMillionMT: 1.1,
    domesticSharePct: 14,
    importGapPct: 86,
    status: 'IMPORT_DEPENDENT',
    statusLabelEn: 'Import Dependent',
    statusLabelBn: 'আমদানি নির্ভর',
    noteEn: 'Rising bakery and urban flour demand drives 6.9M MT annual import volume.',
    noteBn: 'বেকারি ও আটা-ময়দার চাহিদা বৃদ্ধিতে বছরে প্রায় ৬৯ লক্ষ মে.টন আমদানি করতে হয়।',
    keyDistrictsEn: ['Thakurgaon', 'Dinajpur', 'Pabna', 'Faridpur'],
    keyDistrictsBn: ['ঠাকুরগাঁও', 'দিনাজপুর', 'পাবনা', 'ফরিদপুর']
  },
  {
    id: 'maize',
    nameEn: 'Maize',
    nameBn: 'ভুট্টা',
    categoryEn: 'Industrial & Feed',
    categoryBn: 'শিল্প ও ফিড শস্য',
    demandMillionMT: 7.5,
    productionMillionMT: 5.5,
    domesticSharePct: 73,
    importGapPct: 27,
    status: 'HIGH_B2B_DEMAND',
    statusLabelEn: 'High B2B Feed Demand',
    statusLabelBn: 'উচ্চ বি-টু-বি ফিড চাহিদা',
    noteEn: 'Poultry, dairy, and aquaculture feed mills absorb 85%+ of domestic commercial supply.',
    noteBn: 'পোল্ট্রি, ডেইরি ও মৎস্য খাদ্য কারখানায় দেশীয় ভুট্টার ৮৫%+ ব্যবহৃত হয়।',
    keyDistrictsEn: ['Dinajpur', 'Thakurgaon', 'Chuadanga', 'Lalmonirhat'],
    keyDistrictsBn: ['দিনাজপুর', 'ঠাকুরগাঁও', 'চুয়াডাঙ্গা', 'লালমনিরহাট']
  },
  {
    id: 'onion',
    nameEn: 'Onion',
    nameBn: 'পেঁয়াজ',
    categoryEn: 'Essential Spice',
    categoryBn: 'অত্যাবশ্যকীয় মসলা',
    demandMillionMT: 3.2,
    productionMillionMT: 3.4,
    domesticSharePct: 80,
    importGapPct: 20,
    postHarvestLossPct: 25,
    status: 'SEASONAL_DEFICIT',
    statusLabelEn: 'Seasonal Deficit',
    statusLabelBn: 'মৌসুমি ঘাটতি',
    noteEn: 'Gross output exceeds demand, but ~25% post-harvest storage loss creates Oct–Jan deficits.',
    noteBn: 'মোট উৎপাদন চাহিদার চেয়ে বেশি হলেও ~২৫% সংরক্ষণজনিত ক্ষতির কারণে মৌসুমি ঘাটতি তৈরি হয়।',
    keyDistrictsEn: ['Pabna', 'Faridpur', 'Rajbari', 'Kushtia'],
    keyDistrictsBn: ['পাবনা', 'ফরিদপুর', 'রাজবাড়ী', 'কুষ্টিয়া']
  },
  {
    id: 'lentil',
    nameEn: 'Lentil',
    nameBn: 'মসুর ডাল',
    categoryEn: 'Pulses / Protein',
    categoryBn: 'ডাল ও প্রোটিন',
    demandMillionMT: 0.65,
    productionMillionMT: 0.2,
    domesticSharePct: 31,
    importGapPct: 69,
    status: 'DEFICIT',
    statusLabelEn: 'Deficit',
    statusLabelBn: 'ঘাটতি',
    noteEn: 'High daily protein staple; BARI Masur-8 expansion aims to narrow the 450K MT gap.',
    noteBn: 'দৈনন্দিন প্রোটিনের প্রধান উৎস; বারি মসুর-৮ চাষে ৪.৫ লক্ষ মে.টন ঘাটতি কমানোর উদ্যোগ চলছে।',
    keyDistrictsEn: ['Faridpur', 'Jashore', 'Magura', 'Pabna'],
    keyDistrictsBn: ['ফরিদপুর', 'যশোর', 'মাগুরা', 'পাবনা']
  },
  {
    id: 'garlic',
    nameEn: 'Garlic',
    nameBn: 'রসুন',
    categoryEn: 'Essential Spice',
    categoryBn: 'মসলা জাতীয়',
    demandMillionMT: 0.68,
    productionMillionMT: 0.6,
    domesticSharePct: 88,
    importGapPct: 12,
    status: 'NEAR_SELF_SUFFICIENT',
    statusLabelEn: 'Near Self-Sufficient',
    statusLabelBn: 'প্রায় স্বয়ংসম্পূর্ণ',
    noteEn: 'Zero-tillage garlic cultivation in Chalan Beel supplies nearly 88% of national demand.',
    noteBn: 'চলনবিল এলাকায় বিনা-চাষে রসুন উৎপাদন জাতীয় চাহিদার প্রায় ৮৮% পূরণ করে।',
    keyDistrictsEn: ['Natore', 'Pabna', 'Rajshahi', 'Faridpur'],
    keyDistrictsBn: ['নাটোর', 'পাবনা', 'রাজশাহী', 'ফরিদপুর']
  },
  {
    id: 'dry-chili',
    nameEn: 'Dry Chili',
    nameBn: 'শুকনা মরিচ',
    categoryEn: 'Essential Spice',
    categoryBn: 'মসলা জাতীয়',
    demandMillionMT: 0.62,
    productionMillionMT: 0.61,
    domesticSharePct: 98,
    importGapPct: 2,
    status: 'BALANCED',
    statusLabelEn: 'Balanced',
    statusLabelBn: 'ভারসাম্যপূর্ণ',
    noteEn: 'Char-land winter chili & Bogura commercial clusters maintain near-equilibrium supply.',
    noteBn: 'বগুড়া ও চরাঞ্চলের মরিচ উৎপাদন জাতীয় চাহিদার সাথে প্রায় পূর্ণ ভারসাম্য বজায় রাখে।',
    keyDistrictsEn: ['Bogura', 'Jamalpur', 'Panchagarh', 'Cumilla'],
    keyDistrictsBn: ['বগুড়া', 'জামালপুর', 'পঞ্চগড়', 'কুমিল্লা']
  },
  {
    id: 'ginger',
    nameEn: 'Ginger',
    nameBn: 'আদা',
    categoryEn: 'Essential Spice',
    categoryBn: 'মসলা জাতীয়',
    demandMillionMT: 0.32,
    productionMillionMT: 0.15,
    domesticSharePct: 47,
    importGapPct: 53,
    status: 'IMPORT_DEPENDENT',
    statusLabelEn: 'Import Dependent',
    statusLabelBn: 'আমদানি নির্ভর',
    noteEn: 'Sack-ginger homestead farming & CHT hill cultivation are scaling to cut 53% import reliance.',
    noteBn: 'বস্তায় আদা চাষ ও পার্বত্য চট্টগ্রামে আবাদ বাড়িয়ে ৫৩% আমদানি নির্ভরতা কমানোর সুযোগ রয়েছে।',
    keyDistrictsEn: ['Rangamati', 'Khagrachari', 'Bandarban', 'Nilphamari'],
    keyDistrictsBn: ['রাঙামাটি', 'খাগড়াছড়ি', 'বান্দরবান', 'নীলফামারী']
  },
  {
    id: 'mustard-oil',
    nameEn: 'Mustard / Edible Oil',
    nameBn: 'সরিষা / ভোজ্যতেল',
    categoryEn: 'Oilseed',
    categoryBn: 'তৈলবীজ',
    demandMillionMT: 2.3,
    productionMillionMT: 0.35,
    domesticSharePct: 15,
    importGapPct: 85,
    status: 'IMPORT_DEPENDENT',
    statusLabelEn: 'Import Dependent',
    statusLabelBn: 'আমদানি নির্ভর',
    noteEn: 'National 3-year oilseed plan targets BARI Sarisha-14/18 expansion between Aman & Boro.',
    noteBn: 'আমন ও বোরোর মাঝে বারি সরিষা-১৪/১৮ আবাদ বাড়িয়ে ভোজ্যতেল আমদানি কমানোর লক্ষ্য নির্ধারিত।',
    keyDistrictsEn: ['Sirajganj', 'Tangail', 'Pabna', 'Manikganj'],
    keyDistrictsBn: ['সিরাজগঞ্জ', 'টাঙ্গাইল', 'পাবনা', 'মানিকগঞ্জ']
  }
];

export const regionalAgroHubs: AgroHubRegion[] = [
  {
    id: 'rajshahi-rangpur',
    nameEn: 'Rajshahi & Rangpur (North)',
    nameBn: 'রাজশাহী ও রংপুর (উত্তরাঞ্চল)',
    zoneTagEn: 'Grain, Tuber & Orchard Belt',
    zoneTagBn: 'শস্য, আলু ও ফলের প্রধান হাব',
    mapCoords: { x: 118, y: 122, radius: 34 },
    districtsEn: ['Dinajpur', 'Naogaon', 'Bogura', 'Rangpur', 'Thakurgaon', 'Rajshahi', 'Chapainawabganj'],
    districtsBn: ['দিনাজপুর', 'নওগাঁ', 'বগুড়া', 'রংপুর', 'ঠাকুরগাঁও', 'রাজশাহী', 'চাঁপাইনবাবগঞ্জ'],
    primaryCrops: [
      { id: 'rice', nameEn: 'Rice', nameBn: 'ধান/চাল', detailEn: 'Dinajpur & Naogaon aromatic & Boro hubs', detailBn: 'দিনাজপুর ও নওগাঁর সুগন্ধি ও বোরো চাল' },
      { id: 'potato', nameEn: 'Potato', nameBn: 'আলু', detailEn: 'Bogura, Rangpur & Munshiganj surplus cluster', detailBn: 'বগুড়া, রংপুর ও মুন্সিগঞ্জ আলু অঞ্চল' },
      { id: 'maize', nameEn: 'Maize', nameBn: 'ভুট্টা', detailEn: 'Dinajpur & Thakurgaon B2B feed belt', detailBn: 'দিনাজপুর ও ঠাকুরগাঁও ভুট্টা বলয়' },
      { id: 'mango', nameEn: 'Mango / Litchi', nameBn: 'আম ও লিচু', detailEn: 'Rajshahi & Chapainawabganj GI orchards', detailBn: 'রাজশাহী ও চাঁপাইনবাবগঞ্জের জিআই আম-লিচু' }
    ],
    peakHarvestWindowEn: 'Jan – Mar (Potato/Maize) · May – Jul (Mango/Boro)',
    peakHarvestWindowBn: 'জানুয়ারি – মার্চ (আলু/ভুট্টা) · মে – জুলাই (আম/বোরো)',
    coldStorageCapacityMT: 1850000,
    coldStorageHubsCount: 168,
    activeB2BBuyerDemandEn: 'Very High — Feed Mills, Rice Millers & Retail Chains',
    activeB2BBuyerDemandBn: 'অত্যধিক — ফিড মিল, অটো রাইস মিল ও সুপারশপ',
    activeBuyersCount: 142,
    monthlyDemandVolumeMT: 420000,
    highlightEn: 'Generates ~44% of national potato surplus and 62% of commercial Rabi maize.',
    highlightBn: 'দেশের মোট আলু উদ্বৃত্তের ~৪৪% এবং বাণিজ্যিক রবি ভুট্টার ৬২% এই অঞ্চল থেকে আসে।'
  },
  {
    id: 'faridpur-pabna',
    nameEn: 'Faridpur & Pabna Belt (Central-West)',
    nameBn: 'ফরিদপুর ও পাবনা অঞ্চল (মধ্য-পশ্চিম)',
    zoneTagEn: 'National Spice & Oilseed Core',
    zoneTagBn: 'জাতীয় মসলা ও তৈলবীজ কেন্দ্র',
    mapCoords: { x: 145, y: 245, radius: 28 },
    districtsEn: ['Pabna', 'Faridpur', 'Rajbari', 'Kushtia', 'Sirajganj'],
    districtsBn: ['পাবনা', 'ফরিদপুর', 'রাজবাড়ী', 'কুষ্টিয়া', 'সিরাজগঞ্জ'],
    primaryCrops: [
      { id: 'onion', nameEn: 'Onion', nameBn: 'পেঁয়াজ', detailEn: 'Pabna, Faridpur, Rajbari, Kushtia — 75% of national supply', detailBn: 'পাবনা, ফরিদপুর, রাজবাড়ী, কুষ্টিয়া — জাতীয় সরবরাহের ৭৫%' },
      { id: 'garlic', nameEn: 'Garlic', nameBn: 'রসুন', detailEn: 'Pabna & Chalan Beel zero-tillage garlic belt', detailBn: 'পাবনা ও চলনবিল বিনা-চাষ রসুন অঞ্চল' },
      { id: 'lentil', nameEn: 'Lentil', nameBn: 'মসুর ডাল', detailEn: 'Faridpur & Pabna BARI Masur pulse clusters', detailBn: 'ফরিদপুর ও পাবনার বারি মসুর ডাল হাব' },
      { id: 'mustard', nameEn: 'Mustard', nameBn: 'সরিষা', detailEn: 'Sirajganj & Pabna Chalan Beel mustard oil zone', detailBn: 'সিরাজগঞ্জ ও পাবনার সরিষা তেল অঞ্চল' }
    ],
    peakHarvestWindowEn: 'Feb – Apr (Hali Onion & Garlic) · Feb – Mar (Mustard/Lentil)',
    peakHarvestWindowBn: 'ফেব্রুয়ারি – এপ্রিল (হালি পেঁয়াজ ও রসুন) · ফেব্রুয়ারি – মার্চ (সরিষা/মসুর)',
    coldStorageCapacityMT: 420000,
    coldStorageHubsCount: 38,
    activeB2BBuyerDemandEn: 'Critical Surge — Wholesale Spice Markets & Storage Investors',
    activeB2BBuyerDemandBn: 'সর্বোচ্চ চাহিদা — পাইকারি মসলা বাজার ও সংরক্ষণ হাব',
    activeBuyersCount: 118,
    monthlyDemandVolumeMT: 265000,
    highlightEn: 'Accounts for 75% of Bangladesh’s domestic onion output; high ROI for ventilated model storage.',
    highlightBn: 'দেশের মোট পেঁয়াজ উৎপাদনের ৭৫% এই বেল্ট থেকে আসে; আধুনিক মডেল সংরক্ষণাগারের ব্যাপক চাহিদা।'
  },
  {
    id: 'jashore-cumilla-narsingdi',
    nameEn: 'Jashore, Cumilla & Narsingdi (Vegetable Belts)',
    nameBn: 'যশোর, কুমিল্লা ও নরসিংদী (সবজি বলয়)',
    zoneTagEn: 'High-Intensity Horticulture Corridor',
    zoneTagBn: 'বাণিজ্যিক শাকসবজি করিডোর',
    mapCoords: { x: 215, y: 270, radius: 30 },
    districtsEn: ['Jashore', 'Cumilla', 'Narsingdi', 'Bogura', 'Gazipur'],
    districtsBn: ['যশোর', 'কুমিল্লা', 'নরসিংদী', 'বগুড়া', 'গাজীপুর'],
    primaryCrops: [
      { id: 'tomato', nameEn: 'Tomato', nameBn: 'টমেটো', detailEn: 'Winter & summer-tolerant poly-shed varieties', detailBn: 'শীতকালীন ও গ্রীষ্মকালীন টমেটো' },
      { id: 'brinjal', nameEn: 'Brinjal', nameBn: 'বেগুন', detailEn: 'Ramadan peak supply from Jashore & Narsingdi', detailBn: 'যশোর ও নরসিংদী থেকে রমজানের বেগুন সরবরাহ' },
      { id: 'cauliflower', nameEn: 'Cauliflower & Gourds', nameBn: 'ফুলকপি ও লাউ-কুমড়া', detailEn: 'Cumilla & Narsingdi daily Dhaka truckloads', detailBn: 'কুমিল্লা ও নরসিংদী থেকে দৈনিক ঢাকামুখী সরবরাহ' },
      { id: 'banana', nameEn: 'Banana', nameBn: 'কলা', detailEn: 'Narsingdi Sagar & Sabri commercial orchards', detailBn: 'নরসিংদীর সাগর ও সবরি কলা বাগান' }
    ],
    peakHarvestWindowEn: 'Nov – Mar (Winter Vegetables) · Year-round (Banana/Gourds)',
    peakHarvestWindowBn: 'নভেম্বর – মার্চ (শীতের সবজি) · সারাবছর (কলা ও লাউ)',
    coldStorageCapacityMT: 310000,
    coldStorageHubsCount: 29,
    activeB2BBuyerDemandEn: 'High — Urban Superstores, Export Aggregators & Iftar Markets',
    activeB2BBuyerDemandBn: 'উচ্চ — সুপারশপ চেইন, রপ্তানিকারক ও ইফতার বাজার',
    activeBuyersCount: 164,
    monthlyDemandVolumeMT: 315000,
    highlightEn: 'Jashore alone supplies 60%+ of off-season commercial vegetables to Dhaka & Chattogram.',
    highlightBn: 'এককভাবে যশোর জেলা ঢাকা ও চট্টগ্রামের ৬০%+ অফ-সিজন বাণিজ্যিক সবজি সরবরাহ করে।'
  },
  {
    id: 'barishal-coastal',
    nameEn: 'Barishal & Southern Coastal Belt',
    nameBn: 'বরিশাল ও দক্ষিণাঞ্চল উপকূলীয় বলয়',
    zoneTagEn: 'Coastal Fruit, Pulse & Aman Zone',
    zoneTagBn: 'তরমুজ, ডাল ও আমন অঞ্চল',
    mapCoords: { x: 185, y: 375, radius: 28 },
    districtsEn: ['Barishal', 'Patuakhali', 'Bhola', 'Barguna', 'Pirojpur'],
    districtsBn: ['বরিশাল', 'পটুয়াখালী', 'ভোলা', 'বরগুনা', 'পিরোজপুর'],
    primaryCrops: [
      { id: 'watermelon', nameEn: 'Watermelon', nameBn: 'তরমুজ', detailEn: 'Patuakhali & Bhola summer riverine mega-hub', detailBn: 'পটুয়াখালী ও ভোলার বৃহত্তম তরমুজ হাব' },
      { id: 'muskmelon', nameEn: 'Muskmelon (Bangi)', nameBn: 'বাঙ্গি', detailEn: 'High-demand Ramadan & summer cooling fruit', detailBn: 'রমজান ও গ্রীষ্মের চাহিদাসম্পন্ন বাঙ্গি' },
      { id: 'mung', nameEn: 'Mung Bean', nameBn: 'মুগ ডাল', detailEn: 'Barishal & Patuakhali post-Aman coastal pulse', detailBn: 'বরিশাল ও পটুয়াখালীর উপকূলীয় মুগ ডাল' },
      { id: 'aman', nameEn: 'Aman Rice', nameBn: 'আমন ধান', detailEn: 'Saline-tolerant coastal paddy varieties', detailBn: 'লবণাক্ততা সহনশীল উপকূলীয় আমন ধান' }
    ],
    peakHarvestWindowEn: 'Mar – May (Watermelon/Mung Bean) · Nov – Dec (Aman)',
    peakHarvestWindowBn: 'মার্চ – মে (তরমুজ ও মুগ ডাল) · নভেম্বর – ডিসেম্বর (আমন)',
    coldStorageCapacityMT: 95000,
    coldStorageHubsCount: 12,
    activeB2BBuyerDemandEn: 'Strong Seasonal Spike — River-to-Wholesale Bulk Freight',
    activeB2BBuyerDemandBn: 'তীব্র মৌসুমি চাহিদা — নৌ ও সড়কপথে পাইকারি চালান',
    activeBuyersCount: 79,
    monthlyDemandVolumeMT: 185000,
    highlightEn: 'Patuakhali & Bhola produce over 70% of Bangladesh’s commercial summer watermelon.',
    highlightBn: 'পটুয়াখালী ও ভোলা দেশের বাণিজ্যিক গ্রীষ্মকালীন তরমুজের ৭০%-এর বেশি উৎপাদন করে।'
  },
  {
    id: 'sylhet-haor',
    nameEn: 'Sylhet & Haor Basin',
    nameBn: 'সিলেট ও হাওর অববাহিকা',
    zoneTagEn: 'Early Boro & Aromatic Citrus Zone',
    zoneTagBn: 'আগাম বোরো ও লেবু-কমলা অঞ্চল',
    mapCoords: { x: 295, y: 175, radius: 28 },
    districtsEn: ['Sunamganj', 'Kishoreganj', 'Netrokona', 'Sylhet', 'Moulvibazar'],
    districtsBn: ['সুনামগঞ্জ', 'কিশোরগঞ্জ', 'নেত্রকোনা', 'সিলেট', 'মৌলভীবাজার'],
    primaryCrops: [
      { id: 'boro', nameEn: 'Early Boro Rice', nameBn: 'আগাম বোরো ধান', detailEn: 'Sunamganj, Kishoreganj & Netrokona Haor granary', detailBn: 'সুনামগঞ্জ, কিশোরগঞ্জ ও নেত্রকোনার হাওর শস্যভাণ্ডার' },
      { id: 'lemon', nameEn: 'Citrus / Lemon', nameBn: 'লেবু ও সাইট্রাস', detailEn: 'Sreemangal GI-grade Zara & Elachi lemons', detailBn: 'শ্রীমঙ্গলের জারা ও এলাচি লেবু' },
      { id: 'pepper', nameEn: 'Greenhouse Bell Pepper', nameBn: 'গ্রিনহাউজ ক্যাপসিকাম', detailEn: 'Moulvibazar high-value specialty horticulture', detailBn: 'মৌলভীবাজারের উচ্চমূল্যের ক্যাপসিকাম' }
    ],
    peakHarvestWindowEn: 'Apr – May (Early Haor Boro) · Feb – Jul (Sreemangal Lemon)',
    peakHarvestWindowBn: 'এপ্রিল – মে (আগাম হাওর বোরো) · ফেব্রুয়ারি – জুলাই (শ্রীমঙ্গল লেবু)',
    coldStorageCapacityMT: 140000,
    coldStorageHubsCount: 16,
    activeB2BBuyerDemandEn: 'Priority Procurement — Govt Food Silos & Export Citrus Buyers',
    activeB2BBuyerDemandBn: 'অগ্রাধিকার সংগ্রহ — সরকারি খাদ্যগুদাম ও সাইট্রাস ক্রেতা',
    activeBuyersCount: 84,
    monthlyDemandVolumeMT: 230000,
    highlightEn: 'Haor districts deliver the nation’s earliest Boro rice harvest in April, stabilizing pre-monsoon prices.',
    highlightBn: 'হাওরাঞ্চল এপ্রিলে দেশের প্রথম বোরো ধান সরবরাহ করে প্রাক-বর্ষা চালের বাজার স্থিতিশীল রাখে।'
  },
  {
    id: 'chattogram-hill-tracts',
    nameEn: 'Chattogram Hill Tracts',
    nameBn: 'পার্বত্য চট্টগ্রাম অঞ্চল',
    zoneTagEn: 'High-Value Hill Spices & Fruits',
    zoneTagBn: 'পাহাড়ি মসলা ও ফল হাব',
    mapCoords: { x: 325, y: 345, radius: 28 },
    districtsEn: ['Rangamati', 'Khagrachari', 'Bandarban'],
    districtsBn: ['রাঙামাটি', 'খাগড়াছড়ি', 'বান্দরবান'],
    primaryCrops: [
      { id: 'ginger', nameEn: 'Hill Ginger', nameBn: 'পাহাড়ি আদা', detailEn: 'Organic high-oil aroma ginger varieties', detailBn: 'উচ্চ সুগন্ধিযুক্ত জৈব পাহাড়ি আদা' },
      { id: 'turmeric', nameEn: 'Turmeric', nameBn: 'হলুদ', detailEn: 'High-curcumin Khagrachari & Bandarban turmeric', detailBn: 'উচ্চ কারকিউমিন সমৃদ্ধ খাগড়াছড়ি ও বান্দরবানের হলুদ' },
      { id: 'pineapple', nameEn: 'Honey Queen Pineapple', nameBn: 'হানি কুইন আনারস', detailEn: 'Rangamati Naniarchar GI-quality pineapple', detailBn: 'রাঙামাটির নানিয়ারচরের বিখ্যাত হানি কুইন আনারস' },
      { id: 'spices', nameEn: 'Hill Spices & Cashew', nameBn: 'পাহাড়ি মসলা ও কাজু', detailEn: 'Emerging agro-processing & export value chain', detailBn: 'উদীয়মান কৃষি-প্রক্রিয়াজাত ও রপ্তানি পণ্য' }
    ],
    peakHarvestWindowEn: 'Nov – Feb (Ginger/Turmeric) · May – Aug (Pineapple)',
    peakHarvestWindowBn: 'নভেম্বর – ফেব্রুয়ারি (আদা/হলুদ) · মে – আগস্ট (আনারস)',
    coldStorageCapacityMT: 65000,
    coldStorageHubsCount: 9,
    activeB2BBuyerDemandEn: 'High Margin — Spice Processors & Organic Retail Brands',
    activeB2BBuyerDemandBn: 'উচ্চ মুনাফা — মসলা প্রক্রিয়াজাত কোম্পানি ও অর্গানিক ব্র্যান্ড',
    activeBuyersCount: 63,
    monthlyDemandVolumeMT: 92000,
    highlightEn: 'Produces premium high-curcumin turmeric and aromatic hill ginger prized by spice processors.',
    highlightBn: 'দেশের অন্যতম সেরা কারকিউমিন সমৃদ্ধ হলুদ ও সুগন্ধি পাহাড়ি আদা এখান থেকে সংগৃহীত হয়।'
  }
];

export const sixMonthForecastTimeline: MonthlyDemandTrendPoint[] = [
  {
    monthKey: '2026-11',
    monthEn: 'Nov 2026',
    monthBn: 'নভে ২০২৬',
    spicesAndIftarIndex: 102,
    institutionalB2BIndex: 105,
    seasonalFruitsIndex: 82
  },
  {
    monthKey: '2026-12',
    monthEn: 'Dec 2026',
    monthBn: 'ডিসে ২০২৬',
    spicesAndIftarIndex: 108,
    institutionalB2BIndex: 112,
    seasonalFruitsIndex: 86
  },
  {
    monthKey: '2027-01',
    monthEn: 'Jan 2027',
    monthBn: 'জানু ২০২৭',
    spicesAndIftarIndex: 118,
    institutionalB2BIndex: 120,
    seasonalFruitsIndex: 94
  },
  {
    monthKey: '2027-02',
    monthEn: 'Feb 2027',
    monthBn: 'ফেব ২০২৭',
    spicesAndIftarIndex: 142,
    institutionalB2BIndex: 128,
    seasonalFruitsIndex: 116,
    eventTagEn: 'Ramadan Begins',
    eventTagBn: 'রমজান শুরু'
  },
  {
    monthKey: '2027-03',
    monthEn: 'Mar 2027',
    monthBn: 'মার্চ ২০২৭',
    spicesAndIftarIndex: 145,
    institutionalB2BIndex: 134,
    seasonalFruitsIndex: 136,
    eventTagEn: 'Ramadan Peak & Eid',
    eventTagBn: 'রমজান ও ঈদ'
  },
  {
    monthKey: '2027-04',
    monthEn: 'Apr 2027',
    monthBn: 'এপ্রি ২০২৭',
    spicesAndIftarIndex: 114,
    institutionalB2BIndex: 144,
    seasonalFruitsIndex: 142,
    eventTagEn: 'Boro & Summer Peak',
    eventTagBn: 'বোরো ও গ্রীষ্ম'
  },
  {
    monthKey: '2027-05',
    monthEn: 'May 2027',
    monthBn: 'মে ২০২৭',
    spicesAndIftarIndex: 110,
    institutionalB2BIndex: 140,
    seasonalFruitsIndex: 138
  }
];

export const sixMonthForecastItems: SixMonthForecastItem[] = [
  {
    id: 'ramadan-spices',
    cropNameEn: 'Ramadan Core Spices (Onion, Garlic, Ginger, Green Chili)',
    cropNameBn: 'রমজানের মূল মসলা (পেঁয়াজ, রসুন, আদা, কাঁচা মরিচ)',
    subItemsEn: 'Murikata & Early Hali Onion · Chalan Beel Garlic · Hill Ginger',
    subItemsBn: 'মুড়িকাটা ও আগাম হালি পেঁয়াজ · চলনবিল রসুন · পাহাড়ি আদা',
    category: 'RAMADAN_SURGE',
    categoryLabelEn: 'Ramadan Surge',
    categoryLabelBn: 'রমজান চাহিদা বৃদ্ধি',
    peakMonthsEn: 'Feb – Mar 2027',
    peakMonthsBn: 'ফেব্রুয়ারি – মার্চ ২০২৭',
    growthMinPct: 35,
    growthMaxPct: 45,
    sourcingDistrictsEn: ['Pabna', 'Faridpur', 'Rajbari', 'Natore', 'Rangamati'],
    sourcingDistrictsBn: ['পাবনা', 'ফরিদপুর', 'রাজবাড়ী', 'নাটোর', 'রাঙামাটি'],
    driverEn: 'Household Iftar cooking & restaurant bulk stocking trigger a +35% to +45% pre-Ramadan surge.',
    driverBn: 'রমজানের ইফতার ও হোটেল-রেস্তোরাঁর মজুদের কারণে চাহিদা +৩৫% থেকে +৪৫% পর্যন্ত বৃদ্ধি পায়।',
    projectedVolumeMT: '1.15M MT (60-day peak)',
    projectedVolumeBn: '১১.৫ লক্ষ মে.টন (৬০ দিন)',
    defaultListingCropEn: 'Hali Onion & Garlic Bundle',
    defaultListingCropBn: 'হালি পেঁয়াজ ও রসুন',
    urgency: 'CRITICAL'
  },
  {
    id: 'ramadan-iftar-pulses',
    cropNameEn: 'Iftar Pulses (Chickpeas / ছোলা & Lentils / মসুর ডাল)',
    cropNameBn: 'ইফতার ডাল (ছোলা ও মসুর ডাল)',
    subItemsEn: 'Deshi Chickpea · BARI Masur-8 Red Lentil',
    subItemsBn: 'দেশি ছোলা · বারি মসুর-৮ ডাল',
    category: 'RAMADAN_SURGE',
    categoryLabelEn: 'Ramadan Surge',
    categoryLabelBn: 'রমজান চাহিদা বৃদ্ধি',
    peakMonthsEn: 'Feb – Mar 2027',
    peakMonthsBn: 'ফেব্রুয়ারি – মার্চ ২০২৭',
    growthMinPct: 38,
    growthMaxPct: 45,
    sourcingDistrictsEn: ['Faridpur', 'Jashore', 'Magura', 'Kushtia'],
    sourcingDistrictsBn: ['ফরিদপুর', 'যশোর', 'মাগুরা', 'কুষ্টিয়া'],
    driverEn: 'Highest annual per-capita pulse consumption window driven by daily Iftar platters nationwide.',
    driverBn: 'দেশব্যাপী প্রতিদিনের ইফতারে ছোলা ও মসুর ডালের সর্বোচ্চ বার্ষিক চাহিদা সৃষ্টি হয়।',
    projectedVolumeMT: '260K MT (Ramadan window)',
    projectedVolumeBn: '২.৬ লক্ষ মে.টন (রমজান মৌসুম)',
    defaultListingCropEn: 'BARI Masur-8 Lentil',
    defaultListingCropBn: 'বারি মসুর-৮ ডাল',
    urgency: 'CRITICAL'
  },
  {
    id: 'ramadan-iftar-fresh',
    cropNameEn: 'Iftar Fresh Produce (Cucumber, Brinjal, Tomato, Lemon)',
    cropNameBn: 'ইফতারের তাজা সবজি ও লেবু (শসা, বেগুন, টমেটো, লেবু)',
    subItemsEn: 'Beguni Brinjal · Salad Cucumber · Vine Tomato · Zara/Elachi Lemon',
    subItemsBn: 'বেগুন · শসা · টমেটো · জারা ও এলাচি লেবু',
    category: 'RAMADAN_SURGE',
    categoryLabelEn: 'Ramadan Surge',
    categoryLabelBn: 'রমজান চাহিদা বৃদ্ধি',
    peakMonthsEn: 'Feb – Mar 2027',
    peakMonthsBn: 'ফেব্রুয়ারি – মার্চ ২০২৭',
    growthMinPct: 30,
    growthMaxPct: 42,
    sourcingDistrictsEn: ['Jashore', 'Narsingdi', 'Cumilla', 'Moulvibazar (Sreemangal)'],
    sourcingDistrictsBn: ['যশোর', 'নরসিংদী', 'কুমিল্লা', 'মৌলভীবাজার (শ্রীমঙ্গল)'],
    driverEn: 'Daily perishables see immediate farmgate-to-city price elasticity during Ramadan afternoons.',
    driverBn: 'রমজানে প্রতিদিন বিকেলের ইফতার বাজারে টাটকা বেগুন, শসা, টমেটো ও লেবুর চাহিদা +৩০–৪২% বাড়ে।',
    projectedVolumeMT: '640K MT (Peak 6 weeks)',
    projectedVolumeBn: '৬.৪ লক্ষ মে.টন (৬ সপ্তাহ)',
    defaultListingCropEn: 'Sreemangal Lemon & Fresh Brinjal',
    defaultListingCropBn: 'শ্রীমঙ্গল লেবু ও তাজা বেগুন',
    urgency: 'CRITICAL'
  },
  {
    id: 'summer-melons',
    cropNameEn: 'Seasonal Fruits (Watermelon & Muskmelon / তরমুজ ও বাঙ্গি)',
    cropNameBn: 'গ্রীষ্মকালীন ফল (তরমুজ ও বাঙ্গি)',
    subItemsEn: 'Patuakhali Giant Watermelon · Bhola Riverine Muskmelon',
    subItemsBn: 'পটুয়াখালীর তরমুজ · ভোলার বাঙ্গি',
    category: 'INSTITUTIONAL_B2B',
    categoryLabelEn: 'Spring/Summer Surge',
    categoryLabelBn: 'বসন্ত/গ্রীষ্মকালীন চাহিদা',
    peakMonthsEn: 'Mar – May 2027',
    peakMonthsBn: 'মার্চ – মে ২০২৭',
    growthMinPct: 32,
    growthMaxPct: 44,
    sourcingDistrictsEn: ['Patuakhali', 'Bhola', 'Barishal', 'Barguna'],
    sourcingDistrictsBn: ['পটুয়াখালী', 'ভোলা', 'বরিশাল', 'বরগুনা'],
    driverEn: 'Overlap of late Ramadan/Eid and rising April temperatures drives peak urban hydration demand.',
    driverBn: 'রমজানের শেষভাগ ও এপ্রিলের তীব্র গরমে সারাদেশে তরমুজ ও বাঙ্গির ব্যাপক চাহিদা তৈরি হয়।',
    projectedVolumeMT: '510K MT',
    projectedVolumeBn: '৫.১ লক্ষ মে.টন',
    defaultListingCropEn: 'Coastal Watermelon (Patuakhali Grade A)',
    defaultListingCropBn: 'পটুয়াখালীর গ্রেড-এ তরমুজ',
    urgency: 'HIGH'
  },
  {
    id: 'rabi-maize-b2b',
    cropNameEn: 'Rabi Maize (Poultry & Aquaculture Feed Mills)',
    cropNameBn: 'রবি ভুট্টা (পোল্ট্রি ও মৎস্য ফিড মিল)',
    subItemsEn: 'Dry-Grain Yellow Maize (<14% Moisture) for Institutional Mill Contracts',
    subItemsBn: 'শুকনো হলুদ ভুট্টা (<১৪% আর্দ্রতা) প্রাতিষ্ঠানিক ফিড মিলের জন্য',
    category: 'INSTITUTIONAL_B2B',
    categoryLabelEn: 'Institutional B2B',
    categoryLabelBn: 'প্রাতিষ্ঠানিক বি-টু-বি',
    peakMonthsEn: 'Mar – May 2027',
    peakMonthsBn: 'মার্চ – মে ২০২৭',
    growthMinPct: 24,
    growthMaxPct: 34,
    sourcingDistrictsEn: ['Dinajpur', 'Thakurgaon', 'Lalmonirhat', 'Chuadanga'],
    sourcingDistrictsBn: ['দিনাজপুর', 'ঠাকুরগাঁও', 'লালমনিরহাট', 'চুয়াডাঙ্গা'],
    driverEn: 'Commercial feed mills lock multi-ton forward escrow contracts during peak March–May Rabi harvest.',
    driverBn: 'মার্চ–মে মাসে বড় ফিড মিলগুলো ফরওয়ার্ড এসক্রো চুক্তির মাধ্যমে সরাসরি কৃষকের ভুট্টা সংগ্রহ করে।',
    projectedVolumeMT: '3.2M MT (Rabi season)',
    projectedVolumeBn: '৩২ লক্ষ মে.টন (রবি মৌসুম)',
    defaultListingCropEn: 'Dry Yellow Rabi Maize',
    defaultListingCropBn: 'রবি হলুদ ভুট্টা',
    urgency: 'STRATEGIC'
  },
  {
    id: 'boro-paddy-procurement',
    cropNameEn: 'Boro Paddy / Rice (Govt & Auto-Miller Procurement)',
    cropNameBn: 'বোরো ধান ও চাল (সরকারি ও অটো-মিলার সংগ্রহ)',
    subItemsEn: 'BRRI dhan-28, BRRI dhan-89, Bangabandhu dhan-100',
    subItemsBn: 'ব্রি ধান-২৮, ব্রি ধান-৮৯, বঙ্গবন্ধু ধান-১০০',
    category: 'INSTITUTIONAL_B2B',
    categoryLabelEn: 'Institutional B2B',
    categoryLabelBn: 'প্রাতিষ্ঠানিক বি-টু-বি',
    peakMonthsEn: 'Apr – May 2027',
    peakMonthsBn: 'এপ্রিল – মে ২০২৭',
    growthMinPct: 28,
    growthMaxPct: 38,
    sourcingDistrictsEn: ['Sunamganj', 'Kishoreganj', 'Netrokona', 'Dinajpur', 'Naogaon'],
    sourcingDistrictsBn: ['সুনামগঞ্জ', 'কিশোরগঞ্জ', 'নেত্রকোনা', 'দিনাজপুর', 'নওগাঁ'],
    driverEn: 'Annual national food silo replenishment and commercial auto-rice mill stocking open in April.',
    driverBn: 'এপ্রিল–মে মাসে সরকারি খাদ্যগুদাম ও অটো রাইস মিলগুলোর সবচেয়ে বড় ধান সংগ্রহ অভিযান চলে।',
    projectedVolumeMT: '20.8M MT (National Boro)',
    projectedVolumeBn: '২.০৮ কোটি মে.টন (জাতীয় বোরো)',
    defaultListingCropEn: 'High-Yield Boro Rice (BRRI-89)',
    defaultListingCropBn: 'উচ্চফলনশীল বোরো ধান (ব্রি-৮৯)',
    urgency: 'STRATEGIC'
  },
  {
    id: 'cold-storage-potato-onion',
    cropNameEn: 'Cold-Storage Potato & Hali Onion Stocking',
    cropNameBn: 'হিমাগার আলু ও হালি পেঁয়াজ সংরক্ষণ',
    subItemsEn: 'Granola/Cardinal Seed & Table Potato · Ventilated Hali Onion',
    subItemsBn: 'কার্ডিনাল আলু · বাতাস-সঞ্চালিত মডেল ঘরের হালি পেঁয়াজ',
    category: 'INSTITUTIONAL_B2B',
    categoryLabelEn: 'Storage & B2B',
    categoryLabelBn: 'সংরক্ষণ ও বি-টু-বি',
    peakMonthsEn: 'Feb – Apr 2027',
    peakMonthsBn: 'ফেব্রুয়ারি – এপ্রিল ২০২৭',
    growthMinPct: 26,
    growthMaxPct: 36,
    sourcingDistrictsEn: ['Munshiganj', 'Bogura', 'Rangpur', 'Pabna', 'Faridpur'],
    sourcingDistrictsBn: ['মুন্সিগঞ্জ', 'বগুড়া', 'রংপুর', 'পাবনা', 'ফরিদপুর'],
    driverEn: 'Cold-chain aggregators & wholesale traders book 6–8 month storage lots during peak harvest.',
    driverBn: 'পাইকারি ব্যবসায়ী ও কোল্ড-স্টোরেজ প্রতিষ্ঠানগুলো মৌসুমের শুরুতে দীর্ঘমেয়াদী মজুদ বুকিং দেয়।',
    projectedVolumeMT: '4.8M MT (Storage intake)',
    projectedVolumeBn: '৪৮ লক্ষ মে.টন (সংরক্ষণ লক্ষ্য)',
    defaultListingCropEn: 'Cardinal Red Potatoes (Storage Grade)',
    defaultListingCropBn: 'কার্ডিনাল লাল আলু (হিমাগার মান)',
    urgency: 'HIGH'
  }
];
