import { wrapperOptions } from '@ra-lib/admin';

/**
 * Use require.context to automatically ingest all model files
 * */
const result = {};

// Subfolders are not supported in the Src/models directory
const req = require.context('./', false, /\.js$/);
req.keys().forEach((key) => {
    if (['./index.js'].includes(key)) return;

    const model = req(key);

    const options = model.default;
    Object.entries(options).forEach(([k, value]) => {
        if (k in result) throw Error(`${key} file key 「${k}」It's been used! Please replace!`);
        result[k] = value;
    });
});

wrapperOptions(result, 1000 * 5);

export default result;
