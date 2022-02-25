import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';
import './lineChart.css'

const LineChart = ({ data, names, y1axis, y2axis, handlePoint, dataClicked }) => {
  
  const svgRef = useRef(null);
  
  useEffect(() =>{
    draw()
  },[y1axis, y2axis, dataClicked]);

  const draw = async() => {

    // dataclicked point to corrPage/causePage
    const handlePoints = (value) =>{
      handlePoint(value);
    };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const height = 490;
    const width = 490;
    const margin = { top: 15, right: 30, bottom: 60, left: 30 };

    const graph = svg.append("g")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //날짜 데이터를 제대로 사용하기 위해 parse해줌 이 parse된 data를 xaxis에 사용
    var parseTime = d3.timeParse("%Y/%m/%d %H:%M");
    data.map(function(d){
      d["timeparse"] = parseTime(d.timestamp);
    });

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.timeparse; }))
    .range([margin.left, width - margin.right]);

    graph.append("g").attr("transform", `translate(0,${height - margin.bottom})`)
      .call( d3.axisBottom(x).tickSizeOuter(0)//끝에 틱 없애줌
      .tickFormat(d3.timeFormat("%m/%d")) 
      )
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    const y1 = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return +d[y1axis]; }), d3.max(data, function(d) { return +d[y1axis]; })])
    .rangeRound([height - margin.bottom, margin.top]);

    graph.append("g").attr("transform", `translate(${margin.left},0)`)
        .style("color", "steelblue")
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

    //Add y-axis on right
    const y2 = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return +d[y2axis]; }), d3.max(data, function(d) { return +d[y2axis]; })])
    .rangeRound([height - margin.bottom, margin.top]);

    graph.append("g").attr("transform", `translate(${width - margin.right},0)`)
    .style("color", "red")	
    .call(d3.axisRight(y2).tickSizeOuter(0).ticks(null, "s"))
    .call((g) =>
        g
        .append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(data[y2axis])
    );

    //add path on y1axis
    graph.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
    .x(function(d) { return x(d.timeparse) })
    .y(function(d) { return y1(d[y1axis]) })
    )

    //path on y2axis
    graph.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
    .x(function(d) { return x(d.timeparse) })
    .y(function(d) { return y2(d[y2axis]) })
    )

    // On Click first path
    graph.selectAll('circle_samp_1')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.timeparse))
    .attr('cy', (d) => y1(d[y1axis]))
    .attr('r', 6)
    .attr('fill', 'black')
    //dataclicked는 radius가 6인 circle을 보여줌
    .style('opacity', function(d){
      if ( d.timestamp === dataClicked.timestamp && d[y1axis]=== dataClicked[y1axis] && d[y2axis]=== dataClicked[y2axis]) { return 1} 
      else {return 0} })
    .style('pointer-events', 'all')
    .append('title')
    .text(function (d) { return ("timestamp: " + d.timestamp + '\n' + y1axis + ": " + d[y1axis]+ '\n' + y2axis + ": " + d[y2axis] );  });

    //On Hover first path -> lineChart.css에 on hover하면 circle을 보여주도록 되어있음
    graph.selectAll('circle_samp_1')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.timeparse))
    .attr('cy', (d) => y1(d[y1axis]))
    .attr('r', 4)
    .attr('fill', 'black')
    .attr('class', 'points')
    .on("click", (d, i) => { handlePoints(i);})
    .style('pointer-events', 'all')
    .append('title')
    .text(function (d) { return (names["timestamp"] + ": " + d.timestamp + '\n' + names[y1axis] + ": " + d[y1axis]+ '\n' + names[y2axis] + ": " + d[y2axis] );  });

    // On Click second path
    graph.selectAll('circle_samp_2')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.timeparse))
    .attr('cy', (d) => y2(d[y2axis]))
    .attr('r', 6)
    .attr('fill', 'black')
    .style('opacity', function(d){
      if ( d.timestamp === dataClicked.timestamp && d[y1axis]=== dataClicked[y1axis] && d[y2axis]=== dataClicked[y2axis]) { return 1} 
        else {return 0}
    })
    .style('pointer-events', 'all')
    .append('title')
    .text(function (d) { return (names["timestamp"] + ": " + d.timestamp + '\n' + names[y1axis] + ": " + d[y1axis]+ '\n' + names[y2axis] + ": " + d[y2axis] );  });

    //On Hover second path
    graph.selectAll('circle_samp_2')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.timeparse))
    .attr('cy', (d) => y2(d[y2axis]))
    .attr('r', 4)
    .attr('fill', 'black')
    .attr('class', 'points')
    .on("click", (d, i) => { handlePoints(i);})
    .style('pointer-events', 'all')
    .append('title')
    .text(function (d) { return (names["timestamp"] + ": " + d.timestamp + '\n' + names[y1axis] + ": " + d[y1axis]+ '\n' + names[y2axis] + ": " + d[y2axis] );  });

    //Add x-axis label
    graph.append('text')
      .attr('x', width/2)
      .attr('y', height-17)
      .attr('text-anchor', 'middle')
      .style('font-family', 'sans-serif')
      .text(names['timestamp']);
    // Add y1-axis label
    graph.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(-10,' + height/2 + ')rotate(-90)')
      .style('font-family', 'sans-serif')
      .text(names[y1axis]);
    // Add y2-axis label
    graph.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(+500,' + height/2 + ')rotate(90)')
    .style('font-family', 'sans-serif')
    .text(names[y2axis]);
    
  }

  return (
      <svg width={550} height={490}>
        <g ref={svgRef}/>
      </svg>
    )
    

}

export default LineChart;