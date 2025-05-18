import '@/styles/fonts.css';
import '@undp/design-system-react/dist/style.css';
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
import SlideFourContent from './components/Slides/04';
import { SDG_OPTIONS } from './constants';
import { getIndexGroup } from './utils/getIndexGroup';

export function App() {
  const [mapData, setMapData] = useState<
    FeatureCollection<Polygon | MultiPolygon> | undefined
  >(undefined);
  const [wideData, setWideData] = useState<RawDataType[]>([]);
  const [longData, setLongData] = useState<GraphDataType[]>([]);
  const [yearOptions, setYearsOptions] = useState<OptionsDataType[]>([]);
  const [areaOptions, setAreaOptions] = useState<OptionsDataType[]>([]);
  const [sdgOptions, setSDGOptions] = useState<OptionsDataType[]>([]);

  useEffect(() => {
    fetchAndParseJSON(
      'https://raw.githubusercontent.com/UNDP-Data/dv-country-geojson/refs/heads/main/ADM1/IND.json',
    )
      .then(setMapData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchAndParseCSV('/data/sdg-ind-index.csv')
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
              row.area === 'India' ? { backgroundColor: '#F7F7F7' } : undefined,
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
            })),
        );
        const yearOptions = getUniqValue(d, 'year')
          .sort()
          .map(year => ({
            label: `${year}`,
            value: `${year}`,
          }));

        const areaOptions = getUniqValue(d, 'area').map(area => ({
          label: area,
          value: area,
        }));

        const sdgOptions = SDG_OPTIONS.map(sdg => ({
          label: sdg.value,
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
                  el.year === yearOptions[yearOptions.length - 1].value,
              )?.value,
            ),
          }),
        );
        setWideData(transformedWideFormat);
        setLongData(transformedLongFormatWithLatestGroup);
        setYearsOptions(yearOptions);
        setAreaOptions(areaOptions);
        setSDGOptions(sdgOptions);
      })
      .catch(error => console.error('Error loading SDG data:', error));
  }, []);

  if (!mapData || !longData || !wideData)
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
                  Explore subnational SDG India Index data
                </H3>
                <P size='xl' marginBottom='sm' className='text-gray-600'>
                  Lorem ipsum dolor sit amet consectetur. Integer velit nibh
                  mattis rhoncus enim venenatis non euismod felis. Quam nec
                  porttitor sed et vitae et ac magna semper. Eu faucibus potenti
                  egestas nunc aenean elit porttitor.
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
                  Lorem ipsum dolor sit amet consectetur. Integer velit nibh
                  mattis rhoncus enim venenatis non euismod felis. Quam nec
                  porttitor sed et vitae et ac magna semper. Eu faucibus potenti
                  egestas nunc aenean elit porttitor.
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
                  Lorem ipsum dolor sit amet consectetur. Integer velit nibh
                  mattis rhoncus enim venenatis non euismod felis. Quam nec
                  porttitor sed et vitae et ac magna semper. Eu faucibus potenti
                  egestas nunc aenean elit porttitor.
                </P>
              </div>
            ),
            viz: (
              <SlideThreeContent
                mapData={mapData}
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  blandit augue eu sagittis facilisis. Class aptent taciti
                  sociosqu ad litora torquent per conubia nostra, per inceptos
                  himenaeos.
                </P>
              </div>
            ),
            viz: (
              <div className='bg-primary-white w-full p-6 flex flex-col'>
                <SlideFourContent
                  wideData={wideData}
                  mapData={mapData}
                  longData={longData}
                  yearOptions={yearOptions}
                  areaOptions={areaOptions}
                />
              </div>
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
