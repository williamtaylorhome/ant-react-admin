import ReactDOM from 'react-dom';
import { addGlobalUncaughtErrorHandler, registerMicroApps, start } from 'qiankun';
import { SubError } from './components';
import { getContainerId, PageContent } from '@ra-lib/admin';
import { CONFIG_HOC } from './config';
import api from 'src/api';
import App from './App';

/**
 * Gets the currently active sub-app
 * @param pathname
 * @returns {Promise<*>}
 */
export async function getCurrentActiveSubApp(pathname = window.location.pathname) {
    const name = `${pathname.split('/')[1]}`;
    const subApps = await api.getSubApps();

    return subApps.find((item) => item.name === name);
}

/**
 * Determine whether the subproject is active based on the name
 * @param app
 * @param pathname
 * @returns {*}
 */
export function isActiveApp(app, pathname = window.location.pathname) {
    return pathname.startsWith(`/${app.name}`);
}

/**
 * according to name fetch app arrangement
 * @param name
 */
export async function getAppByName(name) {
    const apps = await api.getSubApps();

    return apps.find((item) => item.name === name);
}

export default async function () {
    // Get the child app
    const subApps = await api.getSubApps();

    // Register the sub-application
    registerMicroApps(subApps, {
        // A loading prompt is displayed
        beforeLoad: (app) => {
            const { title = 'Sub-application', name } = app;

            // It must be wrapped through the app, otherwise the necessary environment is missing
            ReactDOM.render(
                <App>
                    <PageContent loading fitHeight loadingTip={`${title}Loading...`} />
                </App>,
                document.getElementById(getContainerId(name)),
            );
        },
    });

    // Launch the app
    start({
        // Whether only one app is loaded at the same time
        singular: !CONFIG_HOC.keepAlive,
        // Whether or not to preload
        prefetch: false,
    });

    // Global error handling
    addGlobalUncaughtErrorHandler((event) => {
        // The child app failed to load
        if (event?.message?.includes('died in status LOADING_SOURCE_CODE')) {
            const name = event.error.appOrParcelName;
            ReactDOM.render(
                <App>
                    <SubError error={event} name={name} />
                </App>,
                document.getElementById(getContainerId(name)),
            );
        }
    });
}
