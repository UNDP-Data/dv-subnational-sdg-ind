import { useEffect, useState } from 'react';
import { DropdownSelect, P } from '@undp/design-system-react';
import { fetchAndParseCSV } from '@undp/data-viz';

import IconGrid from './IconGrid';

import {
  GraphDataType,
  MetaDataType,
  OptionsDataType,
  RawDataType,
} from '@/types';
import { colorMap, TABLE_HEIGHT } from '@/constants';

interface Props {
  rawData: RawDataType[];
  graphData: GraphDataType[];
  yearsOptions: OptionsDataType[];
  sdgOptions: OptionsDataType[];
}

export default function SlideFiveContent(props: Props) {
  const { rawData, graphData, yearsOptions, sdgOptions } = props;
  const [metaData, setMetaData] = useState<MetaDataType[]>([]);
  const [selectedView] = useState<'chart' | 'table'>('table');
  const [selectedYear, setSelectedYear] = useState(
    yearsOptions[yearsOptions.length - 1],
  );
  const [selectedSDG, setSelectedSDG] = useState<OptionsDataType>(
    sdgOptions[0],
  );

  // Fetch the meta data
  useEffect(() => {
    fetchAndParseCSV('/data/meta-placeholder.csv')
      .then(d => {
        setMetaData(d as MetaDataType[]);
      })
      .catch(console.error);
  }, []);

  if (!metaData.length) return null;

  const activeIndicators = metaData.filter(
    item => item.sdg === selectedSDG?.value,
  );
  const indicatorNames = activeIndicators.map(item => item.indicator);

  const sdgScoreMap = new Map();
  graphData.forEach(d => {
    if (
      d.sdg === selectedSDG?.value &&
      String(d.year) === selectedYear?.value
    ) {
      sdgScoreMap.set(d.area, { value: d.value, group: d.group });
    }
  });

  const filteredData = rawData
    .filter(row => String(row.year) === selectedYear?.value)
    .map(row => {
      const sdg = sdgScoreMap.get(row.area);
      return {
        ...row,
        sdgValue: sdg?.value ?? null,
        group: sdg?.group ?? null,
      };
    });
  return (
    graphData && (
      <div className='flex flex-col justify-between grow w-full gap-2'>
        <div className='flex justify-between items-center gap-4 flex-wrap'>
          <P size='lg' marginBottom='none'>
            Performance of States and UTs on indicators of {selectedSDG?.value}{' '}
            ({selectedYear?.value})
          </P>
          <div className='flex gap-4 flex-wrap items-center'>
            <DropdownSelect
              onChange={option => setSelectedSDG(option as OptionsDataType)}
              options={sdgOptions}
              defaultValue={selectedSDG}
              size='sm'
              placeholder='Select SDG'
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
              selectedView={selectedView}
              data={filteredData}
              year={selectedYear}
              keys={[
                'area',
                'Indicator 1',
                'Indicator 2',
                'Indicator 3',
                'year',
              ]}
              slideIndex={5}
            />
          </div>
        </div>
        <div className='grow flex mt-4'>
          <div
            className='overflow-y-auto undp-scrollbar w-full'
            style={{ height: `${TABLE_HEIGHT}px` }}
          >
            <table className='w-full' style={{ borderCollapse: 'collapse' }}>
              <thead className='text-left bg-primary-gray-300 dark:bg-primary-gray-550'>
                <tr>
                  <th className='text-primary-gray-700 dark:text-primary-gray-100 text-sm p-4'>
                    State
                  </th>
                  {indicatorNames.map(indicator => (
                    <th
                      key={indicator}
                      className='text-primary-gray-700 dark:text-primary-gray-100 text-sm p-4'
                    >
                      {indicator}
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
                    key={`${row.area}-${idx}`}
                    className='cursor-auto border-b border-b-primary-gray-400 dark:border-b-primary-gray-500 bg-transparent'
                  >
                    <td className='text-sm text-left text-primary-gray-700 dark:text-primary-gray-100 p-4'>
                      {row.area}
                    </td>

                    {indicatorNames.map(indicator => (
                      <td key={indicator} className='text-sm text-left p-4'>
                        {row?.[indicator as keyof typeof row] ?? '-'}
                      </td>
                    ))}
                    <td className='text-sm text-left p-4'>
                      <span
                        className='rounded-full px-4 py-1 text-white text-primary-white'
                        style={{
                          backgroundColor:
                            colorMap[row.group as keyof typeof colorMap] ??
                            '#fafafa',
                        }}
                      >
                        {row.sdgValue ?? '-'}
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
