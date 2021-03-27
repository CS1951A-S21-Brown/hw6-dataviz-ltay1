let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;

let filenames2 = ["./data/NA.csv", "./data/EU.csv", "./data/JP.csv","./data/OT.csv"];

let width2 = 220,
    height2 = 220;

var svg2 = d3.select("#graph2") 
    .append("svg")
    .attr("width", graph_2_width)     
    .attr("height", graph_2_height)     
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);  

var g = svg2.append("g").attr("transform", "translate(" + 100 + "," + 90 + ")");

var radius = Math.min(width2, height2) / 2;
var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);
var pie = d3.pie().value(function(d) { return d.Sales; });
var arc  = d3.arc().outerRadius(radius).innerRadius(0);
var label = d3.arc().outerRadius(radius).innerRadius(radius + 30); 

var path = d3.arc()
         .outerRadius(radius - 20)
         .innerRadius(0);

let title2 = svg2.append("text")
    .attr("transform", "translate("+ 100 +"," + -25 +")")
    .style("text-anchor", "middle")
    .style("font-size", 15);

function cleanData2(data, comparator) {
    return data.sort(comparator)
    }

let tooltip2 = d3.select("#graph2")  
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function setData2(checkIndex) {
    console.log(checkIndex);
    d3.csv(filenames2[checkIndex]).then(function(data) {    
        
        data = cleanData2(data,function(a,b) { 
            return parseInt(b.count)-parseInt(a.count) 
        });
        console.log(data);

        var arcs = g.selectAll(".arc")
            .data(pie(data))
            .attr("id", "circleBasicTooltip")
            
        arcs.enter()
            .append('path')
            .merge(arcs)
            .transition()
            .duration(1000)
            .attr('d', d3.arc().innerRadius(60).outerRadius(radius))
            .attr('fill', function(d){ return color(d.data.Genre); })
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 1)
        
        let mouseover = function(d) {
            console.log(d.data.Genre);
            console.log(d.data.Sales);
        
            let color_span = `<span style="color: ${color(d.data.Genre)};">`;
            let html = `
                    Genre: ${color_span}${d.data.Genre}</span><br/>
                    Sales: ${color_span}${d.data.Sales + "m"}</span>`;       
    

            tooltip2.html(html)
                .style("left", `${180}px`)
                .style("top", `${200}px`)
                .style('display', 'inline-block')
        	    .style('position', 'absolute')
                .style("box-shadows", `2px 2px 5px ${color(d.data.Genre)}`)
                .transition()
                .duration(200)
                .style("opacity", 1)
        };
    
        let mouseout = function(d) {
            console.log("out");
            tooltip2.transition()
                .duration(200)
                .style("opacity", 0);
        };    
    
        d3.selectAll("path")
            .on("mouseover", mouseover) 
            .on("mouseout", mouseout);
        
        
        var tooltip = d3.select("#graph2")
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .text("TOOL TIP PLS WORK");
    
        svg2.append("g")
            .attr("transform", "translate(" + -150 + "," + -120 + ")")
    
        function pickTitle(thisTitle) { 
            if (thisTitle == 0)
                return "Most Popular Genre in North America";
            else if (thisTitle == 1)
                return "Most Popular Genre in Europe";
            else if (thisTitle == 2)
                return "Most Popular Genre in Japan";
            else 
                return "Most Popular Genre in Other Regions";
        }
        title2.text(pickTitle(checkIndex));
        arcs.exit().remove();
    })   
}
setData2(0);
