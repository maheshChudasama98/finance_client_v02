import { Helmet } from 'react-helmet-async';

import Feeder from 'src/Apps/Feeder';

// ----------------------------------------------------------------------

export default function AppPage() {
    return (
        <>
            <Helmet>
                <title> Feeders  </title>
            </Helmet>

            <Feeder />
        </>
    );
} 
