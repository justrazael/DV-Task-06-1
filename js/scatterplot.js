const drawScatterplot = (data) => {
    // Set the dimensions and margins of the chart area
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`); // Responsive SVG

    // Create an inner chart group with margins
    innerChartS = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    xScaleS
        .domain([0, 8])  // Star ratings go from 0 to 8
        .range([0, innerWidth]);

    yScaleS
        .domain([0, 2600])  // Energy consumption up to 2600 kWh/year
        .range([innerHeight, 0]);

    colorScale
        .domain(data.map(d => d.screenTech))
        .range(d3.schemeCategory10); // Use D3's category 10 color scheme

    // Add X axis
    innerChartS
        .append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScaleS))
        .append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", 40)
        .attr("fill", "black")
        .text("Star Rating");

    // Add Y axis
    innerChartS
        .append("g")
        .call(d3.axisLeft(yScaleS))
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 4)
        .attr("y", -50)
        .attr("fill", "black")
        .text("Energy Consumption (kWh/year)");

    // Add circles
    innerChartS
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("r", 4)
        .style("fill", d => colorScale(d.screenTech))
        .style("opacity", 0.5);

    // Add legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - margin.right - 100}, ${margin.top})`);

    const technologies = [...new Set(data.map(d => d.screenTech))];

    
    technologies.forEach((tech, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);
        
        legendRow.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", colorScale(tech));
        
        legendRow.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .attr("text-anchor", "start")
            .style("font-size", "12px")
            .text(tech);
    });
    createTooltip();    // Create the tooltip first
    handleMouseEvents();
};