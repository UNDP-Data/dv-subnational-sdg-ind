import { useEffect, useState } from 'react';
import { DropdownSelect, P, Spinner } from '@undp/design-system-react';
import { fetchAndParseCSV, SingleGraphDashboard } from '@undp/data-viz';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';

// import IconGrid from '../IconGrid';
import ViewSelection from '../ViewSelection';
import IconGrid from '../IconGrid';

import {
  MetaDataType,
  OptionsDataType,
  GroupedOptionType,
  ChartTypes,
  IndicatorRow,
} from '@/types';
import {
  footnotesBySDG,
  generalNote,
  LEGEND_HEIGHT,
  SDG_TITLES,
  VIS_HEIGHT,
} from '@/constants';

interface Props {
  mapData: FeatureCollection<Polygon | MultiPolygon>;
  yearOptions: OptionsDataType[];
  sdgOptions: OptionsDataType[];
}

export default function SlideFiveContent(props: Props) {
  const { mapData, yearOptions, sdgOptions } = props;
  const [indicatorData, setIndicatorData] = useState<IndicatorRow[]>([]);
  const [selectedView, setSelectedView] = useState<ChartTypes>('chart');
  const [indicatorOptions, setIndicatorOptions] = useState<GroupedOptionType[]>(
    [],
  );
  const [metaData, setMetaData] = useState<MetaDataType[]>([]);
  const [selectedIndicator, setSelectedIndicator] =
    useState<OptionsDataType | null>(null);
  const [selectedYear, setSelectedYear] = useState(yearOptions[0]);
  const [selectedSDG, setSelectedSDG] = useState<OptionsDataType | null>(null);

  useEffect(() => {
    if (!yearOptions || yearOptions.length === 0) return;

    fetchAndParseCSV('/data/metaData.csv')
      .then((d: unknown) => {
        const parsed = d as MetaDataType[];
        setMetaData(parsed);

        const filtered = parsed.filter(
          item => String(item.year) === String(selectedYear.label),
        );

        type GroupedMap = Record<
          string,
          {
            label: string;
            options: OptionsDataType[];
          }
        >;

        const grouped: GroupedMap = {};
        const uniqueSDGs = new Map<string, OptionsDataType>();

        filtered.forEach(item => {
          const sdgItem = `${item.sdg}`;
          const sdgMeta = SDG_TITLES[item.sdg] || { title: '', color: '' };
          const groupLabel = `${item.sdg} - ${sdgMeta.title}`;

          if (!grouped[groupLabel]) {
            grouped[groupLabel] = {
              label: groupLabel,
              options: [],
            };
          }

          grouped[groupLabel].options.push({
            label: item.indicator,
            value: item.indicator,
          });

          if (!uniqueSDGs.has(sdgItem)) {
            uniqueSDGs.set(sdgItem, {
              label: groupLabel,
              value: sdgItem,
            });
          }
        });

        setIndicatorOptions(Object.values(grouped));

        if (sdgOptions.length > 0) {
          setSelectedSDG(sdgOptions[0]);

          const firstGroup = Object.values(grouped)[0];
          if (firstGroup && firstGroup.options.length > 0) {
            setSelectedIndicator(firstGroup.options[0]);
          }
        }
      })
      .catch(console.error);
  }, [sdgOptions, selectedYear, yearOptions]);

  useEffect(() => {
    if (!selectedSDG || metaData.length === 0) return;

    const path = `/data/SDG/${selectedSDG.value}.csv`;

    fetchAndParseCSV(path)
      .then((rows: unknown) => {
        const typedRows = rows as IndicatorRow[];

        const transformedData = typedRows.map(row => {
          const area = row['STATEs/UTs'];
          const updatedRow: IndicatorRow & Record<string, unknown> = {
            ...row,
          };

          if (area === 'Target') {
            metaData
              .filter(
                meta =>
                  meta.sdg === selectedSDG.value &&
                  String(meta.year) === String(row.year),
              )
              .forEach(meta => {
                const col = meta.indicator;
                const rawValue = row[col as keyof IndicatorRow];

                if (typeof rawValue === 'number') {
                  const value = rawValue;
                  const symbol =
                    value === 0 || value === 100
                      ? '='
                      : meta.interpretation.includes('lower performance')
                        ? '≤'
                        : '≥';

                  updatedRow[`${col}_int`] = `${symbol} ${value}`;
                }
              });

            return {
              ...updatedRow,
              rowStyle: { backgroundColor: '#b5d5f53b' },
            };
          }

          if (area === 'India') {
            return {
              ...updatedRow,
              rowStyle: { backgroundColor: '#F7F7F7' },
            };
          }

          return {
            ...updatedRow,
          };
        });

        setIndicatorData(transformedData);
      })
      .catch(console.error);
  }, [selectedSDG, metaData]);

  if (selectedIndicator === null) {
    return <Spinner className='w-full h-full' />;
  }

  const getRefValue = (area: string) => {
    const val = indicatorData.find(
      d => d.yearFormatted === +selectedYear.value && d['STATEs/UTs'] === area,
    )?.[selectedIndicator.label as keyof IndicatorRow];
    return typeof val === 'number' ? val : null;
  };

  const indiaRef = getRefValue('India');
  const targetRef = getRefValue('Target');

  const targetRow = indicatorData.find(
    d =>
      d.yearFormatted === +selectedYear.value && d['STATEs/UTs'] === 'Target',
  );

  const intText = targetRow?.[`${selectedIndicator.label}_int`] as
    | string
    | undefined;

  const renderFootnotes = (selectedSDG: OptionsDataType | null) => {
    const sdgKey = selectedSDG?.value;
    const sdgNotes =
      (footnotesBySDG as Record<string, string[]>)[sdgKey ?? ''] || [];

    const allNotes = [...sdgNotes, generalNote];

    if (allNotes.length === 1) {
      return (
        <div className='text-sm text-primary-gray-550'>Note: {allNotes[0]}</div>
      );
    } else {
      return (
        <div className='text-sm text-primary-gray-550 space-y-1'>
          <div>Notes:</div>
          {allNotes.map((note, i) => (
            <div key={i}>{note}</div>
          ))}
        </div>
      );
    }
  };

  const heightOffset = (() => {
    if (selectedSDG?.value === 'SDG 10') return -64;
    if (selectedSDG?.value === 'SDG 14' || selectedSDG?.value === 'SDG 15')
      return -48;
    return 0;
  })();

  const computedHeight = VIS_HEIGHT + LEGEND_HEIGHT + heightOffset;

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
              onChange={option => setSelectedSDG(option as OptionsDataType)}
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
                          String(item.sdg) === selectedSDG?.value &&
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
                      excludeValues: ['India', 'Target'],
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
                    refValues: (() => {
                      const refs = [];
                      if (indiaRef !== null) {
                        refs.push({
                          value: indiaRef,
                          text: `India Average ${indiaRef}`,
                          color: '#000',
                          styles: {
                            line: { strokeWidth: '1px' },
                            text: { fontWeight: 600 },
                          },
                        });
                      }
                      if (targetRef !== null) {
                        refs.push({
                          value: targetRef,
                          text: `Target ${intText}`,
                          color: '#000',
                          styles: {
                            line: { strokeWidth: '1px' },
                            text: { fontWeight: 600 },
                          },
                        });
                      }
                      return refs;
                    })(),
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
                  d[selectedIndicator.label as keyof typeof d] !== null &&
                  d[selectedIndicator.label as keyof typeof d] !== undefined,
              ) ? (
                <SingleGraphDashboard
                  dataSettings={{
                    data: indicatorData.filter(
                      d =>
                        d.yearFormatted === +selectedYear.value &&
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
                    mapData: mapData,
                    colorLegendTitle: selectedIndicator?.label,
                    isWorldMap: false,
                    height: VIS_HEIGHT + LEGEND_HEIGHT,
                    mapNoDataColor: '#D4D6D8',
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
                  String(item.sdg) === selectedSDG?.value &&
                  String(item.year) === selectedYear.label,
              ) ? (
                <div className='w-full overflow-y-hidden'>
                  <P marginBottom='sm'>
                    {selectedSDG?.value === 'Comp. Score'
                      ? `Indicators behind the ${selectedSDG.label}`
                      : `Indicators behind the ${selectedSDG?.value} Index Score`}
                  </P>
                  <div className='grow flex mt-4 w-full undp-scrollbar'>
                    <SingleGraphDashboard
                      debugMode={true}
                      dataSettings={{
                        data: indicatorData
                          .filter(d => d.yearFormatted === +selectedYear.value)
                          .map(row => {
                            if (row['STATEs/UTs'] !== 'Target') return row;

                            const updatedRow = { ...row };

                            metaData
                              .filter(
                                item =>
                                  String(item.sdg) === selectedSDG?.value &&
                                  String(item.year) === selectedYear.label,
                              )
                              .forEach(item => {
                                const intCol = `${item.indicator}_int`;
                                if (intCol in row) {
                                  updatedRow[item.indicator] = row[intCol];
                                }
                              });

                            return updatedRow;
                          })
                          .sort((a, b) => {
                            const order = (name: string) => {
                              if (name === 'Target') return 0;
                              if (name === 'India') return 1;
                              return 2;
                            };

                            return (
                              order(a['STATEs/UTs']) - order(b['STATEs/UTs'])
                            );
                          }),
                      }}
                      graphType='dataTable'
                      graphSettings={{
                        height: computedHeight,
                        minWidth:
                          selectedSDG?.value !== 'SDG 1' &&
                          selectedSDG?.value !== 'SDG 7' &&
                          selectedSDG?.value !== 'SDG 12' &&
                          selectedSDG?.value !== 'SDG 13' &&
                          selectedSDG?.value !== 'SDG 14'
                            ? '2400px'
                            : undefined,
                        footNote: selectedSDG
                          ? renderFootnotes(selectedSDG)
                          : undefined,
                        columnData: [
                          {
                            columnTitle: 'States/UTs',
                            columnId: 'STATEs/UTs',
                            sortable: true,
                          },
                          ...metaData
                            .filter(
                              item =>
                                String(item.sdg) === selectedSDG?.value &&
                                String(item.year) === selectedYear.label,
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
                    <strong>{selectedSDG?.value}</strong> for{' '}
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
