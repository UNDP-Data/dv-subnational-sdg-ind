import { useEffect, useState } from 'react';
import { DropdownSelect } from '@undp/design-system-react';
import {
  fetchAndParseCSV,
  getUniqValue,
  SingleGraphDashboard,
} from '@undp/data-viz';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';

import IconGrid from '../IconGrid';
import ViewSelection from '../ViewSelection';

import {
  GraphDataType,
  MetaDataType,
  OptionsDataType,
  RawDataType,
  GroupedOptionType,
  ChartTypes,
} from '@/types';
import { COLOR_MAP, SDG_OPTIONS, TABLE_HEIGHT } from '@/constants';

const footnotesBySDG = {
  'SDG 10': [
    'The "Percentage of SC/ST seats in State Legislative Assemblies" indicator is excluded from index computation due to the absence of a uniform target across all States/UTs.',
    'The number of crime cases against SCs for Mizoram stands at 5.',
  ],
  'SDG 14': [
    'The "Mean shore zone coastal water quality (DO) - Biochemical Oxygen Demand (BOD) (mg/l)" indicator has not been used to assess the performance of coastal States due to the absence of fixed quantitative targets.',
  ],
  'SDG 15': ['The absolute number of Wildlife cases for Delhi stands at 4128.'],
};

const generalNote =
  'From 2020, Dadra and Nagar Haveli and Daman and Diu were merged into one Union Territory.';

const renderFootnotes = (selectedSDG: OptionsDataType | null) => {
  const sdgKey = selectedSDG?.value;
  const sdgNotes =
    (footnotesBySDG as Record<string, string[]>)[sdgKey ?? ''] || [];

  const allNotes = [...sdgNotes, generalNote];

  if (allNotes.length === 1) {
    return `{{{<div class="text-sm text-primary-gray-550">Note: ${allNotes[0]}</div>}}}`;
  } else {
    const notesHtml = allNotes
      .map(note => `<div class="text-sm text-primary-gray-550">${note}</div>`)
      .join('');

    return `{{{<div class="text-sm text-primary-gray-550">Notes:</div>${notesHtml}}}}`;
  }
};

interface Props {
  wideData: RawDataType[];
  mapData: FeatureCollection<Polygon | MultiPolygon>;
  longData: GraphDataType[];
  yearOptions: OptionsDataType[];
  areaOptions: OptionsDataType[];
}

export default function SlideFiveContent(props: Props) {
  const { wideData, longData, yearOptions, mapData, areaOptions } = props;
  const [metaData, setMetaData] = useState<MetaDataType[]>([]);
  const [selectedView, setSelectedView] = useState<ChartTypes>('chart');
  const [indicatorOptions, setIndicatorOptions] = useState<GroupedOptionType[]>(
    [],
  );
  const [sdgOptions, setSDGOptions] = useState<OptionsDataType[]>([]);
  const [selectedIndicator, setSelectedIndicator] =
    useState<OptionsDataType | null>(null);
  const [selectedYear, setSelectedYear] = useState(
    yearOptions[yearOptions.length - 1],
  );
  const [selectedSDG, setSelectedSDG] = useState<OptionsDataType>(
    sdgOptions[0],
  );
  const [selectedArea, setSelectedArea] = useState<OptionsDataType[] | null>([
    { label: 'India', value: 'India' },
  ]);

  useEffect(() => {
    fetchAndParseCSV('/data/subnational-sdg-meta.csv')
      .then(d => {
        setMetaData(d as MetaDataType[]);

        const sdgOrder = SDG_OPTIONS.map(opt => opt.value);

        const sdgOptions = getUniqValue(d, 'sdg')
          .map(sdg => ({
            label: sdg,
            value: sdg,
          }))
          .sort(
            (a, b) => sdgOrder.indexOf(a.value) - sdgOrder.indexOf(b.value),
          );
        setSDGOptions(sdgOptions);

        const grouped = (d as MetaDataType[]).reduce(
          (acc, { sdg, label, indicator }) => {
            const groupKey = `${sdg} - ${label}`;
            if (!acc[groupKey]) acc[groupKey] = [];
            acc[groupKey].push({ label: indicator, value: indicator });
            return acc;
          },
          {} as Record<string, OptionsDataType[]>,
        );

        const groupedOptions: GroupedOptionType[] = Object.entries(grouped).map(
          ([groupLabel, options]) => ({
            label: groupLabel,
            options,
          }),
        );

        setIndicatorOptions(groupedOptions);

        if (groupedOptions.length > 0 && groupedOptions[0].options.length > 0) {
          setSelectedIndicator(groupedOptions[0].options[0]);
          setSelectedSDG(sdgOptions[0]);
        }
      })
      .catch(console.error);
  }, []);

  if (!metaData.length) return null;

  const activeIndicators = metaData.filter(
    item => item.sdg === selectedSDG?.value,
  );
  const sdgScoreMap = new Map();
  longData.forEach(d => {
    if (
      d.sdg === selectedSDG?.value &&
      String(d.year) === selectedYear?.value
    ) {
      sdgScoreMap.set(d.area, { value: d.value, group: d.group });
    }
  });

  const indiaValue = Number(
    wideData.find(d => d.area === 'India' && d.year === selectedYear!.value)?.[
      selectedIndicator!.value as keyof RawDataType
    ],
  );

  const filteredData = wideData
    .filter(row => String(row.year) === selectedYear?.value)
    .map(row => {
      const sdg = sdgScoreMap.get(row.area);
      return {
        ...row,
        sdgValue: sdg?.value ?? null,
        group: sdg?.group ?? null,
      };
    });

  return (
    <div className='flex flex-col justify-between grow w-full gap-2'>
      <div className='flex justify-between items-center gap-4 flex-wrap'>
        <ViewSelection
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          slideIndex={4}
        />
        <div className='flex gap-4 flex-wrap items-center'>
          {selectedView === 'table' ? (
            <DropdownSelect
              onChange={option => setSelectedSDG(option as OptionsDataType)}
              options={sdgOptions}
              value={selectedSDG}
              defaultValue={selectedSDG}
              isClearable={false}
              size='sm'
              placeholder='Select SDG'
              className='min-w-40'
              variant='light'
            />
          ) : null}
          {selectedView === 'trends' ? (
            <DropdownSelect
              onChange={option => setSelectedArea(option as OptionsDataType[])}
              options={areaOptions}
              value={selectedArea}
              isClearable={true}
              isMulti={true}
              defaultValue={selectedArea}
              size='sm'
              placeholder='Highlight state/UT'
              className='w-[320px]'
              variant='light'
            />
          ) : null}
          {selectedView !== 'table' ? (
            <DropdownSelect
              onChange={option =>
                setSelectedIndicator(option as OptionsDataType)
              }
              options={indicatorOptions}
              value={selectedIndicator}
              size='sm'
              placeholder='Select indicator'
              className='w-[320px]'
              variant='light'
            />
          ) : null}
          <DropdownSelect
            onChange={option => setSelectedYear(option as OptionsDataType)}
            options={yearOptions}
            size='sm'
            isDisabled={selectedView === 'trends'}
            placeholder='Select year'
            isClearable={false}
            defaultValue={selectedYear}
            className='min-w-40'
            variant='light'
          />
          <IconGrid
            selectedView={selectedView}
            data={filteredData}
            year={selectedYear}
            keys={[
              'area',
              ...activeIndicators.map(item => item.indicator),
              'year',
            ]}
            slideIndex={5}
          />
        </div>
      </div>
      <div className='grow flex mt-4'>
        {selectedView === 'map' && (
          <SingleGraphDashboard
            dataSettings={{
              data: wideData,
            }}
            graphType='choroplethMap'
            dataFilters={[
              {
                column: 'year',
                includeValues: [selectedYear.value],
              },
            ]}
            graphDataConfiguration={[
              { columnId: 'area', chartConfigId: 'id' },
              {
                columnId: selectedIndicator
                  ? selectedIndicator.value
                  : 'Head count ratio as per the Multidimensional Poverty Index (%)',
                chartConfigId: 'x',
              },
            ]}
            graphSettings={{
              graphID: 'slide-4-map',
              mapData: mapData,
              isWorldMap: false,
              height: TABLE_HEIGHT,
              scale: 1.1,
              zoomScaleExtend: [1, 1],
              mapNoDataColor: '#D4D6D8',
              styles: {
                tooltip: {
                  padding: '0',
                  minWidth: '150px',
                },
              },
              tooltip:
                '<div class="font-bold p-2 bg-primary-gray-300 uppercase text-xs">{{id}} ({{data.year}})</div><div class="p-2 flex justify-between"><div>{{xColumns}}</div><div>{{x}}</div></div>',
            }}
          />
        )}
        {selectedView === 'chart' && (
          <SingleGraphDashboard
            dataSettings={{
              data: wideData,
            }}
            graphType='barChart'
            dataFilters={[
              {
                column: 'year',
                includeValues: [selectedYear.value],
              },
            ]}
            graphDataConfiguration={[
              { columnId: 'area', chartConfigId: 'label' },
              {
                columnId: selectedIndicator
                  ? selectedIndicator.value
                  : 'Head count ratio as per the Multidimensional Poverty Index (%)',
                chartConfigId: 'size',
              },
            ]}
            graphSettings={{
              graphID: 'slide-3-chart',
              colorLegendTitle: undefined,
              orientation: 'horizontal',
              showTicks: false,
              leftMargin: 170,
              truncateBy: 20,
              showNAColor: false,
              sortData: 'desc',
              showLabels: true,
              tooltip:
                '<div class="font-bold p-2 bg-primary-gray-300 uppercase text-xs">{{label}} ({{data.year}})</div><div class="p-2 flex justify-between"><div>{{sizeColumns}}</div><div>{{size}}</div></div>',
              styles: {
                tooltip: {
                  padding: '0',
                  minWidth: '150px',
                },
              },
              refValues: indiaValue
                ? [
                    {
                      value: indiaValue,
                      text: `India Average ${indiaValue}`,
                      color: '#000000',
                    },
                  ]
                : undefined,
            }}
          />
        )}
        {selectedView === 'trends' && (
          <SingleGraphDashboard
            dataSettings={{
              data: wideData,
            }}
            graphType='multiLineAltChart'
            graphDataConfiguration={[
              { columnId: 'yearFormatted', chartConfigId: 'date' },
              { columnId: 'area', chartConfigId: 'label' },
              {
                columnId: selectedIndicator
                  ? selectedIndicator.value
                  : 'Head count ratio as per the Multidimensional Poverty Index (%)',
                chartConfigId: 'y',
              },
            ]}
            graphSettings={{
              graphID: 'slide-4-chart',
              curveType: 'curve',
              noOfXTicks: window.innerWidth < 768 ? 5 : 12,
              showNAColor: false,
              valueColor: '#000000',
              rightMargin: 170,
              showLabels: true,
              strokeWidth: 1.5,
              showDots: true,
              tooltip:
                '<div class="font-bold p-2 bg-primary-gray-300 uppercase text-xs">{{label}} ({{data.year}})</div><div class="p-2 flex justify-between"><div>{{yColumns}}</div><div>{{y}}</div></div>',
              styles: {
                tooltip: {
                  padding: '0',
                  minWidth: '150px',
                },
              },
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
            <div className='w-full mt-4 overflow-y-hidden'>
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
                ]}
                graphSettings={{
                  height:
                    selectedSDG?.value === 'SDG 10'
                      ? TABLE_HEIGHT - 50
                      : TABLE_HEIGHT,
                  minWidth:
                    selectedSDG.value !== 'SDG 7' ? '2400px' : undefined,
                  footNote: renderFootnotes(selectedSDG),
                  columnData: [
                    {
                      columnTitle: 'States/UTs',
                      columnId: 'area',
                      sortable: true,
                    },
                    {
                      columnTitle: `${selectedSDG.value} Index Score`,
                      columnId: selectedSDG.value,
                      chip: true,
                      chipColumnId: `${selectedSDG.value} Group`,
                      chipColors: COLOR_MAP,
                      sortable: true,
                    },
                    ...activeIndicators.map(item => ({
                      columnTitle: item.indicator,
                      columnId: item.indicator,
                      sortable: true,
                    })),
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
