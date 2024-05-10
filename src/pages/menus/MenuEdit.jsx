import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Form, Modal, Space, Tabs, Popconfirm } from 'antd';
import json5 from 'json5';
import { FormItem, Content, useHeight, useDebounceValidator } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import { WITH_SYSTEMS } from 'src/config';
import options from 'src/options';
import styles from './style.less';

const menuTargetOptions = options.menuTarget;

const TabPane = Tabs.TabPane;

export default config()(function MenuEdit(props) {
    const { isAdd, selectedMenu, onSubmit, onValuesChange } = props;

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [addTabKey, setAddTabKey] = useState('1');
    const [textAreaHeight] = useHeight(null, 285);
    const contentRef = useRef(null);

    const hasSelectedMenu = selectedMenu && Object.keys(selectedMenu).length;
    const isAddTop = isAdd && !hasSelectedMenu;
    const isAddSub = isAdd && hasSelectedMenu;
    const title = (() => {
        if (isAddTop) return WITH_SYSTEMS ? 'Add an app' : 'Add the top level';

        return isAddSub ? 'Add a menu' : 'Modify the menu';
    })();

    const { run: deleteMenu } = props.ajax.useDel('/menu/:id', null, { setLoading });
    const { run: saveMenu } = props.ajax.usePost('/menu/addMenu', null, { setLoading });
    const { run: branchSaveMenu } = props.ajax.usePost('/menu/addSubMenus', null, { setLoading });
    const { run: updateMenu } = props.ajax.usePost('/menu/updateMenuById', null, { setLoading });
    const { run: fetchMenuByName } = props.ajax.useGet('/menu/getOneMenu');
    const { run: saveRole } = props.ajax.usePost('/role/addRole', null, { setLoading });

    // Form echoes
    useEffect(() => {
        form.resetFields();
        let initialValues = { ...selectedMenu, order: selectedMenu?.ord };
        if (isAddTop) initialValues = { target: 'qiankun' };
        if (isAddSub)
            initialValues = {
                target: 'menu',
                parentId: selectedMenu.id,
                systemId: selectedMenu.systemId,
            };

        form.setFieldsValue(initialValues);
    }, [form, isAdd, isAddTop, isAddSub, selectedMenu]);

    const handleSubmit = useCallback(
        async (values) => {
            if (loading) return;

            const params = {
                ...values,
                type: 1, // menu
                sort: values.order,
                ord: values.order,
            };

            if (isAdd) {
                if (isAddSub && addTabKey === '2') {
                    let { menus, parentId } = values;

                    try {
                        menus = json5.parse(menus);
                    } catch (e) {
                        return Modal.error({
                            title: 'Tips',
                            content: 'There is an error in the menu data added in batches, please fix it and save it!',
                        });
                    }

                    const params = { menus, parentId };
                    const res = await branchSaveMenu(params);
                    const { id } = res;
                    onSubmit && onSubmit({ id, isAdd: true });
                } else {
                    const res = await saveMenu(params);
                    const { id } = res;
                    onSubmit && onSubmit({ ...params, id, isAdd: true });

                    // There is a system concept, and it is to add a top level, to create a system administrator
                    if (WITH_SYSTEMS && isAddTop) {
                        await saveRole({
                            systemId: id,
                            name: 'System administrator',
                            enabled: true,
                            remark: 'Owns all permissions of the current subsystem',
                            type: 2,
                        });
                    }
                }
            } else {
                await updateMenu(params);
                onSubmit && onSubmit({ ...params, isUpdate: true });
            }
        },
        [addTabKey, branchSaveMenu, isAdd, isAddSub, isAddTop, loading, onSubmit, saveMenu, saveRole, updateMenu],
    );

    const checkName = useDebounceValidator(async (rule, value) => {
        if (!value) return;

        const menu = await fetchMenuByName({ name: value });
        if (!menu) return;

        const id = form.getFieldValue('id');
        const menuId = `${menu.id}`;
        if (isAdd && menu.name === value) throw Error('Registered names cannot be duplicated!');
        if (!isAdd && menuId !== id && menu.name === value) throw Error('Registered names cannot be duplicated!');
    });

    const handleDelete = useCallback(async () => {
        const id = selectedMenu?.id;
        await deleteMenu({ id });

        onSubmit && onSubmit({ id, isDelete: true });
    }, [deleteMenu, onSubmit, selectedMenu?.id]);

    const layout = {
        labelCol: { flex: '100px' },
    };

    return (
        <Form
            className={styles.pane}
            name={`menu-form`}
            form={form}
            onFinish={handleSubmit}
            onValuesChange={onValuesChange}
            initialValues={{ enabled: true }}
        >
            <h3 className={styles.title}>{title}</h3>
            <Content ref={contentRef} loading={loading} className={styles.content}>
                {isAddSub ? (
                    <Tabs activeKey={addTabKey} onChange={(key) => setAddTabKey(key)}>
                        <TabPane key="1" tab="Add individually" />
                        <TabPane key="2" tab="Add in bulk" />
                    </Tabs>
                ) : null}
                <FormItem name="id" hidden />
                <FormItem name="parentId" hidden />
                {addTabKey === '1' ? (
                    <>
                        <FormItem
                            {...layout}
                            label="类型"
                            type="select"
                            name="target"
                            options={menuTargetOptions}
                            tooltip="After you specify a type, it will open as a Qiankun subproject or as a third-party website"
                            required
                            getPopupContainer={() => contentRef.current}
                        />
                        <FormItem {...layout} label="title" name="title" required tooltip="Menu title" />
                        <FormItem {...layout} type="number" label="sort" name="order" tooltip="In descending order, the bigger the higher, the higher" />
                        <FormItem {...layout} label="path" name="path" tooltip="Menu path or third-party website address" />
                        <FormItem
                            {...layout}
                            type="switch"
                            label="enable"
                            name="enabled"
                            checkedChildren="open"
                            unCheckedChildren="prohibit"
                            tooltip="Whether it is enabled"
                        />
                        <FormItem shouldUpdate noStyle>
                            {({ getFieldValue }) => {
                                const target = getFieldValue('target');
                                if (target === 'qiankun') {
                                    return (
                                        <>
                                            <FormItem
                                                {...layout}
                                                label="Registered name"
                                                tooltip="To be the same as the name attribute declared in the child app package.json, it must be unique and non-repeatable"
                                                name="name"
                                                rules={[
                                                    { validator: checkName },
                                                    {
                                                        pattern: /^[0-9A-Za-z_-]+$/,
                                                        message: 'Only English case is allowed、_、-！',
                                                    },
                                                ]}
                                                required
                                            />
                                            <FormItem
                                                {...layout}
                                                label="Entrance address"
                                                tooltip="URL starting with http(s)."
                                                name="entry"
                                                rules={[
                                                    {
                                                        validator: (rule, value) => {
                                                            if (value && !value.startsWith('http'))
                                                                return Promise.reject('Please enter the correct entrance address!');
                                                            return Promise.resolve();
                                                        },
                                                    },
                                                ]}
                                                noSpace
                                                required
                                            />
                                        </>
                                    );
                                }

                                return (
                                    <FormItem
                                        {...layout}
                                        label="Base path"
                                        name="basePath"
                                        tooltip="All of its submenu paths will be prefixed with this"
                                    />
                                );
                            }}
                        </FormItem>
                    </>
                ) : (
                    <FormItem
                        labelCol={{ flex: 0 }}
                        type="textarea"
                        name="menus"
                        rows={16}
                        rules={[{ required: true, message: 'Please enter your menu data!' }]}
                        style={{ height: textAreaHeight }}
                        placeholder={`Add submenus in batches, with the following structure:
[
    {id: 'system', title: 'System administration', order: 900},
    {id: 'user', parentId: 'system', title: 'User management', path: '/users', order: 900},
    {id: 'menus', parentId: 'system', title: 'Menu management', path: '/menus', order: 900},
    {id: 'role', parentId: 'system', title: 'Role management', path: '/roles', order: 900},
    {
        id: 'demo', parentId: 'system', title: 'Test the sub-application',
        target: 'qiankun',

        name: 'react-admin',
        entry: 'http://localhost:3000',

        order: 850,
    },
]
                            `}
                    />
                )}
            </Content>
            <Space className={styles.footerAction}>
                {!isAdd ? (
                    <Popconfirm title={`You are sure to delete「${selectedMenu?.title}」？`} onConfirm={handleDelete}>
                        <Button loading={loading} danger>
                            Delete
                        </Button>
                    </Popconfirm>
                ) : null}
                <Button loading={loading} type="primary" htmlType="submit">
                    submit
                </Button>
            </Space>
        </Form>
    );
});
