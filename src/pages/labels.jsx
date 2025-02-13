import { Helmet } from 'react-helmet-async';

import Labels from 'src/Apps/Labels';

// ----------------------------------------------------------------------

export default function AppPage() {
    return (
        <>
            <Helmet>
                <title> Labels </title>
            </Helmet>

            <Labels />
        </>
    );
} 
