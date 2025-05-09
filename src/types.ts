export interface GraphDataType {
  year: string;
  state: string;
  value: number;
  sdg: string;
  // indexGroup: string;
  // colorId: string;
  [key: string]: string | number;
}

export interface OptionsDataType {
  label: string;
  value: string;
}

export interface RawSDGData {
  'STATEs/UTs': string;
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
  'Composite Score': string;
  year: string;
}
