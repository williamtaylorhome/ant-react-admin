import { Form } from 'antd';
import { ModalContent, FormItem } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';

export default config({
    modal: {
        title: 'Change your password',
        width: 500,
    },
})(function PasswordModal(props) {
    const { onOk, onCancel } = props;

    function handleSubmit(values) {
        alert('TODO interface docking');
        console.log(props.ajax);
        onOk();
    }

    const layout = {
        labelCol: { flex: '100px' },
    };

    return (
        <Form onFinish={handleSubmit}>
            <ModalContent okHtmlType="submit" onCancel={onCancel}>
                <FormItem {...layout} type="password" label="Original password" name="oldPassword" required />
                <FormItem {...layout} type="password" label="New passwords" name="password" required />
                <FormItem
                    {...layout}
                    type="password"
                    label="Confirm the new password"
                    name="rePassword"
                    required
                    dependencies={['password']}
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Confirm that the new password is not the same as the new password!'));
                            },
                        }),
                    ]}
                />
            </ModalContent>
        </Form>
    );
});
