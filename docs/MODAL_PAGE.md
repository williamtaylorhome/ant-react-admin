# Pop-up page development
Pop-up frames are often used in scenarios such as adding and modifying, and improper use of the antd modal component will cause dirty data problems (the data rendered by the two pop-up frames interferes with each other)

The system provides high-level components based on modal encapsulation, and every time the pop-up box is closed, the content of the pop-up box will be destroyed to avoid interfering with each other


## Modal high-end components
The Modal high-level components are integrated into the config and can also be referenced separately:`import {modal} from '@ra-lib/hoc';`

```jsx
import React from 'react';
import config from 'src/commons/config-hoc';
import {ModalContent} from 'src/library/components';

export default config({
    modal: {
        title: 'The title of the pop-up box',
    },
})(props => {
    const {onOk, onCancel} = props;

    return (
        <ModalContent
            onOk={onOk}
            onCancel={onCancel}
        >
            The content of the pop-up box
        </ModalContent>
    );
});
```

The following table describes all the parameters of Modal:

1. If it is a string, it will be used as the title of the modal
1. In the case of a function, the function returns the value as a modal parameter
1. If it is an object, it is modal-related 
1. options.fullScreen boolean Default false, whether to display the pop-up box in full screen

## ModalContent
The content of the pop-up box is wrapped in ModalContent, and the specific parameters are as follows:
            
Parameters|Type|Default Values|Description
---|---|---|---
fitHeight   |boolean|false|Whether to use the remaining space in the vertical orientation of the screen 
otherHeight |number |-|Heights other than the body contents, which are used to calculate the body height；
loading     |boolean|false|Loading
loadingTip  |-      |-|Load the prompt copy
footer      |-      |-|bottom
okText      |string  |-|Decide on the button copy
onOk        |function|-|Determine the button event
cancelText  |string  |-|Cancel button copy
onCancel    |function|-|Cancel button events
resetText   |string |-|Reset the button copy
onReset     |function|-|Reset button events
style       |object |-|Outermost container style
bodyStyle   |object |-|Content container style
