import { useState } from 'react';
import { Form, Row, Col, Alert } from 'antd';
import json5 from 'json5';
import { FormItem, LAYOUT_TYPE, PageContent, storage } from '@ra-lib/admin';
import { CONFIG_HOC_STORAGE_KEY, CONFIG_HOC } from 'src/config';
import { layoutRef } from 'src/components/layout';

const options = [
    { value: true, label: 'yes' },
    { value: false, label: 'no' },
];

const themeOptions = [
    { value: 'default', label: 'light' },
    { value: 'dark', label: 'dark' },
];

export default function LayoutSetting(props) {
    const [code, setCode] = useState('');

    function handleChange(changedValues, values) {
        storage.local.setItem(CONFIG_HOC_STORAGE_KEY, values);

        Object.entries(values).forEach(([key, value]) => (CONFIG_HOC[key] = value));

        layoutRef.current?.refresh && layoutRef.current.refresh();
        let code = json5.stringify(values, null, 4) || '';
        code = code.replace(`layoutType: 'side-menu'`, `layoutType: LAYOUT_TYPE.SIDE_MENU`);
        code = code.replace(`layoutType: 'top-menu'`, `layoutType: LAYOUT_TYPE.TOP_MENU`);
        code = code.replace(`layoutType: 'top-side-menu'`, `layoutType: LAYOUT_TYPE.TOP_SIDE_MENU`);
        setCode(code);

        // Delayed triggering window resize Event to adjust the layout
// setTimeout(() => window.dispatchEvent(new Event('resize')));
    }

    const layout = {
        labelCol: { flex: '100px' },
    };

    return (
        <PageContent fitHeight style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 0 }}>
                <Alert
                    style={{ marginBottom: 24 }}
                    type="warning"
                    message={
                        <div style={{ color: 'red' }}>
                            It is not recommended to open the settings to the user, so once selected, copy the code to the project configuration file src/config/index.js 
                        </div>
                    }
                />
                <Form initialValues={CONFIG_HOC} onValuesChange={handleChange}>
                    <FormItem
                        {...layout}
                        type="radio-button"
                        label="Layout"
                        name="layoutType"
                        options={[
                            { value: LAYOUT_TYPE.SIDE_MENU, label: 'Left-hand menu' },
                            { value: LAYOUT_TYPE.TOP_MENU, label: 'Head menu' },
                            { value: LAYOUT_TYPE.TOP_SIDE_MENU, label: 'Head + Left Menu' },
                        ]}
                    />
                    <FormItem
                        {...layout}
                        type="radio-button"
                        label="Logo theme"
                        name="logoTheme"
                        options={themeOptions}
                    />
                    <Row>
                        <Col span={6}>
                            <FormItem {...layout} type="radio-button" label="Left" name="side" options={options} />
                        </Col>
                        <FormItem shouldUpdate noStyle>
                            {({ getFieldValue }) => {
                                const side = getFieldValue('side');
                                if (!side) return null;
                                return (
                                    <>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="The menu remains open"
                                                name="keepMenuOpen"
                                                options={options}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="Theme on the left"
                                                name="sideTheme"
                                                options={themeOptions}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="Menu search"
                                                name="searchMenu"
                                                options={options}
                                            />
                                        </Col>
                                    </>
                                );
                            }}
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem {...layout} type="radio-button" label="head" name="header" options={options} />
                        </Col>
                        <FormItem shouldUpdate noStyle>
                            {({ getFieldValue }) => {
                                const header = getFieldValue('header');
                                if (!header) return null;
                                return (
                                    <>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="Head collapse menu"
                                                name="headerSideToggle"
                                                options={options}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="Header theme"
                                                name="headerTheme"
                                                options={themeOptions}
                                            />
                                        </Col>
                                    </>
                                );
                            }}
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem {...layout} type="radio-button" label="Tab page" name="tab" options={options} />
                        </Col>
                        <FormItem shouldUpdate noStyle>
                            {({ getFieldValue }) => {
                                const tab = getFieldValue('tab');
                                if (!tab) return null;
                                return (
                                    <>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="Tab Endurance"
                                                name="persistTab"
                                                options={options}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="TabCollapse the menu"
                                                name="tabSideToggle"
                                                options={options}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <FormItem
                                                {...layout}
                                                type="radio-button"
                                                label="Tab extra head"
                                                name="tabHeaderExtra"
                                                options={options}
                                            />
                                        </Col>
                                    </>
                                );
                            }}
                        </FormItem>
                    </Row>
                    <FormItem {...layout} type="radio-button" label="The head of the page" name="pageHeader" options={options} />
                </Form>
            </div>
            <code
                style={{
                    flex: 1,
                    overflow: 'auto',
                    borderTop: '1px solid #e8e8e8',
                    padding: 16,
                    background: '#000',
                }}
            >
                <pre style={{ color: '#fff' }}>{code}</pre>
            </code>
        </PageContent>
    );
}
