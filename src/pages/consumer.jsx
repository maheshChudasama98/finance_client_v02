import { Helmet } from 'react-helmet-async';

import Consumer from 'src/Apps/Consumer';

// ----------------------------------------------------------------------

export default function AppPage() {
    return (
        <>
            <Helmet>
                <title> Consumer  </title>
            </Helmet>

            <Consumer />
        </>
    );
} 
