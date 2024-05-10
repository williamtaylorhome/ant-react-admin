/**
 * Use require.context to automatically ingest all model files
 * */
const result = {};

// Subfolders are not supported in the Src/models directory
const req = require.context('./', false, /\.js$/);
req.keys().forEach((key) => {
    if (['./index.js', './models.js'].includes(key)) return;
    const model = req(key);
    const name = getModelName(key);
    result[name] = model.default;
});

// In the src/pages directory, subfolders are supported
const reqPages = require.context('../pages', true, /\.js$/);
reqPages.keys().forEach((key) => {
    if (!key.endsWith('model.js')) return;

    const model = reqPages(key);
    const name = getModelName(key);

    result[name] = model.default;
});

export default result;

/**
 * Get the module name
 * @param filePath
 */
function getModelName(filePath) {
    // models/page.js circumstance
    let name = filePath.replace('./', '').replace('.js', '');

    const names = filePath.split('/');
    const fileName = names[names.length - 1];
    const folderName = names[names.length - 2];

    // users/model.js circumstance
    if (fileName === 'model.js') name = folderName;

    // users/center.model.js circumstance
    if (fileName.endsWith('.model.js')) {
        name = fileName.replace('.model.js', '').replace(/\./g, '-');
    }

    return name.replace(/-(\w)/g, (a, b) => b.toUpperCase());
}
