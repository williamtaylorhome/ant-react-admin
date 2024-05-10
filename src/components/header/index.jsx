import {useState} from 'react';
import {Space, Dropdown, Menu, Avatar} from 'antd';
import {DownOutlined, LockOutlined, LogoutOutlined} from '@ant-design/icons';
import {getColor, FullScreen} from '@ra-lib/admin';
import {IS_MOBILE} from 'src/config';
import config from 'src/commons/config-hoc';
import {toLogin} from 'src/commons';
import PasswordModal from './PasswordModal';
import styles from './style.less';
import {Proxy} from 'src/components';

export default config({
    router: true,
})(function Header(props) {
    const {loginUser = {}} = props;
    const [passwordVisible, setPasswordVisible] = useState(false);

    async function handleLogout() {
        try {
            // await props.ajax.post('/logout', null, {errorTip: false});
            alert('TODO Logout Interface!');
        } finally {
            // Regardless of whether the exit is successful or unsuccessful, the login page will be redirected
            toLogin();
        }
    }

    const menu = (
        <Menu>
            <Menu.Item key="modify-password" icon={<LockOutlined />} onClick={() => setPasswordVisible(true)}>
                Change your password
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" danger icon={<LogoutOutlined />} onClick={handleLogout}>
                Sign out
            </Menu.Item>
        </Menu>
    );

    const {avatar, name = ''} = loginUser;

    return (
        <Space
            className={styles.root}
            size={16}
            style={{
                paddingRight: IS_MOBILE ? 0 : 12,
            }}
        >
            <Proxy className={styles.action} />

            {IS_MOBILE ? null : (
                <>
                    <div className={styles.action}>
                        <FullScreen />
                    </div>
                </>
            )}

            <Dropdown overlay={menu}>
                <div className={styles.action}>
                    {avatar ? (
                        <Avatar size="small" className={styles.avatar} src={avatar} />
                    ) : (
                        <Avatar size="small" className={styles.avatar} style={{backgroundColor: getColor(name)}}>
                            {(name[0] || '').toUpperCase()}
                        </Avatar>
                    )}
                    {IS_MOBILE ? null : (
                        <>
                            <span className={styles.userName}>{name}</span>
                            <DownOutlined />
                        </>
                    )}
                </div>
            </Dropdown>
            <PasswordModal
                visible={passwordVisible}
                onCancel={() => setPasswordVisible(false)}
                onOk={() => setPasswordVisible(false)}
            />
        </Space>
    );
});
