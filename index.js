var svg = d3.select("svg"),
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
    let subjects = {
        name: "SUBJECT",
        children: [
            {
                name: "SUBJECT 1 cluster",
                children: [
                    { name: "AgglomerativeCluster", size: 3938 },
                    { name: "CommunityStructure", size: 3812 },
                    { name: "HierarchicalCluster", size: 6714 },
                    { name: "MergeEdge", size: 743 },
                ],
            },
        ],
    };

    temp["children"] = [];
    col.map((val, colI) => {
        let newObj = {
            name: val,
        };
        let parentChildren = [];
        newObj["children"] = parentChildren;
        data.map((obj, idx) => {
            if (idx > 0) {
                //skip 'student col'

                let addMe = {
                    name: "Subject cluster",
                    children: [
                        { name: obj.student, size: 3938 },
                        { name: "CommunityStructure", size: 3812 },
                        { name: "HierarchicalCluster", size: 6714 },
                        { name: "MergeEdge", size: 743 },
                    ],
                };

                parentChildren.push(addMe);
            }
        });

        console.log("result", newObj);
        newJSON["children"].push(newObj);
    });

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
