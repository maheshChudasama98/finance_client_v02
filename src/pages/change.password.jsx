import { Helmet } from 'react-helmet-async';

import ChangePassword from 'src/Apps/Auth/changePassword';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Change password </title>
      </Helmet>

      <ChangePassword />
    </>
  );
}
