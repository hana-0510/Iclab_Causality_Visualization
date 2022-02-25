
import React, { useState } from 'react';
import { Layout, Slider, Table} from 'antd';
import ScatterPlot from './graphs/scatterPlot';
import LineChart from './graphs/lineChart';

const { Sider, Content } = Layout;

function CorrPage(props) {

    const {data, names, name, caused, effected, amountCorr, pValue, minX, maxX, minY, maxY} = props;
    const [dataClicked, setDataClicked] = useState({});

    const [minF, setMinF] = useState(minX);
    const [maxF, setMaxF] = useState(minX <0 ? 0 : maxX/2);
    const [minS, setMinS] = useState(minY);
    const [maxS, setMaxS] = useState(minY <0 ? 0 : maxY/2);

    const posNeg = (key) =>{
        if(key>0) { return(<span>증가(▲)</span>) } 
        else { return(<span>감소(▼)</span>) }
    }
    const pValueF = (key) =>{
        if(key<0.05){ return(<span className='highlight'>{}&#60; 0.05 </span>)} 
        else{ return(<span className='highlight'> &#62; 0.05</span>)}
    }

    //data point 누르면 반응
    const handlePoint = (value) =>{
        setDataClicked(value);
    }

    //slider 바꾸면 min max 값을 바꿔서 scatterplot에서 점수 색 변하는데 도움을 줌
    const handleSlider = (value, fs) =>{
        console.log("maxF: ",maxF);
        console.log("minF: ",maxX);
        if(fs === "F"){
            setMinF(value[0]);
            setMaxF(value[1]);
        } else{
            setMinS(value[0]);
            setMaxS(value[1]);
        }
    }

    return(
        <Layout style={{backgroundColor:'#fff'}}>
            <Layout style={{backgroundColor:'#fff'}}>
                {/* 젤 위에 있는 summary */}
                <Content style={{marginLeft:10}}>
                    <h3>{name}님은 {names[caused]} 이(가) 증가(▲) 할 때, {names[effected]}가 {posNeg(amountCorr)}하는 경향이 있습니다.</h3>
                    <p style={{ fontSize: 9 }}>[참고] 아래 그래프는 원인과 결과의 상관관계를 나타내며, 상관관계의 존재가 반드시 인과관계의 성립을 의미하는 것은 아닙니다</p>
                </Content>
                {/* slider 2개 */}
                <Layout  style={{backgroundColor:'#fff', marginLeft:10}}>
                    <Sider width={250} style={{backgroundColor:'#fff', marginLeft:10}}>
                        <p>{names[caused]} 레벨</p>
                        <Slider range defaultValue={[minX, minX <0 ? 0 : maxX/2]} min={minX} max={maxX} onChange={(e)=> handleSlider(e, "F")}/>
                    </Sider>
                    <Sider width={250} style={{backgroundColor:'#fff', marginLeft:10}}>
                        <p>{names[effected]} 레벨</p>
                        <Slider range defaultValue={[minY, minY <0 ? 0 : maxY/2]} min={minY} max={maxY} onChange={(e)=> handleSlider(e, "S")} />
                    </Sider>
                </Layout>   
            </Layout>
            <Layout style={{backgroundColor:'#fff'}}>
                {/* scatterplot */}
                <Sider width={500} style={{backgroundColor:'#fff', marginLeft:10}}>
                    <Content>
                        <ScatterPlot data={data} names={names} xaxis={caused} yaxis={effected} w={510} h={490}  handlePoint={handlePoint} dataClicked={dataClicked} minF={minF} maxF={maxF} minS={minS} maxS={maxS} />
                        <p style={{ textAlign: 'center', marginTop:25, fontSize:16 }}>상관계수: {amountCorr}, 유의확률(p값): {pValueF(pValue)}</p>
                    </Content>
                </Sider>
                {/* linechart */}
                <Layout style={{backgroundColor:'#fff', marginLeft:25}}>
                    <Content style={{ marginLeft:25}}>
                        <LineChart data={data} names={names} y1axis={caused} y2axis={effected} handlePoint={handlePoint} dataClicked={dataClicked}/>
                        <Table style={{marginTop:5, marginLeft:0, marginBottom:5, width: 600 }} pagination={false} columns={[{title: names['timestamp'], dataIndex:'timestamp', key: 'timestamp'}, {title: names[caused], dataIndex:caused, key: caused}, {title: names[effected], dataIndex: effected, key: effected}]} dataSource={[dataClicked]} />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    )
}

export default CorrPage;
