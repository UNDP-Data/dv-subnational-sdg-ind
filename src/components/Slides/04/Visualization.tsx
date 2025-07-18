import { useEffect, useState } from 'react';
import { DropdownSelect, P } from '@undp/design-system-react';
import { fetchAndParseCSV, SingleGraphDashboard } from '@undp/data-viz';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';

// import IconGrid from '../IconGrid';
import ViewSelection from '../../ViewSelection';
import IconGrid from '../../IconGrid';

import {
  MetaDataType,
  OptionsDataType,
  GroupedOptionType,
  ChartTypes,
  IndicatorRow,
} from '@/types';
import { FOOTNOTES_SDGS, GENERAL_NOTE, VIS_HEIGHT } from '@/constants';

interface Props {
  mapData2020: FeatureCollection<Polygon | MultiPolygon>;
  mapDataBefore2020: FeatureCollection<Polygon | MultiPolygon>;
  yearOptions: OptionsDataType[];
  sdgOptions: OptionsDataType[];
  indicatorOptions: GroupedOptionType[];
  metaData: MetaDataType[];
}

const getRefValue = (data: IndicatorRow[], indicator: string, area: string) => {
  const val = data.find(d => d['STATEs/UTs'] === area)?.[
    indicator as keyof IndicatorRow
  ];
  return typeof val === 'number' || typeof val === 'string' ? val : null;
};

const getFootNote = (sdgKey?: string) => {
  const sdgNotes = FOOTNOTES_SDGS.find(d => d.sdg === sdgKey)?.footNotes || [];

  const allNotes = [...sdgNotes, GENERAL_NOTE];

  const renderFootnotes =
    allNotes.length === 1 ? (
      <P marginBottom='none' size='sm' className='text-primary-gray-550'>
        Note: {allNotes[0]}
      </P>
    ) : (
      <div className='flex flex-col gap-1'>
        <P marginBottom='none' size='sm' className='text-primary-gray-550'>
          Notes:
        </P>
        {allNotes.map((note, i) => (
          <P
            key={i}
            marginBottom='none'
            size='sm'
            className='text-primary-gray-550'
          >
            {note}
          </P>
        ))}
      </div>
    );
  return renderFootnotes;
};

export default function Visualization(props: Props) {
  const {
    mapData2020,
    mapDataBefore2020,
    yearOptions,
    sdgOptions,
    metaData,
    indicatorOptions,
  } = props;
  const [indicatorData, setIndicatorData] = useState<IndicatorRow[]>([]);
  const [selectedView, setSelectedView] = useState<ChartTypes>('chart');
  const [selectedIndicator, setSelectedIndicator] = useState<OptionsDataType>(
    indicatorOptions[0].options[0],
  );
  const [selectedYear, setSelectedYear] = useState(yearOptions[0]);
  const [selectedSDG, setSelectedSDG] = useState<OptionsDataType>(
    sdgOptions[0],
  );

  const sdgsWithoutMinWidthForTable = [
    'SDG 1',
    'SDG 7',
    'SDG 12',
    'SDG 13',
    'SDG 14',
  ];

  useEffect(() => {
    const path =
      selectedView === 'table'
        ? `/data/SDG/${selectedSDG.value}.csv`
        : `/data/SDG/${selectedIndicator.value.split('~')[0]}.csv`;
    fetchAndParseCSV(path)
      .then((data: unknown) => {
        const targetPrefix = Object.keys((data as IndicatorRow[])[0])
          .filter(d => d !== 'STATEs/UTs')
          .map(d =>
            metaData
              .find(meta => meta.indicator === d)
              ?.interpretation.includes('lower performance')
              ? {
                  indicator: d,
                  prefix: '≤',
                }
              : {
                  indicator: d,
                  prefix: '≥',
                },
          );
        const targetValRows = (data as IndicatorRow[])
          .filter(d => d['STATEs/UTs'] === 'Target')
          .map(d => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const obj: any = {};
            Object.keys(d as IndicatorRow)
              .filter(el => el !== 'STATEs/UTs')
              .forEach(el => {
                obj[el] =
                  el !== 'year' && el !== 'yearFormatted'
                    ? d[el] === null || d[el] === undefined
                      ? ''
                      : d[el] === 0 || d[el] === 100
                        ? `=${d[el]}`
                        : `${targetPrefix.find(p => p.indicator === el)?.prefix || ''}${d[el]}`
                    : d[el];
              });

            return { 'STATEs/UTs': 'Target value', ...obj };
          });
        const transformedData = (
          [...(data as IndicatorRow[]), ...targetValRows] as IndicatorRow[]
        ).map(row => {
          return {
            ...row,
            rowStyle:
              row['STATEs/UTs'] === 'India'
                ? { backgroundColor: '#F7F7F7' }
                : row['STATEs/UTs'] === 'Target value'
                  ? { backgroundColor: '#b5d5f54D' }
                  : undefined,
          };
        });
        const sortedData = [
          ...transformedData.filter(d => d['STATEs/UTs'] === 'Target value'),
          ...transformedData.filter(d => d['STATEs/UTs'] === 'India'),
          ...transformedData.filter(
            d =>
              d['STATEs/UTs'] !== 'Target value' && d['STATEs/UTs'] !== 'India',
          ),
        ];
        setIndicatorData(sortedData);
      })
      .catch(console.error);
  }, [metaData, selectedIndicator.value, selectedSDG.value, selectedView]);

  return (
    <div className='bg-primary-white p-6 flex flex-col grow w-full gap-2'>
      <div className='flex justify-between items-center gap-4 flex-wrap'>
        <ViewSelection
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          slideIndex={4}
        />
        <div className='flex gap-4 flex-wrap items-center'>
          {selectedView === 'table' ? (
            <DropdownSelect
              onChange={option => {
                setSelectedSDG(option as OptionsDataType);
              }}
              options={sdgOptions}
              value={selectedSDG}
              isClearable={false}
              size='sm'
              placeholder='Select SDG'
              className='w-[320px]'
              variant='light'
            />
          ) : (
            <DropdownSelect
              onChange={option =>
                setSelectedIndicator(option as OptionsDataType)
              }
              options={indicatorOptions}
              value={selectedIndicator}
              size='sm'
              placeholder='Select indicator'
              className='w-[480px]'
              variant='light'
            />
          )}
          <DropdownSelect
            onChange={option => setSelectedYear(option as OptionsDataType)}
            options={yearOptions}
            size='sm'
            placeholder='Select year'
            isClearable={false}
            value={selectedYear}
            className='w-40'
            variant='light'
          />
          <IconGrid
            selectedView={selectedView}
            data={indicatorData}
            year={selectedYear}
            keys={
              selectedView === 'table'
                ? [
                    'STATEs/UTs',
                    ...metaData
                      .filter(
                        item =>
                          String(item.sdg) === selectedSDG.value &&
                          String(item.year) === selectedYear.label,
                      )
                      .map(item => item.indicator),
                    'year',
                  ]
                : ['STATEs/UTs', selectedIndicator?.label ?? '', 'year']
            }
            slideIndex={5}
          />
        </div>
      </div>
      {indicatorData.length === 0 ? (
        <div className='flex w-full h-full flex-col justify-center grow items-center gap-2 p-6'>
          <P
            marginBottom='none'
            leading='none'
            size='lg'
            className='text-primary-gray-550 dark:text-primary-gray-550'
          >
            No data available for <strong>{selectedIndicator.label}</strong> for{' '}
            <strong>{selectedYear.label}</strong>
          </P>
        </div>
      ) : (
        <div className='grow flex mt-4'>
          {selectedView === 'chart' && (
            <>
              {indicatorData.some(
                d =>
                  d.yearFormatted === +selectedYear.value &&
                  d[selectedIndicator.label as keyof typeof d] !== null &&
                  d[selectedIndicator.label as keyof typeof d] !== undefined,
              ) ? (
                <SingleGraphDashboard
                  dataSettings={{
                    data: indicatorData.filter(
                      d =>
                        d.yearFormatted === +selectedYear.value &&
                        d['STATEs/UTs'] !== 'Target' &&
                        d['STATEs/UTs'] !== 'Target value' &&
                        d[selectedIndicator.label as keyof IndicatorRow] !==
                          null &&
                        d[selectedIndicator.label as keyof IndicatorRow] !==
                          undefined,
                    ),
                  }}
                  graphType='barChart'
                  dataFilters={[
                    {
                      column: 'STATEs/UTs',
                      excludeValues: ['India', 'Target', 'Target value'],
                    },
                  ]}
                  graphDataConfiguration={[
                    { columnId: 'STATEs/UTs', chartConfigId: 'label' },
                    {
                      columnId: selectedIndicator.label,
                      chartConfigId: 'size',
                    },
                  ]}
                  graphSettings={{
                    graphID: 'slide-4-chart',
                    graphTitle: `${selectedIndicator.label}, ${selectedYear.label}`,
                    footNote:
                      'Note: From 2020, Dadra and Nagar Haveli and Daman and Diu were merged into one Union Territory.',
                    height: VIS_HEIGHT,
                    colorLegendTitle: undefined,
                    orientation: 'horizontal',
                    maxBarThickness: 24,
                    showTicks: false,
                    leftMargin: 170,
                    topMargin: 24,
                    truncateBy: 20,
                    showNAColor: false,
                    sortData: 'desc',
                    showLabels: true,
                    refValues: [
                      {
                        value: getRefValue(
                          indicatorData.filter(
                            d => d.yearFormatted === +selectedYear.value,
                          ),
                          selectedIndicator.label,
                          'India',
                        ) as number,
                        text: `India Average ${getRefValue(
                          indicatorData.filter(
                            d => d.yearFormatted === +selectedYear.value,
                          ),
                          selectedIndicator.label,
                          'India',
                        )}`,
                        color: '#000',
                        styles: {
                          line: { strokeWidth: '1px' },
                          text: { fontWeight: 600 },
                        },
                      },
                      {
                        value: getRefValue(
                          indicatorData.filter(
                            d => d.yearFormatted === +selectedYear.value,
                          ),
                          selectedIndicator.label,
                          'Target',
                        ) as number,
                        text: `Target ${getRefValue(
                          indicatorData.filter(
                            d => d.yearFormatted === +selectedYear.value,
                          ),
                          selectedIndicator.label,
                          'Target value',
                        )}`,
                        color: '#000',
                        styles: {
                          line: { strokeWidth: '1px' },
                          text: { fontWeight: 600 },
                        },
                      },
                    ].filter(d => d.value !== null),
                    tooltip: `<div class="font-bold p-2 bg-primary-gray-300 uppercase text-xs">{{label}} (${selectedYear.label})</div><div class="p-2 flex justify-between"><div class='max-w-[240px]'>${selectedIndicator?.label}</div><div><b>{{size}}</b></div></div>`,
                    styles: {
                      tooltip: {
                        padding: '0',
                        minWidth: '150px',
                      },
                    },
                  }}
                />
              ) : (
                <div className='flex w-full flex-col justify-center grow items-center gap-2 p-6'>
                  <P
                    marginBottom='none'
                    leading='none'
                    size='lg'
                    className='text-primary-gray-550 dark:text-primary-gray-550'
                  >
                    No data available for{' '}
                    <strong>{selectedIndicator.label}</strong> for{' '}
                    <strong>{selectedYear.label}</strong>
                  </P>
                </div>
              )}
            </>
          )}
          {selectedView === 'map' && (
            <>
              {indicatorData.some(
                d =>
                  d.yearFormatted === +selectedYear.value &&
                  d['STATEs/UTs'] !== 'Target' &&
                  d[selectedIndicator.label as keyof typeof d] !== null &&
                  d[selectedIndicator.label as keyof typeof d] !== undefined,
              ) ? (
                <SingleGraphDashboard
                  dataSettings={{
                    data: indicatorData.filter(
                      d =>
                        d.yearFormatted === +selectedYear.value &&
                        d['STATEs/UTs'] !== 'Target' &&
                        d['STATEs/UTs'] !== 'Target value' &&
                        d[selectedIndicator.label as keyof IndicatorRow] !==
                          null &&
                        d[selectedIndicator.label as keyof IndicatorRow] !==
                          undefined,
                    ),
                  }}
                  graphType='choroplethMap'
                  graphDataConfiguration={[
                    { columnId: 'STATEs/UTs', chartConfigId: 'id' },
                    {
                      columnId: selectedIndicator.label,
                      chartConfigId: 'x',
                    },
                  ]}
                  graphSettings={{
                    graphID: 'slide-4-map',
                    graphTitle: `${selectedIndicator.label}, ${selectedYear.label}`,
                    footNote:
                      'Note: From 2020, Dadra and Nagar Haveli and Daman and Diu were merged into one Union Territory.',
                    mapData:
                      parseInt(selectedYear.value) < 2020
                        ? mapDataBefore2020
                        : mapData2020,
                    colorLegendTitle: selectedIndicator?.label,
                    isWorldMap: false,
                    height: VIS_HEIGHT,
                    mapNoDataColor: '#D4D6D8',
                    mapProperty: 'State_Name',
                    styles: {
                      tooltip: {
                        padding: '0',
                        minWidth: '150px',
                      },
                    },
                    tooltip: `<div class="font-bold p-2 bg-primary-gray-300 uppercase text-xs">{{id}} (${selectedYear.label})</div><div class="p-2 flex justify-between"><div class='max-w-[240px]'>${selectedIndicator?.label}</div><div><b>{{x}}</b></div></div>`,
                  }}
                />
              ) : (
                <div className='flex w-full flex-col justify-center grow items-center gap-2 p-6'>
                  <P
                    marginBottom='none'
                    leading='none'
                    size='lg'
                    className='text-primary-gray-550 dark:text-primary-gray-550'
                  >
                    No data available for{' '}
                    <strong>{selectedIndicator.label}</strong> for{' '}
                    <strong>{selectedYear.label}</strong>
                  </P>
                </div>
              )}
            </>
          )}
          {selectedView === 'table' && (
            <>
              {metaData.some(
                item =>
                  String(item.sdg) === selectedSDG.value &&
                  String(item.year) === selectedYear.label,
              ) ? (
                <div className='w-full overflow-y-hidden'>
                  <P marginBottom='sm'>
                    {selectedSDG.value === 'Comp. Score'
                      ? `Indicators behind the ${selectedSDG.label}`
                      : `Indicators behind the ${selectedSDG.value} Index Score`}
                  </P>
                  <div className='grow flex mt-4 w-full undp-scrollbar'>
                    <SingleGraphDashboard
                      dataSettings={{
                        data: indicatorData.filter(
                          d =>
                            d.yearFormatted === +selectedYear.value &&
                            d['STATEs/UTs'] !== 'Target',
                        ),
                      }}
                      graphType='dataTable'
                      graphSettings={{
                        height:
                          VIS_HEIGHT +
                          (selectedSDG.value === 'SDG 10'
                            ? -64
                            : selectedSDG.value === 'SDG 14' ||
                                selectedSDG.value === 'SDG 15'
                              ? -48
                              : 0),
                        minWidth: !sdgsWithoutMinWidthForTable.includes(
                          selectedSDG.value,
                        )
                          ? '2400px'
                          : undefined,
                        footNote: getFootNote(selectedSDG.value),
                        columnData: [
                          {
                            columnTitle: 'States/UTs',
                            columnId: 'STATEs/UTs',
                            sortable: true,
                          },
                          ...metaData
                            .filter(
                              item =>
                                item.sdg === selectedSDG.value &&
                                `${item.year}` === selectedYear.label,
                            )
                            .map(item => ({
                              columnTitle: item.indicator,
                              columnId: item.indicator,
                              sortable: true,
                            })),
                        ],
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className='flex w-full h-full flex-col justify-center grow items-center gap-2 p-6'>
                  <P
                    marginBottom='none'
                    leading='none'
                    size='lg'
                    className='text-primary-gray-550 dark:text-primary-gray-550'
                  >
                    Indicators are not available for{' '}
                    <strong>{selectedSDG.value}</strong> for{' '}
                    <strong>{selectedYear.label}</strong>
                  </P>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
