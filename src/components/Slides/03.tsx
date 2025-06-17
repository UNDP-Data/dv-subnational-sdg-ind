import { useEffect, useState } from 'react';
import { fetchAndParseCSV, SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect } from '@undp/design-system-react';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

// import IconGrid from '../IconGrid';
import ViewSelection from '../ViewSelection';
import Legend from '../Legend';

import {
  ChartTypes,
  GraphDataType,
  MetaDataType,
  OptionsDataType,
} from '@/types';
import { COLOR_MAP, SDG_TITLES, TABLE_HEIGHT } from '@/constants';
import { pivotData } from '@/utils/pivotData';

interface Props {
  data: GraphDataType[];
  mapData: FeatureCollection<Polygon | MultiPolygon>;
  yearOptions: OptionsDataType[];
  areaOptions: OptionsDataType[];
}

export default function SlideThreeContent(props: Props) {
  const { data, mapData, yearOptions, areaOptions } = props;
  const [selectedView, setSelectedView] = useState<ChartTypes>('map');
  const [selectedYear, setSelectedYear] = useState(yearOptions[0]);
  // const [pivotedDataByYears, setPivotedDataByYears] = useState(pivotData(data));
  const [selectedArea, setSelectedArea] = useState<OptionsDataType[] | null>([
    { label: 'India', value: 'India' },
  ]);
  const [sdgOptions, setSdgOptions] = useState<OptionsDataType[]>([]);
  const [selectedSDG, setSelectedSDG] = useState<OptionsDataType | null>(null);
  // const [refValue, setRefValue] = useState(
  //   data.find(
  //     d =>
  //       d.area === 'India' &&
  //       d.year === yearOptions[yearOptions.length - 1].label &&
  //       d.sdg === sdgOptions[0].value,
  //   )?.value,
  // );

  // useEffect(() => {
  //   setPivotedDataByYears(pivotData(data));
  // }, [data, yearOptions]);

  useEffect(() => {
    if (!yearOptions || yearOptions.length === 0) return;

    fetchAndParseCSV('/data/metaData.csv')
      .then((d: unknown) => {
        const parsed = d as MetaDataType[];
        const filtered = parsed.filter(
          item => String(item.year) === String(selectedYear.label),
        );

        const uniqueSDGs = new Map<string, OptionsDataType>();

        filtered.forEach(item => {
          const sdgItem = `${item.sdg}`;
          const sdgMeta = SDG_TITLES[item.sdg] || { title: '', color: '' };
          const groupLabel = `${item.sdg} - ${sdgMeta.title}`;

          if (!uniqueSDGs.has(sdgItem)) {
            uniqueSDGs.set(sdgItem, {
              label: groupLabel,
              value: sdgItem,
            });
          }
        });

        const options = Array.from(uniqueSDGs.values());
        setSdgOptions(options);

        if (options.length > 0) {
          setSelectedSDG(options[0]);
        }
      })
      .catch(console.error);
  }, [selectedYear, yearOptions]);

  // useEffect(() => {
  //   setRefValue(
  //     data.find(
  //       d =>
  //         d.area === 'India' &&
  //         d.year === selectedYear.label &&
  //         d.sdg === selectedSDG.value,
  //     )?.value,
  //   );
  // }, [selectedYear, selectedSDG, data]);

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
            value={selectedSDG}
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
          {/* <IconGrid
            selectedView={selectedView}
            data={pivotedDataByYears}
            sdg={selectedSDG}
            keys={['area', 'sdg', '2018', '2019', '2020–21', '2023–24']}
            slideIndex={3}
          /> */}
        </div>
      </div>
      <div className='grow flex mt-4'>
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
                  includeValues: selectedSDG?.value ? [selectedSDG.value] : [],
                },
              ]}
              graphDataConfiguration={[
                { columnId: 'area', chartConfigId: 'id' },
                { columnId: 'group', chartConfigId: 'x' },
              ]}
              graphSettings={{
                graphID: 'slide-3-map',
                mapData: mapData,
                zoomInteraction: 'button',
                isWorldMap: false,
                height: TABLE_HEIGHT,
                mapNoDataColor: '#D4D6D8',
                showColorScale: true,
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
              // refValues: refValue
              //   ? [
              //       {
              //         value: refValue,
              //         text:
              //           selectedSDG?.label === 'Comp. Score'
              //             ? 'India Composite Index Score'
              //             : `India ${selectedSDG?.label} Index Score (${refValue})`,
              //         color: '#000000',
              //       },
              //     ]
              //   : undefined,
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
              {
                column: 'value',
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
              graphID: 'slide-4-trends',
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
                    includeValues: selectedSDG?.value
                      ? [selectedSDG.value]
                      : [],
                  },
                  {
                    column: 'area',
                    excludeValues: ['Target'],
                  },
                ]}
                graphSettings={{
                  height: TABLE_HEIGHT,
                  graphID: 'slide-3-table',
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
