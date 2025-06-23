import { useState } from 'react';
import { SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect, P } from '@undp/design-system-react';

import IconGrid from '../IconGrid';
import ViewSelection from '../ViewSelection';
import Legend from '../Legend';

import {
  ChartTypes,
  GraphDataType,
  OptionsDataType,
  RawDataType,
} from '@/types';
import { COLOR_MAP, SDG_OPTIONS, VIS_HEIGHT } from '@/constants';

interface Props {
  longData: GraphDataType[];
  wideData: RawDataType[];
  yearOptions: OptionsDataType[];
  sdgOptions: OptionsDataType[];
}

export default function SlideOneContent(props: Props) {
  const { longData, wideData, yearOptions, sdgOptions } = props;
  const [selectedYear, setSelectedYear] = useState(yearOptions[0]);
  const [selectedView, setSelectedView] = useState<ChartTypes>('chart');

  return (
    <div className='bg-primary-white p-6 flex flex-col grow w-full gap-2'>
      <div className='flex justify-between items-center gap-4 flex-wrap'>
        <ViewSelection
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          slideIndex={1}
        />
        <div className='flex gap-4 flex-wrap items-center'>
          <DropdownSelect
            onChange={option => setSelectedYear(option as OptionsDataType)}
            options={[...yearOptions]}
            size='sm'
            placeholder='Select year'
            isClearable={false}
            defaultValue={selectedYear}
            className='min-w-40'
            variant='light'
          />
          <IconGrid
            selectedView={selectedView}
            data={wideData}
            year={selectedYear}
            keys={['area', 'year', ...sdgOptions.map(opt => opt.value)]}
            slideIndex={1}
          />
        </div>
      </div>
      <div className='grow flex mt-4 overflow-y-hidden'>
        {selectedView === 'chart' && (
          <SingleGraphDashboard
            dataSettings={{
              data: longData,
            }}
            graphType='heatMap'
            dataFilters={[
              {
                column: 'year',
                includeValues: [`${selectedYear.label}`],
              },
              {
                column: 'sdg',
                includeValues: SDG_OPTIONS.map(d => d.value),
              },
              {
                column: 'area',
                excludeValues: ['Target'],
              },
            ]}
            graphDataConfiguration={[
              { columnId: 'area', chartConfigId: 'row' },
              { columnId: 'group', chartConfigId: 'value' },
              { columnId: 'sdg', chartConfigId: 'column' },
            ]}
            graphSettings={{
              graphID: `slide-1-chart`,
              graphTitle: `SDG Index Scores across States/UTs, ${selectedYear.label}`,
              footNote:
                'Note: From 2020, Dadra and Nagar Haveli and Daman and Diu were merged into one Union Territory.',
              colors: COLOR_MAP.map(item => item.color),
              colorDomain: COLOR_MAP.map(item => item.value),
              showNAColor: false,
              scaleType: 'categorical',
              truncateBy: 25,
              leftMargin: 170,
              tooltip:
                '<div class="font-bold min-w-[240px] p-2 bg-primary-gray-300 uppercase text-xs">{{row}} ({{data.year}})</div><div class="p-2 flex justify-between"><div>{{column}}</div><div>{{data.value}}</div></div>',
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
          <div className='undp-scrollbar'>
            <P marginBottom='sm'>
              SDG Index Scores across States/UTs, {selectedYear.label}
            </P>
            <Legend />
            <SingleGraphDashboard
              dataSettings={{
                data: wideData,
              }}
              graphType='dataTable'
              dataFilters={[
                {
                  column: 'year',
                  includeValues: [selectedYear.label],
                },
                {
                  column: 'area',
                  excludeValues: ['Target'],
                },
              ]}
              graphSettings={{
                height: VIS_HEIGHT,
                footNote:
                  'Note: From 2020, Dadra and Nagar Haveli and Daman and Diu were merged into one Union Territory.',
                minWidth: '2000px',
                columnData: [
                  {
                    columnTitle: 'States/UTs',
                    columnId: 'area',
                    columnWidth: 3,
                  },
                  ...SDG_OPTIONS.map(d => ({
                    columnTitle: d.value,
                    columnId: d.value,
                    sortable: true,
                    columnWidth: d.value === 'Comp. Score' ? 1.5 : undefined,
                    chip: true,
                    chipColumnId: `${d.value} Group`,
                    chipColors: COLOR_MAP,
                  })),
                ],
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
