import { Helmet } from 'react-helmet-async';

import { NotFoundView } from 'src/Apps/error/index';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>{__PROJECT_NAME__} | 404 Page Not Found </title>
      </Helmet>

      <NotFoundView />
    </>
  );
}
