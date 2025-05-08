export interface GraphDataType {
  year: number;
  state: string;
  value: number;
  sdg: string;
  indexGroup: string;
  colorId: string;
  [key: string]: string | number;
}

export interface OptionsDataType {
  label: string;
  value: string;
}
