d3.csv("https://osm3214.github.io/InfoVis2022/final_task/final_task.csv")
    .then(data => {
        data.forEach(d => { d.ALL = +d.ALL; });

        var config = {
            parent: '#drawing_region',
            width: 1056,
            height: 528,
            margin: { top: 50, right: 50, bottom: 100, left: 60 }
        };

        const barchart = new BarChart(config, data);
        barchart.update();
    })
    .catch(error => {
        console.log(error);
    });
