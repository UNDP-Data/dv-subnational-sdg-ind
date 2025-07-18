import { useEffect, useState } from 'react';
import { SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect, P } from '@undp/design-system-react';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

import IconGrid from '../IconGrid';
import ViewSelection from '../ViewSelection';
import Legend from '../Legend';

import { ChartTypes, GraphDataType, OptionsDataType } from '@/types';
import {
  COLOR_MAP,
  GENERAL_NOTE,
  LEGEND_HEIGHT,
  TREND_NOTE,
  VIS_HEIGHT,
} from '@/constants';
import { pivotData } from '@/utils/pivotData';

interface Props {
  data: GraphDataType[];
  mapData2020: FeatureCollection<Polygon | MultiPolygon>;
  mapDataBefore2020: FeatureCollection<Polygon | MultiPolygon>;
  yearOptions: OptionsDataType[];
  areaOptions: OptionsDataType[];
  sdgOptions: OptionsDataType[];
}

export default function SlideThreeContent(props: Props) {
  const {
    data,
    mapData2020,
    mapDataBefore2020,
    yearOptions,
    areaOptions,
    sdgOptions,
  } = props;
  const [selectedView, setSelectedView] = useState<ChartTypes>('map');
  const [selectedYear, setSelectedYear] = useState(yearOptions[0]);
  const [pivotedDataByYears, setPivotedDataByYears] = useState(pivotData(data));
  const [refValue, setRefValue] = useState(
    data.find(
      d =>
        d.area === 'India' &&
        d.year === yearOptions[yearOptions.length - 1].label &&
        d.sdg === sdgOptions[0].value,
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
      data.find(
        d =>
          d.area === 'India' &&
          d.year === selectedYear.label &&
          d.sdg === selectedSDG.value,
      )?.value,
    );
  }, [selectedYear, selectedSDG, data]);

  return (
    <div className='bg-primary-white p-6 flex flex-col grow w-full gap-2'>
      <div className='flex justify-between items-center gap-4 flex-wrap'>
        <ViewSelection
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          slideIndex={3}
        />
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
              className='w-[320px]'
              variant='light'
            />
          ) : null}
          <DropdownSelect
            onChange={option => setSelectedSDG(option as OptionsDataType)}
            options={sdgOptions}
            defaultValue={selectedSDG}
            size='sm'
            placeholder='Select SDG'
            className='w-[320px]'
            variant='light'
          />
          <DropdownSelect
            onChange={option => setSelectedYear(option as OptionsDataType)}
            options={yearOptions}
            isDisabled={selectedView === 'table' || selectedView === 'trends'}
            size='sm'
            placeholder='Select year'
            isClearable={false}
            defaultValue={selectedYear}
            className='min-w-40'
            variant='light'
          />
          <IconGrid
            selectedView={selectedView}
            data={pivotedDataByYears}
            sdg={selectedSDG}
            keys={['area', 'sdg', '2018', '2019', '2020-21', '2023-24']}
            slideIndex={3}
          />
        </div>
      </div>
      <div className='grow flex mt-4'>
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
                includeValues: selectedSDG ? [selectedSDG.value] : [],
              },
              {
                column: 'area',
                excludeValues: ['India', 'Target'],
              },
            ]}
            graphDataConfiguration={[
              { columnId: 'area', chartConfigId: 'label' },
              { columnId: 'value', chartConfigId: 'size' },
              { columnId: 'group', chartConfigId: 'color' },
            ]}
            graphSettings={{
              graphID: 'slide-3-chart',
              graphTitle:
                selectedSDG.value === 'Comp. Score'
                  ? `${selectedSDG.label}, ${selectedYear.label}`
                  : `${selectedSDG.value} Index Score, ${selectedYear.label}`,
              orientation: 'horizontal',
              colors: COLOR_MAP.map(item => item.color),
              colorDomain: COLOR_MAP.map(item => item.value),
              colorLegendTitle: undefined,
              leftMargin: 170,
              footNote:
                'Note: From 2020, Dadra and Nagar Haveli and Daman and Diu were merged into one Union Territory.',
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
                          : `India ${selectedSDG?.label} Index Score ${refValue}`,
                      color: '#000000',
                      styles: {
                        line: { strokeWidth: '1px' },
                        text: { fontWeight: 600 },
                      },
                    },
                  ]
                : undefined,
              tooltip:
                '<div class="font-bold min-w-[240px] p-2 bg-primary-gray-300 uppercase text-xs">{{label}} ({{data.year}})</div><div class="p-2 flex justify-between"><div>{{data.sdg}} Index Score</div><div>{{size}}</div></div>',
              styles: {
                tooltip: {
                  padding: '0',
                  minWidth: '150px',
                },
              },
            }}
          />
        )}
        {selectedView === 'map' && (
          <div className='w-full h-full'>
            <SingleGraphDashboard
              dataSettings={{
                data: data,
              }}
              graphType='choroplethMap'
              dataFilters={[
                {
                  column: 'year',
                  includeValues: [selectedYear.label],
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
                graphTitle:
                  selectedSDG.value === 'Comp. Score'
                    ? `${selectedSDG.label}, ${selectedYear.label}`
                    : `${selectedSDG.value} Index Score, ${selectedYear.label}`,
                mapData:
                  parseInt(selectedYear.value) < 2020
                    ? mapDataBefore2020
                    : mapData2020,
                mapProperty: 'State_Name',
                footNote:
                  'Note: From 2020, Dadra and Nagar Haveli and Daman and Diu were merged into one Union Territory.',
                isWorldMap: false,
                height: VIS_HEIGHT + LEGEND_HEIGHT,
                mapNoDataColor: '#D4D6D8',
                scaleType: 'categorical',
                colorLegendTitle: undefined,
                colors: ['#CB364B', '#F6C646', '#479E85', '#4EABE9'],
                colorDomain: [
                  'Aspirant (0-49)',
                  'Performer (50-64)',
                  'Front Runner (65-99)',
                  'Achiever (100)',
                ],
                tooltip:
                  '<div class="font-bold p-2 min-w-[240px] bg-primary-gray-300 uppercase text-xs">{{id}} ({{data.year}})</div><div class="p-2 flex justify-between"><div>{{data.sdg}}</div><div>{{data.value}}</div></div>',
                styles: {
                  tooltip: {
                    padding: '0',
                  },
                },
              }}
            />
          </div>
        )}
        {selectedView === 'trends' && (
          <SingleGraphDashboard
            dataSettings={{
              data: data,
            }}
            graphType='multiLineAltChart'
            debugMode
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
              graphTitle:
                selectedSDG.value === 'Comp. Score'
                  ? `${selectedSDG.label}`
                  : `${selectedSDG.value} Index Score`,
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
                'Aspirant (0-49)',
                'Performer (50-64)',
                'Front Runner (65-99)',
                'Achiever (100)',
              ],
              colors: ['#CB364B', '#F6C646', '#479E85', '#4EABE9'],
              footNote: (
                <>
                  <div className='text-sm text-primary-gray-550 space-y-1'>
                    Notes:
                  </div>
                  <div className='text-sm text-primary-gray-550 space-y-1'>
                    {GENERAL_NOTE}
                  </div>
                  <div className='text-sm text-primary-gray-550 space-y-1'>
                    {TREND_NOTE}
                  </div>
                </>
              ),
              highlightedLines: selectedArea
                ? selectedArea.map(area => area.value)
                : [],
            }}
          />
        )}
        {selectedView === 'table' && (
          <div className='w-full'>
            <P marginBottom='sm'>
              {selectedSDG.value === 'Comp. Score'
                ? `${selectedSDG.label}`
                : `${selectedSDG.value} Index Score`}
            </P>
            <Legend />
            <div className='grow flex mt-4 w-full'>
              <SingleGraphDashboard
                dataSettings={{
                  data: pivotData(data),
                }}
                graphType='dataTable'
                dataFilters={[
                  {
                    column: 'sdg',
                    includeValues: [selectedSDG.value],
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
                  columnData: [
                    {
                      columnTitle: 'area',
                      columnId: 'area',
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
                      columnTitle: '2020-21',
                      columnId: '2020-21',
                      chip: true,
                      chipColumnId: 'group2020-21',
                      chipColors: COLOR_MAP,
                    },
                    {
                      columnTitle: '2023-24',
                      columnId: '2023-24',
                      chip: true,
                      chipColumnId: 'group2023-24',
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
