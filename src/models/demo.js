export default {
    /**
     * Initialize the state
     *
     * It is recommended that all states used in the model be initialized:
     * 1. Reasonable initialization value, which can avoid using errors;
     * 2. You can quickly know the data structure provided by the current model through the state list
     * */
    state: {
        name: 'Default value',
        user: null,
        syncObj: {
            good: 123,
            bar: {
                a: {
                    aa: 'aa',
                    aaa: 'aaa',
                    aaaa: ['a', 'a1', 'a2'],
                },
            },
            foo: ['f', 'f1'],
        },
    },
    /**
     * will state Sync to localStorage
     * default false，There are two ways to transfer values:
     * 1. true All current model state are all synchronized
     * 2. [path, path, ...] designation jsonpath synchronous，See：https://lodash.com/docs/4.17.15#get
     */
    syncLocal: ['syncObj.bar.a.aaaa[1]', 'syncObj.foo', 'name', 'user'],
    /**
     * The configuration is the same syncLocal，Sync to sessionStorage
     */
    // syncSession: true,

    /**
     * Synchronous and asynchronous both try to capture, whether to call the handleError method for error handling when there is an error,
     * The default is true, all processing, and you can specify separately which ones need to be processed automatically
     */
    errorTip: {
        async: true, // Asynchronous prompts
        sync: true, // Synchronization prompts
        getUser: 'User acquisition failed, right!!', // getUser prompt has the highest priority
    },

    /**
     * If the operation is successful, the default is false, and the rule is the same as errorTip
     */
    successTip: {
        async: false, // Asynchronous prompts
        sync: false, // Synchronization prompts
        getUser: 'Get user success !!', // getUser prompt default "Operation successful"
        setUser: 'The user was set successfully',
    },
    /**
     * Undo, redo
     * default false,There are two ways to assign values:
     * 1. true, Currently, all methods of the model will trigger undo and redo history, and the configuration will use the default value of redux undo
     * 2. object,Specify the configuration, see for details https://github.com/omnidan/redux-undo
     *      New include、exclude Two configurations,Benchmarking redux-undo filter。 Generally, only one can be configured, and if two exist at the same time, include will take effect
     *
     * If configured undoable
     * 1. The state data structure will be converted to: (only affect the value of connect, not the return value of method)
     * demo = {
     *   future: []
     *   group: null
     *   Index: 4
     *   Limit: 5
     *   past: (4) [{...}, {...}, {...}, {...}]
     *   present: {name: 1618027715626, ...}
     * }
     * 2. New methods: (Do not define some of the following methods in the model, they will be overwritten)
     * '${modelName}Undo' (demoUndo)
     * '${modelName}Redo'
     * '${modelName}Jump'
     * '${modelName}JumpToPast'
     * '${modelName}JumpToFuture'
     * '${modelName}ClearHistory'
     * */
    undoable: {
        // Https://github.com/omnidan/redux undo
        include: ['setName'],
        exclude: ['setOptions'], // include exclude coexists,include will be overridden exclude
        limit: 5,
    },
    /**
     * Asynchronous stabilization, the default is true, asynchronous will still be executed, just ensure the order of the results
     * There are two ways to pass parameters:
     * 1. True asynchronous full stabilization
     * 2. ['getUser'] Specify the getUser method to stabilize the image, and the others will not be stabilized
     */
    // debounce: [
//     // 'testAsync',
// ],
    /**
     * Synchronous method, which returns an object, or something else, if it is not an object, will not be merged into the state
     * Internal ActionType: action_user_setName (action_ module_function_name)
     * @param name custom parameter
     * @param state current model state data
     * @returns {{name}} returns:1. The object will be merged in the state; 2. falsity false values, no state processing
     */
    setName(name, state) {
        console.log('Synchronization method to obtain parameters', name, state);
        return { name };
    },
    setOptions: (options) => {
        console.log('setOptions The method is called');
        return { options };
    },

    /**
     * Asynchronous method, returned promise
     * Automatically added to the data  state.getUserLoading、state.getUserError data
     * inside ActionType: action_user_getUser_resolve action_user_getUser_reject action_user_getUser_padding
     * Set debounce for stabilization: multiple calls in a row, if the last call is not over, the result will be discarded, and the result of the last call will be merged into the state.
     * @param id
     * @param state
     * @returns {Promise<{name: number, age: number}>} promise resolve The value logic is the same as the synchronization method
     */
    async getUser(id, state) {
        console.log('getUser state', state);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.5 ? resolve({ user: { name: 123, age: 23 } }) : reject(new Error('User acquisition failed!'));
            }, 2000);
        });
    },
    testAsync: async (time) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ asyncResult: `${time} seconds execution result` });
            }, time);
        });
    },
};
