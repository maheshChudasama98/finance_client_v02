import { Helmet } from 'react-helmet-async';

import Dashboard from 'src/Apps/Dashboard';

// ----------------------------------------------------------------------

export default function AppPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard  </title>
            </Helmet>

            <Dashboard />
        </>
    );
} 
