import { Loading } from '@ra-lib/admin';
import loadable from '@loadable/component';
import { checkPath } from '../commons';
import pageConfigs from 'src/pages/page-configs';

// Check whether there are conflicting route configurations
checkPath(pageConfigs);

// The route to which the crawled page is made
const pageRoutes = pageConfigs.filter(({ path }) => !!path);

// A page that is accessible to all
export const commonPaths = ['/', '/login'];

/*
 * Non-scripted grabbed routes, which can be edited here,
 * The route that the script grabs is at ./src/pages/page-configs.js中
 * */
export default [
    // {path: '/', component: ()=> import('./path-to-component')},
    { path: '/iframe_page_/:src', component: () => import('../components/iframe') },
    { path: '/layout/setting', component: () => import('../components/layout/layout-setting/SettingPage') },
]
    .concat(pageRoutes)
    .map((item) => {
        return {
            ...item,
            component: loadable(item.component, { fallback: <Loading /> }),
        };
    });
