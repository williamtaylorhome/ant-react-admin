import { useCallback, useMemo, useState } from 'react';
import { Form, Row, Col, Card, Button } from 'antd';
import { ModalContent, FormItem, Content, validateRules, useDebounceValidator } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import RoleSelectTable from 'src/pages/role/RoleSelectTable';

export default config({
    modal: {
        title: (props) => {
            if (props?.record?.isDetail) return 'View users';

            return props.isEdit ? 'Edit the user' : 'Create a user';
        },
        width: '70%',
        top: 50,
    },
})(function Edit(props) {
    const { record, isEdit, onOk, onCancel } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const isDetail = record?.isDetail;

    const params = useMemo(() => {
        return { id: record?.id };
    }, [record]);

    // When editing, the detailed data is queried
    props.ajax.useGet('/user/getUserById', params, [params], {
        mountFire: isEdit,
        setLoading,
        formatResult: (res) => {
            if (!res) return;
            form.setFieldsValue(res);
        },
    });
    const { run: save } = props.ajax.usePost('/user/addUser', null, { setLoading, successTip: 'Created successfully!' });
    const { run: update } = props.ajax.usePost('/user/updateUserById', null, { setLoading, successTip: 'Modification successful!' });
    const { run: fetchUserByAccount } = props.ajax.useGet('/user/getOneUser');

    const handleSubmit = useCallback(
        async (values) => {
            const roleIds = values.roleIds?.filter((id) => !`${id}`.startsWith('systemId'));
            const params = {
                ...values,
                roleIds,
            };

            if (isEdit) {
                await update(params);
            } else {
                await save(params);
            }

            onOk();
        },
        [isEdit, update, save, onOk],
    );

    const checkAccount = useDebounceValidator(async (rule, value) => {
        if (!value) return;

        const user = await fetchUserByAccount({ account: value });
        if (!user) return;

        const id = form.getFieldValue('id');
        if (isEdit && user.id !== id && user.account === value) throw Error('Accounts cannot be duplicated!');
        if (!isEdit && user.account === value) throw Error('Accounts cannot be duplicated!');
    });

    const disabled = isDetail;
    const layout = {
        labelCol: { flex: '100px' },
        disabled,
    };
    const colLayout = {
        xs: { span: 24 },
        sm: { span: 12 },
    };
    return (
        <Form form={form} name="roleEdit" onFinish={handleSubmit} initialValues={{ enabled: true }}>
            <ModalContent
                loading={loading}
                okText="save"
                okHtmlType="submit"
                cancelText="reset"
                onCancel={() => form.resetFields()}
                footer={disabled ? <Button onClick={onCancel}>Shut down</Button> : undefined}
            >
                {isEdit ? <FormItem hidden name="id" /> : null}
                <Row gutter={8}>
                    <Col {...colLayout}>
                        <Card title="Basic Information">
                            <Content fitHeight otherHeight={160}>
                                <FormItem
                                    {...layout}
                                    label="account"
                                    name="account"
                                    required
                                    noSpace
                                    rules={[{ validator: checkAccount }]}
                                />
                                <FormItem {...layout} label="password" name="password" required noSpace />
                                <FormItem
                                    {...layout}
                                    type={'switch'}
                                    label="enable"
                                    name="enabled"
                                    checkedChildren="open"
                                    unCheckedChildren="prohibit"
                                    required
                                />
                                <FormItem {...layout} label="name" name="name" required noSpace />
                                <FormItem
                                    {...layout}
                                    label="email"
                                    name="email"
                                    rules={[validateRules.email()]}
                                    required
                                    noSpace
                                />
                                <FormItem
                                    {...layout}
                                    label="mobile"
                                    name="mobile"
                                    rules={[validateRules.mobile()]}
                                    required
                                    noSpace
                                />
                            </Content>
                        </Card>
                    </Col>
                    <Col {...colLayout}>
                        <Card title="Role configuration" bodyStyle={{ padding: 0 }}>
                            <FormItem {...layout} name="roleIds">
                                <RoleSelectTable fitHeight otherHeight={200} getCheckboxProps={() => ({ disabled })} />
                            </FormItem>
                        </Card>
                    </Col>
                </Row>
            </ModalContent>
        </Form>
    );
});
