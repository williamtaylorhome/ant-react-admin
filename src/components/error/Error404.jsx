import { useEffect, useState } from 'react';
import { Error404 } from '@ra-lib/admin';
import { getCurrentActiveSubApp } from 'src/qiankun';
import { IS_SUB } from 'src/config';

export default function MyError404() {
    const [isSubApp, setIsSubApp] = useState(true);

    const { pathname } = window.location;

    // Detects whether it is a child app
    useEffect(() => {
        (async () => {
            const subApp = await getCurrentActiveSubApp();
            setIsSubApp(!!subApp);
        })();
    }, [pathname]);

    if (isSubApp && !IS_SUB) return null;

    return <Error404 />;
}
