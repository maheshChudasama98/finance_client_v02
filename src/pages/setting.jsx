import { Helmet } from 'react-helmet-async';

import Setting from 'src/Apps/Setting';

// ----------------------------------------------------------------------

export default function AppPage() {
    return (
        <>
            <Helmet>
                <title> Setting </title>
            </Helmet>

            <Setting />
        </>
    );
} 
