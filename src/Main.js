import React, {useState } from 'react';
import { Layout, Menu, Select, List} from 'antd';
import CausePage from './causePage';
import CorrPage from './corrPage';
import { resultJSON } from './data/result_data';
import { rawData2 } from './data/raw_data_edited_2nd';
import { names } from './data/kor_var_name_dict';


const topics = Object.keys(resultJSON);

function MainPage() {
    const { Sider, Content } = Layout;
    const { Option } = Select;

    const [topic, setTopic]  = useState(topics[0]);
    const [caused, setCaused] = useState();
	const [effected, setEffected] = useState();
    const [corrOrcause, setcorrOrcause] = useState("1");
    const [amountCorr, setamountCorr] = useState();
    const [pValue, setpValue] = useState();
    const effects = Object.keys(resultJSON[topic]);
    const name = "윤하나"
    const [minX, setMinX] = useState();
    const [maxX, setMaxX] = useState();
    const [minY, setMinY] = useState();
    const [maxY, setMaxY] = useState();

    //topic이나 effect를 새로 set 함
    const handleChange = (value, type) =>{
		type === 'topic' ? setTopic(value): setEffected(value);
        setCaused();
	}

    const handleCause = (value) =>{
        setCaused(value);
        setamountCorr(resultJSON[topic][effected][value]['corr_coef'].toFixed(6));
        setpValue(resultJSON[topic][effected][value]['corr_sig'].toFixed(6));
        setMinX(Math.floor( Math.min.apply(Math, rawData2.map(function(d){return d[value]}))));
        setMaxX(Math.ceil( Math.max.apply(Math, rawData2.map(function(d){return d[value]}))));
        setMinY(Math.floor( Math.min.apply(Math, rawData2.map(function(d){return d[effected]}))));
        setMaxY(Math.ceil( Math.max.apply(Math, rawData2.map(function(d){return d[effected]}))));
    }

    //corrOrcause가 1이면 Correlation Page 아니면 Cause Page를 return하도록 함
    const corrOrCauComp = (key) =>{
        if (caused!=null && effected!=null){
            if (corrOrcause ==="1"){
                return (<CorrPage data={rawData2} names={names} name={name} caused={caused} effected={effected} amountCorr={amountCorr} pValue={pValue} minX={minX} maxX={maxX} minY={minY} maxY={maxY}/>);
            } else{
                return (<CausePage data={rawData2} names={names} name={name} caused={caused} effected={effected} amountCorr={amountCorr} pValue={pValue} handleCause={handleCause} resultJSON={resultJSON[topic]}/>);
            }
        }
    }

    const amountCorrF = (key) =>{
        if(key === "strong") { return(<span style={{fontWeight:'bold'}}>높은</span>)} 
        else if(key ==="moderate") { return(<span style={{fontWeight:'bold'}}>보통</span>) }
    }

    const posNeg = (key) =>{
        if(key>0) {return(<span style={{fontWeight:'bold'}} >양</span>)} 
        else {return(<span style={{fontWeight:'bold'}} >음</span>)}
    }

    const isCausation = (key, corr) =>{
        if(corr===true){
            if(key === 1){ return(<span style={{fontWeight:'bold'}} >성립합니다</span>)} 
            else{ return(<span style={{fontWeight:'bold'}} >성립하지 않습니다</span>) }
        } else{
            if(key === 1){ return(<span style={{fontWeight:'bold'}} >서로 관련이 있고, 원인과 결과의 관계로 해석할 수 있습니다.</span>)} 
            else{ return(<span style={{fontWeight:'bold'}} >서로 관련이 있으나, 원인과 결과의 관계로 해석하기는 어렵습니다.</span>) }
        }
       
    }

    //cause & effect가 정해지고 나면 상관관계가 나오도록 함
    const afterCauEff = (key) =>{
        if (caused!=null && effected!=null){
            // Summary on Top + 상관관계/ 인과관계 menu
            return(
                <Layout style={{backgroundColor:'#fff'}}>
                    <Content style={{ marginLeft: 10}}>
                        <h3>두 변수의 관계</h3>
                        <p><span style={{fontWeight:'bold'}} >{names[caused]}</span> 와/과 <span style={{fontWeight:'bold'}} >{names[effected]}</span> 사이에는</p>
                        <p>상관관계: { amountCorrF(resultJSON[topic][effected][caused]['corr_str'])} 수준의 {posNeg(amountCorr)}의 상관관계가 존재합니다</p>
                        <p>인과관계: 인과관계가 {isCausation(resultJSON[topic][effected][caused]['causality'], true)}.</p>
                        <p>결론: 두 변수의 변화는 {isCausation(resultJSON[topic][effected][caused]['causality'], false)}</p>
                    </Content>
                    <Content>
                        <Menu className='corrCauMenu' style={{backgroundColor:'#FFD2E2'}} mode="horizontal" defaultSelectedKeys={['1']} onClick={(e) => setcorrOrcause(e.key)}>
                            <Menu.Item key="1">상관관계</Menu.Item>
                            <Menu.Item key="2">인과관계</Menu.Item>
                        </Menu>
                    </Content>
                </Layout>
            )  
        } else{
            return (
                <Content style={{ width: '100%', height:650, display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>Please input the cause & effect you want to know</div>
                </Content>
            )
        }
    }

    return(
        <div className='all'>
            <Layout style={{backgroundColor:'#fff'}}>
                <Layout>
                    {/* Side에 있는 topic -> effect -> cause*/}
                    <Sider width={265} style={{backgroundColor:'#FFEBF2'}}>
                        <Content style={{ height: 100, marginLeft:10}}>
                            <div>
                                <p>Topic: </p>
                                <Select defaultValue={topics[0]} style={{ width: 120 }} onChange={(e)=> handleChange(e, 'topic')}>
                                    {topics.map(eff => (
                                    <Option key={eff}>{names[eff]}</Option>
                                    ))}
                                </Select>
                            </div>
                        </Content>
                        <Content style={{ height: 100, marginLeft:10 }}>
                            <div>
                                <p>결과 변수 선택: </p>
                                <Select defaultValue={""} style={{ width: 120 }} onChange={(e)=> handleChange(e, 'effect')}>
                                    {effects.map(function(option) {
                                        return(<Option key={option}>{names[option]}</Option>)
                                    })}
                                </Select>
                            </div>
                        </Content>
                        <Content style={{ height: 400, marginLeft:10 }}>
                            <p>원인 변수 선택:</p>
                            <List
                                size="small"
                                bordered
                                style={{fontSize:12, marginRight:10 }}
                                dataSource={effected!=null ? Object.keys(resultJSON[topic][effected]) : []}
                                renderItem={cause => <List.Item key={cause} onClick = {() => handleCause(cause)}>
                                    <div>
                                         <div>
                                            {names[cause]}
                                            {resultJSON[topic][effected][cause]['corr_str']==='moderate' ? <span style={{position:'absolute', right:10, fontSize:5, verticalAlign:'middle', justifyContent:'center', alignItems:'center', backgroundColor:'#A1E475' }}>{resultJSON[topic][effected][cause]['corr_str']}</span> : <span style={{position:'absolute', right:10, fontSize:5, verticalAlign:'middle', justifyContent:'center', alignItems:'center', backgroundColor:'#DE7171'}}>{resultJSON[topic][effected][cause]['corr_str']}</span>} 
                                        </div>
                                    </div>
                                </List.Item>}
                            />
                        </Content>
                    </Sider>

                    <Layout style={{backgroundColor:'#fff'}}>
                        <div style={{backgroundColor:'#fff'}}>
                            {afterCauEff()}
                        </div>
                        <div>
                            {corrOrCauComp(corrOrcause)}
                        </div>
                    </Layout>
                </Layout>
            </Layout>

        </div>
    )
}

export default MainPage;
