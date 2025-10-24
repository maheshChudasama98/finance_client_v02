import { Helmet } from 'react-helmet-async';

import { ResetPassword } from 'src/Apps/Auth/resetPassword';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>{__PROJECT_NAME__} | Forgot password </title>
      </Helmet>

      <ResetPassword />
    </>
  );
}
