import { useState } from 'react';
import { getUniqValue, SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect, P } from '@undp/design-system-react';

import IconGrid from '../IconGrid';
import ViewSelection from '../ViewSelection';

import { ChartTypes, GraphDataType, OptionsDataType } from '@/types';
import { COLOR_MAP, SDG_OPTIONS, TABLE_HEIGHT } from '@/constants';
import { pivotData } from '@/utils/pivotData';

interface Props {
  data: GraphDataType[];
  yearOptions: OptionsDataType[];
  areaOptions: OptionsDataType[];
}

export default function SlideTwoContent(props: Props) {
  const { data, yearOptions, areaOptions } = props;
  const [selectedView, setSelectedView] = useState<ChartTypes>('chart');
  const [selectedYear, setSelectedYear] = useState(
    yearOptions[yearOptions.length - 1],
  );
  const [selectedArea, setSelectedArea] = useState(areaOptions[0]);

  return (
    <div className='bg-primary-white p-6 flex flex-col grow w-full gap-2'>
      <div className='flex justify-between items-center gap-4 flex-wrap'>
        <P size='lg' marginBottom='none'>
          SDG Index Score for {selectedArea?.value} ({selectedYear?.value})
        </P>
        <div className='flex gap-4 flex-wrap items-center'>
          <DropdownSelect
            onChange={option => setSelectedArea(option as OptionsDataType)}
            options={getUniqValue(
              data.filter(row => `${row.year}` === `${selectedYear?.value}`),
              'area',
            ).map(area => ({
              label: area,
              value: area,
            }))}
            defaultValue={selectedArea}
            size='sm'
            placeholder='Select area'
            className='min-w-40'
            variant='light'
          />
          <DropdownSelect
            onChange={option => setSelectedYear(option as OptionsDataType)}
            options={yearOptions}
            isDisabled={selectedView === 'table'}
            size='sm'
            placeholder='Select year'
            isClearable={false}
            defaultValue={selectedYear}
            className='min-w-40'
            variant='light'
          />
          <ViewSelection
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            slideIndex={2}
          />
          <IconGrid
            selectedView={selectedView}
            data={data}
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
              data: data,
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
                includeValues: SDG_OPTIONS.map(d => d.value),
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
              colors: COLOR_MAP.map(item => item.color),
              colorDomain: COLOR_MAP.map(item => item.value),
              graphID: `slide-2-chart`,
              labelOrder: SDG_OPTIONS.map(sdg => sdg.value).filter(
                sdg => sdg !== 'Comp. Score',
              ),
              showNAColor: false,
              colorLegendTitle: undefined,
              showLabels: true,
              filterNA: false,
              maxValue: 100,
              bottomMargin: 40,
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
              <SingleGraphDashboard
                dataSettings={{
                  data: pivotData(data),
                }}
                graphType='dataTable'
                dataFilters={[
                  {
                    column: 'area',
                    includeValues: [selectedArea.label],
                  },
                  {
                    column: '2023–24',
                    excludeValues: [NaN, null, undefined],
                  },
                  {
                    column: '2020–21',
                    excludeValues: [NaN, null, undefined],
                  },
                  {
                    column: '2018',
                    excludeValues: [NaN, null, undefined],
                  },
                  {
                    column: '2019',
                    excludeValues: [NaN, null, undefined],
                  },
                  {
                    column: 'group2023–24',
                    excludeValues: [NaN, null, undefined],
                  },
                  {
                    column: 'group2020–21',
                    excludeValues: [NaN, null, undefined],
                  },
                  {
                    column: 'group2018',
                    excludeValues: [NaN, null, undefined],
                  },
                  {
                    column: 'group2019',
                    excludeValues: [NaN, null, undefined],
                  },
                ]}
                graphSettings={{
                  height: TABLE_HEIGHT,
                  columnData: [
                    {
                      columnTitle: 'SDGs',
                      columnId: 'sdg',
                    },
                    {
                      columnTitle: '2023–24',
                      columnId: '2023–24',
                      chip: true,
                      chipColumnId: 'group2023–24',
                      chipColors: COLOR_MAP,
                    },
                  ],
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
