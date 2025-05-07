import { useState } from 'react';
import { SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect, P, SegmentedControl } from '@undp/design-system-react';
import { ChartBar, Table2 } from 'lucide-react';

import IconGrid from './IconGrid';

import { GraphDataType, OptionsDataType } from '@/types';

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

  return (
    graphData && (
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
                height: 800,
                scaleType: 'categorical',
              }}
            />
          )}
          {selectedView === 'table' && (
            <SingleGraphDashboard
              dataSettings={{
                dataURL: '/data/placeholderWide.csv',
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
                height: 880,
                graphID: 'table',
                columnData: [
                  {
                    columnTitle: 'State',
                    columnId: 'state',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG1',
                    columnId: 'SDG_1',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG2',
                    columnId: 'SDG_2',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG3',
                    columnId: 'SDG_3',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG4',
                    columnId: 'SDG_4',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG5',
                    columnId: 'SDG_5',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG7',
                    columnId: 'SDG_7',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG8',
                    columnId: 'SDG_8',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG9',
                    columnId: 'SDG_9',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG10',
                    columnId: 'SDG_10',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG11',
                    columnId: 'SDG_11',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG12',
                    columnId: 'SDG_12',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG13',
                    columnId: 'SDG_13',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG14',
                    columnId: 'SDG_14',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG15',
                    columnId: 'SDG_15',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG16',
                    columnId: 'SDG_16',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG17',
                    columnId: 'SDG_17',
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
