import { Helmet } from 'react-helmet-async';

import UserViewPage from 'src/Apps/UserViewPage';

// ----------------------------------------------------------------------

export default function AppPage() {
    return (
        <>
            <Helmet>
                <title> Notices </title>
            </Helmet>
            <UserViewPage />

        </>
    );
} 
