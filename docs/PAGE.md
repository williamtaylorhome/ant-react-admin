# Page development

A page refers to the page component that corresponds to a route. The most contact with business development is the page, which simplifies development through some encapsulation.

## Configure higher-level components

Some of the functions required by the component can be implemented by configuring the decorator, and the usage is as follows:

hooks:

```
import config from 'src/commons/config-hoc';

export default config({
    path: '/page/path',
    ...
})(function SomePage(props) {
...
});
```

class:

```
import React, {Component} from 'react';
import config from 'src/commons/config-hoc';

@config({
    path: '/page/path',
    title: 'Page title', // Menu based by default
    ajax: true, // The default is true
    ...
})
export default class SomePage extend Component {
    componentDidMount(){
        this.props.ajax
            .get(...)
            .then(...)
    }
...
}
```

All the parameters are as follows:

```js
// config All available parameters, as well as default values
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
    // Set the selection menu, based on the default window.location.pathname Selected  Used to set the non-menu subpage, menu selection status
    selectedMenuPath,
    // Set the page and tab titles, which are based on the selected menu by default, or you can set the /xxx?title=page titles via query string
    title,
    // Custom breadcrumbs, default based on selected menus, false: do not display,[{icon, title, path}, ...]
    breadcrumb,
    // Breadcrumb navigation has been added based on menus
    appendBreadcrumb,
    // The page is maintained, not destroyed, and config needs to be set. KEEP_PAGE_ALIVE === true to take effect
    keepAlive,
    // Whether to add or not withRouter Advanced components
    router = false,
    // props Whether to inject or not ajax
    ajax = CONFIG_HOC.ajax,
    // connect models，extend props.action
    connect = CONFIG_HOC.connect,
    // A high-level component of the pop-up box
    modal,
    // Drawer advanced components
    drawer,
    ...others
} = options;
```

## Page keep

The page is rendered once and then it remains in place, and jumping to the page again will not be recreated or re-rendered.

### How to turn it on

`/src/config CONFIG_HOC.keepAlive` Set to true

Note: Some parts do not need to keep alive pages, and can be set in the config high-level components `keepAlive: false`

### Page show/hide events

If you enable the keepAlive feature, you will receive active props. The current page status can be judged based on the change of the active value

Description of the Active value

- `undefined` The page is initialized, loaded for the first time
- `false` The page is hidden
- `true` The page is displayed

## Page containers

The system provides the following nodes of the PageContent，It has the following features:

- Added margin padding Style;
- Support page loading;
- Add a minimum height to always make the page full screen
- fitHeight The function is that the page fills the full screen, and when the content is too long, the page content will display a scroll bar

Loading is displayed

```js
const {loading} = this.state;

<PageContent loading={loading}>
    ...
</PageContent>
```
        
    
