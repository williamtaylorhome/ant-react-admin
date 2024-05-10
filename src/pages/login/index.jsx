import React, {useState, useEffect, useCallback} from 'react';
import {Helmet} from 'react-helmet';
import {Button, Form} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {FormItem, setLoginUser} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import {toHome} from 'src/commons';
import {Logo, Proxy} from 'src/components';
import {IS_DEV, IS_TEST, IS_PREVIEW} from 'src/config';
import s from './style.less';

// Development mode: The username and password are populated by default
const formValues = {
    account: 'admin',
    password: '123456',
};

export default config({
    path: '/login',
    auth: false,
    layout: false,
})(function Login(props) {
    const [message, setMessage] = useState();
    const [isMount, setIsMount] = useState(false);
    const [form] = Form.useForm();

    const login = props.ajax.usePost('/login');

    const handleSubmit = useCallback(
        (values) => {
            if (login.loading) return;

            const params = {
                ...values,
            };

            alert('TODO login');
            login.run = async () => ({id: 1, name: 'Test', token: 'test'});

            login
                .run(params, {errorTip: false})
                .then((res) => {
                    const {id, name, token, ...others} = res;
                    setLoginUser({
                        id, // Required field
                        name, // Required field
                        token,
                        ...others,
                        // Additional fields are added as needed
                    });
                    toHome();
                })
                .catch((err) => {
                    console.error(err);
                    setMessage(err.response?.data?.message || 'Wrong username or password');
                });
        },
        [login],
    );

    useEffect(() => {
        // Data is populated by default during development
        if (IS_DEV || IS_TEST || IS_PREVIEW) {
            form.setFieldsValue(formValues);
        }

        setTimeout(() => setIsMount(true), 300);
    }, [form]);

    const formItemClass = [s.formItem, {[s.active]: isMount}];

    return (
        <div className={s.root}>
            <Helmet title="Welcome to login" />
            <div className={s.logo}>
                <Logo />
            </div>
            <Proxy className={s.proxy} />
            <div className={s.box}>
                <Form form={form} name="login" onFinish={handleSubmit}>
                    <div className={formItemClass}>
                        <h1 className={s.header}>Welcome to login</h1>
                    </div>
                    <div className={formItemClass}>
                        <FormItem
                            name="account"
                            allowClear
                            autoFocus
                            prefix={<UserOutlined />}
                            placeholder="Please enter a username"
                            rules={[{required: true, message: 'Please enter a username！'}]}
                        />
                    </div>
                    <div className={formItemClass}>
                        <FormItem
                            type="password"
                            name="password"
                            prefix={<LockOutlined />}
                            placeholder="Please enter your password"
                            rules={[{required: true, message: 'Please enter your password！'}]}
                        />
                    </div>
                    <div className={formItemClass}>
                        <FormItem noStyle shouldUpdate style={{marginBottom: 0}}>
                            {() => (
                                <Button
                                    className={s.submitBtn}
                                    loading={login.loading}
                                    type="primary"
                                    htmlType="submit"
                                    disabled={
                                        // The user has not operated on it, or there is no set fields value
                                        !form.isFieldsTouched(true) ||
                                        // There is an error in the form
                                        form.getFieldsError().filter(({errors}) => errors.length).length
                                    }
                                >
                                    login
                                </Button>
                            )}
                        </FormItem>
                    </div>
                </Form>
                <div className={s.errorTip}>{message}</div>
            </div>
        </div>
    );
});
