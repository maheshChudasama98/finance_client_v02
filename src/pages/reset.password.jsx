import { Helmet } from 'react-helmet-async';

import { ResetPassword } from 'src/Apps/Auth/resetPassword';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Forgot password  </title>
      </Helmet>

      <ResetPassword />
    </>
  );
}