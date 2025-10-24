import { Helmet } from 'react-helmet-async';

import Record from 'src/Apps/Record';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title>{__PROJECT_NAME__} | Records </title>
      </Helmet>

      <Record />
    </>
  );
}
