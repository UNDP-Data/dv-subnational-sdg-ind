import { useState } from 'react';
import { getUniqValue, SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect } from '@undp/design-system-react';

import IconGrid from '../IconGrid';
import ViewSelection from '../ViewSelection';
import Legend from '../Legend';

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
  const [selectedYear, setSelectedYear] = useState(yearOptions[0]);
  const [selectedArea, setSelectedArea] = useState(areaOptions[1]);

  const compScoreValue = Number(
    data.find(
      d =>
        d['sdg'] === 'Comp. Score' &&
        d['year'] === selectedYear.label &&
        d['area'] === selectedArea.label,
    )?.['value'],
  );

  const filteredAreas = getUniqValue(
    data.filter(row => `${row.year}` === `${selectedYear?.value}`),
    'area',
  )
    .filter(area => area !== 'Target')
    .sort((a, b) => {
      if (a === 'India') return -1;
      if (b === 'India') return 1;
      return a.localeCompare(b);
    })
    .map(area => ({
      label: area,
      value: area,
    }));

  const allowedSDGs = SDG_OPTIONS.map(option => option.value);
  return (
    <div className='bg-primary-white p-6 flex flex-col grow w-full gap-2'>
      <div className='flex justify-between items-center gap-4 flex-wrap'>
        <ViewSelection
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          slideIndex={2}
        />
        <div className='flex gap-4 flex-wrap items-center'>
          <DropdownSelect
            onChange={option => setSelectedArea(option as OptionsDataType)}
            options={filteredAreas}
            defaultValue={selectedArea}
            size='sm'
            placeholder='Select state/UT'
            className='w-[320px]'
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
          <IconGrid
            selectedView={selectedView}
            data={data.filter(item => allowedSDGs.includes(item.sdg))}
            year={selectedYear}
            area={selectedArea}
            keys={['area', 'sdg', 'value', 'year']}
            slideIndex={2}
          />
        </div>
      </div>
      <div className='grow flex mt-4 overflow-y-hidden'>
        {selectedView === 'chart' && (
          <SingleGraphDashboard
            dataSettings={{
              data: data,
            }}
            graphType='barChart'
            dataFilters={[
              {
                column: 'year',
                includeValues: [selectedYear.label],
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
              refValues: [
                {
                  value: compScoreValue ? compScoreValue : null,
                  text: `Composite Score (${compScoreValue})`,
                  color: '#000000',
                },
              ],
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
            <Legend />
            <div className='grow flex w-full'>
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
                    column: 'sdg',
                    includeValues: SDG_OPTIONS.map(item => item.value),
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
                      columnTitle: '2018',
                      columnId: '2018',
                      chip: true,
                      chipColumnId: 'group2018',
                      chipColors: COLOR_MAP,
                    },
                    {
                      columnTitle: '2019',
                      columnId: '2019',
                      chip: true,
                      chipColumnId: 'group2019',
                      chipColors: COLOR_MAP,
                    },
                    {
                      columnTitle: '2020–21',
                      columnId: '2020–21',
                      chip: true,
                      chipColumnId: 'group2020–21',
                      chipColors: COLOR_MAP,
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
