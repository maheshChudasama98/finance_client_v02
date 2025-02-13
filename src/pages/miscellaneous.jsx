import { Helmet } from 'react-helmet-async';

import MiscellaneousView from 'src/Apps/Miscellaneous';

// ----------------------------------------------------------------------

export default function Miscellaneous() {
    return (
        <>
            <Helmet>
                <title> Miscellaneous  </title>
            </Helmet>

            <MiscellaneousView />
        </>
    );
} 
