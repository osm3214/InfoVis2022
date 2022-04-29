// d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W04/data.csv")
d3.csv("https://osm3214.github.io/InfoVis2022/W04/task/w04_task01.csv")
    .then(data => {
        data.forEach(d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: { top: 10, right: 10, bottom: 20, left: 30 },
            inner_margin: { top: 15, right: 15, bottom: 15, left: 15 }
        };

        const scatter_plot = new ScatterPlot(config, data);
        scatter_plot.update();
    })
    .catch(error => {
        console.log(error);
    });

class ScatterPlot {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
            inner_margin: config.inner_margin || { top: 10, right: 10, bottom: 10, left: 10 }
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([0, self.inner_height]);

        self.xaxis = d3.axisBottom(self.xscale)
            .tickValues([20, 40, 80, 160])
            .tickPadding(-20);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(6);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);
        self.yaxis_group = self.chart.append('g')
    }

    update() {
        let self = this;

        const xmin = d3.min(self.data, d => d.x);
        const xmax = d3.max(self.data, d => d.x);
        self.xscale.domain([xmin - self.config.inner_margin.left, xmax + self.config.inner_margin.right]);

        const ymin = d3.min(self.data, d => d.y);
        const ymax = d3.max(self.data, d => d.y);
        self.yscale.domain([ymin - self.config.inner_margin.top, ymax + self.config.inner_margin.bottom]);

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale(d.x))
            .attr("cy", d => self.yscale(d.y))
            .attr("r", d => d.r)
            .attr("fill", d => d.color)
            .attr("opacity", d => d.opacity);

        self.xaxis_group
            .call(self.xaxis)
            .selectAll("text")
            .attr("font-size", (d) => d == 40 ? "20" : "10");

        self.yaxis_group
            .call(self.yaxis)
            .selectAll("text")
            .attr("font-size", 15)
            .attr("dx", 10)
            .attr("dy", -10)
            .attr("color", "red")
            .attr("transform", "rotate(-45)");
    }
}
