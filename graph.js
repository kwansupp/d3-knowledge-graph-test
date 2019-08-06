d3.json("data.json").then(d => showData(d));

function showData(data) {
    // setup canvas
    let height = 400
    let width = 400

    let svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "canvas")

    // initialize elements from data
    createElements(data);

    // apply force simulation
    let simulation = d3.forceSimulation(data.nodes)   // apply algorithm to data.nodes
        .force("link", d3.forceLink()                 // link the nodes
            .id(function(d) { return d.id; }))         // node id
            // .links(data.links))                       // links
        .force("charge", d3.forceManyBody())          // .strength(-400) repulsion between nodes
        .force("center", d3.forceCenter(width/2, height/2)) // attract nodes to center of area

    // update node and link locations
    simulation.nodes(data.nodes)
        .on("tick", updateElements);
    simulation.force("link").links(data.links)

    
    function createElements(data) {
        console.log("create elements")

        let body = d3.select(".canvas")

        let links = body.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
                .attr("stroke", "gray")

        let nodes = body.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("g")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("click", nodeToggle);

        nodes.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "-0.8em")
            .attr("class", "label")
            .attr("fill", "gray")
            .attr("font-size", 14)
            .text(function(d) { return d.id });

        nodes.append("title")
            .text(function(d) { return d.id });

        nodes.append("circle")
            .attr("class", "node")
            .attr("r", 5)
            .attr("fill", "black")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
            // .on("click", function(d) {
            //     nodeToggle(d);
            // });

        

    }

    function updateElements() {
        d3.select(".nodes")
            .selectAll("g")
            // .attr("cx", d => d.x)
            // .attr("cy", d => d.y)
            .attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
            })
        
        d3.select(".links")
            .selectAll("line")
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)

        // d3.selectAll(".label")
        //     .attr("x", d => d.x + 10)
        //     .attr("y", d => d.y + 5)
    }


    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        // console.log("started")
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        // console.log("dragging")
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        // console.log("ended")
        // simulation.force("center", d3.forceCenter());
    }


}

function nodeToggle(d) {
    if (d3.select(this).select("circle").attr("class") === "expand") {
        // revert to node
        d3.select(this).select("circle")
            .attr("class", "node")

    } else {
        // add expand class
        d3.select(this).select("circle")
            .attr("class", "expand")
            // .transition()
            // .duration(1000)
            // .attr("fill", "gray")
            // .attr("r", 20);
    }
    
}

function mouseover() {
    d3.select(this).select("circle").transition()
      .duration(250)
      .attr('r', 7);
      // .attr("fill", "#DA4567");
    d3.select(this).select("text").transition()
      .duration(250)
      .attr('font-size', 20);
  }

  function mouseout() {
    // console.log(d3.select(this).select("circle").attr("class"));
    if (d3.select(this).select("circle").attr("class") === "expand") {
        d3.select(this).select("circle")
            .attr("r", 5)
            .attr("fill", "steelblue");
    } else {
        d3.select(this).select("circle").transition()
            .duration(250)
            .attr('r', 5)
            .attr("fill", "black");
        d3.select(this).select("text").transition()
            .duration(250)
            .attr('font-size', 14);
    }
    
  }
