import {match} from 'path-to-regexp';
import moment from 'moment';
import {isActiveApp} from '../qiankun';
import api from 'src/api';
import {BASE_NAME, HASH_ROUTER, IS_SUB, NO_AUTH_ROUTES} from '../config';
import {getMainApp, isLoginPage, getParentOrigin} from '@ra-lib/admin';
import pageConfigs from 'src/pages/page-configs';

/**
 * Browser jump, carry baseName hash etc
 * @param href
 * @returns {string|*}
 */
export function locationHref(href) {
    if (href?.startsWith('http')) return (window.location.href = href);

    if (href && BASE_NAME && href.startsWith(BASE_NAME)) href = href.replace(BASE_NAME, '');

    const hash = HASH_ROUTER ? '#' : '';

    return (window.location.href = `${BASE_NAME}${hash}${href}`);
}

/**
 * Go to the home page
 */
export function toHome() {
    // Jump to the page, which will give priority to the last logout page
    let lastHref = window.sessionStorage.getItem('last-href') || '/';

    const url = lastHref.startsWith('http') ? new URL(lastHref) : {pathname: '/'};

    // Last time, it was a non-landing page, so I jumped directly to the homepage
    if (isNoAuthPage(url.pathname)) lastHref = '/';

    locationHref(lastHref);

    if (HASH_ROUTER) window.location.reload();
}

/**
 * Jump to the login page
 */
export function toLogin() {
    const loginPath = '/login';

    // Determine whether the current page is already a login page, and if so, return it directly without redirecting to prevent a jump loop
    if (isLoginPage()) return null;

    // Clear the relevant data
    window.sessionStorage.clear();
    window.sessionStorage.setItem('last-href', window.location.href);

    if (IS_SUB) {
        // Micro frontend, jump to the main application login
        const mainToLogin = getMainApp()?.toLogin;
        if (mainToLogin) return mainToLogin();

        // Inside a mated iframe
        const parentOrigin = getParentOrigin();
        if (parentOrigin) return (window.location.href = `${parentOrigin}/error-401.html`);
    }

    locationHref(loginPath);

    if (HASH_ROUTER) window.location.reload();

    return null;
}

/**
 * Detect route configuration conflicts
 * @param result
 * @returns {string|boolean}
 */
export async function checkPath(result) {
    const subApps = await api.getSubApps();

    const hasHome = result.some(({path}) => path === '/');
    if (!hasHome) throw Error(`Must contain a homepage route,path: '/'， If you need other pages to do the homepage, you can do it Redirect`);

    result
        .filter(({path}) => !!path)
        .forEach(({path, filePath}) => {
            // Whether it conflicts with the subproject configuration
            const app = subApps.find((item) => isActiveApp(item, path));
            if (app)
                throw Error(
                    `Routing address:「${path}」 and sub-projects 「${
                        app.title || app.name
                    }」 The configuration of the activation rule is conflicting, and the corresponding file file file is as follows:\n${filePath}`,
                );

            // Check whether the self-routing configuration conflicts
            const exit = result.find(({filePath: f, path: p}) => {
                if (f === filePath) return false;

                if (!p || !path) return false;

                if (p === path) return true;

                return match(path, {decode: decodeURIComponent})(p) || match(p, {decode: decodeURIComponent})(path);
            });
            if (exit)
                throw Error(
                    `Routing address:「${path}」 and 「${exit.path}」 The configuration conflict, the corresponding file file file is as follows:\n${filePath}\n${exit.filePath}`,
                );
        });
}

/**
 * Based on window.location.pathname pageConfig Obtain the advanced component parameters of the config on the current page
 * @returns {{}|*}
 */
export function getCurrentPageConfig() {
    let {pathname, hash} = window.location;
    if (HASH_ROUTER) {
        pathname = hash.replace('#', '').split('?')[0];
    } else if (BASE_NAME) {
        pathname = pathname.replace(BASE_NAME, '');
    }

    const config = pageConfigs.find(({path}) => path && match(path, {decode: decodeURIComponent})(pathname));

    return config || {};
}

/**
 * Load the js file
 * @param url
 * @returns {Promise<unknown>}
 */
export function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.onload = resolve;
        script.src = url;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Page configuration that does not require login
 * @param pathname
 * @returns {boolean}
 */
export function isNoAuthPage(pathname) {
    return NO_AUTH_ROUTES.includes(pathname || window.location.pathname);
}

// table column Render time
export function renderTime(format = 'YYYY-MM-DD HH:mm:ss') {
    return (value) => {
        if (!value) return '-';

        return moment(value).format(format);
    };
}

// table column Render date
export function renderDate(format = 'YYYY-MM-DD') {
    return (value) => {
        if (!value) return '-';

        return moment(value).format(format);
    };
}
