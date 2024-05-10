import { useState, useMemo, useCallback } from 'react';
import { Button, Form, Space } from 'antd';
import { PageContent, QueryBar, FormItem, Table, Pagination, Operator, ToolBar } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import options from 'src/options';
import EditModal from './EditModal';

export default config({
    path: '/users',
})(function User(props) {
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [conditions, setConditions] = useState({});
    const [visible, setVisible] = useState(false);
    const [record, setRecord] = useState(null);
    const [form] = Form.useForm();

    const params = useMemo(() => {
        return {
            ...conditions,
            pageNum,
            pageSize,
        };
    }, [conditions, pageNum, pageSize]);

    // Use the existing query criteria to re-initiate the request
    const refreshSearch = useCallback(() => {
        setConditions(form.getFieldsValue());
    }, [form]);

    // Get the list
    const { data: { dataSource, total } = {} } = props.ajax.useGet('/user/queryUsersByPage', params, [params], {
        setLoading,
        formatResult: (res) => {
            return {
                dataSource: res?.content || [],
                total: res?.totalElements || 0,
            };
        },
    });

    // Delete
    const { run: deleteRecord } = props.ajax.useDel('/user/:id', null, { setLoading, successTip: 'Deleted successfully!' });

    const columns = [
        { title: 'account', dataIndex: 'account' },
        { title: 'name', dataIndex: 'name' },
        { title: 'enabled', dataIndex: 'enabled', render: (value) => options.enabled.getTag(!!value) },
        { title: 'mobile', dataIndex: 'mobile' },
        { title: 'email', dataIndex: 'email' },
        {
            title: 'operation',
            key: 'operator',
            width: 250,
            render: (value, record) => {
                const { id, name } = record;
                const items = [
                    {
                        label: 'View',
                        onClick: () => setRecord({ ...record, isDetail: true }) || setVisible(true),
                    },
                    {
                        label: 'revise',
                        onClick: () => setRecord(record) || setVisible(true),
                    },
                    {
                        label: 'Delete',
                        color: 'red',
                        confirm: {
                            title: `You are sure to delete「${name}」？`,
                            onConfirm: () => handleDelete(id),
                        },
                    },
                ];

                return <Operator items={items} />;
            },
        },
    ];

    const handleDelete = useCallback(
        async (id) => {
            await deleteRecord(id);
            // Trigger a list update
            refreshSearch();
        },
        [deleteRecord, refreshSearch],
    );

    const queryItem = {
        style: { width: 200 },
    };

    return (
        <PageContent loading={loading}>
            <QueryBar>
                <Form
                    name="user"
                    layout="inline"
                    form={form}
                    initialValues={{ position: '01' }}
                    onFinish={(values) => setPageNum(1) || setConditions(values)}
                >
                    <FormItem {...queryItem} label="account" name="account" />
                    <FormItem {...queryItem} label="name" name="name" />
                    <FormItem {...queryItem} label="mobile" name="mobile" />
                    <FormItem
                        {...queryItem}
                        label="position"
                        name="position"
                        allowClear
                        options={[
                            { value: '01', label: 'Front-end development' },
                            { value: '02', label: 'Back-end development' },
                        ]}
                    />
                    <FormItem>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                search
                            </Button>
                            <Button onClick={() => form.resetFields()}>reset</Button>
                        </Space>
                    </FormItem>
                </Form>
            </QueryBar>
            <ToolBar>
                <Button type="primary" onClick={() => setRecord(null) || setVisible(true)}>
                    add
                </Button>
            </ToolBar>
            <Table
                serialNumber
                pageNum={pageNum}
                pageSize={pageSize}
                fitHeight
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
            />
            <Pagination
                total={total}
                pageNum={pageNum}
                pageSize={pageSize}
                onPageNumChange={setPageNum}
                onPageSizeChange={(pageSize) => setPageNum(1) || setPageSize(pageSize)}
            />
            <EditModal
                visible={visible}
                record={record}
                isEdit={!!record}
                onOk={() => setVisible(false) || refreshSearch()}
                onCancel={() => setVisible(false)}
            />
        </PageContent>
    );
});
