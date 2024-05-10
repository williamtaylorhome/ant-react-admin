# Mock Simulated data
Parallel development of the front-end and back-end, in order to facilitate the rapid development of the back-end, there is no need to wait for the back-end interface, and the system provides a mock function.Based on [mockjs](https://github.com/nuysoft/Mock)

## Write simulation data
Write mock data in the /src/mock directory, for example:
```js
import {getUsersByPageSize} from './mockdata/user';

export default {
    'post /mock/login': (config) => {
        const {
            userName,
            password,
        } = JSON.parse(config.data);
        return new Promise((resolve, reject) => {
            if (userName !== 'test' || password !== '111') {
                setTimeout(() => {
                    reject({
                        code: 1001,
                        message: 'Wrong username or password',
                    });
                }, 1000);
            } else {
                setTimeout(() => {
                    resolve([200, {
                        id: '1234567890abcde',
                        name: 'MOCK user',
                        loginName: 'MOCK Login name',
                    }]);
                }, 1000);
            }
        });
    },
    'post /mock/logout': {},

    'get /mock/user-center': (config) => {
        const {
            pageSize,
            pageNum,
        } = config.params;


        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([200, {
                    pageNum,
                    pageSize,
                    total: 888,
                    list: getUsersByPageSize(pageSize),
                }]);
            }, 1000);
        });
    },
    'get re:/mock/user-center/.+': {id: 1, name: 'Bear big', age: 22, job: 'Front'},
    'post /mock/user-center': true,
    'put /mock/user-center': true,
    'delete re:/mock/user-center/.+': 'id',
}
```

## simplification
In order to facilitate the writing of mock interfaces, the system provides simplified scripts(/src/mock/simplify.js),The above example is a simplification

The key of the object is determined by method url delay，The parts are composed and separated by spaces

Field|Description
---|---
method  | Request method get post etc
url     |The URL of the request
delay   |Analog latency, milliseconds  default 1000

## invoke
The system encapsulated AJAX can automatically distinguish between mock data and real backend data in the following two ways, without additional configuration:

Mock Request:
- Requests with URLs that start with /mock/
- /src/mock/url-config.js in the configuration

```js
this.props.ajax.get('/mock/users').then(...);
```
If the real backend interface is ready, remove the /mock in the URL

Note: The mock function is only enabled in development mode, and the mock function will not be enabled in production mode, if you want to enable mock in other environments, use the MOCK=true parameter, for example `MOCK=true yarn build`
