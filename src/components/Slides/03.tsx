import { useEffect, useState } from 'react';
import { SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect, P } from '@undp/design-system-react';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

import IconGrid from '../IconGrid';
import ViewSelection from '../ViewSelection';

import { ChartTypes, GraphDataType, OptionsDataType } from '@/types';
import { COLOR_MAP, TABLE_HEIGHT } from '@/constants';
import { pivotData } from '@/utils/pivotData';

interface Props {
  data: GraphDataType[];
  mapData: FeatureCollection<Polygon | MultiPolygon>;
  yearOptions: OptionsDataType[];
  areaOptions: OptionsDataType[];
  sdgOptions: OptionsDataType[];
}

export default function SlideThreeContent(props: Props) {
  const { data, mapData, yearOptions, areaOptions, sdgOptions } = props;
  const [selectedView, setSelectedView] = useState<ChartTypes>('map');
  const [selectedYear, setSelectedYear] = useState(
    yearOptions[yearOptions.length - 1],
  );
  const [pivotedDataByYears, setPivotedDataByYears] = useState(pivotData(data));
  const [refValue, setRefValue] = useState(
    data.find(
      d =>
        d.area === 'India' &&
        d.year === yearOptions[yearOptions.length - 1].value,
    )?.value,
  );
  const [selectedArea, setSelectedArea] = useState<OptionsDataType[] | null>([
    { label: 'India', value: 'India' },
  ]);
  const [selectedSDG, setSelectedSDG] = useState<OptionsDataType>(
    sdgOptions[0],
  );

  useEffect(() => {
    setPivotedDataByYears(pivotData(data));
  }, [data, yearOptions]);

  useEffect(() => {
    setRefValue(
      data.find(d => d.area === 'India' && d.year === selectedYear.value)
        ?.value,
    );
  }, [selectedYear, data]);

  return (
    <div className='bg-primary-white p-6 flex flex-col grow w-full gap-2'>
      <div className='flex justify-between items-center gap-4 flex-wrap'>
        <P size='lg' marginBottom='none'>
          Performance of States/UTs on{' '}
          {selectedSDG?.label === 'Comp. Score'
            ? 'Composite Index Score'
            : `${selectedSDG?.label}`}{' '}
          ({selectedYear?.value})
        </P>
        <div className='flex gap-4 flex-wrap items-center'>
          {selectedView === 'trends' ? (
            <DropdownSelect
              onChange={option => setSelectedArea(option as OptionsDataType[])}
              options={areaOptions}
              value={selectedArea}
              isClearable={true}
              isMulti={true}
              defaultValue={selectedArea}
              size='sm'
              placeholder='Highlight area'
              className='min-w-40'
              variant='light'
            />
          ) : null}
          <DropdownSelect
            onChange={option => setSelectedSDG(option as OptionsDataType)}
            options={sdgOptions}
            defaultValue={selectedSDG}
            size='sm'
            placeholder='Select SDG'
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
            slideIndex={3}
          />
          <IconGrid
            selectedView={selectedView}
            data={pivotedDataByYears}
            sdg={selectedSDG}
            keys={['area', 'sdg', '2018', '2019', '2020-21', '2023–24']}
            slideIndex={3}
          />
        </div>
      </div>
      <div className='grow flex mt-4'>
        {selectedView === 'map' && (
          <div className='w-full h-full'>
            <div
              className='flex leading-0'
              aria-label='Color legend'
              style={{ maxWidth: 'none' }}
            >
              <div>
                <div className='flex flex-wrap gap-4 mb-0'>
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
            <SingleGraphDashboard
              dataSettings={{
                data: data,
              }}
              graphType='choroplethMap'
              dataFilters={[
                {
                  column: 'year',
                  includeValues: [selectedYear.value],
                },
                {
                  column: 'area',
                  excludeValues: ['India'],
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
                height: TABLE_HEIGHT,
                scale: 1.1,
                zoomScaleExtend: [1, 1],
                mapNoDataColor: '#D4D6D8',
                showColorScale: false,
                scaleType: 'categorical',
                colors: ['#CB364B', '#F6C646', '#479E85', '#4EABE9'],
                colorDomain: [
                  'Aspirant (0–49)',
                  'Performer (50–64)',
                  'Front Runner (65–99)',
                  'Achiever (100)',
                ],
                tooltip:
                  '<div class="font-bold p-2 bg-primary-gray-300 uppercase text-xs">{{id}} ({{data.year}})</div><div class="p-2 flex justify-between"><div>{{data.sdg}}</div><div>{{data.value}}</div></div>',
                styles: {
                  tooltip: {
                    padding: '0',
                    minWidth: '150px',
                  },
                },
              }}
            />
          </div>
        )}
        {selectedView === 'chart' && (
          <SingleGraphDashboard
            dataSettings={{
              data: data,
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
              {
                column: 'area',
                excludeValues: ['India'],
              },
            ]}
            graphDataConfiguration={[
              { columnId: 'area', chartConfigId: 'label' },
              { columnId: 'value', chartConfigId: 'size' },
              { columnId: 'group', chartConfigId: 'color' },
            ]}
            graphSettings={{
              graphID: 'slide-3-chart',
              orientation: 'horizontal',
              colors: COLOR_MAP.map(item => item.color),
              colorDomain: COLOR_MAP.map(item => item.value),
              colorLegendTitle: undefined,
              leftMargin: 170,
              showTicks: false,

              showNAColor: false,
              sortData: 'desc',
              showLabels: true,
              truncateBy: 20,
              refValues: refValue
                ? [
                    {
                      value: refValue,
                      text:
                        selectedSDG?.label === 'Comp. Score'
                          ? 'India Composite Index Score'
                          : `India ${selectedSDG?.label} Index Score (${refValue})`,
                      color: '#000000',
                    },
                  ]
                : undefined,
              tooltip:
                '<div class="font-bold p-2 bg-primary-gray-300 uppercase text-xs">{{label}} ({{data.year}})</div><div class="p-2 flex justify-between"><div>{{data.sdg}}</div><div>{{size}}</div></div>',
              styles: {
                tooltip: {
                  padding: '0',
                  minWidth: '150px',
                },
              },
            }}
          />
        )}
        {selectedView === 'trends' && (
          <SingleGraphDashboard
            dataSettings={{
              data: data,
            }}
            graphType='multiLineAltChart'
            dataFilters={[
              {
                column: 'sdg',
                includeValues: selectedSDG ? [selectedSDG.value] : [],
              },
              {
                column: 'groupLatest',
                excludeValues: ['', NaN, undefined, null],
              },
            ]}
            graphDataConfiguration={[
              { columnId: 'yearFormatted', chartConfigId: 'date' },
              { columnId: 'area', chartConfigId: 'label' },
              {
                columnId: 'value',
                chartConfigId: 'y',
              },
              {
                columnId: 'groupLatest',
                chartConfigId: 'color',
              },
            ]}
            graphSettings={{
              graphID: 'slide-4-chart',
              curveType: 'curve',
              noOfXTicks: window.innerWidth < 768 ? 5 : 12,
              showNAColor: false,
              valueColor: '#000000',
              strokeWidth: 1.5,
              rightMargin: 150,
              showDots: true,
              styles: {
                tooltip: {
                  padding: '0',
                  minWidth: '150px',
                },
              },
              colorDomain: [
                'Aspirant (0–49)',
                'Performer (50–64)',
                'Front Runner (65–99)',
                'Achiever (100)',
              ],
              colors: ['#CB364B', '#F6C646', '#479E85', '#4EABE9'],
              footNote:
                'Colors are assigned based on the latest available SDG Index data (2023–24).',
              highlightedLines: selectedArea
                ? selectedArea.map(area => area.value)
                : [],
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
              <div
                className='overflow-y-auto undp-scrollbar w-full'
                style={{ height: `${TABLE_HEIGHT}px` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
