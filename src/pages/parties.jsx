import { Helmet } from 'react-helmet-async';

import Parties from 'src/Apps/Parties';

// ----------------------------------------------------------------------

export default function AppPage() {
    return (
        <>
            <Helmet>
                <title> Parties </title>
            </Helmet>

            <Parties />
        </>
    );
} 
