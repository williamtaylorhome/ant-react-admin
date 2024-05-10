import moment from 'moment';
import { convertToTree, findGenerationNodes } from '@ra-lib/admin';
import executeSql from 'src/mock/web-sql';

export default {
    // Get the user favorites menu
    'get /authority/queryUserCollectedMenus': async (config) => {
        const { userId } = config.params;

        const userCollectMenus = await executeSql('select * from user_collect_menus where userId = ?', [userId]);
        if (!userCollectMenus?.length) return [200, []];
        const menuIds = userCollectMenus.map((item) => item.menuId);

        const list = await executeSql(`select *
                                       from menus
                                       where id in (${menuIds})`);

        return [200, list];
    },
    // Save the user favorites menu
    'post /authority/addUserCollectMenu': async (config) => {
        const { userId, menuId, collected } = JSON.parse(config.data);
        const args = [userId, menuId];
        // TODO child processing
        if (collected) {
            await executeSql('INSERT INTO user_collect_menus (userId, menuId) VALUES (?, ?)', args);
        } else {
            await executeSql('DELETE FROM user_collect_menus WHERE userId=? AND menuId=?', args);
        }

        return [200, true];
    },
    // Get the user menu
    'get /authority/queryUserMenus': async (config) => {
        const { userId } = config.params;
        const userRoles = await executeSql('select * from user_roles where userId = ?', [userId]);
        if (!userRoles?.length) return [200, []];

        const roleIds = userRoles.map((item) => item.roleId).join(',');

        const roles = await executeSql(`select *
                                        from roles
                                        where id in (${roleIds})`);

        // is a super admin that returns all menu data
        if (roles && roles.some((item) => item.type === 1)) {
            const menus = await executeSql(`select *
                                            from menus`);

            return [200, Array.from(menus)];
        }

        console.log(roles);

        const roleMenus = await executeSql(`select *
                                            from role_menus
                                            where roleId in (${roleIds})`);

        if (!roleMenus?.length) return [200, []];

        const menusId = roleMenus.map((item) => item.menuId).join(',');
        const menus = await executeSql(`select *
                                        from menus
                                        where id in (${menusId})`);

        return [200, Array.from(menus)];
    },
    // Get all systems
    'get /menu/queryTopMenus': async (config) => {
        const result = await executeSql(`select *
                                         from menus
                                         where parentId is null
                                            or parentId = ''`);

        return [200, result];
    },
    // Get it all
    'get /menu/queryMenus': async (config) => {
        const result = await executeSql('select * from menus');

        return [200, result];
    },
    // Obtain the data based on the name
    'get /menu/getOneMenu': async (config) => {
        const { name } = config.params;

        const result = await executeSql('select * from menus where name = ?', [name]);
        return [200, result[0]];
    },
    // according to code fetch action
    'get /actionByCode': async (config) => {
        const { code } = config.params;

        const result = await executeSql('select * from menus where code = ? and type=2', [code]);
        return [200, result[0]];
    },
    // Add to
    'post /menu/addMenu': async (config) => {
        const { keys, args, holders } = getMenuData(config);

        const result = await executeSql(
            `
            INSERT INTO menus (${keys})
            VALUES (${holders})
        `,
            args,
            true,
        );
        const { insertId: menuId } = result;

        return [200, { id: menuId }];
    },
    // Add in bulk
    'post /menu/addSubMenus': async (config) => {
        const { menus, parentId } = JSON.parse(config.data);

        if (!menus?.length) return [200, true];

        // Obtain the maximum ID of the menu
        const result = await executeSql('select * from menus order by id desc limit ? offset ? ', [1, 0]);
        const maxId = result[0] ? result[0].id : 0;

        // Processing ID
        const idMap = {};
        menus.forEach((menu, index) => {
            const { id } = menu;
            const nextId = (menu.id = maxId + index + 1);
            if (id) idMap[id] = nextId;

            if (!menu.type) menu.type = 1;

            if (!menu.parentId) menu.parentId = parentId;
        });

        // Handle the parent ID
        menus.forEach((menu) => {
            const { parentId } = menu;
            if (idMap[parentId]) {
                menu.parentId = idMap[parentId];
            }
        });

        let menuId;
        // Insert the database
        for (let i = 0; i < menus.length; i++) {
            const menu = menus[i];
            const { id } = menu;
            const { keys, args, holders } = getMenuData({ data: menu }, (value) => value);
            keys.push('id');
            args.push(id);
            holders.push('?');

            const result = await executeSql(
                `
                INSERT INTO menus (${keys})
                VALUES (${holders})
            `,
                args,
                true,
            );
            if (i === 0) menuId = result.insertId;
        }

        return [200, menuId];
    },
    // revise
    'post /menu/updateMenuById': async (config) => {
        const { id } = JSON.parse(config.data);
        const { keys, args } = getMenuData(config);

        keys.push('updatedAt');
        args.push(moment().format('YYYY-MM-DD HH:mm:ss'));
        args.push(id);
        const arr = keys.map((key) => key + '=?');

        await executeSql(
            `UPDATE menus
                          SET ${arr}
                          WHERE id = ?`,
            args,
        );

        return [200, true];
    },
    // Delete
    'delete re:/menu/.+': async (config) => {
        const id = parseInt(config.url.split('/')[2]);
        const allMenus = await executeSql('select * from menus');
        const menuTreeData = convertToTree(allMenus);

        const nodes = findGenerationNodes(menuTreeData, id, 'id') || [];
        const ids = nodes.map((item) => item.id);
        ids.push(id);

        await executeSql(`DELETE
                          FROM menus
                          WHERE id in (${ids})`);
        await executeSql(`DELETE
                          FROM role_menus
                          WHERE menuId in (${ids})`);
        return [200, true];
    },
    // Bulk update feature lists
    'post /menu/updateSubActions': async (config) => {
        const { actions, parentId } = JSON.parse(config.data);
        if (actions && actions.length) {
            const codes = [];

            for (let action of actions) {
                const { code } = action;
                if (codes.includes(action.code)) return [400, { message: `Permission code：「${code} 」It cannot be repeated` }];
                codes.push(code);
            }
        }
        const oldActions = await executeSql('select * from menus where parentId=? and type=?', [parentId, 2]);

        // Keep the ID
        actions.forEach((item) => {
            const { code } = item;
            const action = oldActions.find((it) => it.code === code);
            item.id = action?.id;
        });
        // Delete all old actions
        await executeSql('delete  from menus where parentId=? and type=?', [parentId, 2]);
        // Insert a new action
        for (let action of actions) {
            const { id, title, code, enabled = true, type = 2 } = action;

            const data = { parentId, title, code, type, enabled: enabled ? 1 : 0 };

            const keys = Object.keys(data);
            const values = Object.values(data);
            const holders = ['?', '?', '?', '?', '?'];

            if (id) {
                keys.push('id');
                values.push(id);
                holders.push('?');
            }
            const oldAction = await executeSql('select * from menus where code=? and type=2', [code]);
            if (oldAction?.length) return [400, { message: `Permission code：「${code} 」It cannot be repeated` }];

            await executeSql(
                `insert into menus (${keys})
                              values (${holders})`,
                values,
            );
        }
        return [200, true];
    },
};

function getMenuData(config, parse = JSON.parse) {
    const {
        target = 'menu',
        parentId = '',
        title,
        basePath = '',
        path = '',
        sort = 0,
        name = '',
        entry = '',
        icon = '',
        code = '',
        type = 1,
        enabled = true,
    } = parse(config.data);
    const data = Object.entries({
        target,
        parentId,
        title,
        basePath,
        path,
        // Eslint disable next line
        sort,
        name,
        entry,
        icon,
        code,
        type,
        enabled: enabled ? 1 : 0,
    });

    const keys = data.map(([key]) => key);
    const args = data.map(([, value]) => value);
    const holders = data.map(() => '?');

    return { keys, args, holders };
}
