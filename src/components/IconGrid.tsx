import { imageDownload, CsvDownloadButton } from '@undp/data-viz';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@undp/design-system-react';
import { ImageDown } from 'lucide-react';
import { useCallback } from 'react';

import { GraphDataType, OptionsDataType } from '@/types';

interface Props {
  selectedView: 'chart' | 'table' | 'map' | 'trends';
  data: unknown[];
  keys: string[];
  year?: OptionsDataType;
  area?: OptionsDataType;
  sdg?: OptionsDataType;
  slideIndex: number;
}

export default function IconGrid(props: Props) {
  const { selectedView, data, keys, year, area, sdg, slideIndex } = props;
  const filteredData = (data as GraphDataType[]).filter(d => {
    const matchesYear = year ? String(d.year) === year.value : true;
    const matchesArea = area ? d.area === area.value : true;
    const matchesSDG = sdg ? d.sdg === sdg.value : true;
    return matchesYear && matchesArea && matchesSDG;
  });
  const handleImageDownload = useCallback(() => {
    const id = `slide-${slideIndex}-${selectedView}`;
    const el = document.getElementById(id);
    if (el) {
      imageDownload(el, `hdi-${id}`);
    }
  }, [slideIndex, selectedView]);

  const headers = keys.map(key => ({
    label: key,
    key: key,
  }));
  return (
    <div className='flex gap-2'>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              type='button'
              onClick={handleImageDownload}
              disabled={selectedView === 'table'}
              className={`border border-primary-gray-400 p-3 h-full w-fit ${
                selectedView === 'table'
                  ? 'cursor-not-allowed bg-primary-gray-200'
                  : 'cursor-pointer bg-transparent'
              }`}
              aria-label='Download image'
            >
              <ImageDown
                size={16}
                strokeWidth={1.5}
                className={`${
                  selectedView === 'table'
                    ? 'text-gray-400 opacity-20'
                    : 'text-black'
                }`}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className='m-0 p-0'>
              {selectedView === 'table'
                ? 'Not available for table view'
                : 'Download Image'}
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <CsvDownloadButton
              csvData={filteredData}
              className='border border-primary-gray-400 p-3 h-full w-fit cursor-pointer bg-transparent'
              headers={headers}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className='m-0 p-0'>Download Data</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
