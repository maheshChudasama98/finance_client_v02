import { Helmet } from 'react-helmet-async';

import { LoginView } from 'src/Apps/Auth/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>{__PROJECT_NAME__} | Login</title>
      </Helmet>
      <LoginView />
    </>
  );
}
