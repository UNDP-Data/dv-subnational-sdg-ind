import { useState } from 'react';
import { SingleGraphDashboard } from '@undp/data-viz';
import { DropdownSelect, P, SegmentedControl } from '@undp/design-system-react';
import { ChartBar, ImageDownIcon, Table2 } from 'lucide-react';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';

import IconGrid from './IconGrid';

import { GraphDataType, OptionsDataType } from '@/types';

interface Props {
  graphData: GraphDataType[];
  mapData: FeatureCollection<Polygon | MultiPolygon>;
  yearsOptions: OptionsDataType[];
  stateOptions: OptionsDataType[];
  SDGOptions: OptionsDataType[];
}

export default function SlideThreeContent(props: Props) {
  const { graphData, mapData, yearsOptions, stateOptions, SDGOptions } = props;
  const [selectedYear, setSelectedYear] = useState({
    label: '2022',
    value: '2022',
  });
  const [selectedState, setSelectedState] = useState<OptionsDataType | null>(
    null,
  );
  const [selectedSDG, setSelectedSDG] = useState<OptionsDataType | null>({
    label: 'SDG 1',
    value: 'SDG 1',
  });
  const [selectedView, setSelectedView] = useState<'chart' | 'table' | 'map'>(
    'chart',
  );

  return (
    graphData && (
      <div className='flex flex-col justify-between grow w-full gap-2'>
        <div className='flex justify-between items-center gap-4 flex-wrap'>
          <P size='lg' marginBottom='none'>
            SDG Index Score by States ({selectedYear?.value})
          </P>
          <div className='flex gap-4 flex-wrap items-center'>
            <DropdownSelect
              onChange={option => setSelectedSDG(option as OptionsDataType)}
              options={SDGOptions}
              defaultValue={selectedSDG}
              size='sm'
              placeholder='Highlight state'
              className='min-w-[240px]'
              variant='light'
            />
            <DropdownSelect
              onChange={option => setSelectedState(option as OptionsDataType)}
              options={stateOptions}
              isClearable={true}
              defaultValue={selectedState}
              size='sm'
              placeholder='Highlight state'
              className='min-w-[240px]'
              variant='light'
            />
            <DropdownSelect
              onChange={option => setSelectedYear(option as OptionsDataType)}
              options={yearsOptions}
              size='sm'
              placeholder='Select year'
              isClearable={false}
              defaultValue={selectedYear}
              className='min-w-40'
              variant='light'
            />
            <SegmentedControl
              defaultValue='map'
              size='sm'
              value={selectedView}
              color='black'
              onValueChange={value =>
                setSelectedView(value as 'chart' | 'table' | 'map')
              }
              options={[
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
                        <ChartBar size={16} strokeWidth={1.5} />
                      </div>
                      <P marginBottom='none' size='sm'>
                        Chart
                      </P>
                    </div>
                  ),
                  value: 'chart',
                },
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
            <IconGrid
              selectedView='chart'
              data={graphData}
              year={2022}
              keys={[
                'department',
                'Human Development Index',
                'hdiGroup',
                'year',
              ]}
            />
          </div>
        </div>
        <div className='grow flex mt-4'>
          {selectedView === 'map' && (
            <SingleGraphDashboard
              dataSettings={{
                data: graphData,
                fileType: 'csv',
              }}
              graphType='choroplethMap'
              dataFilters={[
                {
                  column: 'year',
                  includeValues: selectedYear
                    ? [Number(selectedYear.value)]
                    : [],
                },
                {
                  column: 'sdg',
                  includeValues: selectedSDG ? [selectedSDG.value] : [],
                },
              ]}
              graphDataConfiguration={[
                { columnId: 'state', chartConfigId: 'id' },
                { columnId: 'indexGroup', chartConfigId: 'x' },
              ]}
              graphSettings={{
                mapData: mapData,
                graphID: 'map',
                isWorldMap: false,
                scale: 1.1,
                zoomScaleExtend: [1, 1],
                colorLegendTitle: 'SDG Index Score groups',
                categorical: true,
                tooltip: '{{id}} – <b>{{data.sdgIndex}}</b> (<b>{{x}}</b>)',
                colors: ['#CB364B', '#F6C646', '#479E85', '#4EABE9'],
                colorDomain: [
                  'Aspirant',
                  'Performer',
                  'Front Runner',
                  'Achiever',
                ],
                highlightedIds: selectedState ? [selectedState.value] : [],
              }}
            />
          )}
          {selectedView === 'chart' && (
            <SingleGraphDashboard
              dataSettings={{
                data: graphData,
                fileType: 'csv',
              }}
              graphType='barChart'
              dataFilters={[
                {
                  column: 'year',
                  includeValues: selectedYear
                    ? [Number(selectedYear.value)]
                    : [],
                },
                {
                  column: 'sdg',
                  includeValues: selectedSDG ? [selectedSDG.value] : [],
                },
              ]}
              graphDataConfiguration={[
                { columnId: 'state', chartConfigId: 'label' },
                { columnId: 'value', chartConfigId: 'size' },
                { columnId: 'indexGroup', chartConfigId: 'color' },
              ]}
              graphSettings={{
                colors: ['#CB364B', '#F6C646', '#479E85', '#4EABE9'],
                colorDomain: [
                  'Aspirant',
                  'Performer',
                  'Front Runner',
                  'Achiever',
                ],
                showNAColor: false,
                showLabels: true,
                truncateBy: 3,
              }}
            />
          )}
          {selectedView === 'table' && (
            <SingleGraphDashboard
              dataSettings={{
                data: graphData,
                fileType: 'csv',
              }}
              graphType='dataTable'
              readableHeader={[
                {
                  value: 'SDG 1',
                  label: 'SDG 1: No Poverty',
                },
                {
                  value: 'SDG 2',
                  label: 'SDG 2: No Hunger',
                },
              ]}
              dataFilters={[
                {
                  column: 'year',
                  includeValues: selectedYear
                    ? [Number(selectedYear.value)]
                    : [],
                },
                {
                  column: 'sdg',
                  includeValues: selectedSDG ? [selectedSDG.value] : [],
                },
              ]}
              graphSettings={{
                graphID: 'table',
                columnData: [
                  {
                    columnTitle: 'State',
                    columnId: 'state',
                    sortable: true,
                  },
                  {
                    columnTitle: 'SDG Index Score',
                    columnId: 'value',
                    sortable: true,
                  },
                  {
                    columnTitle: 'Group',
                    columnId: 'indexGroup',
                    sortable: true,
                  },
                ],
              }}
            />
          )}
        </div>
      </div>
    )
  );
}
