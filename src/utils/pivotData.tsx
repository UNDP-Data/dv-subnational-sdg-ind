import { GraphDataType } from '@/types';

type PivotedRow = {
  state: string;
  sdg?: string;
  year?: string | number;
  [key: string]: string | number | undefined;
};

export const pivotData = (
  graphData: GraphDataType[],
  pivotBy: 'sdg' | 'year',
  selectedSDG?: { value: keyof GraphDataType },
): PivotedRow[] => {
  const resultMap: Record<string, PivotedRow> = {};

  graphData.forEach(row => {
    const indicatorKey = selectedSDG?.value ?? 'value';
    const indicator = row[indicatorKey];

    if (row.state && row.year && row.sdg && indicator != null) {
      let rowKey: string;
      let columnKey: string;
      const baseRow: PivotedRow = { state: row.state };

      if (pivotBy === 'sdg') {
        rowKey = `${row.state}_${row.year}`;
        columnKey = row.sdg;
        baseRow.year = row.year;
      } else {
        rowKey = `${row.state}_${row.sdg}`;
        columnKey = String(row.year);
        baseRow.sdg = row.sdg;
      }

      if (!resultMap[rowKey]) {
        resultMap[rowKey] = baseRow;
      }

      resultMap[rowKey][columnKey] = indicator;
    }
  });

  return Object.values(resultMap);
};
