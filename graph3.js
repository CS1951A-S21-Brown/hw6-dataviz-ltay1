let filenames3 = ["./data/graph3/action.csv", 
"./data/graph3/adventure.csv", 
"./data/graph3/fighting.csv", 
"./data/graph3/misc.csv",
"./data/graph3/platform.csv", 
"./data/graph3/puzzle.csv", 
"./data/graph3/racing.csv", 
"./data/graph3/role.csv",
"./data/graph3/shooter.csv",
"./data/graph3/simulation.csv",
"./data/graph3/sports.csv",
"./data/graph3/strategy.csv"];

let width3 = 900,
    height3 = 500;

let svg3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_1_width)     
    .attr("height", graph_1_height)     
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);  


let x3 = d3.scaleLinear()
.range([0, graph_1_width - margin.left - margin.right]);


let y3 = d3.scaleBand()
.range([0, graph_1_height - margin.top - margin.bottom])
.padding(0.1); 

let countRef3 = svg3.append("g");

let y_axis_label3 = svg3.append("g");

svg3.append("text")
.attr("transform", `translate(${(graph_1_width - margin.left-margin.right)/2},
${(graph_1_height-margin.top-margin.bottom) + 15})`)       
.style("text-anchor", "middle")
.text("Global Sales (Million)");

let y_axis_text3 = svg3.append("text")
.attr("transform", `translate(${(graph_1_width - margin.left) - 450},${185})`)       
.style("text-anchor", "middle");
y_axis_text3.text("Name of Publishers");

let title3 = svg3.append("text")
.attr("transform", `translate(${((graph_1_height - margin.left - margin.right)/2) + 130}, ${-15})`)       
.style("text-anchor", "middle")
.style("font-size", 15);

function setData3(index) {
d3.csv(filenames3[index]).then(function(data) {
    data = cleanData3(data,function(a,b) { 
        return parseInt(b.count3)-parseInt(a.count3) });

    x3.domain([0, d3.max(data, function(d) { return parseInt(d.Sales); })]) ;

    y3.domain(data.map(function(d) { return d.Publisher }));
    
    y_axis_label3.call(d3.axisLeft(y3).tickSize(0).tickPadding(10));
    let color = d3.scaleOrdinal()
    .domain(data.map(function(d) { return d.Publisher })) 
    .range(d3.quantize(d3.interpolateHcl("#fd5e53", "#008080"), NUM_EXAMPLES));

    let bars3 = svg3.selectAll("rect").data(data);

    bars3.enter()
        .append("rect")
        .merge(bars3)
        .transition()
        .duration(1000)
        .attr("fill",function(d) {return color(d.Sales)})
        .attr("x", x3(0))
        .attr("y", function(d) { return y3(d.Publisher);})                
        .attr("width", function(d) { return x3(parseFloat(d.Sales)); })
        .attr("height",  y3.bandwidth());       

    
    let counts3 = countRef3.selectAll("text").data(data);

   
    counts3.enter()
        .append("text")
        .merge(counts3)
        .transition()
        .duration(1000)
        .attr("x", function(d) {return x3(parseFloat(d.Sales)) + 10})       
        .attr("y", function(d) {return y3(d.Publisher) + 14})      
        .style("text-anchor", "start")
        .text(function(d) {return parseFloat(d.Sales)});

    function pickTitle2(id) { 
        if (id == 0)
            return "Top Publishers of Action Games";
        else if (id == 1)
            return "Top Publishers of Adventure Games";
        else if (id == 2)
            return "Top Publishers of Fighting Games";
        else if (id == 3)
            return "Top Publishers of Misc Games";
        else if (id == 4)
            return "Top Publishers of Platform Games";
        else if (id == 5)
            return "Top Publishers of Puzzle Games";
        else if (id == 6)
            return "Top Publishers of Racing Games";
        else if (id == 7)
            return "Top Publishers of Role-Playing Games";
        else if (id == 8)
            return "Top Publishers of Shooter Games";
        else if (id == 9)
            return "Top Publishers of Simulation Games";
        else if (id == 10)
            return "Top Publishers of Sports Games";
        else 
            return "Top Publishers of Strategy Games";
    }
    
    title3.text(pickTitle2(index));

    bars3.exit().remove();
    counts3.exit().remove();
});
}

function cleanData3(data, comparator) {
    return data.sort(comparator).slice(0,10)
}

setData3(0);
