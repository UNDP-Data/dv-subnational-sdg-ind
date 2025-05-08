import { useState } from 'react';
import { DropdownSelect, P } from '@undp/design-system-react';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

import IconGrid from './IconGrid';

import { GraphDataType, OptionsDataType } from '@/types';

interface Props {
  graphData: GraphDataType[];
  mapData: FeatureCollection<Polygon | MultiPolygon>;
  yearsOptions: OptionsDataType[];
  stateOptions: OptionsDataType[];
  SDGOptions: OptionsDataType[];
}

export const SDGs = [
  {
    id: 1,
    label: 'SDG 1',
    title: 'Peace, Justice and Strong Institutions',
    indicators: [{ code: '16.1', label: 'Murders per 1 lakh population' }],
  },
];

export default function SlideFiveContent(props: Props) {
  const { graphData, yearsOptions, SDGOptions } = props;
  const [selectedYear, setSelectedYear] = useState({
    label: '2022',
    value: '2022',
  });
  const [selectedSDG, setSelectedSDG] = useState<OptionsDataType | null>({
    label: 'SDG 1',
    value: 'SDG 1',
  });

  const fallbackSDG = SDGs.find(sdg => sdg.label === 'SDG 1')!;
  const activeSDG =
    SDGs.find(sdg => sdg.label === selectedSDG?.label) ?? fallbackSDG;

  const filteredData = graphData.filter(
    row =>
      String(row.year) === selectedYear?.value && row.sdg === activeSDG.label,
  );

  return (
    graphData && (
      <div className='flex flex-col justify-between grow w-full gap-2'>
        <div className='flex justify-between items-center gap-4 flex-wrap'>
          <P size='lg' marginBottom='none'>
            SDG Index Score by States ({selectedYear?.value})
          </P>
          <div className='flex gap-4 flex-wrap items-center'>
            <DropdownSelect
              onChange={option => setSelectedSDG(option as OptionsDataType)}
              options={SDGOptions}
              defaultValue={selectedSDG}
              size='sm'
              placeholder='Highlight state'
              className='min-w-[240px]'
              variant='light'
            />
            <DropdownSelect
              onChange={option => setSelectedYear(option as OptionsDataType)}
              options={yearsOptions}
              size='sm'
              placeholder='Select year'
              isClearable={false}
              defaultValue={selectedYear}
              className='min-w-40'
              variant='light'
            />
            <IconGrid
              selectedView='chart'
              data={graphData}
              year={2022}
              keys={[
                'department',
                'Human Development Index',
                'hdiGroup',
                'year',
              ]}
            />
          </div>
        </div>
        <div className='grow flex mt-4'>
          <div className='max-h-[720px] w-full undp-scrollbar overflow-y-auto'>
            <table className='w-full' style={{ borderCollapse: 'collapse' }}>
              <thead className='text-left bg-primary-gray-300 dark:bg-primary-gray-550'>
                <tr>
                  <th className='text-primary-gray-700 dark:text-primary-gray-100 text-sm p-4'>
                    State
                  </th>
                  {activeSDG.indicators.map(ind => (
                    <th
                      key={ind.label}
                      className='text-primary-gray-700 dark:text-primary-gray-100 text-sm p-4'
                    >
                      {ind.label}
                    </th>
                  ))}
                  <th className='text-primary-gray-700 dark:text-primary-gray-100 text-sm p-4'>
                    SDG Index Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, idx) => (
                  <tr
                    key={`${row.state}-${idx}`}
                    className='cursor-auto border-b border-b-primary-gray-400 dark:border-b-primary-gray-500 bg-transparent'
                  >
                    <td className='text-sm text-left text-primary-gray-700 dark:text-primary-gray-100 p-4'>
                      {row.state}
                    </td>

                    {activeSDG.indicators.map(ind => (
                      <td key={ind.label} className='text-sm text-left p-4'>
                        {row[ind.label] !== undefined ? row[ind.label] : '-'}
                      </td>
                    ))}

                    <td className='text-sm text-left p-4'>
                      <span
                        className={`rounded px-2 py-1 text-white ${
                          row.value >= 80
                            ? 'bg-accent-green'
                            : row.value >= 60
                              ? 'bg-accent-yellow'
                              : 'bg-accent-red'
                        }`}
                      >
                        {row.value}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  );
}
