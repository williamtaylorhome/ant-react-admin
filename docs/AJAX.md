# Ajax request
The system's AJAX requests are based on: [axios](https://github.com/axios/axios)Secondary encapsulation was carried out.

## Methods
Based on the RESTful specification, 5 methods are provided:

- get   Obtain the server-side data, concatenate the parameters on the URL, and send them to the backend in the form of query string
- post  Add new data, and send the parameters to the backend in the form of a body
- put   Modify the data and send the parameters to the backend in the form of a body
- del   The data is deleted, and the parameters are concatenated on the URL and sent to the backend in the form of a query string
- patch   Modify some data and send the parameters to the backend in the form of a body

## Invocation mode
There are three ways to get an AJAX object from a React component

- Config decorator ajax property
    ```js
    import React, {Component} from 'react';
    import config from 'src/commons/config-hoc';
    
    @config({
        // ajax: true, // Defaults to true
        ...
    })
    export default class SomePage extend Component {
        componentDidMount() {
            this.props.ajax
                .get(...)
                .then(...)
        }
        ...
    }
    ```
    annotation: hooks `props.ajax.useGet`
- Ajax decorator
    ```js
    import React, {Component} from 'react';
    import {ajaxHoc} from 'src/commpons/ajax';
    
    @ajaxHoc()
    export default class SomePage extend Component {
        componentDidMount() {
            this.props.ajax
                .get(...)
                .then(...)
        }
        ...
    } 
    ```
  
- Directly import AJAX objects
    ```js
    import React, {Component} from 'react';
    import ajax from 'src/commpons/ajax';
    
    export default class SomePage extend Component {
        componentDidMount() {
            ajax.post(...).then(...);
        
            // If you need to make an AJAX request for a component uninstall or any other situation, you can use it in the following way
            const ajaxFunc = ajax.get(...);
            ajaxFunc.then(...).finally(...);
            ajaxFunc.cancel();
        }
        ...
    } 
    ```
Note: config and ajax hoc are encapsulated, and the page will automatically interrupt the incomplete request after it is uninstalled

## parameter
All AJAX method parameters are uniform and can accept three parameters:

parameter|illustrate
---|---
url|The address of the request
params|Request the parameters passed to the backend
options|Request configuration, i.e. the configuration of axios,

options arrangement

parameter|illustrate
---|---
axios arrangement|axios parameters are acceptable
successTip|Extended parameters, success prompts
errorTip|Extended parameters, failure message
noEmpty|Extended parameters, filter out '', null, undefined parameters, and do not submit to the backend
originResponse|extended parameters,.then can get the whole one response，And not just response.data

Note: The global default parameters can be configured in src/commons/ajax.js，default baseURL='/api'、timeout=1000 * 60。

## Prompt for the request result
The system automatically prompts for AJAX failures, which developers can configure through the src/commons/handle error.js;

If you need a success prompt, you can configure the success tip parameter or handle it yourself in .then().

The success hint is in src/commons/handle success.js in the configuration;
```js
this.props.ajax.del('/user/1', null, {successTip: 'Deleted successfully!', errorTip: 'Delete failed!', noEmpty: true});
```

## loading dispose
The system extends promises to provide finally methods for processing regardless of success or failure. It is generally used to disable loading
```js
this.setState({loading: true});
this.props.ajax
    .get('/url')
    .then(...)
    .finally(() => this.setState({loading: false}));
```

