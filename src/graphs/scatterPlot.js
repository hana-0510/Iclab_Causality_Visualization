import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';

const ScatterPlot = ({ data, names, xaxis, yaxis, w, h, handlePoint, dataClicked, minF, maxF, minS, maxS }) => {

  const svgRef = useRef(null);
  
  useEffect(() =>{
    draw();
  },[data, xaxis, yaxis, dataClicked, minF, maxF, minS, maxS]);

  const draw = () =>{
    const svg = d3.select(svgRef.current);

    //이걸 해줘야 전에 click한 point가 원래 사이즈로 돌아감
    svg.selectAll("*").remove();

    const height = h;
    const width = w;
    const margin = { top: 15, right: 30, bottom: 60, left: 23 };

    //min max consider해서 filter로 range안에 있는 point만 남김
    const newinRange = data.filter(d => d[xaxis]>=minF).filter(d=>d[xaxis]<=maxF).filter(d=>d[yaxis]>=minS).filter(d=>d[yaxis]<=maxS);

    const graph = svg.append("g")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //dataclick하면 그 정보를 corrPage/causePage로 넘겨줌
    const handlePoints = (value) =>{
      handlePoint(value);
    }

    //x축
    const x = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d[xaxis]), d3.max(data, (d) => +d[xaxis])])
      .rangeRound([margin.left, width - margin.right]);

    graph.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(
      d3.axisBottom(x).tickValues(
          d3.ticks(...d3.extent(x.domain()), width / 40).filter((v) => x(v) !== undefined))
          .tickSizeOuter(0).ticks(null, "s")
    );

    //y축
    const y1 = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d[yaxis]), d3.max(data, (d) => +d[yaxis])])
      .rangeRound([height - margin.bottom, margin.top]);

    graph.append("g").attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y1).tickSizeOuter(0).ticks(null, "s"))
      .call((g) =>
        g
          .append("text")
          .attr("x", -margin.left)
          .attr("y", 10)
          .attr("fill", "currentColor")
            .attr("text-anchor", "start")
          .text(data.y1)
      );

    //x-axis label
    graph.append('text')
      .attr('x', width/2)
      .attr('y', height-17)
      .attr('text-anchor', 'middle')
      .style('font-family', 'sans-serif')
      .text(names[xaxis]);
    
    // Add y-axis label
    graph.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(-12,' + height/2 + ')rotate(-90)')
      .style('font-family', 'sans-serif')
      .text(names[yaxis]);
    
    //Add circle s
    graph.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d[xaxis]); } )
      .attr("cy", function (d) { return y1(d[yaxis]); } )
      // range안에 있으면 blue 없으면 red로 point색 변환
      .style("fill", function(d){
        if (newinRange.includes(d)) { return "steelblue"} 
        else { return  "red"}
        })  
      .on("click", function(d,i){ handlePoints(i); })
      // dataClicked point는 radius가 7
      .attr("r", function(d){
        if (d[xaxis] === dataClicked[xaxis] && d[yaxis]=== dataClicked[yaxis]) { return 7} 
        else { return  3} })  
      .style('pointer-events', 'all')
      .append('title')
      .text(function (d) { return ("time: "+d.timestamp +" "+ xaxis + ": " + d[xaxis] + '\n' + yaxis + ": " + d[yaxis] );  });
  }

  return (
    <svg width={w} height={h}>
      <g ref={svgRef}/>
    </svg>
  )
}

export default ScatterPlot;