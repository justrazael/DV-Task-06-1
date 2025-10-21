function drawHistogram(data) {
    // Create SVG container
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create the inner chart group and translate it to account for margins
    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Generate the bins
    const bins = binGenerator(data);

    // Set up the scales with domains
    xScale
        .domain([0, 1800]) 
        .range([0, innerWidth]);

    yScale
        .domain([0, d3.max(bins, d => d.length)])
        .range([innerHeight, 0]);

    // Create and add the bars
    chart.selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor);

    // Add x-axis
    const xAxis = d3.axisBottom(xScale);
    chart.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(xAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", 40)
        .attr("fill", "black")
        .text("Energy Consumption (watts)");

    // Add y-axis
    const yAxis = d3.axisLeft(yScale);
    chart.append("g")
        .call(yAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -40)
        .attr("fill", "black")
        .text("Number of TVs");
}

// Function to update the histogram when filters are applied
function updateHistogram(filteredData) {
    // Remove existing SVG
    d3.select("#histogram svg").remove();
    // Redraw with filtered data
    drawHistogram(filteredData);
}