import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';
import './lineChart.css'

const Diagram = ({names, caused, effected, confounder}) => {
  
  const svgRef = useRef(null);
  
  useEffect(() =>{
    draw()
  },[caused, effected, confounder]);

  const draw = () => {

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const height = 300;
    const width = 350;
    const boxSize = {h: 50, w: 150}

    const graph = svg.append("g")
    .attr("width", width)
    .attr("height", height)
    .attr('stroke', 'black')

    //rectangle on top
    graph.append('rect')
    .attr('x', width/2-(boxSize.w/2))
    .attr('y', 10)
    .attr('width', boxSize.w)
    .attr('height', boxSize.h)
    .attr('stroke', 'black')
    .attr('fill', '#ffffff');

    //rectangle on left
    graph.append('rect')
    .attr('x', 1)
    .attr('y', 200)
    .attr('width', boxSize.w)
    .attr('height', boxSize.h)
    .attr('stroke', 'black')
    .attr('fill', '#ffffff');

    //renctangle on right
    graph.append('rect')
    .attr('x', width-boxSize.w-1)
    .attr('y', 200)
    .attr('width', boxSize.w)
    .attr('height', boxSize.h)
    .attr('stroke', 'black')
    .attr('fill', '#ffffff');

    //make arrows in line
    graph.append('defs').append('marker')
    .attr('id', 'arrow1')
    .attr("markerUnits", "strokeWidth") 
    .attr("markerWidth", "16").attr("markerHeight", "16")// 너비와 높이를 정해주고, 
    .attr("viewBox", "0 0 16 16")//해당 개체가 어떻게 보여줄지 정하고, 
    .attr("refX", "8").attr("refY", "8") 
    .attr("orient", "auto")// 이걸 없애면 선의 방향에 맞춰서 그려지지 않습니다.
    .append('path')
    .attr('d', d3.line()([[0, 0], [0, 16], [16, 8]]));
    
    //line from top to left
    graph.append('line')
    .attr('x1', width/2)
    .attr('y1', 10+boxSize.h)
    .attr('x2', (boxSize.w/2))
    .attr('y2', 200-5)
    .attr("marker-end", "url(#arrow1)");

    //line from top to right
    graph.append('line')
    .attr('x1', width/2)
    .attr('y1', 10+boxSize.h)
    .attr('x2', width-(boxSize.w/2))
    .attr('y2', 200-5)
    .attr("marker-end", "url(#arrow1)");

    //line from left to right
    graph.append('line')
    .attr('x1', 1+boxSize.w)
    .attr('y1', 200+(boxSize.h/2))
    .attr('x2', width-8-(boxSize.w))
    .attr('y2', 200+(boxSize.h/2))
    .attr("marker-end", "url(#arrow1)");

    //text on top
    graph.append('text')
    .attr('x', width/2-(boxSize.w/2)+5)
    .attr('y', 10+(boxSize.h/2)+3)
    .style("font-size", 12)
    .text(names[confounder])

    //text on left
    graph.append('text')
    .attr('x',1+6)
    .attr('y', 200+(boxSize.h/2)+5)
    .style("font-size", 12)
    .text(names[caused])

    //text on right
    graph.append('text')
    .attr('x',width-1-boxSize.w+6)
    .attr('y', 200+(boxSize.h/2)+5)
    .style("font-size", 12)
    .text(names[effected])

  }

  return (
      <svg width={350} height={320}>
        <g ref={svgRef}/>
      </svg>
    )
    

}

export default Diagram;