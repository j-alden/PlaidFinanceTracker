import React from 'react';
// Ant Design
import { Layout } from 'antd';
import 'antd/dist/antd.css';
// CSS
import './styles.css';
// Custom components
import TransactionList from '../TransactionList';
import LeftSidebar from '../LeftSidebar';
import LinkAccount from '../LinkAccount/LinkAccount';
//import Header from '../Header/Header';

const AppLayout = () => {
  const { Header, Content } = Layout;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <LeftSidebar />
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '16px 16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <TransactionList />
            <LinkAccount />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
