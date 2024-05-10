import React, {useState, useEffect, useCallback} from 'react';
import {Helmet} from 'react-helmet';
import {Button, Form} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {FormItem, setLoginUser, queryStringify} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import {toHome} from 'src/commons';
import {Logo} from 'src/components';
import s from './style.less';
import {IS_DEV, IS_PREVIEW, IS_TEST} from 'src/config';

// In development mode, the default password is filled in the account
const formValues = {
    account: 'P101282',
    password: '0000',
};

// Other parameters required to log in to the interface
const queryString = queryStringify({
    phoneCode: '0000',
    captchaCode: '0000',
    captchaId: '578721818865569792',
    srandNumFlagId: 1,
    isPhone: false,
    isCheck: true,
});

export default config({
    path: '/p/login',
    auth: false,
    layout: false,
})(function Login(props) {
    const login = props.ajax.usePost('/login/login?' + queryString, null, {baseURL: '/portal', errorTip: false});

    const [message, setMessage] = useState();
    const [isMount, setIsMount] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = useCallback(
        (values) => {
            if (login.loading) return;

            const {account, password} = values;
            const params = {
                loginName: account,
                password,
            };

            login
                .run(params, {errorTip: false})
                .then((res) => {
                    const {id, loginName: name, token, ...others} = res;
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
