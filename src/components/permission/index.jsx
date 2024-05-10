import React from 'react';
import PropTypes from 'prop-types';
import {hasPermission} from '@ra-lib/admin';

/**
 * Use hasPermission and code to determine whether children are displayed
 * Generally, it is used for front-end permission control to see whether a certain button is displayed, etc., and the general project permission can be controlled to the menu level, and rarely to the function level
 */

Permission.propTypes = {
    code: PropTypes.string.isRequired,
    useDisabled: PropTypes.bool,
};

Permission.defaultProps = {
    useDisabled: false,
};

export default function Permission(props) {
    let {code, useDisabled, children} = props;

    if (!useDisabled) {
        return hasPermission(code) ? children : null;
    }

    children = Array.isArray(children) ? children : [children];

    return children.map((item) => {
        const {key, ref} = item;
        return React.cloneElement(item, {
            disabled: !hasPermission(code),
            key,
            ref,
        });
    });
}
