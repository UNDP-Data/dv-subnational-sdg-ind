import { useEffect, useState } from 'react';
import { DropdownSelect, P } from '@undp/design-system-react';
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
} from '@/types';
import { colorMap, TABLE_HEIGHT } from '@/constants';

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
  const [selectedView, setSelectedView] = useState<
    'chart' | 'table' | 'map' | 'trends'
  >('chart');
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
  const indicatorNames = activeIndicators.map(item => item.indicator);

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
        <P size='lg' marginBottom='none'>
          {selectedView !== 'table'
            ? `Performance of States and UTs on ${selectedIndicator?.value}`
            : `Performance of States and UTs on indicators behind ${selectedSDG?.value}`}{' '}
          ({selectedYear?.value})
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
          {selectedView !== 'table' ? (
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
          ) : null}
          <DropdownSelect
            onChange={option => setSelectedYear(option as OptionsDataType)}
            options={yearOptions}
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
            slideIndex={4}
          />
          <IconGrid
            selectedView={selectedView}
            data={filteredData}
            year={selectedYear}
            keys={['area', 'Indicator 1', 'Indicator 2', 'Indicator 3', 'year']}
            slideIndex={5}
          />
        </div>
      </div>
      <div className='grow flex mt-4'>
        {selectedView === 'map' && (
          <SingleGraphDashboard
            dataSettings={{
              data: wideData,
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
              tooltip:
                '<div class="font-bold p-2 bg-primary-gray-300 uppercase text-xs">{{id}} ({{data.year}})</div><div class="p-2 flex justify-between"><div>{{xColumns}}</div><div>{{x}}</div></div>',
            }}
          />
        )}
        {selectedView === 'chart' && (
          <SingleGraphDashboard
            dataSettings={{
              data: wideData,
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
          <div
            className='overflow-y-auto undp-scrollbar w-full'
            style={{ height: `${TABLE_HEIGHT}px` }}
          >
            <SingleGraphDashboard
              dataSettings={{
                data: wideData,
              }}
              graphType='dataTable'
              debugMode
              dataFilters={[
                {
                  column: 'year',
                  includeValues: [selectedYear.label],
                },
              ]}
              graphSettings={{
                height: TABLE_HEIGHT,
                columnData: [
                  {
                    columnTitle: 'States/UTs',
                    columnId: 'area',
                  },
                  {
                    columnTitle: selectedSDG.value,
                    columnId: selectedSDG.value,
                    chip: true,
                    chipColumnId: `${selectedSDG.value} Group`,
                    chipColors: colorMap,
                  },
                  ...indicatorNames.map(ind => ({
                    columnTitle: ind,
                    columnId: ind,
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
