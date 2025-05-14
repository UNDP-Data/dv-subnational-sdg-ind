import { useState } from 'react';
import { SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect, P, SegmentedControl } from '@undp/design-system-react';
import { ChartBar, Table2 } from 'lucide-react';

import IconGrid from './IconGrid';

import { GraphDataType, OptionsDataType } from '@/types';
import { colorMap, TABLE_HEIGHT } from '@/constants';
import { pivotData } from '@/utils/pivotData';

interface Props {
  graphData: GraphDataType[];
  areaOptions: OptionsDataType[];
  sdgOptions: OptionsDataType[];
  yearsOptions: OptionsDataType[];
}

export default function SlideFourContent(props: Props) {
  const { graphData, areaOptions, sdgOptions, yearsOptions } = props;
  const [selectedArea, setSelectedArea] = useState<OptionsDataType[] | null>(
    null,
  );
  const [selectedSDG, setSelectedSDG] = useState<OptionsDataType>(
    sdgOptions[0],
  );
  const [selectedView, setSelectedView] = useState<'chart' | 'table'>('chart');

  const pivotedDataByYears = pivotData(graphData);

  const filteredData = pivotedDataByYears.filter(
    row => String(row.sdg) === selectedSDG?.value,
  );

  return (
    graphData &&
    filteredData && (
      <div className='bg-primary-white p-6 flex flex-col grow w-full gap-2'>
        <div className='flex justify-between items-center gap-4 flex-wrap'>
          <P size='lg' marginBottom='none'>
            Performance of States/UTs on{' '}
            {selectedSDG?.label === 'Comp. Score'
              ? 'Composite Index Score'
              : `${selectedSDG?.label}`}{' '}
            over Time
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
              onChange={option => setSelectedArea(option as OptionsDataType[])}
              options={areaOptions}
              isClearable={true}
              defaultValue={selectedArea}
              isDisabled={selectedView === 'table' ? true : false}
              size='sm'
              isMulti={true}
              placeholder='Highlight area'
              className='min-w-[240px]'
              variant='light'
            />
            <SegmentedControl
              defaultValue='chart'
              size='sm'
              value={selectedView}
              color='black'
              onValueChange={value =>
                setSelectedView(value as 'chart' | 'table')
              }
              options={[
                {
                  label: (
                    <div className='flex gap-2 h-fit items-center'>
                      <div className='h-fit'>
                        <ChartBar size={16} strokeWidth={1.5} />
                      </div>
                      <P marginBottom='none' size='sm'>
                        Chart
                      </P>
                    </div>
                  ),
                  value: 'chart',
                },
                {
                  label: (
                    <div className='flex gap-2 h-fit items-center'>
                      <div className='h-fit'>
                        <Table2 size={16} strokeWidth={1.5} />
                      </div>
                      <P marginBottom='none' size='sm'>
                        Table
                      </P>
                    </div>
                  ),
                  value: 'table',
                },
              ]}
            />
            <IconGrid
              selectedView={selectedView}
              slideIndex={4}
              data={pivotedDataByYears}
              sdg={selectedSDG}
              keys={['area', 'sdg', '2018', '2019', '2020-21', '2023–24']}
            />
          </div>
        </div>
        <div className='grow flex mt-4'>
          {selectedView === 'chart' && (
            <SingleGraphDashboard
              dataSettings={{
                data: graphData,
                fileType: 'csv',
              }}
              graphType='multiLineAltChart'
              dataFilters={[
                {
                  column: 'sdg',
                  includeValues: selectedSDG ? [selectedSDG.value] : [],
                },
                {
                  column: 'groupLatest',
                  excludeValues: ['', NaN, undefined, null],
                },
              ]}
              graphDataConfiguration={[
                { columnId: 'yearFormatted', chartConfigId: 'date' },
                { columnId: 'area', chartConfigId: 'label' },
                {
                  columnId: 'value',
                  chartConfigId: 'y',
                },
                {
                  columnId: 'groupLatest',
                  chartConfigId: 'color',
                },
              ]}
              graphSettings={{
                graphID: 'slide-4-chart',
                curveType: 'curve',
                noOfXTicks: window.innerWidth < 768 ? 5 : 12,
                rightMargin: window.innerWidth < 768 ? 18 : 164,
                showNAColor: false,
                valueColor: '#000000',
                strokeWidth: 1.5,
                showDots: true,
                tooltip: '<b>{{label}} ({{data.year}})</b></br>{{y}}',
                colorDomain: [
                  'Aspirant (0–49)',
                  'Performer (50–64)',
                  'Front Runner (65–99)',
                  'Achiever (100)',
                ],
                colors: ['#CB364B', '#F6C646', '#479E85', '#4EABE9'],
                footNote:
                  'Colors are assigned based on the latest available SDG Index data (2023–24).',
                highlightedLines: selectedArea
                  ? selectedArea.map(area => area.value)
                  : [],
              }}
            />
          )}
          {selectedView === 'table' && (
            <div className='w-full'>
              <div
                className='flex leading-0'
                aria-label='Color legend'
                style={{ maxWidth: 'none' }}
              >
                <div>
                  <div className='flex flex-wrap gap-3.5 mb-0'>
                    <div className='flex items-center gap-1 cursor-pointer'>
                      <div
                        className='w-3 h-3 rounded-full'
                        style={{ backgroundColor: 'rgb(203, 54, 75)' }}
                      />
                      <p className='mt-0 ml-0 mr-0 text-sm leading-[1.4] mb-0'>
                        Aspirant (0–49)
                      </p>
                    </div>
                    <div className='flex items-center gap-1 cursor-pointer'>
                      <div
                        className='w-3 h-3 rounded-full'
                        style={{ backgroundColor: 'rgb(246, 198, 70)' }}
                      />
                      <p className='mt-0 ml-0 mr-0 text-sm leading-[1.4] mb-0'>
                        Performer (50–64)
                      </p>
                    </div>
                    <div className='flex items-center gap-1 cursor-pointer'>
                      <div
                        className='w-3 h-3 rounded-full'
                        style={{ backgroundColor: 'rgb(71, 158, 133)' }}
                      />
                      <p className='mt-0 ml-0 mr-0 text-sm leading-[1.4] mb-0'>
                        Front Runner (65–99)
                      </p>
                    </div>
                    <div className='flex items-center gap-1 cursor-pointer'>
                      <div
                        className='w-3 h-3 rounded-full'
                        style={{ backgroundColor: 'rgb(78, 171, 233)' }}
                      />
                      <p className='mt-0 ml-0 mr-0 text-sm leading-[1.4] mb-0'>
                        Achiever (100)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='grow flex mt-4 w-full'>
                <div
                  className='overflow-y-auto undp-scrollbar w-full'
                  style={{ height: `${TABLE_HEIGHT}px` }}
                >
                  <table
                    className='w-full'
                    style={{ borderCollapse: 'collapse' }}
                  >
                    <thead className='text-left bg-primary-gray-300 dark:bg-primary-gray-550'>
                      <tr>
                        <th className='text-primary-gray-700 dark:text-primary-gray-100 text-sm p-4'>
                          States/UTs
                        </th>
                        {yearsOptions.map(option => (
                          <th
                            key={option.value}
                            className='text-primary-gray-700 dark:text-primary-gray-100 text-sm p-4'
                          >
                            {option.label}
                          </th>
                        ))}
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

                          {yearsOptions.map(option => {
                            const value =
                              row[option.value as keyof GraphDataType];
                            let category = '';
                            if (value === 100) {
                              category = 'Achiever (100)';
                            } else if (
                              typeof value === 'number' &&
                              value >= 65
                            ) {
                              category = 'Front Runner (65–99)';
                            } else if (
                              typeof value === 'number' &&
                              value >= 50
                            ) {
                              category = 'Performer (50–64)';
                            } else if (
                              typeof value === 'number' &&
                              value >= 0
                            ) {
                              category = 'Aspirant (0–49)';
                            }

                            return (
                              <td
                                key={option.value}
                                className='text-sm text-left p-4'
                              >
                                {value != null ? (
                                  <span
                                    className='rounded-full px-4 py-1 text-white text-sm text-primary-white'
                                    style={{
                                      backgroundColor:
                                        colorMap[
                                          category as keyof typeof colorMap
                                        ] ?? '#ccc',
                                    }}
                                  >
                                    {value}
                                  </span>
                                ) : (
                                  ''
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}
