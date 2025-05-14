export interface GraphDataType {
  year: string;
  yearFormatted: string;
  area: string;
  value: number | undefined;
  sdg: string;
  group: string;
}

export interface MetaDataType {
  sdg: string;
  label: string;
  indicator: string;
}

export interface OptionsDataType {
  label: string;
  value: string;
}

export interface GroupedOptionType {
  label: string;
  options: OptionsDataType[];
}

export interface PivotedRowType {
  area: string;
  sdg: string;
  [year: string]: string | number;
}

export interface RawDataType {
  area: string;
  year: string;
  yearFormatted: string;
  'SDG 1': number;
  'SDG 2': number;
  'SDG 3': number;
  'SDG 4': number;
  'SDG 5': number;
  'SDG 6': number;
  'SDG 7': number;
  'SDG 8': number;
  'SDG 9': number;
  'SDG 10': number;
  'SDG 11': number;
  'SDG 12': number;
  'SDG 13': number;
  'SDG 15': number;
  'SDG 16': number;
  'Indicator 1': number;
  'Indicator 2': number;
  'Indicator 3': number;
  [key: string]: string | number | null;
}
