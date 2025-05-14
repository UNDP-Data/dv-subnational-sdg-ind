import { useEffect, useState } from 'react';
import { DropdownSelect, P, SegmentedControl } from '@undp/design-system-react';
import {
  fetchAndParseCSV,
  getUniqValue,
  SingleGraphDashboard,
} from '@undp/data-viz';
import { ChartBar, ChartSpline, ImageDownIcon, Table2 } from 'lucide-react';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';

import IconGrid from './IconGrid';

import {
  GraphDataType,
  MetaDataType,
  OptionsDataType,
  RawDataType,
  GroupedOptionType,
} from '@/types';
import { colorMap, TABLE_HEIGHT } from '@/constants';

interface Props {
  rawData: RawDataType[];
  mapData: FeatureCollection<Polygon | MultiPolygon>;
  graphData: GraphDataType[];
  yearsOptions: OptionsDataType[];
  areaOptions: OptionsDataType[];
}

export default function SlideFiveContent(props: Props) {
  const { rawData, graphData, yearsOptions, mapData, areaOptions } = props;
  const [metaData, setMetaData] = useState<MetaDataType[]>([]);
  const [indicatorOptions, setIndicatorOptions] = useState<GroupedOptionType[]>(
    [],
  );
  const [sdgOptions, setSDGOptions] = useState<OptionsDataType[]>([]);
  const [selectedIndicator, setSelectedIndicator] =
    useState<OptionsDataType | null>(null);
  const [selectedYear, setSelectedYear] = useState(
    yearsOptions[yearsOptions.length - 1],
  );
  const [selectedView, setSelectedView] = useState<
    'chart' | 'table' | 'map' | 'trends'
  >('chart');
  const [selectedSDG, setSelectedSDG] = useState<OptionsDataType>(
    sdgOptions[0],
  );
  const [selectedArea, setSelectedArea] = useState<OptionsDataType[] | null>(
    null,
  );

  useEffect(() => {
    fetchAndParseCSV('/data/meta-placeholder.csv')
      .then(d => {
        setMetaData(d as MetaDataType[]);

        const sdgOptions = getUniqValue(d, 'sdg').map(sdg => ({
          label: sdg,
          value: sdg,
        }));
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

        if (
          !selectedIndicator &&
          groupedOptions.length > 0 &&
          groupedOptions[0].options.length > 0
        ) {
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
  const indicatorNames = activeIndicators.map(item => item.indicator);

  const sdgScoreMap = new Map();
  graphData.forEach(d => {
    if (
      d.sdg === selectedSDG?.value &&
      String(d.year) === selectedYear?.value
    ) {
      sdgScoreMap.set(d.area, { value: d.value, group: d.group });
    }
  });

  const indiaValue = Number(
    rawData.find(d => d.area === 'India' && d.year === selectedYear!.value)?.[
      selectedIndicator!.value
    ],
  );

  const filteredData = rawData
    .filter(row => String(row.year) === selectedYear?.value)
    .map(row => {
      const sdg = sdgScoreMap.get(row.area);
      return {
        ...row,
        sdgValue: sdg?.value ?? null,
        group: sdg?.group ?? null,
      };
    });

  console.log(indiaValue);
  return (
    graphData && (
      <div className='flex flex-col justify-between grow w-full gap-2'>
        <div className='flex justify-between items-center gap-4 flex-wrap'>
          <P size='lg' marginBottom='none'>
            Performance of States and UTs on {selectedIndicator?.value} (
            {selectedYear?.value})
          </P>
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
            {selectedView !== 'table' ? (
              <>
                <DropdownSelect
                  onChange={option =>
                    setSelectedArea(option as OptionsDataType[])
                  }
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
                <DropdownSelect
                  onChange={option =>
                    setSelectedIndicator(option as OptionsDataType)
                  }
                  options={indicatorOptions}
                  value={selectedIndicator}
                  size='sm'
                  placeholder='Select indicator'
                  className='min-w-40'
                  variant='light'
                />
              </>
            ) : null}
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
                setSelectedView(value as 'chart' | 'table' | 'map' | 'trends')
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
                        <ChartSpline size={16} strokeWidth={1.5} />
                      </div>
                      <P marginBottom='none' size='sm'>
                        Trends
                      </P>
                    </div>
                  ),
                  value: 'trends',
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
              data={filteredData}
              year={selectedYear}
              keys={[
                'area',
                'Indicator 1',
                'Indicator 2',
                'Indicator 3',
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
                data: rawData,
                fileType: 'csv',
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
                    : 'Indicator 1',
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
                highlightedIds: selectedArea
                  ? selectedArea.map(area => area.value)
                  : [],
                tooltip:
                  '<div class="font-bold p-2 bg-primary-gray-300 uppercase text-xs">{{id}} ({{data.year}})</div><div class="p-2 flex justify-between"><div>{{xColumns}}</div><div>{{x}}</div></div>',
              }}
            />
          )}
          {selectedView === 'chart' && (
            <SingleGraphDashboard
              dataSettings={{
                data: rawData,
                fileType: 'csv',
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
                  columnId: selectedIndicator ? selectedIndicator.value : '',
                  chartConfigId: 'size',
                },
              ]}
              graphSettings={{
                graphID: 'slide-3-chart',
                colorLegendTitle: undefined,
                showNAColor: false,
                sortData: 'desc',
                showLabels: true,
                truncateBy: 3,
                highlightedDataPoints: selectedArea
                  ? selectedArea.map(area => area.value)
                  : [],
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
                        text: 'India Average',
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
                data: rawData,
                fileType: 'csv',
              }}
              graphType='multiLineAltChart'
              graphDataConfiguration={[
                { columnId: 'yearFormatted', chartConfigId: 'date' },
                { columnId: 'area', chartConfigId: 'label' },
                {
                  columnId: selectedIndicator
                    ? selectedIndicator.value
                    : 'Indicator 1',
                  chartConfigId: 'y',
                },
              ]}
              graphSettings={{
                graphID: 'slide-4-chart',
                curveType: 'curve',
                noOfXTicks: window.innerWidth < 768 ? 5 : 12,
                showNAColor: false,
                valueColor: '#000000',
                showLabels: false,
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
            <div
              className='overflow-y-auto undp-scrollbar w-full'
              style={{ height: `${TABLE_HEIGHT}px` }}
            >
              <table className='w-full' style={{ borderCollapse: 'collapse' }}>
                <thead className='text-left bg-primary-gray-300 dark:bg-primary-gray-550'>
                  <tr>
                    <th className='text-primary-gray-700 dark:text-primary-gray-100 text-sm p-4'>
                      State
                    </th>
                    {indicatorNames.map(indicator => (
                      <th
                        key={indicator}
                        className='text-primary-gray-700 dark:text-primary-gray-100 text-sm p-4'
                      >
                        {indicator}
                      </th>
                    ))}
                    <th className='text-primary-gray-700 dark:text-primary-gray-100 text-sm p-4'>
                      SDG Index Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, idx) => (
                    <tr
                      key={`${row.area}-${idx}`}
                      className='cursor-auto border-b border-b-primary-gray-400 dark:border-b-primary-gray-500 bg-transparent'
                    >
                      <td className='text-sm text-left text-primary-gray-700 dark:text-primary-gray-100 p-4'>
                        {row.area}
                      </td>

                      {indicatorNames.map(indicator => (
                        <td key={indicator} className='text-sm text-left p-4'>
                          {row?.[indicator as keyof typeof row] ?? '-'}
                        </td>
                      ))}
                      <td className='text-sm text-left p-4'>
                        <span
                          className='rounded-full px-4 py-1 text-white text-primary-white'
                          style={{
                            backgroundColor:
                              colorMap[row.group as keyof typeof colorMap] ??
                              '#fafafa',
                          }}
                        >
                          {row.sdgValue ?? '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )
  );
}
