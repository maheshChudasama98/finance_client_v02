import { Helmet } from 'react-helmet-async';

import Accounts from 'src/Apps/Accounts';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title>{__PROJECT_NAME__} | Accounts </title>
      </Helmet>

      <Accounts />
    </>
  );
}
