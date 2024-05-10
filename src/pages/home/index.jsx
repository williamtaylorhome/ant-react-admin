// import {Redirect} from 'react-router-dom';
import { Button } from 'antd';
import { PageContent } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import styles from './style.less';

export default config({
    path: '/',
    title: 'Home',
})(function Home(props) {
    // If other pages are used as the homepage, redirect directly, do not set the title in the config, otherwise there will be multiple homepages in the tab page
// return <Redirect to="/users"/>;
    return (
        <PageContent className={styles.root}>
            <h1>Home</h1>
            {process.env.REACT_APP_MOCK ? (
                <Button
                    onClick={async () => {
                        await props.ajax.post('/initDB', null, { successTip: 'Database reset successful!' });
                        setTimeout(() => window.location.reload(), 2000);
                    }}
                >
                    Reset the database
                </Button>
            ) : null}
        </PageContent>
    );
});
