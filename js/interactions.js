const populateFilters = (data) => {
    d3.select("#filters_screen")
        .selectAll(".filter")
        .data(filters_screen)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (e, d) => {
            console.log("Clicked filter:", e);
            console.log("Clicked filter data:", d);

            // Update isActive state for all filters
            filters_screen.forEach(filter => {
                filter.isActive = d.id === filter.id ? !filter.isActive : false;
            });

            // Update button classes based on isActive
            d3.selectAll("#filters_screen .filter")
                .classed("active", filter => filter.isActive);

            // Pass the id and data to the update function
            updateHistogram(d.id, data);
        });
};

const updateHistogram = (filterId, data, filterType = "screenTech") => {
    // 1. Filter the data based on the filterId and filterType
    let updatedData = data;
    if (filterId !== "all") {
        if (filterType === "screenTech") {
            updatedData = data.filter(tv => tv.screenTech === filterId);
        } else if (filterType === "screenSize") {
            updatedData = data.filter(tv => String(tv.screenSize) === filterId);
        }
    }

    // 2. Generate new bins
    const updatedBins = binGenerator(updatedData);

    // 3. Update the bars with a transition
    d3.selectAll("#histogram rect")
        .data(updatedBins)
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length));
};

const populateSizeFilters = (data) => {
    d3.select("#filters_screen_size")
        .selectAll(".size-filter")
        .data(filters_screen_size)
        .join("button")
        .attr("class", d => `size-filter${d.isActive ? " active" : ""}`)
        .text(d => d.label)
        .on("click", (e, d) => {
            // Update isActive state for all size filters
            filters_screen_size.forEach(filter => {
                filter.isActive = d.id === filter.id;
            });

            // Update button classes based on isActive
            d3.selectAll("#filters_screen_size .size-filter")
                .classed("active", filter => filter.isActive);

            // Use updateHistogram with filterType "screenSize"
            updateHistogram(d.id, data, "screenSize");
        });
};

// Add this at the top of interactions.js with your other functions
const createTooltip = () => {
    const tooltip = innerChartS.append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);

    tooltip.append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("fill", barColor)
        .attr("fill-opacity", 0.75);

    // Create separate text elements for each line
    const textGroup = tooltip.append("g")
        .attr("fill", "white")
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "hanging");

    ["size", "energy", "tech", "star"].forEach((field, i) => {
        textGroup.append("text")
            .attr("x", 10)
            .attr("y", 8 + i * 20)
            .attr("class", `tooltip-${field}`);
    });
};

const handleMouseEvents = () => {
    innerChartS.selectAll("circle")
        .on("mouseenter", (e, d) => {
            const tooltip = d3.select(".tooltip");
            
            // Update all text fields
            tooltip.select(".tooltip-size").text(`Size: ${d.screenSize}"`);

            // Get position
            const cx = parseFloat(e.target.getAttribute("cx"));
            const cy = parseFloat(e.target.getAttribute("cy"));

            // Check boundaries and adjust position if needed
            const x = cx + tooltipWidth > innerWidth ? 
                cx - tooltipWidth - 10 : 
                cx + 10;
            
            const y = cy - tooltipHeight < 0 ? 
                cy + 10 : 
                cy - tooltipHeight - 10;

            // Move and show tooltip
            tooltip
                .attr("transform", `translate(${x},${y})`)
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", () => {
            d3.select(".tooltip")
                .transition()
                .duration(200)
                .style("opacity", 0);
        });
};