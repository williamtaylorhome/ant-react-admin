import { useCallback, useState } from 'react';
import { Card, Row, Col, Form } from 'antd';
import { ModalContent, FormItem, Content, useDebounceValidator, useOptions } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import { WITH_SYSTEMS } from 'src/config';
import MenuTableSelect from 'src/pages/menus/MenuTableSelect';
import options from 'src/options';

export default config({
    modal: {
        title: (props) => (props.isEdit ? 'Edit the role' : 'Create a role'),
        width: '70%',
        top: 50,
    },
})(function Edit(props) {
    const { record, isEdit, onOk } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [systemOptions] = useOptions(options.system);

    // Get Details data is the form echo data
    props.ajax.useGet('/role/getRoleDetailById', { id: record?.id }, [], {
        setLoading,
        mountFire: isEdit, // When a component is mounted, the request is triggered only when it is edited
        formatResult: (res) => {
            if (!res) return;
            const values = {
                ...res,
            };
            form.setFieldsValue(values);
        },
    });
    // Add a request
    const { run: saveRole } = props.ajax.usePost('/role/addRole', null, { setLoading, successTip: 'Created successfully!' });
    // Update the request
    const { run: updateRole } = props.ajax.usePost('/role/updateRoleById', null, {
        setLoading,
        successTip: 'Modification successful!',
    });
    const { run: fetchRoleByName } = props.ajax.useGet('/role/getOneRole');

    const handleSubmit = useCallback(
        async (values) => {
            const params = {
                ...values,
            };

            if (isEdit) {
                await updateRole(params);
            } else {
                await saveRole(params);
            }

            onOk();
        },
        [isEdit, updateRole, saveRole, onOk],
    );

    // Within the system, the role name cannot be repeated
    const checkName = useDebounceValidator(async (rule, value) => {
        if (!value) return;

        const systemId = form.getFieldValue('systemId');
        const role = await fetchRoleByName({ name: value, systemId });
        if (!role) return;

        const id = form.getFieldValue('id');
        if (isEdit && role.id !== id && role.name === value) throw Error('Character names cannot be repeated!');
        if (!isEdit && role.name === value) throw Error('Character names cannot be repeated!');
    });

    const layout = { labelCol: { flex: '100px' } };
    const colLayout = {
        xs: { span: 24 },
        sm: { span: 12 },
    };
    return (
        <Form form={form} name="roleEdit" onFinish={handleSubmit} initialValues={{ enabled: true }}>
            <ModalContent
                loading={loading}
                okText="submit"
                okHtmlType="submit"
                cancelText="reset"
                onCancel={() => form.resetFields()}
            >
                {isEdit ? <FormItem hidden name="id" /> : null}

                <Row gutter={8}>
                    <Col {...colLayout}>
                        <Card title="Basic Information">
                            <Content fitHeight otherHeight={160}>
                                {WITH_SYSTEMS ? (
                                    <FormItem
                                        {...layout}
                                        label="Attribution system"
                                        name="systemId"
                                        required
                                        options={systemOptions}
                                        onChange={() => {
                                            form.setFieldsValue({ menuIds: [] });
                                        }}
                                        noSpace
                                    />
                                ) : null}
                                <FormItem
                                    {...layout}
                                    label="The name of the role"
                                    name="name"
                                    required
                                    noSpace
                                    maxLength={50}
                                    rules={[{ validator: checkName }]}
                                />
                                <FormItem
                                    {...layout}
                                    type={'switch'}
                                    label="enable"
                                    name="enabled"
                                    checkedChildren="open"
                                    unCheckedChildren="prohibit"
                                    required
                                />
                                <FormItem {...layout} type="textarea" label="remark" name="remark" maxLength={250} />
                            </Content>
                        </Card>
                    </Col>
                    <Col {...colLayout}>
                        <Card title="Permission configuration" bodyStyle={{ padding: 0 }}>
                            <FormItem shouldUpdate noStyle>
                                {({ getFieldValue }) => {
                                    const systemId = getFieldValue('systemId');
                                    return (
                                        <FormItem {...layout} name="menuIds">
                                            <MenuTableSelect
                                                topId={WITH_SYSTEMS ? systemId : undefined}
                                                fitHeight
                                                otherHeight={200}
                                            />
                                        </FormItem>
                                    );
                                }}
                            </FormItem>
                        </Card>
                    </Col>
                </Row>
            </ModalContent>
        </Form>
    );
});
