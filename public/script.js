fetch('/data')
    .then(response => response.json())
    .then(data => {
        const svg = d3.select("svg");
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        // Define arrowhead marker
        svg.append("defs").append("marker")
            .attr("id", "end")
            .attr("viewBox", "0 -5 15 10")
            .attr("refX", 15)
            .attr("refY", 0)
            .attr("markerWidth", 12)
            .attr("markerHeight", 12)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L15,0L0,5")
            .style("fill", "black")
            .style("stroke", "black")
            .style("stroke-width", "1px");

        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id(d => d.id))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        // Links (edges) between nodes
        const link = svg.append("g").attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .attr("marker-end", "url(#end)");

        // Nodes (circles)
        const node = svg.append("g").attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r", 8)
            .style("fill", "#1f77b4")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .on("click", onNodeClick);

        // Node labels
        const label = svg.append("g").attr("class", "labels")
            .selectAll("text")
            .data(data.nodes)
            .enter().append("text")
            .attr("dy", -10)
            .text(d => d.id);

        // Handle node click to highlight connected elements
        function onNodeClick(event, clickedNode) {
            const connectedLinks = new Set();
            const connectedNodes = new Set();

            // Collect connected links and nodes
            data.links.forEach(l => {
                if (l.source === clickedNode || l.target === clickedNode) {
                    connectedLinks.add(l);
                    connectedNodes.add(l.source);
                    connectedNodes.add(l.target);
                }
            });

            // Highlight links
            link.style("stroke", d => connectedLinks.has(d) ? "red" : "#999");

            // Highlight nodes
            node.style("fill", d => connectedNodes.has(d) || d === clickedNode ? "orange" : "#1f77b4");
        }

        // Simulation tick update
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            label
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });

        // Drag functions
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
    });
