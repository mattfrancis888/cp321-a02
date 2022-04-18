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
    //.domain([-1, 5])
    .domain([-1, 5])
    // .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .range(["hsl(152,80%,80%)", "red"])
    // .range(["white", "green"])
    .interpolate(d3.interpolateHcl);

var pack = d3
    .pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

d3.json("task1.json", function (error, root) {
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
        // .style("fill", function (d) {
        //     return d.children ? color(d.depth) : null;
        // })
        .style("fill", function (d) {
            console.log("d is", d);
            return d.children ? color(d.depth) : color(d.data.size);
        })

        // .style("fill", function (d) {
        //     console.log("d is", d);
        //     return color(d.data.size);
        // })
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

//q2 (taken from textbook)

d3.json("./task2.json", viz);

function viz(data) {
    console.log(data);
    var depthScale = d3.scaleOrdinal().range(["#402D54", "#D18975", "#8FD175"]);

    var nestedTweets = d3
        .nest()
        .key((d) => d.Folder + "( " + d.filename.split(".").pop() + " )")
        .entries(data.root);
    //group by a certain property defined in key
    //like:
    //d3.nest()
    // .key(function (d) {
    //     return d.manufactured;
    // })
    var packableData = { id: "All Data", values: nestedTweets };

    var root = d3.hierarchy(packableData, (d) => d.values).sum((d) => d.size);
    console.log("hiearchy root", root); //creates hiearchy based on data, need sum because it will
    // returns the desired value for each individual node

    //set up a layout for the treemap
    var treemapLayout = d3
        .treemap()
        .size([500, 500])
        .padding((d) => d.depth * 5 + 5);

    treemapLayout(root);

    d3.select("#chartq2")
        .selectAll("rect")
        .data(root.descendants())
        .enter()
        .append("rect")
        .attr("x", (d) => d.x0)
        .attr("y", (d) => d.y0)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .style("fill", (d) => depthScale(d.depth))
        .style("stroke", "black");

    d3.select("#chartq2")
        .selectAll("text")
        .data(
            root.descendants().filter(function (d) {
                return d.depth == 1;
            })
        )

        .enter()
        .append("text")
        .attr("x", function (d) {
            return d.x0;
        })
        .attr("y", function (d) {
            return d.y0 + 15;
        })
        .text((d) => d.data.key)
        .attr("font-size", "15px")
        .attr("fill", "black");
}
var color2 = d3.scaleOrdinal().range(["#402D54", "#D18975", "#8FD175"]);
