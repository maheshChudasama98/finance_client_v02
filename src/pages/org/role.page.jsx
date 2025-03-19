import { Helmet } from 'react-helmet-async';

import IndexComponent from 'src/OrgSection/Roles';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Roles </title>
      </Helmet>

      <IndexComponent />
    </>
  );
}
