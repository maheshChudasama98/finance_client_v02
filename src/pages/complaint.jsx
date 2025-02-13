import { Helmet } from 'react-helmet-async';

import Complaint from 'src/Apps/Complaint';

// ----------------------------------------------------------------------

export default function AppPage() {
    return (
        <>
            <Helmet>
                <title> Complaint  </title>
            </Helmet>

            <Complaint />
        </>
    );
} 
