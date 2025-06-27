export const VIS_HEIGHT = 689;
export const LEGEND_HEIGHT = 32;

export const SDG_OPTIONS = [
  { label: 'SDG 1 - No Poverty', value: 'SDG 1' },
  { label: 'SDG 2 - Zero Hunger', value: 'SDG 2' },
  { label: 'SDG 3 - Good Health and Well-being', value: 'SDG 3' },
  { label: 'SDG 4 - Quality Education', value: 'SDG 4' },
  { label: 'SDG 5 - Gender Equality', value: 'SDG 5' },
  { label: 'SDG 6 - Clean Water and Sanitation', value: 'SDG 6' },
  { label: 'SDG 7 - Affordable and Clean Energy', value: 'SDG 7' },
  { label: 'SDG 8 - Decent Work and Economic Growth', value: 'SDG 8' },
  { label: 'SDG 9 - Industry, Innovation and Infrastructure', value: 'SDG 9' },
  { label: 'SDG 10 - Reduced Inequalities', value: 'SDG 10' },
  { label: 'SDG 11 - Sustainable Cities and Communities', value: 'SDG 11' },
  { label: 'SDG 12 - Responsible Consumption and Production', value: 'SDG 12' },
  { label: 'SDG 13 - Climate Action', value: 'SDG 13' },
  { label: 'SDG 14 - Life Below Water', value: 'SDG 14' },
  { label: 'SDG 15 - Life on Land', value: 'SDG 15' },
  { label: 'SDG 16 - Peace, Justice and Strong Institutions', value: 'SDG 16' },
  // { label: 'SDG 17 - Partnerships for the goals', value: 'SDG 17' },
  { label: 'Composite Score', value: 'Comp. Score' },
];

export const SDG_TITLES: Record<string, { title: string; color: string }> = {
  'SDG 1': { title: 'No Poverty', color: '#e5243b' },
  'SDG 2': { title: 'Zero Hunger', color: '#dda63a' },
  'SDG 3': { title: 'Good Health and Well-being', color: '#4c9f38' },
  'SDG 4': { title: 'Quality Education', color: '#c5192d' },
  'SDG 5': { title: 'Gender Equality', color: '#ff3a21' },
  'SDG 6': { title: 'Clean Water and Sanitation', color: '#26bde2' },
  'SDG 7': { title: 'Affordable and Clean Energy', color: '#fcc30b' },
  'SDG 8': { title: 'Decent Work and Economic Growth', color: '#a21942' },
  'SDG 9': {
    title: 'Industry, Innovation and Infrastructure',
    color: '#fd6925',
  },
  'SDG 10': { title: 'Reduced Inequalities', color: '#dd1367' },
  'SDG 11': { title: 'Sustainable Cities and Communities', color: '#fd9d24' },
  'SDG 12': {
    title: 'Responsible Consumption and Production',
    color: '#bf8b2e',
  },
  'SDG 13': { title: 'Climate Action', color: '#3f7e44' },
  'SDG 14': { title: 'Life Below Water', color: '#0a97d9' },
  'SDG 15': { title: 'Life on Land', color: '#56c02b' },
  'SDG 16': {
    title: 'Peace, Justice and Strong Institutions',
    color: '#00689d',
  },
  'SDG 17': { title: 'Partnerships for the Goals', color: '#19486a' },
};

export const YEARS = [
  { label: '2024', value: '2023-24' },
  { label: '2021', value: '2020-21' },
  { label: '2020', value: '2019-20' },
  { label: '2018', value: '2018' },
];

export const COLOR_MAP = [
  {
    value: 'Aspirant (0-49)',
    color: '#CB364B',
  },
  {
    value: 'Performer (50-64)',
    color: '#F6C646',
  },
  {
    value: 'Front Runner (65-99)',
    color: '#479E85',
  },
  {
    value: 'Achiever (100)',
    color: '#4EABE9',
  },
  {
    value: 'NA',
    color: '#D4D6D8',
  },
];

export const FOOTNOTES_SDGS = [
  {
    sdg: 'SDG 10',
    footNotes: [
      'The "Percentage of SC/ST seats in State Legislative Assemblies" indicator is excluded from index computation due to the absence of a uniform target across all States/UTs.',
      'The number of crime cases against SCs for Mizoram stands at 5.',
    ],
  },
  {
    sdg: 'SDG 14',
    footNotes: [
      'The "Mean shore zone coastal water quality (DO) - Biochemical Oxygen Demand (BOD) (mg/l)" indicator has not been used to assess the performance of coastal States due to the absence of fixed quantitative targets.',
    ],
  },
  {
    sdg: 'SDG 15',
    footNotes: [
      'The absolute number of Wildlife cases for Delhi stands at 4128.',
    ],
  },
];

export const GENERAL_NOTE =
  'From 2020, Dadra and Nagar Haveli and Daman and Diu were merged into one Union Territory.';
export const TREND_NOTE =
  'Colors are assigned based on the latest available SDG Index data (2023-24).';
