import {
    select,
    csv,
    scaleLinear,
    max,
    scaleBand,
    axisLeft,
    axisBottom,
    extent,
    format,
} from "d3";

//Q1:
var myLink = document.getElementById("mylink");
var myLink2 = document.getElementById("mylink2");
console.log("hi", myLink);
myLink.onclick = function () {
    svg.select("rect").remove();
    svg.select("rect").remove();
    svg.select("rect").remove();
};

const titleText = "Marks - Lowest to highest";
const xAxisLabelText = "Marks";
const yAxisLabel = "Student ID";
//const svg = select('svg');
const svg = select("#chartq1");

const width = +svg.attr("width");
const height = +svg.attr("height");

const render = (data) => {
    var w = 640,
        h = 480;

    var data = {
        name: "root",
        children: [
            { name: "1", size: 100 },
            { name: "2", size: 85 },
            { name: "3", size: 70 },
            { name: "4", size: 55 },
            { name: "5", size: 40 },
            { name: "6", size: 25 },
            { name: "7", size: 10 },
        ],
    };

    var canvas = d3
        .select("#canvas")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h);

    var nodes = d3.layout
        .pack()
        .value(function (d) {
            return d.size;
        })
        .size([w, h])
        .nodes(data);

    // Get rid of root node
    nodes.shift();

    canvas
        .selectAll("circles")
        .data(nodes)
        .enter()
        .append("svg:circle")
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", function (d) {
            return d.r;
        })
        .attr("fill", "white")
        .attr("stroke", "grey");
};

// csv('data.csv').then(data => {
//   //parses strings into numbers with foreach
//   data.forEach(d => {
//     d.population = +d.population * 1000; //csv population is now represented in thousands
//   });
//   render(data);
// });

csv("student.csv").then((data) => {
    //parses strings into numbers with foreach
    data.forEach((d) => {
        d.population = +d.population; //parse from str num
    });
    render(data);
});

//Q2:

const svg2 = select("#chartq2");

const width2 = +svg2.attr("width");
const height2 = +svg2.attr("height");

const render2 = (data) => {};

// csv('https://vizhub.com/curran/datasets/auto-mpg.csv')
//   .then(data => {
//     data.forEach(d => {
//       d.mpg = +d.mpg;
//       d.cylinders = +d.cylinders;
//       d.displacement = +d.displacement;
//       d.horsepower = +d.horsepower;
//       d.weight = +d.weight;
//       d.acceleration = +d.acceleration;
//       d.year = +d.year;
//     });
//     render2(data);
//   });

csv("kag.csv").then((data) => {
    data.forEach((d) => {
        d.price = +d.price;
        d["average rating"] = +d["average rating"];
        console.log("foreach", test);
        let test = d["course duration"].split(" ")[0];
        console.log("foreach", test);
        d["course duration"] = +test;

        // d.duration = +d.duration;
    });
    render2(data);
});
