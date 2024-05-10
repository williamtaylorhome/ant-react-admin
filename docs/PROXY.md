# Development Agents
During development, if you want to interface with the backend, you can connect to the backend through an agent, and the development agent configuration is written in 'src/setupProxy.js'

```js
const proxy = require('http-proxy-middleware');

// Front-end web service proxy configuration
module.exports = function(app) {
    app.use(proxy('/api',
        {
            target: 'http://localhost:8081/', // Destination server
            pathRewrite: {
                '^/api': '', // If the backend interface has no prefix, it can be removed in this way
            },
            changeOrigin: true,
            secure: false, // Whether or not to validate the certificate
            ws: true, // Enable websockets
        },
    ));
};

```

Note: For more proxy configurations, please refer to [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
