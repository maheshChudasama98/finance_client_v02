import { Helmet } from 'react-helmet-async';

import UserView from 'src/Apps/Users';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title>{__PROJECT_NAME__} | Users </title>
      </Helmet>

      <UserView />
    </>
  );
}
