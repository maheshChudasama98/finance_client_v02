import { Helmet } from 'react-helmet-async';

import NewConnection from 'src/Apps/NewConnection';

// ----------------------------------------------------------------------

export default function AppPage() {
    return (
        <>
            <Helmet>
                <title> New Connection </title>
            </Helmet>

            <NewConnection />
        </>
    );
} 
