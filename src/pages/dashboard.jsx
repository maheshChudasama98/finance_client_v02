import { Helmet } from 'react-helmet-async';

import Accounts from 'src/Apps/Dashboard';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title>{__PROJECT_NAME__} | Dashboard </title>
      </Helmet>

      <Accounts />
    </>
  );
}
