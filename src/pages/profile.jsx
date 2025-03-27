import { Helmet } from 'react-helmet-async';

import Profile from 'src/Apps/Profile';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Profile </title>
      </Helmet>

      <Profile />
    </>
  );
}
