import { SegmentedControl, P } from '@undp/design-system-react';
import { ChartBar, ImageDownIcon, ChartSpline, Table2 } from 'lucide-react';

import { ChartTypes } from '@/types';

interface Props {
  selectedView: ChartTypes;
  setSelectedView: (view: ChartTypes) => void;
  slideIndex: number;
}

export default function ViewSelection(props: Props) {
  const { selectedView, setSelectedView, slideIndex } = props;
  return (
    <SegmentedControl
      size='sm'
      value={selectedView}
      color='black'
      onValueChange={value => setSelectedView(value as ChartTypes)}
      options={[
        {
          label: (
            <div className='flex gap-2 h-fit items-center'>
              <div className='h-fit'>
                <ChartBar size={16} strokeWidth={1.5} />
              </div>
              <P marginBottom='none' size='sm'>
                Chart
              </P>
            </div>
          ),
          value: 'chart',
        },
        ...(slideIndex === 3 || slideIndex === 4
          ? [
              {
                label: (
                  <div className='flex gap-2 h-fit items-center'>
                    <div className='h-fit'>
                      <ImageDownIcon size={16} strokeWidth={1.5} />
                    </div>
                    <P marginBottom='none' size='sm'>
                      Map
                    </P>
                  </div>
                ),
                value: 'map',
              },
              {
                label: (
                  <div className='flex gap-2 h-fit items-center'>
                    <div className='h-fit'>
                      <ChartSpline size={16} strokeWidth={1.5} />
                    </div>
                    <P marginBottom='none' size='sm'>
                      Trends
                    </P>
                  </div>
                ),
                value: 'trends',
              },
            ]
          : []),
        {
          label: (
            <div className='flex gap-2 h-fit items-center'>
              <div className='h-fit'>
                <Table2 size={16} strokeWidth={1.5} />
              </div>
              <P marginBottom='none' size='sm'>
                Table
              </P>
            </div>
          ),
          value: 'table',
        },
      ]}
    />
  );
}
