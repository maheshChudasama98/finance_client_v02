import { Helmet } from 'react-helmet-async';

import Notices from 'src/Apps/Notices';

// ----------------------------------------------------------------------

export default function AppPage() {
    return (
        <>
            <Helmet>
                <title> Notices </title>
            </Helmet>

            <Notices />
        </>
    );
} 
