import { H3 } from '@undp/design-system-react';

import '@/styles/fonts.css';
import '@undp/design-system-react/dist/style.css';
import '@undp/data-viz/dist/style.css';
import undpLogo from './assets/undp-logo-blue.svg';

function App() {
  return (
    <div className='m-5'>
      <div>
        <img
          src={undpLogo}
          className='logo react mb-8'
          alt='React logo'
          width='72px'
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
      </div>
      <H3 className='text-center'>
        This is template for building visualization and frontend project
        maintained by UNDP&apos;s SDG Integration Team.
        <br />
        <br />
        Contact us at data@undp.org if you have any feedback or questions.
      </H3>
    </div>
  );
}

export default App;
