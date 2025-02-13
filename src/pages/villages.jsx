import { Helmet } from 'react-helmet-async';

import Villages from 'src/Apps/Villages';

// ----------------------------------------------------------------------

export default function AppPage() {
    return (
        <>
            <Helmet>
                <title> Villages </title>
            </Helmet>

            <Villages />
        </>
    );
} 
