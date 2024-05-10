import React, { useState, useEffect, useCallback } from 'react';
import { ConfigProvider } from 'antd';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn'; // Solve the internationalization problem of components related to antd date
import { ComponentProvider, Loading, getLoginUser, setLoginUser /*Query parse,*/ } from '@ra-lib/admin';
import { Generator } from 'src/components';
import { isNoAuthPage } from 'src/commons';
import AppRouter from './router/AppRouter';
import { APP_NAME, CONFIG_HOC, IS_MOBILE } from 'src/config';
import { store } from 'src/models';
import api from 'src/api';
import theme from 'src/theme.less';
import './App.less';

// Set the language
moment.locale('zh-cn');

// Set up Modal、Message、Notification rootPrefixCls。
ConfigProvider.config({
    prefixCls: theme.antPrefix,
});

export default function App(props) {
    const { children } = props;
    const [loading, setLoading] = useState(true);
    const [menus, setMenus] = useState([]);
    const [collectedMenus, setCollectedMenus] = useState(CONFIG_HOC.showCollectedMenus ? [] : null);
    const handleMenuCollect = useCallback(async (menu, collected) => {
        await api.saveCollectedMenu({ menuId: menu.id, collected });

        const collectedMenus = await api.getCollectedMenus();
        setCollectedMenus(collectedMenus);
    }, []);

    // Some initialization work
    useEffect(() => {
        // Pages that don't require a login are not requested
        if (isNoAuthPage()) return setLoading(false);

        // Get user menus, permissions, and more
        (async () => {
            try {
                let loginUser = getLoginUser();
                if (!loginUser) {
                    // If you do not go through the login page or set the login user, you need to request the login user
// Send a request,fetch login user
// loginUser = await api.getLoginUser();
//
// const {token} = queryParse();
// if (token) loginUser.token = token;
//
// setLoginUser(loginUser);

                    return setLoading(false);
                }

                // User Favorites Menu Use then catch to prevent subsequent interface blocking
// User Favorites menu
                if (CONFIG_HOC.showCollectedMenus) {
                    await api.getCollectedMenus().then(setCollectedMenus).catch(console.error);
                }

                // Get the user menu
                await api.getMenus().then(setMenus).catch(console.error);

                // Get user permissions
                await api
                    .getPermissions()
                    .then((res) => {
                        loginUser.permissions = res;
                        setLoginUser(loginUser);
                    })
                    .catch(console.error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // After the load is completed, render to ensure that you can get data such as permissions
    return (
        <Provider store={store}>
            <ConfigProvider locale={zhCN} prefixCls={theme.antPrefix}>
                <Helmet title={APP_NAME} />
                <ComponentProvider
                    prefixCls={theme.raLibPrefix}
                    layoutPageOtherHeight={CONFIG_HOC.pageOtherHeight}
                    isMobile={IS_MOBILE}
                >
                    {loading ? (
                        <Loading progress={false} spin />
                    ) : children ? (
                        children
                    ) : (
                        <AppRouter menus={menus} collectedMenus={collectedMenus} onMenuCollect={handleMenuCollect} />
                    )}
                    {process.env.NODE_ENV === 'development' ? <Generator /> : null}
                </ComponentProvider>
            </ConfigProvider>
        </Provider>
    );
}
