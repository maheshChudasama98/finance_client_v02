import { Helmet } from 'react-helmet-async';

import { SignupView } from 'src/Apps/Auth/signup';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>{__PROJECT_NAME__} | Sign Up</title>
      </Helmet>
      <SignupView />
    </>
  );
}
