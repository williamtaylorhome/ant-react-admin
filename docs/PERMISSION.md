# Permission control

System menus and specific function points can be controlled by permission.

## Menu permissions

If the menu is provided by the backend (generally the system is provided by the backend), you can obtain the user's menu permissions through the user id. The page only shows the menus you get;

The system provides a basic menu and permission management page, which requires the backend to cooperate with the storage of data.

## Feature permissions

Functions can be passed `src/commons#hasPermission` method to determine permissions

components can be passed `src/components/permission` The component controls the permissions of the function

```js
import React, {Component} from 'react';
import Permission from 'src/components';
import {hasPermission} from 'src/commons/index';

export default class SomePage extends Component {

    someFunc() {
        const show = hasPermission('USER_ADD');
    }

    render() {
        return (
            <div>
                <Permission code="USER_ADD">
                    <Button>Add users</Button>
                </Permission>
            </div>
        );
    }
}
```

Note: The code front-end of the permission will be hard-coded when used, pay attention to semantics and uniqueness.

## role

Generally, the system will provide a role management function, and the system provides a basic role management function, which can be used with a slight modification.
