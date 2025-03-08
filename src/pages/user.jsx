import { Helmet } from 'react-helmet-async';

import UserView from 'src/Apps/Users';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> User  </title>
      </Helmet>

      <UserView />
    </>
  );
}
