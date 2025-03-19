import { Helmet } from 'react-helmet-async';

import IndexComponent from 'src/OrgSection/Branches';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Branches </title>
      </Helmet>

      <IndexComponent />
    </>
  );
}
