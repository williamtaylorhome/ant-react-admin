import models from './models';
import handleSuccess from 'src/commons/handle-success';
import handleError from 'src/commons/handle-error';
import { storage, createStoreByModels } from '@ra-lib/admin';

const result = createStoreByModels(models, {
    // middlewares: [
//     thunk,
// ],
// enhancers: [], // and middlewares carry out compose How to do the math: const enhancer = compose(applyMiddleware(... middlewares), ... enhancers);
// reducers: {todos}, // Additional reducers
// localStorage: window.localStorage,
// sessionStorage: window.sessionStorage,
// serialize: JSON.stringify,
// deserialize: JSON.parse,
    localStorage: storage.local,
    sessionStorage: storage.session,
    serialize: (data) => data,
    deserialize: (data) => data,
    onError: handleError,
    onSuccess: handleSuccess,
});

export const connect = result.connect;

/**
 * Export storage actions For use in non-component environments
 const demoState = store.getState()?. demo
 const demoAction = actions.demo
 */
export const store = result.store;
export const actions = result.actions;
