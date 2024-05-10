import { Tag } from 'antd';
import ajax from 'src/commons/ajax';

/**
 * Some enumeration data that may be used in the project
 * The convention contains only three parameters,
 * {
 *  value: 1, // Required and non-repeatable
 *  label: 'name', // Required
 *  meta: {}, // Other data, can be defaulted
 *  tag: Tag // tag
 * };
 *
 * Extension methods
 * options.menuTarget.getLabel('menu')
 * options.yesNo.getTag(true);
 * */
export default {
    // Menu target
    menuTarget: [
        { value: 'menu', label: 'App menu' },
        { value: 'qiankun', label: 'Qiankun sub-application' },
        { value: 'iframe', label: 'The iframe is embedded with a third party' },
        { value: '_self', label: 'The current window opens a third party' },
        { value: '_blank', label: 'A new window opens with a third party' },
    ],
    // Whether
    yesNo: [
        { value: true, label: 'yes', tag: <Tag color="green">yes</Tag> },
        { value: false, label: 'no', tag: <Tag color="red">no</Tag> },
    ],
    // Enable, disable
    enabled: [
        { value: true, label: 'enable', tag: <Tag color="green">enable</Tag> },
        { value: false, label: 'disable', tag: <Tag color="red">disable</Tag> },
    ],
    // gender
    sex: [
        { value: '1', label: 'man' },
        { value: '2', label: 'woman' },
        { value: '3', label: 'Unknown' },
    ],
    // It can be a function, asynchronous or synchronous
    async system() {
        const list = await ajax.get('/menu/queryTopMenus');
        return list.map((item) => {
            return {
                value: item.id,
                label: item.title,
                meta: item,
            };
        });
    },
    action() {
        return [{ value: 'add', label: 'Add to' }];
        // throw Error('Fetch failed');
    },
    // Use get
    get demo() {
        return [];
    },
};
