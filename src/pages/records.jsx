import { Helmet } from 'react-helmet-async';

import Record from 'src/Apps/Record';

// ----------------------------------------------------------------------

export default function AppPage() {
    return (
        <>
            <Helmet>
                <title> Records </title>
            </Helmet>

            <Record />
        </>
    );
} 
