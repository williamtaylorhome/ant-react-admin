if (window.__POWERED_BY_QIANKUN__) {
    // Dynamic settings webpack publicPath，Prevent resource loading errors

    const { PUBLIC_URL = '' } = process.env;

    let publicUrl = PUBLIC_URL.replace('/', '');

    if (publicUrl && !publicUrl.endsWith('/')) publicUrl = `${publicUrl}/`;

    // eslint-disable-next-line no-undef
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ + publicUrl;
}
/* eslint-disable import/first*/
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { notification, Modal, message } from 'antd';
import App from './App';
import { setMainApp } from '@ra-lib/admin';
import qiankun from './qiankun';

// If you enable mock, don't modify this judgment, otherwise it will put mock-related js into the production package, which is very large
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_MOCK) {
    require('./mock/index');
    console.warn('mock is enabled!!!');
}

function getRootDom(props) {
    const rootId = '#root';
    const { container } = props;
    return container ? container.querySelector(rootId) : document.querySelector(rootId);
}

function render(props = {}) {
    ReactDOM.render(<App />, getRootDom(props));
}

// When running alone, render
if (!window.__POWERED_BY_QIANKUN__) {
    render();
}

// Qiankun main application
qiankun();

// As a sub-application of Qiankun
export async function bootstrap(props) {}

export async function mount(props) {
    setMainApp(props.mainApp);
    render(props);
}

export async function unmount(props) {
    // Cleanup
    notification.destroy();
    message.destroy();
    Modal.destroyAll();

    ReactDOM.unmountComponentAtNode(getRootDom(props));
}
