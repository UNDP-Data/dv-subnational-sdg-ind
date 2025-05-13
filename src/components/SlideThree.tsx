import { useState } from 'react';
import { SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect, P, SegmentedControl } from '@undp/design-system-react';
import { ChartBar, ImageDownIcon, Table2 } from 'lucide-react';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

import IconGrid from './IconGrid';

import { GraphDataType, OptionsDataType } from '@/types';
import { colorMap, TABLE_HEIGHT } from '@/constants';

interface Props {
  graphData: GraphDataType[];
  mapData: FeatureCollection<Polygon | MultiPolygon>;
  yearsOptions: OptionsDataType[];
  areaOptions: OptionsDataType[];
  sdgOptions: OptionsDataType[];
}

export default function SlideThreeContent(props: Props) {
  const { graphData, mapData, yearsOptions, areaOptions, sdgOptions } = props;
  const [selectedYear, setSelectedYear] = useState(
    yearsOptions[yearsOptions.length - 1],
  );
  const [selectedArea, setSelectedArea] = useState<OptionsDataType | null>(
    null,
  );
  const [selectedSDG, setSelectedSDG] = useState<OptionsDataType>(
    sdgOptions[0],
  );
  const [selectedView, setSelectedView] = useState<'chart' | 'table' | 'map'>(
    'map',
  );
  const indiaValue = graphData.find(
    d => d.area === 'India' && d.year === selectedYear.value,
  )?.value;

  const filteredData = graphData.filter(
    row =>
      String(row.year) === selectedYear?.value &&
      row.sdg === selectedSDG?.label,
  );

  return (
    graphData && (
      <div className='bg-primary-white p-6 flex flex-col grow w-full gap-2'>
        <div className='flex justify-between items-center gap-4 flex-wrap'>
          <P size='lg' marginBottom='none'>
            Performance of States/UTs on{' '}
            {selectedSDG?.label === 'Composite Score'
              ? 'Composite Index Score'
              : `${selectedSDG?.label}`}{' '}
            ({selectedYear?.value})
          </P>
          <div className='flex gap-4 flex-wrap items-center'>
            <DropdownSelect
              onChange={option => setSelectedSDG(option as OptionsDataType)}
              options={sdgOptions}
              defaultValue={selectedSDG}
              size='sm'
              placeholder='Select SDG'
              className='min-w-[240px]'
              variant='light'
            />
            <DropdownSelect
              onChange={option => setSelectedArea(option as OptionsDataType)}
              options={areaOptions}
              isClearable={true}
              isDisabled={selectedView === 'table' ? true : false}
              defaultValue={selectedArea}
              size='sm'
              placeholder='Highlight area'
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
              defaultValue='map'
              size='sm'
              value={selectedView}
              color='black'
              onValueChange={value =>
                setSelectedView(value as 'chart' | 'table' | 'map')
              }
              options={[
                {
                  label: (
                    <div className='flex gap-2 h-fit items-center'>
                      <div className='h-fit'>
                        <ImageDownIcon size={16} strokeWidth={1.5} />
                      </div>
                      <P marginBottom='none' size='sm'>
                        Map
                      </P>
                    </div>
                  ),
                  value: 'map',
                },
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
              sdg={selectedSDG}
              keys={['area', 'sdg', 'value', 'group', 'year']}
              slideIndex={3}
            />
          </div>
        </div>
        <div className='grow flex mt-4'>
          {selectedView === 'map' && (
            <SingleGraphDashboard
              dataSettings={{
                data: graphData,
                fileType: 'csv',
              }}
              graphType='choroplethMap'
              dataFilters={[
                {
                  column: 'year',
                  includeValues: [selectedYear.value],
                },
                {
                  column: 'sdg',
                  includeValues: selectedSDG ? [selectedSDG.value] : [],
                },
              ]}
              graphDataConfiguration={[
                { columnId: 'area', chartConfigId: 'id' },
                { columnId: 'group', chartConfigId: 'x' },
              ]}
              graphSettings={{
                graphID: 'slide-3-map',
                mapData: mapData,
                isWorldMap: false,
                scale: 1.1,
                zoomScaleExtend: [1, 1],
                colorLegendTitle: 'SDG Index Score groups',
                mapNoDataColor: '#D4D6D8',
                categorical: true,
                tooltip: '{{id}} – <b>{{data.value}}</b>',
                colors: ['#CB364B', '#F6C646', '#479E85', '#4EABE9'],
                colorDomain: [
                  'Aspirant (0–49)',
                  'Performer (50–64)',
                  'Front Runner (65–99)',
                  'Achiever (100)',
                ],
                highlightedIds: selectedArea ? [selectedArea.value] : [],
              }}
            />
          )}
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
                  column: 'sdg',
                  includeValues: selectedSDG ? [selectedSDG.value] : [],
                },
              ]}
              graphDataConfiguration={[
                { columnId: 'area', chartConfigId: 'label' },
                { columnId: 'value', chartConfigId: 'size' },
                { columnId: 'group', chartConfigId: 'color' },
              ]}
              graphSettings={{
                graphID: 'slide-3-chart',
                colors: ['#CB364B', '#F6C646', '#479E85', '#4EABE9'],
                highlightedDataPoints: selectedArea ? [selectedArea.value] : [],
                colorLegendTitle: undefined,
                colorDomain: [
                  'Aspirant (0–49)',
                  'Performer (50–64)',
                  'Front Runner (65–99)',
                  'Achiever (100)',
                ],
                showNAColor: false,
                sortData: 'desc',
                showLabels: true,
                truncateBy: 3,
                refValues: indiaValue
                  ? [
                      {
                        value: indiaValue,
                        text:
                          selectedSDG?.label === 'Composite Score'
                            ? 'India Composite Index Score'
                            : `India ${selectedSDG?.label} Index Score`,
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
                        States/UTs
                      </th>
                      <th className='text-primary-gray-700 dark:text-primary-gray-100 text-sm p-4'>
                        {selectedSDG.label} Index Score
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
                          {row.area}
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
