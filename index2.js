var treeData = {
    name: "Top Level",
    value: 10,
    type: "black",
    level: "red",
    children: [
        {
            name: "Level 2: A",
            value: 15,
            type: "grey",
            level: "red",
            children: [
                {
                    name: "Son of A",
                    value: 5,
                    type: "steelblue",
                    level: "orange",
                },
                {
                    name: "Daughter of A",
                    value: 8,
                    type: "steelblue",
                    level: "red",
                },
            ],
        },
        {
            name: "Level 2: B",
            value: 10,
            type: "grey",
            level: "green",
        },
    ],
};

// set the dimensions and margin2s of the diagram
var margin2 = { top: 20, right: 90, bottom: 30, left: 90 },
    width = 660 - margin2.left - margin2.right,
    height = 500 - margin2.top - margin2.bottom;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

//  assigns the data to a hierarchy using parent-child relationships
var nodes = d3.hierarchy(treeData, function (d) {
    return d.children;
});

// maps the node data to the tree layout
nodes = treemap(nodes);

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin2
var svg2 = d3
        .select("body")
        .append("svg")
        .attr("width", width + margin2.left + margin2.right)
        .attr("height", height + margin2.top + margin2.bottom),
    g = svg2
        .append("g")
        .attr(
            "transform",
            "translate(" + margin2.left + "," + margin2.top + ")"
        );

// adds the links between the nodes
var link = g
    .selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter()
    .append("path")
    .attr("class", "link")
    .style("stroke", function (d) {
        return d.data.level;
    })
    .attr("d", function (d) {
        return (
            "M" +
            d.y +
            "," +
            d.x +
            "C" +
            (d.y + d.parent.y) / 2 +
            "," +
            d.x +
            " " +
            (d.y + d.parent.y) / 2 +
            "," +
            d.parent.x +
            " " +
            d.parent.y +
            "," +
            d.parent.x
        );
    });

// adds each node as a group
var node = g
    .selectAll(".node")
    .data(nodes.descendants())
    .enter()
    .append("g")
    .attr("class", function (d) {
        return "node" + (d.children ? " node--internal" : " node--leaf");
    })
    .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
    });

// adds the circle to the node
node.append("circle")
    .attr("r", function (d) {
        return d.data.value;
    })
    .style("stroke", function (d) {
        return d.data.type;
    })
    .style("fill", function (d) {
        return d.data.level;
    });

// adds the text to the node
node.append("text")
    .attr("dy", ".35em")
    .attr("x", function (d) {
        return d.children ? (d.data.value + 4) * -1 : d.data.value + 4;
    })
    .style("text-anchor", function (d) {
        return d.children ? "end" : "start";
    })
    .text(function (d) {
        return d.data.name;
    });
