import { Helmet } from 'react-helmet-async';

import Categories from 'src/Apps/Categories';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title>{__PROJECT_NAME__} | Categories </title>
      </Helmet>

      <Categories />
    </>
  );
}
