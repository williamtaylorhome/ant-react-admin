/**
 * Simplify how to write mock requests
 *
 * Conventions:method url delay，Sections are separated by a single space
 *      url starts with re:, which will be converted to regular, for example:re:/mock/user-center/.+ -> /\/mock\/user-center\/.+/
 *
 * @example
 * 
 *
 * @param mock
 * @param mocks
 */
export const simplify = (mock, mocks) =>
    mocks.forEach((item) =>
        Object.keys(item).forEach((key) => {
            let method = key.split(' ')[0];
            let url = key.split(' ')[1];
            const delay = key.split(' ')[2] || 300;
            const result = item[key];

            method = `on${method.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}`;

            if (url.startsWith('re:')) {
                url = new RegExp(url.replace('re:', ''));
            }

            if (typeof result === 'function') {
                mock[method](url).reply(result);
            } else {
                mock[method](url).reply(() => {
                    // Join the delay
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve([200, result]);
                        }, delay);
                    });
                });
            }
        }),
    );

/**
 * Get a random number
 * @param max
 * @returns {number}
 */
export function randomNumber(max) {
    return Math.ceil(Math.random() * max);
}

/**
 * Randomly get the array count elements
 * @param arr
 * @param count
 * @returns {FlatArray<*[], 1>[]}
 */
export function randomArray(arr, count) {
    const source = [...arr];
    const result = [];

    for (let i = 0; i < count; i++) {
        const randomIndex = randomNumber(source.length - 1);
        result.push(source.splice(randomIndex, 1));
    }
    return result.flat();
}
