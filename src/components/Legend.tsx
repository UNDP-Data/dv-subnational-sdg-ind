export default function Legend() {
  return (
    <div
      className='flex leading-0 mt-0 mb-4'
      aria-label='Color legend'
      style={{ maxWidth: 'none' }}
    >
      <div>
        <div className='flex flex-wrap gap-3.5 mb-0'>
          <div className='flex items-center gap-1 cursor-pointer'>
            <div
              className='w-3 h-3 rounded-full'
              style={{ backgroundColor: 'rgb(203, 54, 75)' }}
            />
            <p className='mt-0 ml-0 mr-0 text-sm leading-[1.4] mb-0'>
              Aspirant (0-49)
            </p>
          </div>
          <div className='flex items-center gap-1 cursor-pointer'>
            <div
              className='w-3 h-3 rounded-full'
              style={{ backgroundColor: 'rgb(246, 198, 70)' }}
            />
            <p className='mt-0 ml-0 mr-0 text-sm leading-[1.4] mb-0'>
              Performer (50-64)
            </p>
          </div>
          <div className='flex items-center gap-1 cursor-pointer'>
            <div
              className='w-3 h-3 rounded-full'
              style={{ backgroundColor: 'rgb(71, 158, 133)' }}
            />
            <p className='mt-0 ml-0 mr-0 text-sm leading-[1.4] mb-0'>
              Front Runner (65-99)
            </p>
          </div>
          <div className='flex items-center gap-1 cursor-pointer'>
            <div
              className='w-3 h-3 rounded-full'
              style={{ backgroundColor: 'rgb(78, 171, 233)' }}
            />
            <p className='mt-0 ml-0 mr-0 text-sm leading-[1.4] mb-0'>
              Achiever (100)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
