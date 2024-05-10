import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { renderTableCheckbox, Table, filterTree } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import { WITH_SYSTEMS } from 'src/config';

const WithCheckboxTable = renderTableCheckbox(Table);

@config()
export default class RoleSelectTable extends Component {
    static propTypes = {
        value: PropTypes.array, // Selected nodes
        onChange: PropTypes.func, // Triggered when a node is selected
        fullValue: PropTypes.bool, // Value is the full data of the role
    };

    static defaultProps = {
        value: [],
        onChange: () => void 0,
        fullValue: false,
    };

    state = {
        loading: false,
        dataSource: [], // The role data displayed in the table is a subset of roles when searched
        roles: [], // All character data
    };

    columns = [
        { title: 'Character name', dataIndex: 'name', key: 'name' },
        { title: 'description', dataIndex: 'remark', key: 'remark' },
    ];

    componentDidMount() {
        (async () => {
            await this.handleSearch();
        })();
    }

    handleSearch = async () => {
        if (this.state.loading) return;

        try {
            this.setState({ loading: true });
            const res = await this.props.ajax.get('/role/queryEnabledRoles');

            let roles = res || [];
            if (WITH_SYSTEMS) {
                const systems = [];
                roles.forEach((item) => {
                    const { systemId, systemName } = item;
                    if (!systemId) return systems.push(item);

                    let system = systems.find((sys) => sys.systemId === systemId);
                    if (!system) {
                        system = {
                            id: `systemId-${systemId}`,
                            systemId,
                            name: systemName,
                            type: 4,
                            children: [item],
                        };
                        systems.push(system);
                    } else {
                        system.children.push(item);
                    }
                });
                systems.sort((a, b) => (a.type < b.type ? -1 : 1));
                systems.forEach(({ children }) => {
                    if (!children) return;
                    children.sort((a, b) => (a.type < b.type ? -1 : 1));
                });

                roles = systems;
            } else {
                roles = roles.filter((item) => item.type !== 2);
            }

            roles.sort((a, b) => (a.type < b.type ? -1 : 1));

            this.setState({ dataSource: [...roles], roles, loading: false });
        } catch (e) {
            this.setState({ loading: false });
            throw e;
        }
    };

    handleSearchValue = (value) => {
        const { roles } = this.state;

        const dataSource = filterTree(roles, (node) => {
            const { name, remark } = node;
            return [name, remark].some((val) => {
                const lowerValue = (val || '').toLowerCase();
                return lowerValue.includes(value);
            });
        });

        this.setState({
            dataSource,
        });
    };

    handleChange = (e) => {
        // Stabilization
        if (this.timer) clearTimeout(this.timer);

        this.timer = setTimeout(() => this.handleSearchValue(e.target.value), 300);
    };

    render() {
        const { dataSource, loading } = this.state;

        const { value, onChange, fullValue, disabled, getCheckboxProps = () => ({}), ...others } = this.props;

        return (
            <>
                <div style={{ padding: 8, display: 'flex', alignItems: 'center' }}>
                    <Input.Search
                        style={{ flex: 1 }}
                        allowClear
                        placeholder="Enter a keyword to search"
                        onSearch={this.handleSearchValue}
                        onChange={this.handleChange}
                    />
                </div>
                <WithCheckboxTable
                    showHeader={true}
                    size="small"
                    rowSelection={{
                        getCheckboxProps,
                        selectedRowKeys: fullValue ? (value || []).map((item) => item.id) : value,
                        onChange: (selectedRowKeys, selectedRows) =>
                            onChange(fullValue ? selectedRows : selectedRowKeys),
                    }}
                    loading={loading}
                    columns={this.columns}
                    dataSource={dataSource}
                    pagination={false}
                    rowKey="id"
                    {...others}
                />
            </>
        );
    }
}
