import { useState } from 'react';
import { SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect, P, SegmentedControl } from '@undp/design-system-react';
import { ChartBar, Table2 } from 'lucide-react';

import IconGrid from './IconGrid';

import { GraphDataType, OptionsDataType } from '@/types';
import { pivotData } from '@/utils/pivotData';

interface Props {
  graphData: GraphDataType[];
  yearsOptions: OptionsDataType[];
  stateOptions: OptionsDataType[];
}

export default function SlideOneContent(props: Props) {
  const { graphData, yearsOptions } = props;
  const [selectedYear, setSelectedYear] = useState({
    label: '2022',
    value: '2022',
  });
  const [selectedView, setSelectedView] = useState<'chart' | 'table'>('chart');

  const pivotedDataBySDG = pivotData(graphData, 'sdg');
  return (
    graphData &&
    pivotedDataBySDG && (
      <div className='flex flex-col justify-between grow w-full gap-2'>
        <div className='flex justify-between items-center gap-4 flex-wrap'>
          <P size='lg' marginBottom='none'>
            SDG Index Score by States ({selectedYear?.value})
          </P>
          <div className='flex gap-4 flex-wrap items-center'>
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
          {selectedView === 'chart' && (
            <SingleGraphDashboard
              dataSettings={{
                data: graphData,
                fileType: 'csv',
              }}
              debugMode={true}
              graphType='heatMap'
              dataFilters={[
                {
                  column: 'year',
                  includeValues: selectedYear
                    ? [Number(selectedYear.value)]
                    : [],
                },
              ]}
              graphDataConfiguration={[
                { columnId: 'state', chartConfigId: 'row' },
                { columnId: 'indexGroup', chartConfigId: 'value' },
                { columnId: 'sdg', chartConfigId: 'column' },
              ]}
              graphSettings={{
                colorDomain: [
                  'Aspirant',
                  'Performer',
                  'Front Runner',
                  'Achiever',
                ],
                colors: ['#CB364B', '#F6C646', '#479E85', '#4EABE9'],
                showNAColor: false,
                scaleType: 'categorical',
                truncateBy: 10,
              }}
            />
          )}
          {selectedView === 'table' && (
            <SingleGraphDashboard
              dataSettings={{
                data: pivotedDataBySDG,
                fileType: 'csv',
              }}
              graphType='dataTable'
              dataFilters={[
                {
                  column: 'year',
                  includeValues: selectedYear
                    ? [Number(selectedYear.value)]
                    : [],
                },
              ]}
              graphSettings={{
                columnData: [
                  {
                    columnTitle: 'State',
                    columnId: 'state',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 1',
                    columnId: 'SDG 1',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 2',
                    columnId: 'SDG 2',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 3',
                    columnId: 'SDG 3',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 4',
                    columnId: 'SDG 4',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 5',
                    columnId: 'SDG 5',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 7',
                    columnId: 'SDG 7',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 8',
                    columnId: 'SDG 8',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 9',
                    columnId: 'SDG 9',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 10',
                    columnId: 'SDG 10',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 11',
                    columnId: 'SDG 11',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 12',
                    columnId: 'SDG 12',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 13',
                    columnId: 'SDG 13',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 14',
                    columnId: 'SDG 14',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 15',
                    columnId: 'SDG 15',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 16',
                    columnId: 'SDG 16',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG 17',
                    columnId: 'SDG 17',
                    sortable: true,
                  },
                ],
              }}
            />
          )}
        </div>
      </div>
    )
  );
}
