d3.csv("https://osm3214.github.io/InfoVis2022/W08/task/w08_task01.csv")
    .then(data => {
        data.forEach(d => { d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
            margin: { top: 10, right: 10, bottom: 20, left: 60 }
        };

        const barchart = new BarChart(config, data);
        barchart.update();

        d3.select('#reverse').on('click', d => { barchart.data.reverse(); barchart.update(); });
        d3.select('#descend').on('click', d => { barchart.data.sort((a, b) => b.value - a.value); barchart.update(); });
        d3.select('#ascend').on('click', d => { barchart.data.sort((a, b) => a.value - b.value); barchart.update(); });
    })
    .catch(error => {
        console.log(error);
    });
