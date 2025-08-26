import { Helmet } from 'react-helmet-async';

import Loans from 'src/Apps/Loans';

// ----------------------------------------------------------------------

export default function LoansPage() {
  return (
    <>
      <Helmet>
        <title> Loans </title>
      </Helmet>

      <Loans />
    </>
  );
}
