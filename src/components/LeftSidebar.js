import React, { useState } from 'react';
import { Menu, Layout, Icon } from 'antd';

const LeftSidebar = () => {
  // const [selectedItem, setSelectedItem] = useState('Dashboard');
  // const handleOnSelect = (e, selectedItem) => {
  //   return setSelectedItem(selectedItem);
  // };
  const { Sider } = Layout;
  const [collapsed, setCollapsed] = useState(true);
  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div className='logo' />
      <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline'>
        <Menu.Item key='1'>
          <Icon type='dashboard' />
          <span>Dashboard</span>
        </Menu.Item>
        <Menu.Item key='2'>
          <Icon type='unordered-list' />
          <span>Transactions</span>
        </Menu.Item>
        <Menu.Item key='3'>
          <Icon type='line-chart' />
          <span>Trends</span>
        </Menu.Item>
        <Menu.Item key='4'>
          <Icon type='bank' />
          <span>Accounts</span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default LeftSidebar;
