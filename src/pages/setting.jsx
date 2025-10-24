import { Helmet } from 'react-helmet-async';

import Setting from 'src/Apps/Setting';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title>{__PROJECT_NAME__} | Setting </title>
      </Helmet>

      <Setting />
    </>
  );
}
