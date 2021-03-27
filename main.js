const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};
const NUM_EXAMPLES = 10;
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;

let filenames = ["./data/video_games_2015.csv", "./data/video_games_2016.csv", "./data/video_games.csv",];

let width = 900,
    height = 500;

let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)     
    .attr("height", graph_1_height)     
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);  

let x = d3.scaleLinear()
.range([0, graph_1_width - margin.left - margin.right]);

let y = d3.scaleBand()
.range([0, graph_1_height - margin.top - margin.bottom])
.padding(0.1); 

let countRef = svg.append("g");
let y_axis_label = svg.append("g");

svg.append("text")
.attr("transform", `translate(${(graph_1_width - margin.left-margin.right)/2},
${(graph_1_height-margin.top-margin.bottom) + 15})`)       
.style("text-anchor", "middle")
.text("Global Sales (Million)");


let y_axis_text = svg.append("text")
.attr("transform", `translate(${(graph_1_width - margin.left) - 450},${185})`)       
.style("text-anchor", "middle");
y_axis_text.text("Name of Video Games");


let title = svg.append("text")
.attr("transform", `translate(${((graph_1_height - margin.left - margin.right)/2) + 130}, ${-15})`)  
.style("text-anchor", "middle")
.style("font-size", 15);

function setData(index, attr, button) {
d3.csv(filenames[index]).then(function(data) {
    data = cleanData(data,function(a,b) { 
        return parseInt(b.count)-parseInt(a.count) });

    x.domain([0, d3.max(data, function(d) { return parseInt(d.Global_Sales); })]) ;

    y.domain(data.map(function(d) { return d[attr] }));
   
    y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));
    let color = d3.scaleOrdinal()
    .domain(data.map(function(d) { return d.Names })) 
    .range(d3.quantize(d3.interpolateHcl("#87ceff", "#87ceff"),10));
    
    let bars = svg.selectAll("rect").data(data);

    bars.enter()
        .append("rect")
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("fill",function(d) {return color(d.Global_Sales)})
        .attr("x", x(0))
        .attr("y", function(d) { return y(d.Name);})                
        .attr("width", function(d) { return x(parseFloat(d.Global_Sales)); })
        .attr("height",  y.bandwidth());        

    let counts = countRef.selectAll("text").data(data);

    counts.enter()
        .append("text")
        .merge(counts)
        .transition()
        .duration(1000)
        .attr("x", function(d) {return x(parseFloat(d.Global_Sales))+10})       
        .attr("y", function(d) {return y(d.Name) + 14})       
        .style("text-anchor", "start")
        .text(function(d) {return parseFloat(d.Global_Sales)});

    function pickTitle(thisTitle) { 
        if (thisTitle == 2015)
            return "Most Popular Video Games in 2015";
        else if (thisTitle == 2016)
            return "Most Popular Video Games in 2016";
        else
            return "Most Popular Video Games of All Time";
    }
    title.text(pickTitle(button));
    bars.exit().remove();
    counts.exit().remove();
});
}

function cleanData(data, comparator) {
    return data.sort(comparator).slice(0,10)
}

setData(2, "Name", "1");
