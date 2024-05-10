import moment from 'moment';

const now = moment().format('YYYY-MM-DD HH:mm:ss');

export default `
    create table if not exists menus
    (
        id        INTEGER PRIMARY KEY,
        parentId  INTEGER                             null,
        title     varchar(50)                         null,     -- comment 'Menu title or permission code title',
        icon      varchar(50)                         null,     -- comment 'menu icon',
        basePath  varchar(200)                        null,     -- comment 'Base path',
        path      varchar(200)                        null,     -- comment 'Menu path',
        target    varchar(50)                         null,     -- comment 'target：menu App menu qiankun Qiankun sub-project iframe Embedded iframe _self The current window opens a third party _blank A new window opens with a third party',
        sort INTEGER   default 0                 null,     -- comment 'Sorting, the bigger the higher, the higher',
        type      INTEGER   default 1                 not null, -- comment 'Type: 1 menu 2 Permission code',
        enabled    tinyint(1)                          not null, -- comment '是否可用',
        code      varchar(50)                         null,     -- comment 'Permission code',
        name      varchar(50)                         null,     -- comment 'The registration name of the Qiankun sub-application',
        entry     varchar(200)                        null,     -- comment 'The entrance address of the Qiankun sub-application',
        createdAt timestamp default CURRENT_TIMESTAMP not null, -- comment 'Creation time',
        updatedAt timestamp default CURRENT_TIMESTAMP null,     -- comment 'Updated',
        constraint menus_id_uindex
            unique (id)
    );
    create table if not exists user_collect_menus
    (
        id        INTEGER PRIMARY KEY,
        userId    INTEGER                             not null,
        menuId    INTEGER                             not null,
        createdAt timestamp default CURRENT_TIMESTAMP not null,
        updatedAt timestamp default CURRENT_TIMESTAMP not null,
        constraint user_collect_menus_id_uindex
        unique (id)
        );

    create table if not exists role_menus
    (
        id        INTEGER PRIMARY KEY,
        roleId    INTEGER                             not null,
        menuId    INTEGER                             not null,
        createdAt timestamp default CURRENT_TIMESTAMP not null,
        updatedAt timestamp default CURRENT_TIMESTAMP not null,
        constraint role_menus_id_uindex
            unique (id)
    );

    create table if not exists roles
    (
        id        INTEGER PRIMARY KEY,
        type      INTEGER,
        systemId      INTEGER,
        enabled    tinyint(1)                          not null, -- comment 'Availability',
        name      varchar(50)                         not null, -- comment 'The name of the role',
        remark    varchar(200)                        null,     -- comment 'Role notes',
        createdAt timestamp default CURRENT_TIMESTAMP not null, -- comment 'Creation time',
        updatedAt timestamp default CURRENT_TIMESTAMP null,     -- comment 'Updated',
        constraint roles_id_uindex
            unique (id)
    );

    create table if not exists user_roles
    (
        id        INTEGER PRIMARY KEY,
        userId    INTEGER                             not null,
        roleId    INTEGER                             not null,
        createdAt timestamp default CURRENT_TIMESTAMP not null,
        updatedAt timestamp default CURRENT_TIMESTAMP not null,
        constraint user_roles_id_uindex
            unique (id)
    );

    create table if not exists users
    (
        id        INTEGER PRIMARY KEY,
        account   varchar(50)                         not null, -- comment 'Account',
        name      varchar(50)                         not null, -- comment 'Username',
        password  varchar(20)                         null,     -- comment 'password',
        mobile    varchar(20)                         null,     -- comment 'Phone',
        email     varchar(50)                         null,     -- comment 'mailbox',
        enabled    tinyint(1)                          not null, -- comment 'Availability',
        createdAt timestamp default CURRENT_TIMESTAMP not null, -- comment 'Creation time',
        updatedAt timestamp default CURRENT_TIMESTAMP not null,
        constraint users_account_uindex
            unique (account),
        constraint users_id_uindex
            unique (id)
    );
`;

export const initRolesSql = `
    INSERT INTO roles (id, type, enabled,  name, remark, createdAt, updatedAt)
    VALUES (1, 1, true, 'Super Admin', 'The super administrator has all the permissions of the system', '${now}', '${now}');
`;

export const initRoleMenusSql = `
    INSERT INTO role_menus (id, roleId, menuId, createdAt, updatedAt)
    VALUES (1, 1, 1, '${now}', '${now}');
    INSERT INTO role_menus (id, roleId, menuId, createdAt, updatedAt)
    VALUES (2, 1, 2, '${now}', '${now}');
    INSERT INTO role_menus (id, roleId, menuId, createdAt, updatedAt)
    VALUES (3, 1, 3, '${now}', '${now}');
    INSERT INTO role_menus (id, roleId, menuId, createdAt, updatedAt)
    VALUES (4, 1, 4, '${now}', '${now}');
    INSERT INTO role_menus (id, roleId, menuId, createdAt, updatedAt)
    VALUES (5, 1, 5, '${now}', '${now}');
`;

export const initUsersSql = `
    INSERT INTO users (id, account, name, password, mobile, email, enabled, createdAt, updatedAt)
    VALUES (1, 'admin', 'administrator', '123456', '18888888888', 'email@qq.com', 1, '${now}', '${now}');
`;

export const initUserRolesSql = `
    INSERT INTO user_roles (id, userId, roleId, createdAt, updatedAt)
    VALUES (1, 1, 1, '${now}', '${now}');
`;

export const initMenuSql = `
    INSERT INTO menus (id, enabled, parentId, title, icon, basePath, path, target, sort, type, code, name, entry, createdAt, updatedAt)
    VALUES (1, true, null, 'System administration', null, null, null, 'menu', 0, 1, null, null, null, '${now}', '${now}');
    INSERT INTO menus (id, enabled, parentId, title, icon, basePath, path, target, sort, type, code, name, entry, createdAt, updatedAt)
    VALUES (2, true,1, 'User management', null, null, '/users', 'menu', 0, 1, null, null, null, '${now}', '${now}');
    INSERT INTO menus (id, enabled, parentId, title, icon, basePath, path, target, sort, type, code, name, entry, createdAt, updatedAt)
    VALUES (3, true,1, 'Role management', null, null, '/roles', 'menu', 0, 1, null, null, null, '${now}', '${now}');
    INSERT INTO menus (id, enabled, parentId, title, icon, basePath, path, target, sort, type, code, name, entry, createdAt, updatedAt)
    VALUES (4, true,1, 'Menu management', null, null, '/menus', 'menu', 0, 1, null, null, null, '${now}', '${now}');
    INSERT INTO menus (id, enabled, parentId, title, icon, basePath, path, target, sort, type, code, name, entry, createdAt, updatedAt)
    VALUES (5, true,2, 'Add users', null, null, null, null, 0, 2, 'ADD_USER', null, null, '${now}', '${now}');
    INSERT INTO menus (id, enabled, parentId, title, icon, basePath, path, target, sort, type, code, name, entry, createdAt, updatedAt)
    VALUES (6, true,2, 'Delete the user', null, null, null, null, 0, 2, 'UPDATE_USER', null, null, '${now}', '${now}');
`;

export const initUserCollectMenusSql = `
    INSERT INTO user_collect_menus (userId, menuId, createdAt, updatedAt)
    VALUES (1, 2, '${now}', '${now}');
`;

export const initDataSql = {
    menus: initMenuSql,
    roles: initRolesSql,
    users: initUsersSql,
    role_menus: initRoleMenusSql,
    user_roles: initUserRolesSql,
    user_collect_menus: initUserCollectMenusSql,
};
