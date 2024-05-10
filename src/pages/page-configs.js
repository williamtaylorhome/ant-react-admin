/**
 * The current file will be processed by config-loader, and the edits will not be valid
 * The following is an example of the response:
 * */
export default [
    {
        path: '/users', // Routing address
        component: () => import('/../src/pages/home/user/index.jsx'),
        filePath: '/../src/pages/home/user/index.jsx', // The absolute path of the file
// ... Other config advanced component parameters
    },
];
