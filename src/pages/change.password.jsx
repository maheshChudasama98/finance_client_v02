import { Helmet } from 'react-helmet-async';

import ChangePassword from 'src/Apps/Auth/changePassword';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>{__PROJECT_NAME__} | Change password </title>
      </Helmet>

      <ChangePassword />
    </>
  );
}
