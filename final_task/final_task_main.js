let input_data,
    barchart_all,
    barchart_prefecture,
    current_date = -1;

d3.csv("https://osm3214.github.io/InfoVis2022/final_task/final_task.csv")
    .then(data => {
        input_data = data
        input_data.forEach(d => { d.ALL = +d.ALL; });

        barchart_all = new BarChart({
            parent: '#drawing_region_all',
            width: 800,
            height: 400,
            margin: { top: 50, right: 50, bottom: 100, left: 60 }
        }, input_data);

        barchart_prefecture = new BarChart2({
            parent: '#drawing_region_prefecture',
            width: 800,
            height: 400,
            margin: { top: 50, right: 50, bottom: 100, left: 60 },
        }, input_data)
        barchart_all.update();
        barchart_prefecture.update();
    })
    .catch(error => {
        console.log(error);
    });

function Update_prefecture() {
    barchart_prefecture.update();
}
