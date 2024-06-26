import createTableSql, { initDataSql } from './init-sql';
import appPackage from '../../../package.json';

const packageName = appPackage.name;

const db = openDatabase(packageName, '1.0', packageName + 'Test the database', 2 * 1024 * 1024);
let CACHE_INI_DB;

const tables = ['menus', 'roles', 'users', 'role_menus', 'user_roles', 'user_collect_menus'];

export default async function executeSql(sql, args, fullResult) {
    CACHE_INI_DB = CACHE_INI_DB || initDB();

    await CACHE_INI_DB;

    return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
            tx.executeSql(
                sql,
                args,
                (transaction, resultSet) => resolve(fullResult ? resultSet : Array.from(resultSet.rows)),
                (transaction, error) => reject(error),
            );
        });
    });
}

// Initialize the database
export async function initDB(init) {
    const hasInitData = await usersHasData();

    if (init) await dropAllTables();

    // Create a table
    await executeSplit(createTableSql, 'create table');

    if (init || !hasInitData) await initTablesData();
}

export async function usersHasData() {
    return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
            tx.executeSql(
                'select * from users',
                null,
                (transaction, resultSet) => {
                    resultSet.rows.length ? resolve(true) : resolve(false);
                },
                (transaction, error) => {
                    resolve(false);
                },
            );
        });
    });
}

// Delete all database tables
export async function dropAllTables() {
    tables.forEach((table) => {
        db.transaction(function (tx) {
            tx.executeSql(`drop table ${table}`);
        });
    });
}

// Insert initialization data
export async function initTablesData() {
    for (let table of tables) {
        const sql = initDataSql[table];
        await executeSplit(sql, 'INSERT INTO');
    }
}

async function executeSplit(sql, keyWord) {
    const arr = sql
        .split(keyWord)
        .filter((item) => !!item.trim())
        .map((item) => keyWord + item);

    for (let sql of arr) {
        await new Promise((resolve, reject) => {
            db.transaction(function (tx) {
                tx.executeSql(
                    sql,
                    null,
                    (transaction, resultSet) => resolve(resultSet),
                    (transaction, error) => reject(error),
                );
            });
        });
    }
}
