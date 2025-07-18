// import IconGrid from '../IconGrid';

import { useEffect, useState } from 'react';
import { fetchAndParseCSV } from '@undp/data-viz';
import { Spinner } from '@undp/design-system-react';
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';

import Visualization from './Visualization';

import { GroupedOptionType, MetaDataType, OptionsDataType } from '@/types';

interface Props {
  mapData2020: FeatureCollection<Polygon | MultiPolygon>;
  mapDataBefore2020: FeatureCollection<Polygon | MultiPolygon>;
  yearOptions: OptionsDataType[];
  sdgOptions: OptionsDataType[];
}

export default function SlideFourContent(props: Props) {
  const { mapData2020, mapDataBefore2020, yearOptions, sdgOptions } = props;
  const [metaData, setMetaData] = useState<MetaDataType[]>([]);
  const [indicatorOptions, setIndicatorOptions] = useState<GroupedOptionType[]>(
    [],
  );
  useEffect(() => {
    fetchAndParseCSV('/data/metaData.csv')
      .then((d: unknown) => {
        const sortedMetaData = (d as MetaDataType[])
          .sort((a, b) => b.yearFormatted - a.yearFormatted)
          .sort(
            (a, b) =>
              parseInt(a.sdg.split(' ')[1], 10) -
              parseInt(b.sdg.split(' ')[1], 10),
          );
        setIndicatorOptions(
          [...new Set(sortedMetaData.map(d => d.sdg))].map(d => ({
            label: `${sortedMetaData.filter(el => d === el.sdg)[0].sdg} - ${sortedMetaData.filter(el => d === el.sdg)[0].label}`,
            options: sortedMetaData
              .filter(el => d === el.sdg)
              .map(el => ({
                value: `${el.sdg}~${el.indicator}`,
                label: el.indicator,
              })),
          })),
        );
        setMetaData(sortedMetaData);
      })
      .catch(console.error);
  }, []);
  return (
    <div className='bg-primary-white flex flex-col grow w-full gap-2'>
      {metaData.length === 0 || indicatorOptions.length === 0 ? (
        <Spinner />
      ) : (
        <Visualization
          metaData={metaData}
          indicatorOptions={indicatorOptions}
          mapData2020={mapData2020}
          mapDataBefore2020={mapDataBefore2020}
          yearOptions={yearOptions}
          sdgOptions={sdgOptions}
        />
      )}
    </div>
  );
}
