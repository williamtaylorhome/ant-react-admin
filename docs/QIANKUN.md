# Micro front-end

The current framework can be used as both the main project and the sub-project of Qiankun

## As a Qiankun subsystem

**Pay attention to the modifications when creating a new subproject package.json file name attribute**

Conventions:package.json name As:

    - BASE_NAME of subsystem 
    - The subsystem is registered with the main system name 、 activeRule
    - ant、ra-lib Component library class prefix

## Server settings

### Development model

- exploitation devServer

```js
devServer: (devServerConfig, {env, paths, proxy, allowedHost}) => {
    if (!devServerConfig.headers) devServerConfig.headers = {};
    devServerConfig.headers['Access-Control-Allow-Origin'] = '*';
    return devServerConfig;
}
```

- Develop a proxy server

```js
module.exports = function(app) {
    app.use(proxy('/api',
        {
            target: 'http://172.16.40.72:8080',
            pathRewrite: {
                '^/api': '', // If the backend interface has no prefix, it can be removed in this way
            },
            changeOrigin: true,
            secure: false, // Whether or not to validate the certificate
            ws: true, // Enable websockets
            // As a subsystem, you need to set the ability to allow cross-domain
            onProxyRes(proxyRes, req, res) {
                proxyRes.headers['Access-Control-Allow-Origin'] = '*';
                proxyRes.headers['Access-Control-Allow-Methods'] = '*';
                proxyRes.headers['Access-Control-Allow-Headers'] = '*';
            },
        },
    ));
};
```

### Production (test) deployment

- nginx arrangement

```
    # If it is a micro front-terminal project, you need to set the permission to cross domains
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods *;
    add_header Access-Control-Allow-Headers *;

    # Delete the interface server header
    proxy_hide_header Access-Control-Allow-Origin;
    proxy_hide_header Access-Control-Allow-Methods;
    proxy_hide_header Access-Control-Allow-Headers;
```

- Backend interface services

If you use ng, you can set it on NG without special settings, and if the frontend directly requests the backend interface service, you need to set up cross-domain

## The pit at the front end of Qiankun micro

-[ ] When a subsystem is uninstalled, the console sends a reminder `[qiankun] Set window.event while sandbox destroyed or inactive in xxx! `
