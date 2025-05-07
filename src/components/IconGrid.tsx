import { imageDownload, CsvDownloadButton } from '@undp/data-viz';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@undp/design-system-react';
import { ImageDown } from 'lucide-react';
import { useCallback } from 'react';

import { GraphDataType } from '@/types';

interface Props {
  selectedView: 'chart' | 'table' | 'map';
  data: unknown[];
  keys: string[];
  year?: number;
}

export default function IconGrid(props: Props) {
  const { selectedView, data, keys, year } = props;
  const filteredData = year
    ? (data as GraphDataType[]).filter(d => d.year === year)
    : (data as GraphDataType[]);
  const handleImageDownload = useCallback(() => {
    const el = document.getElementById(selectedView);
    if (el) imageDownload(el, `hdi-${selectedView}`);
  }, [selectedView]);

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
              className='border border-primary-gray-400 p-3 h-full w-fit cursor-pointer bg-transparent'
              aria-label='Download image'
            >
              <ImageDown size={16} strokeWidth={1.5} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className='m-0 p-0'>Download Image</p>
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
