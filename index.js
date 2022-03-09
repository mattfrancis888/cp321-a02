var myLink = document.getElementById("mylink");

var svg = d3.select("#chartq1"),
    margin = 20,
    diameter = +svg.attr("width"),
    g = svg
        .append("g")
        .attr(
            "transform",
            "translate(" + diameter / 2 + "," + diameter / 2 + ")"
        );

var color = d3
    .scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

var pack = d3
    .pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

d3.json("task1-copy.json", function (error, root) {
    // d3.json("flare.json", function (error, root) {
    if (error) throw error;
    console.log("root", root);
    let newJSON = {};
    newJSON["children"] = [];
    let temp = [...root];
    let data = temp[0][Object.keys(temp[0])[0]];
    let col = Object.keys(data[0]);
    console.log("Columns", col);

    temp["children"] = [];

    //OOPS:
    // col.map((val, colI) => {
    //     //maps through all columns
    //     if (colI > 0) {
    //         let newObj = {
    //             name: val,
    //         };
    //         let parentChildren = [];
    //         newObj["children"] = parentChildren;

    //         //in each column, if student belongs to that column....
    //         let addMe; //the object for inside parentChildren

    //         data.map((obj, idx) => {
    //             //maps through all students
    //             console.log("obj is", obj, idx == 0, val);
    //             let addMe = {
    //                 name: obj.student,
    //                 size: obj[val],
    //             };

    //             parentChildren.push(addMe);
    //         });

    //         console.log("parentCHildren", parentChildren);
    //         console.log("result", newObj);
    //         newJSON["children"].push(newObj);
    //     }
    // });

    //NEW
    data.map((val, colI) => {
        //maps through all students

        let newObj = {
            name: val.student,
        };
        let parentChildren = [];
        newObj["children"] = parentChildren;

        col.map((obj, idx) => {
            //maps through all columns

            console.log("obj is", obj);
            if (idx > 0) {
                let addMe = {
                    name: obj,
                    size: val[obj],
                };
                parentChildren.push(addMe);
            } else {
                //used for labeling inside circle
                let addMe = {
                    name: "Student subjects",
                    size: 0,
                };
                parentChildren.push(addMe);
            }
        });

        console.log("parentCHildren", parentChildren);
        console.log("result", newObj);
        newJSON["children"].push(newObj);
    });

    myLink.onclick = function () {
        svg.select("rect").remove();
    };

    console.log("newJSON - ", newJSON);

    root = d3
        .hierarchy(newJSON)
        // .hierarchy(temp["children"])
        .sum(function (d) {
            return d.size;
        })
        .sort(function (a, b) {
            return b.value - a.value;
        });

    var focus = root,
        nodes = pack(root).descendants(),
        view;

    var circle = g
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", function (d) {
            return d.parent
                ? d.children
                    ? "node"
                    : "node node--leaf"
                : "node node--root";
        })
        .style("fill", function (d) {
            return d.children ? color(d.depth) : null;
        })
        .on("click", function (d) {
            if (focus !== d) zoom(d), d3.event.stopPropagation();
        });

    var text = g
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "label")
        .style("fill-opacity", function (d) {
            return d.parent === root ? 1 : 0;
        })
        .style("display", function (d) {
            return d.parent === root ? "inline" : "none";
        })
        .text(function (d) {
            return d.data.name;
        });

    var node = g.selectAll("circle,text");

    svg.style("background", color(-1)).on("click", function () {
        zoom(root);
    });

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    function zoom(d) {
        var focus0 = focus;
        focus = d;

        var transition = d3
            .transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", function (d) {
                var i = d3.interpolateZoom(view, [
                    focus.x,
                    focus.y,
                    focus.r * 2 + margin,
                ]);
                return function (t) {
                    zoomTo(i(t));
                };
            });

        transition
            .selectAll("text")
            .filter(function (d) {
                return d.parent === focus || this.style.display === "inline";
            })
            .style("fill-opacity", function (d) {
                return d.parent === focus ? 1 : 0;
            })
            .on("start", function (d) {
                if (d.parent === focus) this.style.display = "inline";
            })
            .on("end", function (d) {
                if (d.parent !== focus) this.style.display = "none";
            });
    }

    function zoomTo(v) {
        var k = diameter / v[2];
        view = v;
        node.attr("transform", function (d) {
            return (
                "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"
            );
        });
        circle.attr("r", function (d) {
            return d.r * k;
        });
    }
});

//q2:
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
var nodes2 = d3.hierarchy(treeData, function (d) {
    return d.children;
});

// maps the node data to the tree layout
nodes2 = treemap(nodes2);

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin2
var svg2 = d3
        .select("body")
        .append("svg")
        .attr("width", width + margin2.left + margin2.right)
        .attr("height", height + margin2.top + margin2.bottom),
    g2 = svg2
        .append("g")
        .attr(
            "transform",
            "translate(" + margin2.left + "," + margin2.top + ")"
        );

// adds the links between the nodes2
var link = g2
    .selectAll(".link")
    .data(nodes2.descendants().slice(1))
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
var node2 = g2
    .selectAll(".node")
    .data(nodes2.descendants())
    .enter()
    .append("g")
    .attr("class", function (d) {
        return "node" + (d.children ? " node--internal" : " node--leaf");
    })
    .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
    });

// adds the circle to the node
node2
    .append("circle")
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
node2
    .append("text")
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
