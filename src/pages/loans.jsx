import { Helmet } from 'react-helmet-async';

import Loans from 'src/Apps/Loans';

// ----------------------------------------------------------------------

export default function LoansPage() {
  return (
    <>
      <Helmet>
        <title>{__PROJECT_NAME__} | Loans </title>
      </Helmet>

      <Loans />
    </>
  );
}
