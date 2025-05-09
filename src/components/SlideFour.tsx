import { useState } from 'react';
import { SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect, P, SegmentedControl } from '@undp/design-system-react';
import { ChartBar, Table2 } from 'lucide-react';

import IconGrid from './IconGrid';

import { GraphDataType, OptionsDataType } from '@/types';
import { pivotData } from '@/utils/pivotData';

interface Props {
  graphData: GraphDataType[];
  stateOptions: OptionsDataType[];
  SDGOptions: OptionsDataType[];
}

export default function SlideFourContent(props: Props) {
  const { graphData, stateOptions, SDGOptions } = props;
  const [selectedState, setSelectedState] = useState<OptionsDataType[] | null>(
    null,
  );
  const [selectedSDG, setSelectedSDG] = useState<OptionsDataType | null>({
    label: 'SDG 1',
    value: 'SDG 1',
  });
  const [selectedView, setSelectedView] = useState<'chart' | 'table'>('chart');

  const pivotedDataByYears = pivotData(graphData, 'year');
  return (
    graphData &&
    pivotedDataByYears && (
      <div className='flex flex-col justify-between w-full gap-2 grow'>
        <div className='flex justify-between items-center gap-4 flex-wrap'>
          <P size='lg' marginBottom='none'>
            SDG Index Score by States
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
              onChange={option => setSelectedState(option as OptionsDataType[])}
              options={stateOptions}
              isClearable={true}
              defaultValue={selectedState}
              size='sm'
              isMulti={true}
              placeholder='Highlight state'
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
              graphType='multiLineAltChart'
              dataFilters={[
                {
                  column: 'sdg',
                  includeValues: selectedSDG ? [selectedSDG.value] : [],
                },
              ]}
              graphDataConfiguration={[
                { columnId: 'year', chartConfigId: 'date' },
                { columnId: 'state', chartConfigId: 'label' },
                {
                  columnId: 'value',
                  chartConfigId: 'y',
                },
                { columnId: 'colorId', chartConfigId: 'color' },
              ]}
              graphSettings={{
                showColorScale: false,
                curveType: 'curve',
                noOfXTicks: window.innerWidth < 768 ? 5 : 12,
                rightMargin: window.innerWidth < 768 ? 18 : 64,
                colorLegendTitle: 'SDG Index groups',
                colorDomain: [
                  'Aspirant',
                  'Performer',
                  'Front Runner',
                  'Achiever',
                ],
                colors: ['#CB364B', '#F6C646', '#479E85', '#4EABE9'],
                showNAColor: false,
                valueColor: '#000000',
                strokeWidth: 1,
                showDots: false,
                tooltip: 'test',
                footNote:
                  'Colors are assigned according to SDG Index values from the year 2022',
                highlightedLines: selectedState
                  ? selectedState.map(state => state.value)
                  : [],
              }}
            />
          )}
          {selectedView === 'table' && (
            <SingleGraphDashboard
              dataSettings={{
                data: pivotedDataByYears,
                fileType: 'csv',
              }}
              dataFilters={[
                {
                  column: 'sdg',
                  includeValues: [selectedSDG?.value],
                },
              ]}
              graphType='dataTable'
              graphSettings={{
                height: 500,
                columnData: [
                  {
                    columnTitle: 'State',
                    columnId: 'state',
                    sortable: true,
                  },
                  {
                    columnTitle: '2015',
                    columnId: '2015',
                    sortable: true,
                  },
                  {
                    columnTitle: '2016',
                    columnId: '2016',
                    sortable: true,
                  },
                  {
                    columnTitle: '2017',
                    columnId: '2017',
                    sortable: true,
                  },
                  {
                    columnTitle: '2018',
                    columnId: '2018',
                    sortable: true,
                  },
                  {
                    columnTitle: '2019',
                    columnId: '2019',
                    sortable: true,
                  },
                  {
                    columnTitle: '2020',
                    columnId: '2020',
                    sortable: true,
                  },
                  {
                    columnTitle: '2021',
                    columnId: '2021',
                    sortable: true,
                  },
                  {
                    columnTitle: '2022',
                    columnId: '2022',
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
