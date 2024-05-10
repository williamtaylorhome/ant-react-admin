const path = require('path');

/**
 * It is used for IDE identification such as WebStorm and import, and it is not a build configuration.
 * The build configuration is in craco.config.js
 * */
module.exports = {
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
        },
    },
};
