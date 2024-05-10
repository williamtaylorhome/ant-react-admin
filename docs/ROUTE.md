# System routing
System routing usage [react-router](https://reactrouter.com/en/main/route/route)。
The most commonly used scenario for routing is a path for a page, but developers have to write configuration files, and when multiple people collaborate, the configuration files often conflict.
The system uses scripts to simplify route configuration.

## Route configuration mode
Pass config-loader Populate the higher-order component parameters to `/src/pages/page-configs.js` File.

Page config decorator
```js
@config({
    path: '/path',
})
export default class SomePage extends React.Component {
    ...
}
```

Like what SomePage.jsx In any of the above formulations,config-loader Eventually, it will be `/src/pages/page-configs.js` The file is populated with the following routing configuration:
```js
{
    path: '/path',
    component: () => import('/path/to/SomePage.jsx'),
},
```

## Secondary pages
    
If you want to keep the parent menu selected on the second-level page, set it in the config high-level component selectedMenuPath parameter
