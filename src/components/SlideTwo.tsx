import { useState } from 'react';
import { getUniqValue, SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect, P } from '@undp/design-system-react';

import IconGrid from './IconGrid';
import ViewSelection from './ViewSelection';

import { GraphDataType, OptionsDataType } from '@/types';
import { colorMap, sdgList, SDGS, TABLE_HEIGHT } from '@/constants';
import { pivotData } from '@/utils/pivotData';

interface Props {
  longData: GraphDataType[];
  yearOptions: OptionsDataType[];
  areaOptions: OptionsDataType[];
}

export default function SlideTwoContent(props: Props) {
  const { longData, yearOptions, areaOptions } = props;
  const [selectedView, setSelectedView] = useState<
    'chart' | 'table' | 'map' | 'trends'
  >('chart');
  const [selectedYear, setSelectedYear] = useState(
    yearOptions[yearOptions.length - 1],
  );
  const [selectedArea, setSelectedArea] = useState(areaOptions[0]);
  const sdgOrder = SDGS.filter(sdg => sdg.value !== 'Comp. Score').map(
    sdg => sdg.value,
  );

  const pivotedDataByYears = pivotData(longData);

  const filteredBySelectedYear = longData.filter(
    row => String(row.year) === String(selectedYear?.value),
  );
  const areaOptionsForSeletedYear = getUniqValue(
    filteredBySelectedYear,
    'area',
  ).map(area => ({
    label: area,
    value: area,
  }));

  // const compScoreValue = Number(
  //   longData.find(
  //     d => d['sdg'] === 'Comp. Score' && d['year'] === selectedYear.label,
  //   )?.['value'],
  // );

  return (
    longData && (
      <div className='bg-primary-white p-6 flex flex-col grow w-full gap-2'>
        <div className='flex justify-between items-center gap-4 flex-wrap'>
          <P size='lg' marginBottom='none'>
            SDG Index Score for {selectedArea?.value} ({selectedYear?.value})
          </P>
          <div className='flex gap-4 flex-wrap items-center'>
            <DropdownSelect
              onChange={option => setSelectedArea(option as OptionsDataType)}
              options={areaOptionsForSeletedYear}
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
              data={longData}
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
                data: longData,
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
                  includeValues: sdgList,
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
                colors: colorMap.map(item => item.color),
                colorDomain: colorMap.map(item => item.value),
                graphID: `slide-2-chart`,
                labelOrder: sdgOrder,
                showNAColor: false,
                colorLegendTitle: undefined,
                showLabels: true,
                filterNA: false,
                maxValue: 100,
                bottomMargin: 40,
                // refValues: [
                //   {
                //     value: compScoreValue ? compScoreValue : null,
                //     text: `Composite Score (${compScoreValue})`,
                //     color: '#000000',
                //   },
                // ],
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
                    data: pivotedDataByYears,
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
                        chipColors: colorMap,
                      },
                    ],
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}
