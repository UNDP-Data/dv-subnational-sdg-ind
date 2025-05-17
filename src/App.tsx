import '@/styles/fonts.css';
import '@undp/design-system-react/dist/style.css';
import { H3, P, VizCarousel } from '@undp/design-system-react';
import {
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
import { sdgList, SDGS } from './constants';
import { getIndexGroup } from './utils/getIndexGroup';

function transformDataWideFormat(data: RawDataType[]) {
  return data.map(row => {
    const sdgGroups: Record<string, string> = {};

    SDGS.filter(sdg => sdg.value.startsWith('SDG')).forEach(sdg => {
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
}

const transformDataLongFormat = (data: RawDataType[]) => {
  return data.flatMap(({ year, yearFormatted, area, ...rest }) => {
    return Object.entries(rest).map(([label, value]) => ({
      area,
      year: `${year}`,
      yearFormatted: `${yearFormatted}`,
      sdg: label,
      value: value ? (value as number) : undefined,
      group: value ? getIndexGroup(value as number) : 'NA',
    }));
  });
};

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
        const transformedWideFormat = transformDataWideFormat(
          d as RawDataType[],
        );

        const transformedLongFormat = transformDataLongFormat(
          transformedWideFormat,
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

        const sdgOptions = getUniqValue(transformedLongFormat, 'sdg')
          .filter(sdg => sdgList.includes(sdg))
          .sort((a, b) => sdgList.indexOf(a) - sdgList.indexOf(b))
          .map((sdg: string) => ({
            label: sdg,
            value: sdg,
          }));

        setWideData(transformedWideFormat);
        setLongData(transformedLongFormat);
        setYearsOptions(yearOptions);
        setAreaOptions(areaOptions);
        setSDGOptions(sdgOptions);
      })
      .catch(error => console.error('Error loading SDG data:', error));
  }, []);

  if (!mapData || !longData || !wideData) return null;
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
                longData={longData}
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
                longData={longData}
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
