import { Helmet } from 'react-helmet-async';

import Profile from 'src/Apps/Profile';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title>{__PROJECT_NAME__} | Profile </title>
      </Helmet>

      <Profile />
    </>
  );
}
