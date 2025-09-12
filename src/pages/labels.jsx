import { Helmet } from 'react-helmet-async';

import Labels from 'src/Apps/Labels';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title>{__PROJECT_NAME__} | Labels </title>
      </Helmet>

      <Labels />
    </>
  );
}
