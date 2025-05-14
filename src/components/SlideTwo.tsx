import { useState } from 'react';
import { SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect, P, SegmentedControl } from '@undp/design-system-react';
import { ChartBar, Table2 } from 'lucide-react';

import IconGrid from './IconGrid';

import { GraphDataType, OptionsDataType } from '@/types';
import { colorMap, SDGS, TABLE_HEIGHT } from '@/constants';
import { pivotData } from '@/utils/pivotData';

interface Props {
  graphData: GraphDataType[];
  yearsOptions: OptionsDataType[];
  areaOptions: OptionsDataType[];
}

export default function SlideTwoContent(props: Props) {
  const { graphData, yearsOptions, areaOptions } = props;
  const [selectedYear, setSelectedYear] = useState(
    yearsOptions[yearsOptions.length - 1],
  );
  const [selectedArea, setSelectedArea] = useState(areaOptions[0]);
  const [selectedView, setSelectedView] = useState<'chart' | 'table'>('chart');
  const sdgOrder = SDGS.filter(sdg => sdg.value !== 'Comp. Score').map(
    sdg => sdg.value,
  );

  const pivotedDataByYears = pivotData(graphData);

  const filteredData = pivotedDataByYears.filter(
    row => String(row.area) === selectedArea?.value,
  );

  const compScoreValue = Number(
    graphData.find(
      d => d['sdg'] === 'Comp. Score' && d['year'] === selectedYear.label,
    )?.['value'],
  );

  return (
    graphData && (
      <div className='bg-primary-white p-6 flex flex-col grow w-full gap-2'>
        <div className='flex justify-between items-center gap-4 flex-wrap'>
          <P size='lg' marginBottom='none'>
            SDG Index Score for {selectedArea?.value} ({selectedYear?.value})
          </P>
          <div className='flex gap-4 flex-wrap items-center'>
            <DropdownSelect
              onChange={option => setSelectedArea(option as OptionsDataType)}
              options={areaOptions}
              defaultValue={selectedArea}
              size='sm'
              placeholder='Select area'
              className='min-w-40'
              variant='light'
            />
            <DropdownSelect
              onChange={option => setSelectedYear(option as OptionsDataType)}
              options={yearsOptions}
              isDisabled={selectedView === 'table'}
              size='sm'
              placeholder='Select year'
              isClearable={false}
              defaultValue={selectedYear}
              className='min-w-40'
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
              data={graphData}
              year={selectedYear}
              area={selectedArea}
              keys={['area', 'sdg', 'value', 'group', 'year']}
              slideIndex={2}
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
              graphType='barChart'
              dataFilters={[
                {
                  column: 'year',
                  includeValues: [selectedYear.value],
                },
                {
                  column: 'sdg',
                  excludeValues: ['Comp. Score'],
                },
                {
                  column: 'area',
                  includeValues: selectedArea ? [selectedArea.value] : [],
                },
              ]}
              graphDataConfiguration={[
                { columnId: 'sdg', chartConfigId: 'label' },
                { columnId: 'value', chartConfigId: 'size' },
                { columnId: 'group', chartConfigId: 'color' },
              ]}
              graphSettings={{
                colors: ['#CB364B', '#F6C646', '#479E85', '#4EABE9'],
                colorDomain: [
                  'Aspirant (0–49)',
                  'Performer (50–64)',
                  'Front Runner (65–99)',
                  'Achiever (100)',
                ],
                graphID: `slide-2-chart`,
                labelOrder: sdgOrder,
                showNAColor: false,
                colorLegendTitle: undefined,
                showLabels: true,
                filterNA: false,
                maxValue: 100,
                bottomMargin: 40,
                refValues: [
                  {
                    value: compScoreValue,
                    text: `Composite Score (${compScoreValue})`,
                    color: '#000000',
                  },
                ],
                tooltip:
                  '<div class="font-bold p-2 bg-primary-gray-300 uppercase text-xs">{{data.area}} ({{data.year}})</div><div class="p-2 flex justify-between"><div>{{data.sdg}}</div><div>{{size}}</div></div>',
                styles: {
                  tooltip: {
                    padding: '0',
                    minWidth: '150px',
                  },
                },
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
                          SDGs
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
                          key={`${row.sdg}-${idx}`}
                          className='cursor-auto border-b border-b-primary-gray-400 dark:border-b-primary-gray-500 bg-transparent'
                        >
                          <td className='text-sm text-left text-primary-gray-700 dark:text-primary-gray-100 p-4'>
                            {row.sdg}
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
