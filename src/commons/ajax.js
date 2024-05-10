import { getToken, Ajax, createAjaxHoc, createAjaxHooks } from '@ra-lib/admin';
import { AJAX_PREFIX, AJAX_TIMEOUT } from 'src/config';
import handleError from './handle-error';
import handleSuccess from './handle-success';

// Create an ajax instance and set the default values
const ajax = new Ajax({
    baseURL: AJAX_PREFIX,
    timeout: AJAX_TIMEOUT,
    onError: handleError,
    onSuccess: handleSuccess,
    // withCredentials: true, // Cross-domain carrying of cookies, corresponding to the backend Access-Control-Allow-Origin Not to be done '*', you need to specify a specific domain name
});

// Request an interception
ajax.instance.interceptors.request.use(
    (cfg) => {
        if (!cfg.headers) cfg.headers = {};
        // Here, each request will be dynamically fetched and put into the created instance, and it will only be loaded once, which sometimes will cause problems.
        cfg.headers['auth-token'] = getToken();
        return cfg;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    },
);

// Respond to interception
ajax.instance.interceptors.response.use(
    (res) => {
        // Do something before response

        // If the backend customization fails, the frontend throws it directly and takes the handle error logic
// if (typeof res.data === 'object' && 'code' in res.data && res.data.code !== 0) return Promise.reject(res.data);

        return res;
    },
    (error) => {
        // Do something with response error
        return Promise.reject(error);
    },
);

const hooks = createAjaxHooks(ajax);
const hoc = createAjaxHoc(ajax);

export default ajax;

export const ajaxHoc = hoc;

export const get = ajax.get;
export const post = ajax.post;
export const put = ajax.put;
export const del = ajax.del;
export const patch = ajax.patch;
export const download = ajax.download;

export const useGet = hooks.useGet;
export const usePost = hooks.usePost;
export const usePut = hooks.usePut;
export const useDel = hooks.useDel;
export const usePatch = hooks.usePatch;
export const useDownload = hooks.useDownload;
