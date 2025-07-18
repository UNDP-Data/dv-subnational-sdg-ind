export interface GraphDataType {
  year: string;
  yearFormatted: string;
  area: string;
  value: number | undefined;
  sdg: string;
  group: string | undefined;
}

export interface MetaDataType {
  sdg: string;
  label: string;
  indicator: string;
  year: number | string;
  yearFormatted: number;
  interpretation: string;
}

export type IndicatorRow = {
  'STATEs/UTs': string;
  year: number | string;
  yearFormatted: number;
  rowStyle?: React.CSSProperties | undefined;
} & {
  [indicatorName: string]:
    | string
    | number
    | null
    | undefined
    | React.CSSProperties;
};

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
  rowStyle?: { backgroundColor: string } | undefined;
  [year: string]: { backgroundColor: string } | string | number | undefined;
}

export type ChartTypes = 'chart' | 'table' | 'map' | 'trends';

export interface RawDataType {
  area: string;
  year: string;
  yearFormatted: string;
  rawStyle: React.CSSProperties;
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
}
