import { Helmet } from 'react-helmet-async';

import IndexComponent from 'src/OrgSection/Modules';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Modules </title>
      </Helmet>

      <IndexComponent />
    </>
  );
}
