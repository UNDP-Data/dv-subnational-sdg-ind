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

import { GraphDataType, OptionsDataType, RawSDGData } from './types';
import SlideOneContent from './components/SlideOne';
// import SlideTwoContent from './components/SlideTwo';
// import SlideThreeContent from './components/SlideThree';
// import SlideFourContent from './components/SlideFour';
// import SlideFiveContent from './components/SlideFive';
import { VizCarousel } from './vizCarousel';

export function App() {
  const [mapData, setMapData] = useState<
    FeatureCollection<Polygon | MultiPolygon> | undefined
  >(undefined);
  const [graphData, setGraphData] = useState<GraphDataType[]>([]);
  const [yearsOptions, setYearsOptions] = useState<OptionsDataType[]>([]);
  const [stateOptions, setStateOptions] = useState<OptionsDataType[]>([]);
  // const [SDGOptions, setSDGOptions] = useState<OptionsDataType[]>([]);

  // const getIndexGroup = (
  //   value: number,
  // ): 'Aspirant' | 'Performer' | 'Front Runner' | 'Achiever' => {
  //   if (value < 49.99) return 'Aspirant';
  //   if (value < 64.99) return 'Performer';
  //   if (value < 99.99) return 'Front Runner';
  //   return 'Achiever';
  // };

  // Fetch the map data
  useEffect(() => {
    fetchAndParseJSON(
      'https://raw.githubusercontent.com/UNDP-Data/dv-country-geojson/refs/heads/main/ADM1/IND.json',
    )
      .then(setMapData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchAndParseCSV('/data/sdg-ind-index.csv')
      .then(rawData => {
        const typedData = rawData as RawSDGData[];
        const longFormatData = typedData.flatMap(row => {
          const { year, ['STATEs/UTs']: state, ...rest } = row;

          return Object.entries(rest).map(([sdgLabel, value]) => {
            const sdgNumber = parseInt(sdgLabel.replace('SDG ', ''), 10);
            return {
              state,
              year,
              sdg: `SDG ${sdgNumber}`,
              value: value as number,
            };
          });
        });

        const years = Array.from(new Set(longFormatData.map(d => d.year))).map(
          year => ({
            label: year,
            value: year,
          }),
        );

        const states = getUniqValue(longFormatData, 'state').map(state => ({
          label: state,
          value: state,
        }));

        // const SDGs = getUniqValue(longFormatData, 'sdg')
        //   .sort((a, b) => a - b)
        //   .map((sdg: string) => ({
        //     label: sdg,
        //     value: sdg,
        //   }));

        setYearsOptions(years);
        setStateOptions(states);
        // setSDGOptions(SDGs);
        setGraphData(longFormatData);
      })
      .catch(error => console.error('Error loading SDG data:', error));
  }, []);

  if (!mapData || !graphData) return null;
  return (
    <div style={{ height: '800px' }}>
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
              <SlideOneContent
                graphData={graphData}
                yearsOptions={yearsOptions}
                stateOptions={stateOptions}
              />
            ),
          },
          // {
          //   content: (
          //     <div className='flex flex-col'>
          //       <H3 marginBottom='2xs'>Zooming In: State Profiles</H3>
          //       <P size='xl' marginBottom='none' className='text-gray-600'>
          //         Lorem ipsum dolor sit amet consectetur. Integer velit nibh
          //         mattis rhoncus enim venenatis non euismod felis. Quam nec
          //         porttitor sed et vitae et ac magna semper. Eu faucibus potenti
          //         egestas nunc aenean elit porttitor.
          //       </P>
          //     </div>
          //   ),
          //   viz: (
          //     <SlideTwoContent
          //       graphData={graphData}
          //       yearsOptions={yearsOptions}
          //       stateOptions={stateOptions}
          //     />
          //   ),
          // },
          // {
          //   content: (
          //     <div className='flex flex-col'>
          //       <H3 marginBottom='2xs'>
          //         A Closer Look at Progress on Individual SDGs
          //       </H3>
          //       <P size='xl' marginBottom='none' className='text-gray-600'>
          //         Lorem ipsum dolor sit amet consectetur. Integer velit nibh
          //         mattis rhoncus enim venenatis non euismod felis. Quam nec
          //         porttitor sed et vitae et ac magna semper. Eu faucibus potenti
          //         egestas nunc aenean elit porttitor.
          //       </P>
          //     </div>
          //   ),
          //   viz: (
          //     <SlideThreeContent
          //       mapData={mapData}
          //       graphData={graphData}
          //       yearsOptions={yearsOptions}
          //       stateOptions={stateOptions}
          //       SDGOptions={SDGOptions}
          //     />
          //   ),
          // },
          // {
          //   content: (
          //     <div className='flex flex-col'>
          //       <H3 marginBottom='2xs'>
          //         How Have SDG Index Changed Over Time?
          //       </H3>
          //       <P size='xl' marginBottom='none' className='text-gray-600'>
          //         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          //         blandit augue eu sagittis facilisis. Class aptent taciti
          //         sociosqu ad litora torquent per conubia nostra, per inceptos
          //         himenaeos.
          //       </P>
          //     </div>
          //   ),
          //   viz: (
          //     <SlideFourContent
          //       graphData={graphData}
          //       stateOptions={stateOptions}
          //       SDGOptions={SDGOptions}
          //     />
          //   ),
          // },
          // {
          //   content: (
          //     <div className='flex flex-col'>
          //       <H3 marginBottom='2xs'>
          //         Exploring the Indicators Behind the SDG Index
          //       </H3>
          //       <P size='xl' marginBottom='none' className='text-gray-600'>
          //         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          //         blandit augue eu sagittis facilisis. Class aptent taciti
          //         sociosqu ad litora torquent per conubia nostra, per inceptos
          //         himenaeos.
          //       </P>
          //     </div>
          //   ),
          //   viz: (
          //     <div className='bg-primary-white w-full p-6 flex flex-col'>
          //       <SlideFiveContent
          //         mapData={mapData}
          //         graphData={graphData}
          //         yearsOptions={yearsOptions}
          //         stateOptions={stateOptions}
          //         SDGOptions={SDGOptions}
          //       />
          //     </div>
          //   ),
          // },
        ]}
        vizWidth='full'
        vizStyle={{
          height: '800px',
        }}
      />
    </div>
  );
}

export default App;
