import React, { useEffect } from "react";
import * as d3 from "d3";

function NetworkChart({ data }) {
  useEffect(() => {
    const width = 1200;
    const height = 800;

    console.log(data);

    //Initializing chart
    const chart = d3
      .select(".chart")
      .attr("width", width)
      .attr("height", height);
    //.attr("style", "outline: thin solid red;");

    //Creating tooltip
    const tooltip = d3
      .select(".container")
      .append("div")
      .attr("class", "tooltip")
      .html("Tooltip");

    //Initializing force simulation
    const simulation = d3
      .forceSimulation()
      .force("link", d3.forceLink())
      .force("charge", d3.forceManyBody().strength(-100))
      .force("collide", d3.forceCollide())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("y", d3.forceY(0))
      .force("x", d3.forceX(0));

    //Drag functions
    const dragStart = (e, d) => {
      if (!e.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const drag = (e, d) => {
      d.fx = e.x;
      d.fy = e.y;
    };

    const dragEnd = (e, d) => {
      if (!e.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    //Creating links
    const link = chart
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line");

    //Creating nodes
    const node = d3
      .select(".chartContainer")
      .selectAll("div")
      .data(data.nodes)
      .enter()
      .append("div")
      .attr("class", (d) => {
        return "flag flag-" + d.name;
      })
      .text(function (d) {
        return d.name;
      })
      .call(
        d3.drag().on("start", dragStart).on("drag", drag).on("end", dragEnd)
      )
      .on("mouseover", (e, d) => {
        tooltip
          .html(d.name)
          .style("left", e.pageX + 5 + "px")
          .style("top", e.pageY + 5 + "px")
          .style("opacity", 0.8);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0).style("left", "0px").style("top", "0px");
      });

    //Setting location when ticked
    const ticked = () => {
      link
        .attr("x1", (d) => {
          return d.source.x;
        })
        .attr("y1", (d) => {
          return d.source.y;
        })
        .attr("x2", (d) => {
          return d.target.x;
        })
        .attr("y2", (d) => {
          return d.target.y;
        });

      node.attr("style", (d) => {
        return "left: " + d.x + "px; top: " + (d.y + 72) + "px";
      });
    };

    //Starting simulation
    simulation.nodes(data.nodes).on("tick", ticked);

    simulation.force("link").links(data.links);
  }, []);

  return (
    <div className="container">
      <h1>Book 1 Network</h1>
      <div className="chartContainer">
        <svg className="chart"></svg>
      </div>
    </div>
  );
}

export default NetworkChart;
