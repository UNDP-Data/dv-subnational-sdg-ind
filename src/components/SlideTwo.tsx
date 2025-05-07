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

export default function SlideTwoContent(props: Props) {
  const { graphData, yearsOptions, stateOptions } = props;
  const [selectedYear, setSelectedYear] = useState({
    label: '2022',
    value: '2022',
  });
  const [selectedState, setSelectedState] = useState<OptionsDataType | null>({
    label: 'Andaman and Nicobar Islands',
    value: 'Andaman and Nicobar Islands',
  });
  const [selectedView, setSelectedView] = useState<'chart' | 'table'>('chart');

  return (
    graphData && (
      <div className='flex flex-col justify-between grow w-full gap-2'>
        <div className='flex justify-between items-center gap-4 flex-wrap'>
          <P size='lg' marginBottom='none'>
            SDG Index Score for {selectedState?.value} ({selectedYear?.value})
          </P>
          <div className='flex gap-4 flex-wrap items-center'>
            <DropdownSelect
              onChange={option => setSelectedState(option as OptionsDataType)}
              options={stateOptions}
              defaultValue={selectedState}
              size='sm'
              placeholder='Highlight department'
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
              graphType='barChart'
              dataFilters={[
                {
                  column: 'year',
                  includeValues: selectedYear
                    ? [Number(selectedYear.value)]
                    : [],
                },
                {
                  column: 'state',
                  includeValues: selectedState ? [selectedState.value] : [],
                },
              ]}
              graphDataConfiguration={[
                { columnId: 'sdg', chartConfigId: 'label' },
                { columnId: 'value', chartConfigId: 'size' },
                { columnId: 'indexGroup', chartConfigId: 'color' },
              ]}
              graphSettings={{
                colors: ['#CB364B', '#F6C646', '#479E85', '#4EABE9'],
                showNAColor: false,
                showLabels: true,
              }}
            />
          )}
          {selectedView === 'table' && (
            <SingleGraphDashboard
              dataSettings={{
                data: graphData,
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
                {
                  column: 'state',
                  includeValues: selectedState ? [selectedState.value] : [],
                },
              ]}
              graphSettings={{
                height: 880,
                graphID: 'table',
                columnData: [
                  {
                    columnTitle: 'SDG',
                    columnId: 'sdg',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG Index Score',
                    columnId: 'value',
                    sortable: true,
                  },
                  {
                    columnTitle: 'Group',
                    columnId: 'indexGroup',
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
