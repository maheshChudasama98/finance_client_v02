import { Helmet } from 'react-helmet-async';

import Branches from 'src/Apps/Branches';

// ----------------------------------------------------------------------

export default function AppPage() {
    return (
        <>
            <Helmet>
                <title> Branches </title>
            </Helmet>

            <Branches />
        </>
    );
} 
