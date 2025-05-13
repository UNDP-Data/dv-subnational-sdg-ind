import { useState } from 'react';
import { SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect, P, SegmentedControl } from '@undp/design-system-react';
import { ChartBar, Table2 } from 'lucide-react';

import IconGrid from './IconGrid';

import { GraphDataType, OptionsDataType } from '@/types';
import { colorMap, SDGS, TABLE_HEIGHT } from '@/constants';

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
  const indiaValue = graphData.find(
    d => d.area === 'India' && d.year === selectedYear.value,
  )?.value;

  const sdgOrder = SDGS.map(sdg => sdg.value);

  const filteredData = graphData.filter(
    row =>
      String(row.year) === selectedYear?.value &&
      row.area === selectedArea?.label,
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
              className='w-full'
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
                graphID: `slide-2-chart`,
                labelOrder: sdgOrder,
                showNAColor: false,
                colorLegendTitle: undefined,
                showLabels: true,
                bottomMargin: 40,
                refValues: indiaValue
                  ? [
                      {
                        value: indiaValue,
                        text: 'India SDG Index Score',
                        color: '#000000',
                      },
                    ]
                  : undefined,
              }}
            />
          )}
          {selectedView === 'table' && (
            <div className='grow flex mt-4'>
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
                        SDG
                      </th>
                      <th className='text-primary-gray-700 dark:text-primary-gray-100 text-sm p-4'>
                        SDG Index Score
                      </th>
                      <th className='text-primary-gray-700 dark:text-primary-gray-100 text-sm p-4'>
                        Category
                      </th>
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
                        <td className='text-sm text-left p-4'>{row.value}</td>
                        <td className='text-sm text-left p-4'>
                          <span
                            className='rounded-full px-4 py-1 text-white text-primary-white'
                            style={{
                              backgroundColor:
                                colorMap[row.group as keyof typeof colorMap] ??
                                '#fafafa',
                            }}
                          >
                            {row.group}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}
