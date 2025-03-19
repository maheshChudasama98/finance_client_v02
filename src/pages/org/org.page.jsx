import { Helmet } from 'react-helmet-async';

import IndexComponent from 'src/OrgSection/Orgs';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Orgs </title>
      </Helmet>

      <IndexComponent />
    </>
  );
}
