import * as development from './config.development';
import * as production from './config.production';
import appPackage from '../../package.json';
import {storage, getConfigValue, LAYOUT_TYPE} from '@ra-lib/admin';

const allEnvConfig = {development, production};
const configEnv = process.env.REACT_APP_CONFIG_ENV || process.env.NODE_ENV;
const envConfig = allEnvConfig[configEnv] || {};
const isQianKun = window.__POWERED_BY_QIANKUN__;
const isQianKunPublicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
const appName = appPackage.name;
const isIframe = window.self !== window.top;

// Obtain configuration information from the command line or environment configuration file
const c = (key, defaultValue, parse = (value) => value) => getConfigValue(envConfig, key, defaultValue, parse);

/**
 * All configurations can be passed via command line arguments with a REACT_APP_ prefix, e.g. REACT_APP_CONFIG_ENV=test yarn build
 * Configure the priority command-line > Environment File > default
 * The current file is the default configuration and is overwritten by the environment configuration and command-line parameters
 * */
// Page routing whitelisting that does not require login
export const NO_AUTH_ROUTES = [
    '/login', // login
    '/register', // enroll
    '/password-retrieval', // Retrieve your password
];

// Node environment
export const NODE_ENV = process.env.NODE_ENV;
// In the actual running environment, the NODE_ENV of the test, pre-release, etc. environment is also production, so it is impossible to distinguish between them
export const RUN_ENV = process.env.REACT_APP_RUN_ENV;
// The name of the app
export const APP_NAME = c('APP_NAME', 'React Admin');
// AJAX request prefix
// The development environment or test environment uses the prefix stored in localStorage
export const SHOW_PROXY = NODE_ENV === 'development' || window.location.hostname === '172.16.143.44';
export const AJAX_PREFIX = SHOW_PROXY
    ? window.localStorage.getItem('AJAX_PREFIX') || '/api'
    : c('AJAX_PREFIX', isQianKun ? `${isQianKunPublicPath}api` : '/api');
// ajax timeout
export const AJAX_TIMEOUT = c('AJAX_TIMEOUT', 1000 * 60, Number);
// Configure the environment
export const CONFIG_ENV = process.env.REACT_APP_CONFIG_ENV;
// config-hoc 配置存储key
export const CONFIG_HOC_STORAGE_KEY = 'CONFIG_HOC_STORAGE_KEY';
// Whether there is a system concept or not, the top-level menu will be the system, the role has a system concept, and the subsystem administrator role is added by default
export const WITH_SYSTEMS = c('WITH_SYSTEMS', false);
// Page routing prefix
export const BASE_NAME = c('BASE_NAME', isQianKun ? `/${appName}` : '');
// Whether to use hash routing
export const HASH_ROUTER = c('HASH_ROUTER', false);
// Static file prefix
export const PUBLIC_URL = c('PUBLIC_URL', '');
// Whether it is a development environment
export const IS_DEV = c('RUN_ENV', RUN_ENV === 'development', (value) => value === 'development');
// Whether it's a production environment
export const IS_PROD = c('RUN_ENV', RUN_ENV === 'production', (value) => value === 'production');
// Whether it is a test environment
export const IS_TEST = c('RUN_ENV', RUN_ENV === 'test', (value) => value === 'test');
// Whether it's a preview or not
export const IS_PREVIEW = c('RUN_ENV', RUN_ENV === 'preview', (value) => value === 'preview');

// Whether it is a sub-project or embedded in an iframe
export const IS_SUB = c('IS_SUB', isQianKun || isIframe);
// Whether it's a phone layout or not
export const IS_MOBILE = c('IS_MOBILE', window.document.body.clientWidth <= 575);

const mobileConfig = IS_MOBILE
    ? {
          layoutType: LAYOUT_TYPE.SIDE_MENU,
          header: true,
          side: false,
          tab: false,
          headerTheme: 'dark',
      }
    : {};

// config-hoc is the default configuration for higher-level components and layouts
export const CONFIG_HOC = {
    // Whether a sign-in is required
    auth: true,
    // Props Whether to inject or not
    ajax: true,
    // Whether it is connected to the model
    connect: true,
    // Enable the page hold function, no special needs, try not to open it
    keepAlive: false,
    // Layout Layout LAYOUT_TYPE. SIDE_MENU LAYOUT_TYPE. TOP_MENU LAYOUT_TYPE. TOP_SIDE_MENU
    layoutType: LAYOUT_TYPE.SIDE_MENU,
    // Whether the head is displayed
    header: true,
    // Whether the sidebar is displayed
    side: true,
    // Whether or not Tabs are displayed
    tab: false,
    // Persist tabs records
    persistTab: true,
    // On the left side of the tab, the Expand Collapse Menu button appears
    tabSideToggle: true,
    // The right side of the tab shows the additional header content
    tabHeaderExtra: true,
    // Tab height
    tabHeight: 40,
    // Whether the page header is displayed
    pageHeader: false,
    // Header theme
    headerTheme: 'default', // dark
// Sidebar theme
    sideTheme: 'dark', // dark
// logo theme
    logoTheme: 'dark',
    // The sidebar expands the width
    sideMaxWidth: 210,
    // The head display menu expands the collapse button
    headerSideToggle: true,
    // Keep the menu expanded
    keepMenuOpen: true,
    // The left menu is collapsed
    sideCollapsed: false,
    // Whether or not to display the search menu
    searchMenu: true,
    // Whether or not to display the My Favorites menu
    showCollectedMenus: false,
    // The extra height value used to calculate the height is calculated when the PageContent component fitHeight, and the height of the footer is set here if the page displays a uniform footer
    pageOtherHeight: 0, // The default footer height is 26

    ...mobileConfig,
    ...(storage.local.getItem(CONFIG_HOC_STORAGE_KEY) || {}),
};
