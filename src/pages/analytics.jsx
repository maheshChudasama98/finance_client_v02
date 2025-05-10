import { Helmet } from 'react-helmet-async';

import Analytics from 'src/Apps/Analytics';

// ----------------------------------------------------------------------

export default function AppPage() {
    return (
        <>
            <Helmet>
                <title> Analytics </title>
            </Helmet>

            <Analytics />
        </>
    );
} 
