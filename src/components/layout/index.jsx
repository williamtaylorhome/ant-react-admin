import { useEffect, useState } from 'react';
import { getQuery, isLogin, Layout as RALayout, KeepPageAlive } from '@ra-lib/admin';
import { APP_NAME, CONFIG_HOC, HASH_ROUTER, IS_SUB } from 'src/config';
import { toLogin, getCurrentPageConfig } from 'src/commons';
import { Header } from 'src/components';
import logo from 'src/components/logo/logo.png';

/**
 * Obtain the configuration used for layout
 */
function getOptions(options) {
    // Adjust the layout based on the configuration information of the high-level components
    const currentPageConfig = options || getCurrentPageConfig();
    const { title: queryTitle } = getQuery();
    let {
        auth,
        layout,
        layoutType,
        header: showHeader,
        headerSideToggle: showHeaderSideToggle,
        pageHeader: showPageHeader,
        keepMenuOpen,
        side: showSide,
        sideCollapsed,
        selectedMenuPath,
        title: pageTitle,
        breadcrumb,
        appendBreadcrumb,
        tab: showTab,
        persistTab,
        tabHeight,
        tabSideToggle: showTabSideToggle,
        tabHeaderExtra: showTabHeaderExtra,
        searchMenu: showSearchMenu,
        headerTheme,
        sideTheme,
        sideMaxWidth,
        logoTheme,
    } = { ...CONFIG_HOC, ...currentPageConfig };

    pageTitle = queryTitle || pageTitle;

    if (layout === false) {
        showHeader = false;
        showSide = false;
        showPageHeader = false;
        showTab = false;
    }

    return {
        auth,
        layout,
        layoutType,
        showHeader,
        showHeaderSideToggle,
        showSide,
        showTab,
        showTabSideToggle,
        showTabHeaderExtra,
        showPageHeader,
        showSearchMenu,
        persistTab,
        tabHeight,
        keepMenuOpen,
        sideCollapsed,
        selectedMenuPath,
        pageTitle,
        breadcrumb,
        appendBreadcrumb,
        headerTheme,
        sideTheme,
        sideMaxWidth,
        logoTheme,
    };
}

// If other components have requirements, you can use layoutRef to obtain a series of methods and data in Layout.
// Note: layoutRef.current may not exist
export const layoutRef = { current: null };

export default function Layout(props) {
    const { menus, collectedMenus, onMenuCollect } = props;
    const { auth, ...nextState } = getOptions();

    if (auth && !isLogin()) toLogin();

    const [refresh, setRefresh] = useState({});

    useEffect(() => {
        // Layout It is possible not to render,layoutRef.current It's possible to be null
        if (!layoutRef?.current?.setState) return;

        // Filter out the functions, which are handled by the layout hoc
        const state = Object.entries(nextState).reduce((prev, curr) => {
            const [key, value] = curr;
            if (typeof value !== 'function') prev[key] = value;

            return prev;
        }, {});

        layoutRef.current.setState(state);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ...Object.values(nextState),
        refresh,
    ]);

    // Layout is not rendered without using any of the features in Layout
    let withoutLayout = [nextState.showHeader, nextState.showSide, nextState.showTab, nextState.showPageHeader].every(
        (item) => !item,
    );

    if (IS_SUB) withoutLayout = true;

    if (window.location.pathname !== '/layout/setting' && withoutLayout) {
        if (CONFIG_HOC.keepAlive) return <KeepPageAlive hashRouter={HASH_ROUTER} {...props} />;

        return null;
    }

    return (
        <RALayout
            className="no-print"
            ref={(current) => (layoutRef.current = { ...current, refresh: () => setRefresh({}) })}
            logo={logo}
            title={APP_NAME}
            menus={menus}
            collectedMenus={collectedMenus}
            onMenuCollect={onMenuCollect}
            headerExtra={<Header />}
            keepPageAlive={CONFIG_HOC.keepAlive}
            hashRouter={HASH_ROUTER}
            {...nextState}
            {...props}
        />
    );
}

// Handler function configuration
export function layoutHoc() {
    return (WrappedComponent) => {
        const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

        const WithLayout = (props) => {
            let nextState = getOptions();

            nextState = Object.entries(nextState).reduce((prev, curr) => {
                const [key, value] = curr;
                if (typeof value === 'function') prev[key] = value(props);
                return prev;
            }, {});

            if (Object.keys(nextState).length && props.active !== false) {
                // Warning: Cannot update a component (`ForwardRef`) while rendering a different component (`withLayout(Connect(WithAjax(WithConfig(UserEdit))))`).
                setTimeout(() => {
                    layoutRef?.current?.setState(nextState);
                });
            }

            return <WrappedComponent {...props} />;
        };

        WithLayout.displayName = `WithLayout(${componentName})`;

        return WithLayout;
    };
}
