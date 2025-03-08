import { Helmet } from 'react-helmet-async';

import Categories from 'src/Apps/Categories';

// ----------------------------------------------------------------------

export default function AppPage() {
    return (
        <>
            <Helmet>
                <title> Categories </title>
            </Helmet>

            <Categories />
        </>
    );
} 
