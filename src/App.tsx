import '@/styles/fonts.css';
import '@undp/design-system-react/dist/style.css';
import { H3, P } from '@undp/design-system-react';
import {
  fetchAndParseCSV,
  fetchAndParseJSON,
  getUniqValue,
} from '@undp/data-viz';
import { useEffect, useState } from 'react';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

import { GraphDataType, OptionsDataType, RawDataType } from './types';
import SlideOneContent from './components/SlideOne';
import SlideTwoContent from './components/SlideTwo';
import SlideThreeContent from './components/SlideThree';
import SlideFourContent from './components/SlideFour';
import { VizCarousel } from './vizCarousel';
import { SDGS } from './constants';

const getIndexGroup = (value: number) => {
  if (value < 49.99) return 'Aspirant (0–49)';
  if (value < 64.99) return 'Performer (50–64)';
  if (value < 99.99) return 'Front Runner (65–99)';
  return 'Achiever (100)';
};

const isValidGraphEntry = (label: string) =>
  label.startsWith('SDG ') || label === 'Comp. Score';

const transformGraphData = (data: RawDataType[]) => {
  return data.flatMap(({ year, yearFormatted, area, ...rest }) => {
    return Object.entries(rest)
      .filter(([label]) => isValidGraphEntry(label))
      .map(([label, value]) => ({
        area,
        year: `${year}`,
        yearFormatted: `${yearFormatted}`,
        sdg: label,
        value: value ? (value as number) : undefined,
        group: value ? getIndexGroup(value as number) : '–',
      }));
  });
};

export function App() {
  const [mapData, setMapData] = useState<
    FeatureCollection<Polygon | MultiPolygon> | undefined
  >(undefined);
  const [rawData, setRawData] = useState<RawDataType[]>([]);
  const [graphData, setGraphData] = useState<GraphDataType[]>([]);
  const [yearsOptions, setYearsOptions] = useState<OptionsDataType[]>([]);
  const [areaOptions, setAreaOptions] = useState<OptionsDataType[]>([]);
  const [sdgOptions, setSDGOptions] = useState<OptionsDataType[]>([]);

  // Fetch the map data
  useEffect(() => {
    fetchAndParseJSON(
      'https://raw.githubusercontent.com/UNDP-Data/dv-country-geojson/refs/heads/main/ADM1/IND.json',
    )
      .then(setMapData)
      .catch(console.error);
  }, []);

  // Fetch the graph data
  useEffect(() => {
    fetchAndParseCSV('/data/sdg-ind-index.csv')
      .then(d => {
        const raw = (d as RawDataType[]).map(row => ({
          ...row,
          year: `${row.year}`,
        }));
        const transformed = transformGraphData(raw);

        const yearsOptions = Array.from(new Set(transformed.map(d => d.year)))
          .sort()
          .map(year => ({ label: `${year}`, value: `${year}` }));

        const latestYear = yearsOptions[yearsOptions.length - 1]?.value;

        const latestGroupMap = new Map<string, string>();
        transformed.forEach(({ area, sdg, year, value }) => {
          if (year === latestYear && value !== undefined) {
            latestGroupMap.set(`${area}|||${sdg}`, getIndexGroup(value));
          }
        });

        const dataWithLatestGroup = transformed.map(d => {
          const key = `${d.area}|||${d.sdg}`;
          return {
            ...d,
            groupLatest: latestGroupMap.get(key),
          };
        });

        const areaOptions = getUniqValue(dataWithLatestGroup, 'area').map(
          area => ({
            label: area,
            value: area,
          }),
        );

        const sdgOrder = SDGS.map(sdg => sdg.value);
        const sdgOptions = getUniqValue(dataWithLatestGroup, 'sdg')
          .sort((a, b) => sdgOrder.indexOf(a) - sdgOrder.indexOf(b))
          .map((sdg: string) => ({
            label: sdg,
            value: sdg,
          }));

        setRawData(raw);
        setGraphData(dataWithLatestGroup);
        setYearsOptions(yearsOptions);
        setAreaOptions(areaOptions);
        setSDGOptions(sdgOptions);
      })
      .catch(error => console.error('Error loading SDG data:', error));
  }, []);

  if (!mapData || !graphData || !rawData) return null;
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
                graphData={graphData}
                rawData={rawData}
                yearsOptions={yearsOptions}
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
                graphData={graphData}
                yearsOptions={yearsOptions}
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
                graphData={graphData}
                yearsOptions={yearsOptions}
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
                  rawData={rawData}
                  mapData={mapData}
                  graphData={graphData}
                  yearsOptions={yearsOptions}
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
