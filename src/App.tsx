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

import { GraphDataType, OptionsDataType } from './types';
import SlideOneContent from './components/SlideOne';
import SlideTwoContent from './components/SlideTwo';
import SlideThreeContent from './components/SlideThree';

export function App() {
  const [mapData, setMapData] = useState<
    FeatureCollection<Polygon | MultiPolygon> | undefined
  >(undefined);
  const [graphData, setGraphData] = useState<GraphDataType[]>([]);
  const [yearsOptions, setYearsOptions] = useState<OptionsDataType[]>([]);
  const [stateOptions, setStateOptions] = useState<OptionsDataType[]>([]);
  const [SDGOptions, setSDGOptions] = useState<OptionsDataType[]>([]);

  const getIndexGroup = (
    value: number,
  ): 'Aspirant' | 'Performer' | 'Front Runner' | 'Achiever' => {
    if (value < 49.99) return 'Aspirant';
    if (value < 64.99) return 'Performer';
    if (value < 99.99) return 'Front Runner';
    return 'Achiever';
  };

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
    fetchAndParseCSV('/data/placeholder.csv')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((d: any) => {
        const latestYear = getUniqValue(d, 'year').sort((a, b) => b - a)[0];
        const dataWithIndexGroups = (d as GraphDataType[]).map(item => {
          const indexNumber = +item.value;
          const formattedIndex = +indexNumber.toFixed(3);
          return {
            ...item,
            sdgIndex: formattedIndex,
            indexGroup: getIndexGroup(formattedIndex),
            colorId:
              getIndexGroup(
                (d as GraphDataType[])[
                  (d as GraphDataType[]).findIndex(
                    el => el.state === item.state && el.year === latestYear,
                  )
                ]['value'],
              ) || null,
          };
        });

        const years = getUniqValue(dataWithIndexGroups, 'year')
          .sort((a, b) => b - a)
          .map(year => ({
            label: `${year}`,
            value: `${year}`,
          }));

        const states = getUniqValue(dataWithIndexGroups, 'state').map(
          state => ({
            label: state,
            value: state,
          }),
        );

        const SDGs = getUniqValue(dataWithIndexGroups, 'sdg').map(sdg => ({
          label: sdg,
          value: sdg,
        }));

        setYearsOptions(years);
        setStateOptions(states);
        setSDGOptions(SDGs);
        setGraphData(dataWithIndexGroups);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  if (!mapData || !graphData) return null;
  return (
    <div className='bg-primary-gray-200 py-16 px-6 h-auto relative'>
      <VizCarousel
        className='max-w-[1980px]'
        slides={[
          {
            content: (
              <div className='flex flex-col'>
                <H3 marginBottom='2xs'>
                  Explore subnational SDG India Index data
                </H3>
                <P size='xl' marginBottom='none' className='text-gray-600'>
                  Lorem ipsum dolor sit amet consectetur. Integer velit nibh
                  mattis rhoncus enim venenatis non euismod felis. Quam nec
                  porttitor sed et vitae et ac magna semper. Eu faucibus potenti
                  egestas nunc aenean elit porttitor.
                </P>
              </div>
            ),
            viz: (
              <div className='bg-primary-white w-full p-6 flex flex-col min-h-[960px]'>
                <SlideOneContent
                  graphData={graphData}
                  yearsOptions={yearsOptions}
                  stateOptions={stateOptions}
                />
              </div>
            ),
          },
          {
            content: (
              <div className='flex flex-col'>
                <H3 marginBottom='2xs'>Zooming In: State Profiles</H3>
                <P size='xl' marginBottom='none' className='text-gray-600'>
                  Lorem ipsum dolor sit amet consectetur. Integer velit nibh
                  mattis rhoncus enim venenatis non euismod felis. Quam nec
                  porttitor sed et vitae et ac magna semper. Eu faucibus potenti
                  egestas nunc aenean elit porttitor.
                </P>
              </div>
            ),
            viz: (
              <div className='bg-primary-white w-full p-6 flex flex-col min-h-[960px]'>
                <SlideTwoContent
                  graphData={graphData}
                  yearsOptions={yearsOptions}
                  stateOptions={stateOptions}
                />
              </div>
            ),
          },
          {
            content: (
              <div className='flex flex-col'>
                <H3 marginBottom='2xs'>
                  A Closer Look at Progress on Individual SDGs
                </H3>
                <P size='xl' marginBottom='none' className='text-gray-600'>
                  Lorem ipsum dolor sit amet consectetur. Integer velit nibh
                  mattis rhoncus enim venenatis non euismod felis. Quam nec
                  porttitor sed et vitae et ac magna semper. Eu faucibus potenti
                  egestas nunc aenean elit porttitor.
                </P>
              </div>
            ),
            viz: (
              <div className='bg-primary-white w-full p-6 flex flex-col min-h-[960px]'>
                <SlideThreeContent
                  mapData={mapData}
                  graphData={graphData}
                  yearsOptions={yearsOptions}
                  stateOptions={stateOptions}
                  SDGOptions={SDGOptions}
                />
              </div>
            ),
          },
          {
            content: (
              <div className='flex flex-col'>
                <H3 marginBottom='2xs'>
                  How Have SDG Index Changed Over Time?
                </H3>
                <P size='xl' marginBottom='none' className='text-gray-600'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  blandit augue eu sagittis facilisis. Class aptent taciti
                  sociosqu ad litora torquent per conubia nostra, per inceptos
                  himenaeos.
                </P>
              </div>
            ),
            viz: (
              <div className='bg-primary-white w-full p-6 flex flex-col'>
                test
              </div>
            ),
          },
          {
            content: (
              <div className='flex flex-col'>
                <H3 marginBottom='2xs'>
                  Exploring the Indicators Behind the SDG Index
                </H3>
                <P size='xl' marginBottom='none' className='text-gray-600'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  blandit augue eu sagittis facilisis. Class aptent taciti
                  sociosqu ad litora torquent per conubia nostra, per inceptos
                  himenaeos.
                </P>
              </div>
            ),
            viz: (
              <div className='bg-primary-white w-full p-6 flex flex-col'>
                test
              </div>
            ),
          },
        ]}
        vizHeight='auto'
        vizWidth='full'
      />
    </div>
  );
}

export default App;
