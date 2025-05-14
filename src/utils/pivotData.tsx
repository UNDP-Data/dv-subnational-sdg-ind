import { GraphDataType, PivotedRowType } from '@/types';

export const pivotData = (graphData: GraphDataType[]): PivotedRowType[] => {
  const resultMap: Record<string, PivotedRowType> = {};

  graphData.forEach(row => {
    const indicator = row.value;

    if (row.area && row.year && row.sdg && indicator != null) {
      const rowKey = `${row.area}_${row.sdg}`;
      if (!resultMap[rowKey]) {
        resultMap[rowKey] = {
          area: row.area,
          sdg: row.sdg,
        };
      }

      resultMap[rowKey][row.year] = indicator;
    }
  });

  return Object.values(resultMap);
};
