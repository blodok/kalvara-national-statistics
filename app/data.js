// Kalvara National Statistics Office — published figures.
// Every figure below is the Office's own published data for the fictional Republic
// of Kalvara. Each indicator carries its source publication and reference year so a
// visitor can check where a number comes from. Figures are internally consistent
// across pages: the same series appears once here and is reused by every view.

export const META = {
  country: 'Republic of Kalvara',
  office: 'Kalvara National Statistics Office',
  updated: '26 November 2026',
  currency: 'kalvar (KLV)',
};

export const KEY_INDICATORS = [
  {
    id: 'population', label: 'Population', value: '4,812,300', change: '+0.6% on 2024',
    direction: 'up', note: 'Mid-year estimate, 2025',
    source: 'Population estimates 2025, KNSO',
  },
  {
    id: 'gdp', label: 'GDP', value: 'KLV 96.4 bn', change: '+3.1% in real terms',
    direction: 'up', note: '2025, current prices KLV 96.4 bn',
    source: 'National accounts 2025, KNSO',
  },
  {
    id: 'unemployment', label: 'Unemployment rate', value: '5.2%', change: '−0.4 pp on 2024',
    direction: 'down', note: 'Labour force survey, Q3 2026',
    source: 'Labour force survey Q3 2026, KNSO',
  },
  {
    id: 'inflation', label: 'Consumer price inflation', value: '2.8%', change: '−0.7 pp on a year ago',
    direction: 'down', note: 'October 2026, year on year',
    source: 'Consumer price index, October 2026, KNSO',
  },
  {
    id: 'life-expectancy', label: 'Life expectancy at birth', value: '78.6 years', change: '+0.3 years on 2024',
    direction: 'up', note: '2025 life tables',
    source: 'Life tables 2025, KNSO',
  },
  {
    id: 'median-wage', label: 'Median monthly wage', value: 'KLV 2,340', change: '+4.2% nominal on 2024',
    direction: 'up', note: 'Full-time employees, 2025',
    source: 'Earnings survey 2025, KNSO',
  },
];

// Population, mid-year estimates (thousands). Source: Population estimates 2025, KNSO.
export const POPULATION_BY_YEAR = [
  { year: 2015, total: 4521 }, { year: 2016, total: 4558 }, { year: 2017, total: 4596 },
  { year: 2018, total: 4633 }, { year: 2019, total: 4671 }, { year: 2020, total: 4689 },
  { year: 2021, total: 4712 }, { year: 2022, total: 4744 }, { year: 2023, total: 4776 },
  { year: 2024, total: 4784 }, { year: 2025, total: 4812 },
];

// Age structure, 2025 (% of population). Source: Population estimates 2025, KNSO.
export const AGE_GROUPS = [
  { group: '0–14', share: 17.8 }, { group: '15–24', share: 12.4 },
  { group: '25–54', share: 42.1 }, { group: '55–64', share: 13.2 },
  { group: '65+', share: 14.5 },
];

// Regions, 2025. Source: Regional statistics 2025, KNSO.
export const REGIONS = [
  { name: 'Port Kalvara', population: 1184300, gdpPerCapita: 28400, unemployment: 4.6, density: 412 },
  { name: 'Northfield', population: 684200, gdpPerCapita: 21300, unemployment: 5.1, density: 96 },
  { name: 'Lake District', population: 521700, gdpPerCapita: 19800, unemployment: 5.8, density: 61 },
  { name: 'Eastvale', population: 498400, gdpPerCapita: 17600, unemployment: 6.4, density: 48 },
  { name: 'South Coast', population: 462900, gdpPerCapita: 22900, unemployment: 4.9, density: 133 },
  { name: 'Highlands', population: 388100, gdpPerCapita: 15900, unemployment: 7.1, density: 22 },
  { name: 'Riverland', population: 371500, gdpPerCapita: 18200, unemployment: 5.5, density: 57 },
  { name: 'Isle of Tarn', population: 701200, gdpPerCapita: 20100, unemployment: 5.0, density: 88 },
];

// GDP, real growth % and level (KLV bn, current prices). Source: National accounts 2025, KNSO.
export const GDP_BY_YEAR = [
  { year: 2015, level: 71.2, growth: 2.4 }, { year: 2016, level: 73.8, growth: 2.8 },
  { year: 2017, level: 77.1, growth: 3.4 }, { year: 2018, level: 80.9, growth: 3.9 },
  { year: 2019, level: 84.2, growth: 2.6 }, { year: 2020, level: 81.5, growth: -3.8 },
  { year: 2021, level: 85.6, growth: 4.6 }, { year: 2022, level: 89.3, growth: 3.5 },
  { year: 2023, level: 92.1, growth: 2.9 }, { year: 2024, level: 94.8, growth: 2.7 },
  { year: 2025, level: 96.4, growth: 3.1 },
];

// GDP by sector, % of gross value added, 2025. Source: National accounts 2025, KNSO.
export const GDP_SECTORS = [
  { sector: 'Services', share: 61.4 }, { sector: 'Manufacturing', share: 17.8 },
  { sector: 'Agriculture & fishing', share: 8.6 }, { sector: 'Construction', share: 6.9 },
  { sector: 'Mining & energy', share: 5.3 },
];

// Consumer price inflation, % year on year. Source: CPI, October 2026, KNSO.
export const INFLATION_BY_YEAR = [
  { year: 2020, rate: 1.2 }, { year: 2021, rate: 2.1 }, { year: 2022, rate: 5.4 },
  { year: 2023, rate: 4.1 }, { year: 2024, rate: 3.5 }, { year: 2025, rate: 3.1 },
  { year: 2026, rate: 2.8 },
];

// Trade, KLV bn. Source: External trade statistics 2025, KNSO.
export const TRADE = { exports: 41.7, imports: 38.9, balance: 2.8, year: 2025 };
export const TRADE_PARTNERS = [
  { partner: 'Nordic Union', share: 28.4 }, { partner: 'Meridian States', share: 19.7 },
  { partner: 'Alder Republic', share: 12.3 }, { partner: 'Southern Isles', share: 9.8 },
  { partner: 'Other', share: 29.8 },
];

// Unemployment rate, %. Source: Labour force survey, KNSO.
export const UNEMPLOYMENT_BY_YEAR = [
  { year: 2019, rate: 6.1 }, { year: 2020, rate: 7.8 }, { year: 2021, rate: 6.9 },
  { year: 2022, rate: 6.2 }, { year: 2023, rate: 5.9 }, { year: 2024, rate: 5.6 },
  { year: 2025, rate: 5.4 }, { year: 2026, rate: 5.2 },
];
export const UNEMPLOYMENT_BY_AGE = [
  { group: '15–24', rate: 11.8 }, { group: '25–34', rate: 6.3 },
  { group: '35–54', rate: 4.1 }, { group: '55+', rate: 3.6 },
];
export const EMPLOYMENT_BY_SECTOR = [
  { sector: 'Services', share: 68.2 }, { sector: 'Manufacturing', share: 14.9 },
  { sector: 'Agriculture & fishing', share: 7.4 }, { sector: 'Construction', share: 6.1 },
  { sector: 'Mining & energy', share: 3.4 },
];
export const WAGES = { medianMonthly: 2340, meanMonthly: 2870, year: 2025 };

// Health, 2025. Source: Health statistics 2025, KNSO; Ministry of Health.
export const LIFE_EXPECTANCY = [
  { year: 2015, all: 76.9, female: 79.8, male: 74.1 },
  { year: 2018, all: 77.4, female: 80.2, male: 74.7 },
  { year: 2021, all: 77.8, female: 80.6, male: 75.1 },
  { year: 2023, all: 78.3, female: 81.0, male: 75.7 },
  { year: 2025, all: 78.6, female: 81.3, male: 76.0 },
];
export const CAUSES_OF_DEATH = [
  { cause: 'Circulatory diseases', share: 31.2 },
  { cause: 'Cancers', share: 26.8 },
  { cause: 'Respiratory diseases', share: 9.4 },
  { cause: 'External causes', share: 6.1 },
  { cause: 'Other', share: 26.5 },
];
export const HEALTH = { spendingShareGdp: 8.9, doctorsPer1000: 3.8, bedsPer1000: 4.6, year: 2025 };

// Education, 2025. Source: Education statistics 2025, KNSO; Ministry of Education.
export const ENROLMENT = [
  { level: 'Primary', rate: 99.1 }, { level: 'Lower secondary', rate: 98.4 },
  { level: 'Upper secondary', rate: 91.7 }, { level: 'Tertiary', rate: 58.3 },
];
export const ATTAINMENT = [
  { level: 'Primary or less', share: 9.8 }, { level: 'Lower secondary', share: 16.4 },
  { level: 'Upper secondary', share: 38.2 }, { level: 'Tertiary', share: 35.6 },
];
export const EDUCATION = { spendingShareGdp: 5.2, pupilsPerTeacher: 14.1, year: 2025 };

// Latest releases. Source: KNSO release calendar.
export const RELEASES = [
  { date: '2026-11-26', title: 'Population estimates, mid-2025', tag: 'Population', file: 'data/population-2025.csv' },
  { date: '2026-11-19', title: 'Consumer price index, October 2026', tag: 'Prices', file: 'data/cpi-2026.csv' },
  { date: '2026-11-12', title: 'Labour force survey, Q3 2026', tag: 'Labour', file: 'data/labour-2026.csv' },
  { date: '2026-11-05', title: 'National accounts, Q3 2026', tag: 'Economy', file: 'data/gdp-2025.csv' },
  { date: '2026-10-29', title: 'Regional statistics 2025', tag: 'Regions', file: 'data/regions-2025.csv' },
  { date: '2026-10-22', title: 'Health statistics 2025', tag: 'Health', file: 'data/health-2025.csv' },
  { date: '2026-10-15', title: 'Education statistics 2025', tag: 'Education', file: 'data/education-2025.csv' },
  { date: '2026-10-08', title: 'External trade, September 2026', tag: 'Trade', file: 'data/trade-2025.csv' },
];

// Search index: what the search box looks through.
export const SEARCH_INDEX = [
  { title: 'Population', text: 'population residents age groups regions mid-year estimate', route: '#/population' },
  { title: 'Economy — GDP', text: 'gross domestic product gdp growth sectors national accounts', route: '#/economy' },
  { title: 'Economy — Inflation', text: 'consumer prices inflation cpi cost of living', route: '#/economy' },
  { title: 'Economy — Trade', text: 'exports imports trade balance partners', route: '#/economy' },
  { title: 'Labour — Unemployment', text: 'unemployment jobs employment labour force youth', route: '#/labour' },
  { title: 'Labour — Wages', text: 'wages earnings median salary pay', route: '#/labour' },
  { title: 'Health', text: 'life expectancy health spending doctors hospitals causes of death', route: '#/health' },
  { title: 'Education', text: 'schools enrolment attainment pupils teachers tertiary', route: '#/education' },
  { title: 'Regions', text: 'regions port kalvara northfield highlands regional statistics', route: '#/regions' },
  { title: 'Releases & data', text: 'releases publications downloads csv data files', route: '#/releases' },
  { title: 'Sources & methods', text: 'sources methods definitions revisions quality', route: '#/methods' },
];
