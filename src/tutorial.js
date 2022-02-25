import React from "react";
import {Layout, Tabs} from 'antd';
import img1 from './data/1.png';
import img2 from './data/2.png';
import img3 from './data/3.png';

const { TabPane } = Tabs;
const { Sider, Header, Content, Footer } = Layout; 

function Tutorial() {
  return (
    <Content style={{marginLeft:10}}>
         <Tabs defaultActiveKey="1">
            <TabPane tab="Tab 1" key="1"> <span style={{textAlign:'center', display:'block'}}><img src={img1} width={1200} height={700}/></span> </TabPane>
            <TabPane tab="Tab 2" key="2"> <span style={{textAlign:'center', display:'block'}}><img src={img2} width={1200} height={700}/></span> </TabPane>
            <TabPane tab="Tab 3" key="3"> <span style={{textAlign:'center', display:'block'}}><img src={img3} width={1200} height={700}/></span> </TabPane>
        </Tabs>
    </Content>
   
  );
}
export default Tutorial;