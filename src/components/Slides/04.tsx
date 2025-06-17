import { useEffect, useState } from 'react';
import { DropdownSelect } from '@undp/design-system-react';
import {
  checkIfNullOrUndefined,
  fetchAndParseCSV,
  SingleGraphDashboard,
} from '@undp/data-viz';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';

// import IconGrid from '../IconGrid';
import ViewSelection from '../ViewSelection';

import {
  MetaDataType,
  OptionsDataType,
  GroupedOptionType,
  ChartTypes,
} from '@/types';
import { SDG_TITLES, TABLE_HEIGHT } from '@/constants';

// const footnotesBySDG = {
//   'SDG 10': [
//     'The "Percentage of SC/ST seats in State Legislative Assemblies" indicator is excluded from index computation due to the absence of a uniform target across all States/UTs.',
//     'The number of crime cases against SCs for Mizoram stands at 5.',
//   ],
//   'SDG 14': [
//     'The "Mean shore zone coastal water quality (DO) - Biochemical Oxygen Demand (BOD) (mg/l)" indicator has not been used to assess the performance of coastal States due to the absence of fixed quantitative targets.',
//   ],
//   'SDG 15': ['The absolute number of Wildlife cases for Delhi stands at 4128.'],
// };

// const generalNote =
//   'From 2020, Dadra and Nagar Haveli and Daman and Diu were merged into one Union Territory.';

// const renderFootnotes = (selectedSDG: OptionsDataType | null) => {
//   const sdgKey = selectedSDG?.value;
//   const sdgNotes =
//     (footnotesBySDG as Record<string, string[]>)[sdgKey ?? ''] || [];

//   const allNotes = [...sdgNotes, generalNote];

//   if (allNotes.length === 1) {
//     return `{{{<div class="text-sm text-primary-gray-550">Note: ${allNotes[0]}</div>}}}`;
//   } else {
//     const notesHtml = allNotes
//       .map(note => `<div class="text-sm text-primary-gray-550">${note}</div>`)
//       .join('');

//     return `{{{<div class="text-sm text-primary-gray-550">Notes:</div>${notesHtml}}}}`;
//   }
// };

interface Props {
  mapData: FeatureCollection<Polygon | MultiPolygon>;
  yearOptions: OptionsDataType[];
}

export default function SlideFourContent(props: Props) {
  const { mapData, yearOptions } = props;
  const [indicatorData, setIndicatorData] = useState<
    Record<string, string | number>[]
  >([]);
  const [selectedView, setSelectedView] = useState<ChartTypes>('chart');
  const [indicatorOptions, setIndicatorOptions] = useState<GroupedOptionType[]>(
    [],
  );
  const [metaData, setMetaData] = useState<MetaDataType[]>([]);
  const [selectedIndicator, setSelectedIndicator] =
    useState<OptionsDataType | null>(null);
  const [sdgOptions, setSdgOptions] = useState<OptionsDataType[]>([]);
  const [selectedYear, setSelectedYear] = useState(yearOptions[0]);
  const [selectedSDG, setSelectedSDG] = useState<OptionsDataType | null>(null);

  useEffect(() => {
    if (!yearOptions || yearOptions.length === 0) return;

    fetchAndParseCSV('/data/metaData.csv')
      .then((d: unknown) => {
        const parsed = d as MetaDataType[];
        setMetaData(parsed);

        const filteredByYear = parsed.filter(
          item =>
            String(item.year).trim() === String(selectedYear.label).trim(),
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

        filteredByYear.forEach(item => {
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

        const groupedIndicatorOptions = Object.values(grouped);
        const sdgOptionList = Array.from(uniqueSDGs.values());

        setIndicatorOptions(groupedIndicatorOptions);
        setSdgOptions(sdgOptionList);

        if (sdgOptionList.length > 0) {
          setSelectedSDG(sdgOptionList[0]);
        } else {
          setSelectedSDG(null);
        }

        const firstGroup = groupedIndicatorOptions[0];
        if (firstGroup && firstGroup.options.length > 0) {
          setSelectedIndicator(firstGroup.options[0]);
        } else {
          setSelectedIndicator(null);
        }
      })
      .catch(console.error);
  }, [selectedYear, yearOptions]);

  useEffect(() => {
    if (!selectedSDG || !selectedYear || metaData.length === 0) return;

    const path = `/data/SDG/${selectedSDG.value}.csv`;

    fetchAndParseCSV(path)
      .then((rows: unknown) => {
        const typedRows = rows as Record<string, string | number>[];
        const filtered = typedRows.filter(
          row => String(row.year) === String(selectedYear.label),
        );
        setIndicatorData(filtered);
      })
      .catch(console.error);
  }, [selectedSDG, selectedYear, metaData]);
  const activeIndicators = metaData.filter(
    item =>
      String(item.sdg).trim() === String(selectedSDG?.value).trim() &&
      String(item.year).trim() === String(selectedYear.label).trim(),
  );

  useEffect(() => {
    if (!selectedIndicator || !metaData.length) return;

    const matched = metaData.find(
      item => item.indicator === selectedIndicator.value,
    );

    if (!matched) return;

    const sdgKey = `${matched.sdg}`;
    setSelectedSDG({
      label: `${sdgKey} - ${SDG_TITLES[matched.sdg]?.title ?? ''}`,
      value: sdgKey,
    });
  }, [selectedIndicator, metaData]);

  const filteredIndicatorData = indicatorData
    .map(row => {
      const value = row[selectedIndicator?.value ?? ''];
      return {
        area: row['STATEs/UTs'],
        value: !checkIfNullOrUndefined(value) ? Number(value) : undefined,
      };
    })
    .filter(d => d.area && d.value !== undefined);

  const sortedTableData = [...indicatorData].sort((a, b) => {
    const priority = (area: string) =>
      area === 'Target' ? 0 : area === 'India' ? 1 : 2;

    const aPriority = priority(String(a['STATEs/UTs']));
    const bPriority = priority(String(b['STATEs/UTs']));

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    return String(a['STATEs/UTs']).localeCompare(String(b['STATEs/UTs']));
  });

  const styledTableData = sortedTableData.map(row => ({
    ...row,
    rowStyle:
      row['STATEs/UTs'] === 'Target'
        ? { backgroundColor: '#E6F2FA' }
        : row['STATEs/UTs'] === 'India'
          ? { backgroundColor: '#F7F7F7' }
          : undefined,
  }));

  return (
    <div>
      {indicatorData.length === 0 ? (
        <div className='text-sm text-red-600 mt-2'>
          No indicators available for the selected year.
        </div>
      ) : (
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
              {/* <IconGrid
            selectedView={selectedView}
            data={filteredData}
            year={selectedYear}
            keys={[
              'area',
              ...activeIndicators.map(item => item.indicator),
              'year',
            ]}
            slideIndex={5}
          /> */}
            </div>
          </div>
          <div className='grow flex mt-4'>
            {selectedView === 'map' && (
              <SingleGraphDashboard
                dataSettings={{
                  data: filteredIndicatorData,
                }}
                graphType='choroplethMap'
                graphDataConfiguration={[
                  { columnId: 'area', chartConfigId: 'id' },
                  {
                    columnId: 'value',
                    chartConfigId: 'x',
                  },
                ]}
                graphSettings={{
                  graphID: 'slide-4-map',
                  mapData: mapData,
                  colorLegendTitle: selectedIndicator?.label,
                  isWorldMap: false,
                  height: TABLE_HEIGHT,
                  zoomInteraction: 'button',
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
            )}
            {selectedView === 'chart' && (
              <SingleGraphDashboard
                dataSettings={{
                  data: filteredIndicatorData,
                }}
                graphType='barChart'
                dataFilters={[
                  {
                    column: 'area',
                    excludeValues: ['India', 'Target'],
                  },
                ]}
                graphDataConfiguration={[
                  { columnId: 'area', chartConfigId: 'label' },
                  {
                    columnId: 'value',
                    chartConfigId: 'size',
                  },
                ]}
                graphSettings={{
                  graphID: 'slide-4-chart',
                  height: TABLE_HEIGHT - 24,
                  bottomMargin: 0,
                  topMargin: 24,
                  barPadding: 0.1,
                  colorLegendTitle: undefined,
                  orientation: 'horizontal',
                  maxBarThickness: 24,
                  showTicks: false,
                  leftMargin: 170,
                  truncateBy: 20,
                  showNAColor: false,
                  sortData: 'desc',
                  showLabels: true,
                  tooltip: `<div class="font-bold p-2 bg-primary-gray-300 uppercase text-xs">{{label}} (${selectedYear.label})</div><div class="p-2 flex justify-between"><div class='max-w-[240px]'>${selectedIndicator?.label}</div><div><b>{{size}}</b></div></div>`,
                  styles: {
                    tooltip: {
                      padding: '0',
                      minWidth: '150px',
                    },
                  },
                  // refValues: indiaValue
                  //   ? [
                  //       {
                  //         value: indiaValue,
                  //         text: `India Average ${indiaValue}`,
                  //         color: '#000000',
                  //       },
                  //     ]
                  //   : undefined,
                }}
              />
            )}
            {selectedView === 'table' && (
              <div className='w-full'>
                <div className='w-full mt-4 overflow-y-hidden'>
                  <SingleGraphDashboard
                    dataSettings={{
                      data: styledTableData,
                    }}
                    graphType='dataTable'
                    graphSettings={{
                      height:
                        selectedSDG?.value === 'SDG 10'
                          ? TABLE_HEIGHT - 50
                          : TABLE_HEIGHT,
                      minWidth:
                        selectedSDG?.value !== 'SDG 7' ? '2400px' : undefined,
                      // footNote: renderFootnotes(selectedSDG),
                      columnData: [
                        {
                          columnTitle: 'States/UTs',
                          columnId: 'STATEs/UTs',
                          sortable: true,
                        },
                        ...activeIndicators.map(indicator => ({
                          columnTitle: indicator.indicator,
                          columnId: indicator.indicator,
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
      )}
    </div>
  );
}
