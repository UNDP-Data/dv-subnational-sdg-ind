import { useState } from 'react';
import { SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect, P, SegmentedControl } from '@undp/design-system-react';
import { ChartBar, Table2 } from 'lucide-react';

import IconGrid from './IconGrid';

import { GraphDataType, OptionsDataType, RawDataType } from '@/types';
import { TABLE_HEIGHT } from '@/constants';

interface Props {
  graphData: GraphDataType[];
  rawData: RawDataType[];
  yearsOptions: OptionsDataType[];
  sdgOptions: OptionsDataType[];
}

export default function SlideOneContent(props: Props) {
  const { graphData, rawData, yearsOptions, sdgOptions } = props;
  const [selectedYear, setSelectedYear] = useState(
    yearsOptions[yearsOptions.length - 1],
  );
  const [selectedView, setSelectedView] = useState<'chart' | 'table'>('chart');
  return (
    graphData &&
    rawData && (
      <div className='bg-primary-white p-6 flex flex-col grow w-full gap-2'>
        <div className='flex justify-between items-center gap-4 flex-wrap'>
          <P size='lg' marginBottom='none'>
            Performance of States and UTs on SDGs ({selectedYear?.value})
          </P>
          <div className='flex gap-4 flex-wrap items-center'>
            <DropdownSelect
              onChange={option => setSelectedYear(option as OptionsDataType)}
              options={[...yearsOptions].reverse()}
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
              data={rawData}
              year={selectedYear}
              keys={['area', 'year', ...sdgOptions.map(opt => opt.value)]}
              slideIndex={1}
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
              graphType='heatMap'
              dataFilters={[
                {
                  column: 'year',
                  includeValues: [selectedYear.value],
                },
                {
                  column: 'value',
                  excludeValues: [null, NaN],
                },
              ]}
              graphDataConfiguration={[
                { columnId: 'area', chartConfigId: 'row' },
                { columnId: 'value', chartConfigId: 'value' },
                { columnId: 'sdg', chartConfigId: 'column' },
              ]}
              graphSettings={{
                graphID: `slide-1-chart`,
                colorDomain: [
                  'Aspirant (0–49)',
                  'Performer (50–64)',
                  'Front Runner (65–99)',
                  'Achiever (100)',
                ],
                colors: ['#CB364B', '#F6C646', '#479E85', '#4EABE9'],
                showNAColor: false,
                scaleType: 'categorical',
                truncateBy: 10,
                tooltip: '<b>{{row}}</b></br> {{column}} – {{value}}',
                styles: {
                  tooltip: {
                    padding: '100px 12px',
                    backgroundColor: '#000',
                  },
                },
              }}
            />
          )}
          {selectedView === 'table' && (
            <>
              <SingleGraphDashboard
                dataSettings={{
                  data: rawData,
                  fileType: 'csv',
                }}
                graphType='dataTable'
                dataFilters={[
                  {
                    column: 'year',
                    includeValues: [selectedYear.value],
                  },
                ]}
                graphSettings={{
                  height: TABLE_HEIGHT,
                  columnData: [
                    {
                      columnTitle: 'Area',
                      columnId: 'area',
                      sortable: true,
                    },
                    ...sdgOptions.map(option => ({
                      columnTitle: option.label,
                      columnId: option.value,
                      sortable: true,
                    })),
                  ],
                }}
              />
            </>
          )}
        </div>
      </div>
    )
  );
}
