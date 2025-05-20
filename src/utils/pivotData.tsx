import { GraphDataType, PivotedRowType } from '@/types';
import { getIndexGroup } from '@/utils/getIndexGroup';

export const pivotData = (longData: GraphDataType[]): PivotedRowType[] => {
  const resultMap: Record<string, PivotedRowType> = {};
  longData.forEach(row => {
    const indicator = row.value;
    if (row.area && row.year && row.sdg && indicator != null) {
      const rowKey = `${row.area}_${row.sdg}`;
      const groupKey = `group${row.year}`;
      if (!resultMap[rowKey]) {
        resultMap[rowKey] = {
          area: row.area,
          rowStyle:
            row.area === 'India' || row.area === 'Target'
              ? { backgroundColor: '#F7F7F7' }
              : undefined,
          sdg: row.sdg,
        };
      }
      resultMap[rowKey][row.year] = indicator;
      resultMap[rowKey][groupKey] = getIndexGroup(indicator);
    }
  });

  return Object.values(resultMap);
};
