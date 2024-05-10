import { withRouter } from 'react-router-dom';
import { createConfigHoc, modal as modalHoc, drawer as drawerHoc, getQuery, getLoginUser } from '@ra-lib/admin';
import { ajaxHoc } from 'src/commons/ajax';
import { connect as reduxConnect } from 'src/models';
import { CONFIG_HOC, IS_MOBILE } from 'src/config';
import { layoutHoc } from 'src/components/layout';
import React from 'react';

// A public high-level component that injects some common data, such as query loginUser
function commonHoc(options) {
    const { query, loginUser } = options;
    return (WrappedComponent) => {
        const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

        const WithLayout = (props) => {
            // By default, properties are added to properties in props
            const extendProps = {};
            if (query !== false) extendProps.query = getQuery();
            if (loginUser !== false) extendProps.loginUser = getLoginUser();

            return <WrappedComponent {...extendProps} {...props} />;
        };

        WithLayout.displayName = `WithCommon(${componentName})`;

        return WithLayout;
    };
}

export default function configHoc(options = {}) {
    // config All available parameters, along with default values
    const {
        // Routing address
        path,
        // Whether a sign-in is required
        auth,
        // Whether to display the top
        header,
        // Whether or not to display labels
        tab,
        // Whether to display the page header
        pageHeader,
        // Whether or not to display the sidebar
        side,
        // Whether the sidebar is collapsed or not
        sideCollapsed,
        // Set the selection menu, the default is based on window.location selection is used to set the non-menu subpage, menu selection state
        selectedMenuPath,
        // Set the page and tab titles, which are based on the selected menu by default, or you can set the /xxx?title=page titles via query string
        title,
        // Custom breadcrumbs, default based on selected menus, false: do not display,[{icon, title, path}, ...]
        breadcrumb,
        // Breadcrumb navigation has been added based on menus
        appendBreadcrumb,
        // The page is maintained, not destroyed, and config needs to be set. KEEP_PAGE_ALIVE === true to take effect
        keepAlive,
        // Whether to add or not with router Advanced components
        router = true,
        // Whether Props are injected or not
        ajax = CONFIG_HOC.ajax,
        // Connect models, extensions props.action
        connect = CONFIG_HOC.connect,
        // A high-level component of the pop-up box
        modal,
        // Drawer advanced components
        drawer,
        ...others
    } = options;

    // config Pass parameter validation
    if (modal && drawer) throw Error('[config hoc] modal and drawer config can not be used together!');

    const hoc = [];

    // Common high-level components
    hoc.push(commonHoc(options));

    // A high-level component of the pop-up box
    if (modal) hoc.push(modalHoc(modal, IS_MOBILE));

    // Drawer for high-end components
    if (drawer) hoc.push(drawerHoc(drawer));

    // redux connects higher-order components
    if (connect === true) hoc.push(reduxConnect());
    if (typeof connect === 'function') hoc.push(reduxConnect(connect));

    // Ajax high-level components
    if (ajax) hoc.push(ajaxHoc());

    // Routing higher-order components
    if (router) hoc.push(withRouter);

    // At the end, with some functional configurations, more props data can be obtained
    hoc.push(layoutHoc(options));

    return createConfigHoc({
        hoc,
        onConstructor: () => void 0,
        onDidMount: () => void 0,
        onUnmount: () => void 0,
    })({ ...options, ...others });
}
