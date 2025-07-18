import '@/styles/fonts.css';
import '@/styles/styles.css';
import '@undp/data-viz/style.css';
import '@undp/design-system-react/style.css';
import { H3, P, Spinner, VizCarousel } from '@undp/design-system-react';
import {
  checkIfNullOrUndefined,
  fetchAndParseCSV,
  fetchAndParseJSON,
  getUniqValue,
} from '@undp/data-viz';
import { useEffect, useState } from 'react';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

import { GraphDataType, OptionsDataType, RawDataType } from './types';
import SlideOneContent from './components/Slides/01';
import SlideTwoContent from './components/Slides/02';
import SlideThreeContent from './components/Slides/03';
import { COLORS, SDG_OPTIONS } from './constants';
import { getIndexGroup } from './utils/getIndexGroup';
import SlideFourContent from './components/Slides/04';

export function App() {
  const [mapDataBefore2020, setMapDataBefore2020] = useState<
    FeatureCollection<Polygon | MultiPolygon> | undefined
  >(undefined);
  const [mapData2020, setMapData2020] = useState<
    FeatureCollection<Polygon | MultiPolygon> | undefined
  >(undefined);
  const [wideData, setWideData] = useState<RawDataType[]>([]);
  const [longData, setLongData] = useState<GraphDataType[]>([]);
  const [yearOptions, setYearsOptions] = useState<OptionsDataType[]>([]);
  const [areaOptions, setAreaOptions] = useState<OptionsDataType[]>([]);
  const [sdgOptions, setSDGOptions] = useState<OptionsDataType[]>([]);

  useEffect(() => {
    fetchAndParseJSON('/data/map-geometry/India_State_Boundary_2020.json')
      .then(setMapData2020)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchAndParseJSON(
      '/data/map-geometry/India_State_Boundary_Before_2020.json',
    )
      .then(setMapDataBefore2020)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchAndParseCSV('/data/scoreData.csv')
      .then(d => {
        const transformedWideFormat = (d as RawDataType[]).map(row => {
          const sdgGroups: Record<string, string> = {};

          SDG_OPTIONS.forEach(sdg => {
            const key = sdg.value;
            const groupKey = `${key} Group`;
            const value = row[key as keyof RawDataType];
            sdgGroups[groupKey] =
              value != null && typeof value === 'number'
                ? getIndexGroup(value)
                : 'NA';
          });
          return {
            ...row,
            rowStyle:
              row.area === 'India' || row.area === 'Target'
                ? { backgroundColor: '#F7F7F7' }
                : undefined,
            year: `${row.year}`,
            ...sdgGroups,
          };
        });

        const transformedLongFormat = (d as RawDataType[]).flatMap(
          ({ year, yearFormatted, area, ...rest }) =>
            Object.entries(rest).map(([label, value]) => ({
              area,
              year: `${year}`,
              yearFormatted: `${yearFormatted}`,
              sdg: label,
              value: !checkIfNullOrUndefined(value)
                ? (value as number)
                : undefined,
              group: getIndexGroup(value as number | undefined),
              rowStyle:
                area === 'India' || area === 'Target'
                  ? { backgroundColor: '#F7F7F7' }
                  : undefined,
            })),
        );
        const uniqueYears = Array.from(
          new Map(
            transformedLongFormat.map(item => [item.yearFormatted, item]),
          ).values(),
        );

        const yearOptionsFromFile = uniqueYears
          .sort((a, b) => Number(b.yearFormatted) - Number(a.yearFormatted))
          .map(item => ({
            label: item.year,
            value: item.yearFormatted ?? item.year,
          }));

        const areaOptionsFromFile = getUniqValue(d, 'area')
          .filter(area => area !== 'Target')
          .sort((a, b) => {
            if (a === 'India') return -1;
            if (b === 'India') return 1;
            return a.localeCompare(b);
          })
          .map(area => ({
            label: area,
            value: area,
          }));

        const sdgOptionsFromFile = SDG_OPTIONS.map(sdg => ({
          label: sdg.label,
          value: sdg.value,
        }));
        const transformedLongFormatWithLatestGroup = transformedLongFormat.map(
          d => ({
            ...d,
            groupLatest: getIndexGroup(
              transformedLongFormat.find(
                el =>
                  el.area === d.area &&
                  el.sdg === d.sdg &&
                  el.year === yearOptionsFromFile[0].label,
              )?.value,
            ),
          }),
        );
        setWideData(transformedWideFormat);
        setLongData(transformedLongFormatWithLatestGroup);
        setYearsOptions(yearOptionsFromFile);
        setAreaOptions(areaOptionsFromFile);
        setSDGOptions(sdgOptionsFromFile);
      })
      .catch(error => console.error('Error loading SDG data:', error));
  }, []);

  if (!mapData2020 || !mapDataBefore2020 || !longData || !wideData)
    return (
      <div className='p-4'>
        <Spinner />
      </div>
    );

  return (
    <div className='bg-primary-gray-200 p-6 py-20'>
      <VizCarousel
        className='max-w-[1980px]'
        slides={[
          {
            content: (
              <div className='flex flex-col'>
                <H3 marginBottom='2xs'>
                  Performance of States and UTs on SDGs
                </H3>
                <P size='xl' marginBottom='sm' className='text-gray-600'>
                  Snapshot of how each State and UT performed across all 17
                  SDGs, with performance levels color-coded from
                  <span
                    className='font-bold'
                    style={{ color: COLORS.aspirant }}
                  >
                    {' '}
                    Aspirant
                  </span>{' '}
                  to
                  <span
                    className='font-bold'
                    style={{ color: COLORS.achiever }}
                  >
                    {' '}
                    Achiever
                  </span>
                  .
                </P>
              </div>
            ),
            viz: (
              <SlideOneContent
                longData={longData}
                wideData={wideData}
                yearOptions={yearOptions}
                sdgOptions={sdgOptions}
              />
            ),
          },
          {
            content: (
              <div className='flex flex-col'>
                <H3 marginBottom='2xs'>Zooming In: State/UT Profiles</H3>
                <P size='xl' marginBottom='sm' className='text-gray-600'>
                  Detailed SDG-wise performance and composite score for each
                  State and UT, helping identify progress made and areas
                  requiring greater focus.
                </P>
              </div>
            ),
            viz: (
              <SlideTwoContent
                data={longData}
                yearOptions={yearOptions}
                areaOptions={areaOptions}
              />
            ),
          },
          {
            content: (
              <div className='flex flex-col'>
                <H3 marginBottom='2xs'>
                  A Closer Look at Progress on Individual SDGs
                </H3>
                <P size='xl' marginBottom='sm' className='text-gray-600'>
                  Visualisation of State/UT performance on a specific SDG,
                  highlighting regional disparities and emerging trends across
                  the country.
                </P>
              </div>
            ),
            viz: (
              <SlideThreeContent
                mapData2020={mapData2020}
                mapDataBefore2020={mapDataBefore2020}
                data={longData}
                yearOptions={yearOptions}
                areaOptions={areaOptions}
                sdgOptions={sdgOptions}
              />
            ),
          },
          {
            content: (
              <div className='flex flex-col'>
                <H3 marginBottom='2xs'>
                  Exploring the Indicators Behind the SDG Index
                </H3>
                <P size='xl' marginBottom='sm' className='text-gray-600'>
                  Indicator-wise performance of each State and UT offers a
                  granular view of what drives goal-level scores, helping
                  pinpoint strengths, weaknesses, and data-driven priorities.
                </P>
              </div>
            ),
            viz: (
              <SlideFourContent
                mapData2020={mapData2020}
                mapDataBefore2020={mapDataBefore2020}
                yearOptions={yearOptions}
                sdgOptions={sdgOptions}
              />
            ),
          },
        ]}
        vizWidth='full'
        vizStyle={{
          height: '916px',
        }}
      />
    </div>
  );
}

export default App;
