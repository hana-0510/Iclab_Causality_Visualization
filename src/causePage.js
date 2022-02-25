import React, {useState } from 'react';
import { Layout, Select, Button, Table} from 'antd';
import ScatterPlot from './graphs/scatterPlot';
import Diagram from './graphs/diagram';

const { Sider, Content } = Layout;
const { Option } = Select;


function CausePage (props){
    const {data, names, name, caused, effected, amountCorr, pValue, resultJSON} = props;
    const confounders = resultJSON[effected][caused]['confounders'];
    const [confounder, setConfounder] = useState();
    const [dataClicked, setDataClicked] = useState({});
    const [newCause, setNewCause] = useState(caused);

    const handleChange = (value) =>{
        setConfounder(value);
        setDataClicked({});
    }
    const handleNewCause = (value) =>{
        setNewCause(value);
    }
    const newCaused = (value) =>{
        props.handleCause(value);
        setConfounder();
    }
    const handlePoint = (value) =>{
        setDataClicked(value);
    }


    //causality relationship이 있으면 else 없으면 위
    const isCause = (value) =>{
        if(value===0){
            return(
                <Content style={{marginLeft:10}}>
                    <p>교란 변수의 영향을 통제했을 때, [{names[caused]}]은(는) [{names[effected]}]에 유의한 영향을 미치지 않습니다. (상관계수: {amountCorr},  유의확률(p값): {pValue})</p>
                    <p> ⇒ 즉, 분석 결과에 따르면 [{names[caused]}]을(를) 높이더라도 [{names[effected]}]의 변화에는 직접적인 영향이 없을 것으로 예상됩니다.</p>
                </Content>
            )
        } else{
            return(
                <Content style={{marginLeft:10}}>
                    <p>교란 변수의 영향을 통제했을 때, [{names[caused]}]은(는) [{names[effected]}]에 유의한 영향을 줍니다. (상관계수: {amountCorr},  유의확률(p값): {pValue})</p>
                    <p> ⇒ 즉, 분석 결과에 따르면 [{names[caused]}]을(를) 높일 때 [{names[effected]}]의 변화에 직접적인 영향이 있을 것으로 예상됩니다.</p>
                </Content>
            )
        }
    }

    //confounder 고르면 위 아직 안 골랐으면 아래 (고르라는 메세지)
    const confounderX = (value) =>{
        if(value!=null) {
            return(
                <Layout style={{backgroundColor:'#fff'}}>
                    <Layout style={{backgroundColor:'#fff'}}>
                        <Sider width={400} style={{backgroundColor:'#fff', marginLeft:10}}>
                            <ScatterPlot data={data} names={names} xaxis={confounder} yaxis={caused} w={320} h={320}  handlePoint={handlePoint} dataClicked={dataClicked}/>
                        </Sider>
                        <Sider width={400} style={{backgroundColor:'#fff', marginLeft:10}}>
                            <ScatterPlot data={data} names={names} xaxis={confounder} yaxis={effected} w={320} h={320}  handlePoint={handlePoint} dataClicked={dataClicked}/>
                        </Sider>
                    </Layout>
                    <Content>
                        <Table style={{marginTop:5, marginLeft:10, marginBottom:5, width: 780 }} pagination={false} columns={[{title: names['timestamp'], dataIndex:'timestamp', key: 'timestamp'}, {title: names[caused], dataIndex:caused, key: caused}, {title: names[effected], dataIndex: effected, key: effected}, {title: names[confounder], dataIndex: confounder, key: confounder}]} dataSource={[dataClicked]} />
                    </Content>
                </Layout>  
        )}else{
            return(
                <Content style={{backgroundColor:'#fff', width: '100%', height:350, display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', textAlign:'center'}}>Please select the confounder you want to know</div>
                </Content>
            )
        }
    }

    //confounder가 없으면 위 있으면 아래
    const noConfounder = (value) =>{
        if(value===0){
            return(
                <Layout style={{ backgroundColor:'#fff', width: '100%', height:430, display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <Content>
                        <h3 style={{display:'flex', justifyContent:'center', alignItems:'center'}}>{name} 님의 {names[caused]}와(과) {names[effected]}의 변화에 영향을 줄 수 있는 교란 변수는 존재하지 않습니다.</h3>
                        <p style={{display:'flex', justifyContent:'center', alignItems:'center'}}>교란 변수가 존재하지 않으므로, {names[caused]}와 {names[effected]}의 상관관계는 곧 인과관계로 해석될 수 있습니다.</p>
                        <p style={{display:'flex', justifyContent:'center', alignItems:'center'}}>⇒ 즉, 분석 결과에 따르면 {names[caused]}을(를) 높일 때 {names[effected]}의 변화에 직접적인 영향이 있을 것으로 예상됩니다.</p>
                    </Content>
                </Layout>
            )
        } else{
            return(
                <Layout style={{backgroundColor:'#fff', marginLeft:10}}>
                    {/* summary on top */}
                    <Layout style={{backgroundColor:'#fff'}}>
                        <Content>
                            <h3>{name}님의 {names[caused]}와(과) {names[effected]}의 변화에 영향을 줄 수 있는 교란 변수는 총 {confounders.length}개 존재합니다.</h3>
                            <p style={{ fontSize: 9 }}>[참고] 아래 그래프는 교란 변수의 원인 및 결과와의 상관관계를 나타내며, 인과관계 확인을 위해 교란 변수의 영향을 먼저 통제해야 합니다.</p>
                        </Content>
                    </Layout>
                    {/* choosing confounder */}
                    <Layout style={{backgroundColor:'#fff'}}>
                        <Sider width={350} height={350} style={{backgroundColor:'#fff', marginLeft:10}}>
                            <h3>교란 변수 선택</h3>
                            <Content>
                                 <Select defaultValue={""} style={{ width: 200 }} onChange={(e)=> handleChange(e)}>
                                    {confounders.map(function(option) {
                                        return(
                                            <Option key={option}>{names[option]}</Option>
                                        )
                                    })}
                                </Select>
                            </Content>
                           <Content style={{marginTop:25}}>
                               <Diagram names={names} caused={caused} effected={effected} confounder={confounder}/>
                           </Content>
                        </Sider>
                        {/* displaying confounder scatter plots */}
                        <div>
                            {confounderX(confounder)}
                        </div>
                    </Layout> 
                       {/* select at bottom */}
                    <Layout style={{backgroundColor:'#fff'}}>
                        <div>{isCause(resultJSON[effected][caused]['causality'])}</div>
                        <Content>
                            <span style={{marginLeft:10}}>[{names[effected]}]와 관련된 다른 변수의 인과관계 살펴보기 ⇒ </span>
                                <Select defaultValue={""} style={{ width: 200 }} onChange={(e)=> handleNewCause(e)}>
                                    {confounders.map(function(option) {
                                        return(
                                            <Option key={option}>{names[option]}</Option>
                                        )
                                    })}
                                </Select>
                                <Button onClick={(e) => newCaused(newCause)}>확인</Button>
                        </Content>
                    </Layout>
                </Layout>)
        }
    }

    return(
        <div>{noConfounder(confounders.length)}</div>
    )
}

export default CausePage;


