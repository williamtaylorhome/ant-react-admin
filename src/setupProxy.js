const proxy = require('http-proxy-middleware');
const proxyConfig = require('./setupProxyConfig.json');
const path = require('path');
const fs = require('fs');

// Modify the ng agent in the test environment synchronously
modifyTestNg();

// Front-end web service proxy configuration
module.exports = function (app) {
    proxyConfig
        .filter((item) => !item.disabled)
        .forEach(({ baseUrl, target }) => {
            app.use(
                proxy(baseUrl, {
                    target,
                    pathRewrite: {
                        ['^' + baseUrl]: '',
                    },
                    changeOrigin: true,
                    secure: false, // Whether or not to validate the certificate
                    ws: true, // Enable websockets
                    // As a subsystem, you need to set the ability to allow cross-domain
                    // onProxyRes(proxyRes, req, res) {
                    //     proxyRes.headers['Access-Control-Allow-Origin'] = '*';
                    //     proxyRes.headers['Access-Control-Allow-Methods'] = '*';
                    //     proxyRes.headers['Access-Control-Allow-Headers'] = '*';
                    // },
                }),
            );
        });

    app.use(
        proxy('/portal', {
            target: 'http://172.16.143.44:32328', // Test the portal backend
            pathRewrite: {
                '^/portal': '',
            },
            changeOrigin: true,
            secure: false, // Whether or not to validate the certificate
            ws: true, // Enable websockets
        }),
    );
};

function modifyTestNg() {
    const ngConfigPath = path.resolve(__dirname, '..', 'deploy', 'rancher', 'nginx.conf');
    const ngConfig = fs.readFileSync(ngConfigPath, 'UTF-8');
    const locations = proxyConfig
        .filter((item) => !item.disabled)
        .map(({ name, baseUrl, target }) => {
            return `
    # Proxy AJAX requests ${name}
    location ^~${baseUrl} {
        rewrite ^${baseUrl}/(.*)$ /$1 break; # If the backend interface does not start with the API, remove the API prefix
        proxy_pass ${target};
        proxy_set_header Host  $http_host;
        proxy_set_header Connection close;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Server $host;
    }
        `;
        })
        .join('');
    const startIndex = ngConfig.indexOf('# Proxy AJAX requests');

    const nextNgConfig = `
${ngConfig.substring(0, startIndex)}${locations.trim()}
}
    `;
    fs.writeFileSync(ngConfigPath, nextNgConfig.trim(), 'UTF-8');
}
