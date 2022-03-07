// import * as d3 from "d3";

// const width = 250;
// const height = 250;
// const padding = 10; // min: 1

// const createNode = (level) => {
//     const numChildren = Math.ceil(Math.random() * 3) + 1;

//     if (level > 2 && (level >= 5 || numChildren <= 1)) {
//         return { value: Math.random() + 1 / level };
//     }
//     const children = [];
//     for (let i = 0; i < numChildren; i++) {
//         children.push(createNode(level + 1));
//     }
//     return { children };
// };

// const data = createNode(1);
// console.log("hey", data);

// const color = d3.scaleSequential([8, 0], d3.interpolateMagma);
// const pack = (data) =>
//     d3.pack().size([width, height]).padding(3)(
//         d3
//             .hierarchy(data)
//             .sum((d) => d.value)
//             .sort((a, b) => b.value - a.value)
//     );

// const svg = d3
//     .select("#data")
//     .append("svg")
//     .attr("viewBox", [
//         -padding,
//         -padding,
//         width + padding * 2,
//         height + padding * 2,
//     ]);
// const root = pack(data);

// const node = svg
//     .selectAll("g")
//     .data(
//         d3
//             .nest()
//             .key((d) => d.height)
//             .entries(root.descendants())
//     )
//     // .join("g")
//     .enter()
//     .append("g")
//     .selectAll("g")
//     .data((d) => d.values)
//     // .join("g")
//     .enter()
//     .append("g")
//     .attr("transform", (d) => `translate(${d.x},${d.y})`);

// const circle = node
//     .append("circle")
//     .attr("r", (d) => d.r)
//     .attr("stroke-width", (d) => 1 / (d.depth + 1))
//     .attr("fill", (d) => {
//         console.log("star", d);
//         return color(1);
//     });

// circle.on("click", (d) => {
//     svg.transition()
//         .duration(1000)
//         .attr("viewBox", [
//             d.x - d.r - padding,
//             d.y - d.r - padding,
//             d.r * 2 + padding * 2,
//             d.r * 2 + padding * 2,
//         ]);
// });

//E2

// set the dimensions and margins of the graph
var width = 450;
var height = 450;

// append the svg object to the body of the page
var svg = d3
    .select("#data")
    .append("svg")
    .attr("width", 450)
    .attr("height", 450);

// create dummy data -> just one element per circle
var data = [
    { name: "A" },
    { name: "B" },
    { name: "C" },
    { name: "D" },
    { name: "E" },
    { name: "F" },
    { name: "G" },
    { name: "H" },
];

// Initialize the circle: all located at the center of the svg area
var node = svg
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 25)
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .style("fill", "#69b3a2")
    .style("fill-opacity", 0.3)
    .attr("stroke", "#69a2b2")
    .style("stroke-width", 4);

// Features of the forces applied to the nodes:
var simulation = d3
    .forceSimulation()
    .force(
        "center",
        d3
            .forceCenter()
            .x(width / 2)
            .y(height / 2)
    ) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
    .force(
        "collide",
        d3.forceCollide().strength(0.01).radius(30).iterations(1)
    ); // Force that avoids circle overlapping

// Apply these forces to the nodes and update their positions.
// Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
simulation.nodes(data).on("tick", function (d) {
    node.attr("cx", function (d) {
        return d.x;
    }).attr("cy", function (d) {
        return d.y;
    });
});
