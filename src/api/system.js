import ajax from 'src/commons/ajax';
import { getLoginUser, isLoginPage, formatMenus, getContainerId } from '@ra-lib/admin';
import { isNoAuthPage } from 'src/commons';
import { IS_SUB } from 'src/config';

export default {
    /**
     * Get the menu
     * @returns {Promise<*[]|*>}
     */
    async getMenuData() {
        // Non-landing page, no menu
        if (isNoAuthPage()) return [];

        // As a child app, it does not load
        if (IS_SUB) return [];

        // Obtain server-side data and cache it to prevent multiple API calls
        return (this.getMenuData.__CACHE =
            this.getMenuData.__CACHE ||
            ajax
                .get('/authority/queryUserMenus', { userId: getLoginUser()?.id })
                .then((res) => res.map((item) => ({ ...item, order: item.order ?? item.ord ?? item.sort })))
                .catch(() => []));

        // Front-end hard-coded menus
// return [
//     {id: 1, title: 'System administration', order: 900, type: 1},
//     {id: 2, parentId: 1, title: 'User management', path: '/users', order: 900, type: 1},
//     {id: 3, parentId: 1, title: 'Role management', path: '/roles', order: 900, type: 1},
//     {id: 4, parentId: 1, title: 'Menu management', path: '/menus', order: 900, type: 1},
// ];
    },
    /**
     * Get the system menu
     * @returns {Promise<T[]>}
     */
    async getMenus() {
        // Mock, do a delay process, otherwise the menu request cannot be mocked
        if (process.env.REACT_APP_MOCK) await new Promise((resolve) => setTimeout(resolve));

        const serverMenus = await this.getMenuData();
        const menus = serverMenus
            .filter((item) => !item.type || item.type === 1)
            .map((item) => {
                return {
                    ...item,
                    id: `${item.id}`,
                    parentId: `${item.parentId}`,
                };
            });

        return formatMenus(menus);
    },
    /**
     * Get the user favorites menu
     * @returns {Promise<*>}
     */
    async getCollectedMenus() {
        // Landing page, does not load
        if (isLoginPage()) return [];

        // As a child app, it does not load
        if (IS_SUB) return [];

        const loginUser = getLoginUser();
        const data = await ajax.get('/authority/queryUserCollectedMenus', { userId: loginUser?.id });
        // const data = [];

        const menus = data.filter((item) => item.type === 1).map((item) => ({ ...item, isCollectedMenu: true }));

        return formatMenus(menus);
    },
    /**
     * Save the user favorites menu
     * @param menuId
     * @param collected
     * @returns {Promise<void>}
     */
    async saveCollectedMenu({ menuId, collected }) {
        await ajax.post('/authority/addUserCollectMenu', { userId: getLoginUser()?.id, menuId, collected });
    },
    /**
     * Obtain the user permission code
     * @returns {Promise<*[string]>}
     */
    async getPermissions() {
        const serverMenus = await this.getMenuData();
        return serverMenus.filter((item) => item.type === 2).map((item) => item.code);
    },
    /**
     * Obtain the sub-application configuration
     * @returns {Promise<*[{title, name, entry}]>}
     */
    async getSubApps() {
        // Get the Qiankun sub-items that need to be registered from the menu data
        const menuTreeData = (await this.getMenus()) || [];

        // Data passed to sub-apps
        const loginUser = getLoginUser();
        const props = {
            mainApp: {
                loginUser: loginUser,
                token: loginUser?.token,
            },
        };
        let result = [];
        const loop = (nodes) =>
            nodes.forEach((node) => {
                const { _target, children } = node;
                if (_target === 'qiankun') {
                    const { title, name, entry } = node;
                    const container = `#${getContainerId(name)}`;
                    const activeRule = `/${name}`;

                    result.push({
                        title,
                        name,
                        entry,
                        container,
                        activeRule,
                        props,
                    });
                }
                if (children?.length) loop(children);
            });
        loop(menuTreeData);

        return result;
    },
};
