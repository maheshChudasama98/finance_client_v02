import { Helmet } from 'react-helmet-async';

import FinanceCalculator from 'src/Apps/FinanceCalculator';

// ----------------------------------------------------------------------

export default function FinanceCalculatorPage() {
  return (
    <>
      <Helmet>
        <title>{__PROJECT_NAME__} | Finance Calculator </title>
      </Helmet>

      <FinanceCalculator />
    </>
  );
}
