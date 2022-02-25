import React from "react";
import { Layout, Menu} from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;

function HeaderJ() {
  return (
        <Header style={{backgroundColor:'#FFC0D7'}}>
            <Menu style={{backgroundColor:'#FFC0D7'}} mode="horizontal" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">Analysis <Link to="/"/> </Menu.Item>
                <Menu.Item key="2">Dashboard</Menu.Item>
                <Menu.Item key="3">Tutorial <Link to="/tutorial"/> </Menu.Item>
            </Menu>
        </Header>
  );
}
export default HeaderJ;