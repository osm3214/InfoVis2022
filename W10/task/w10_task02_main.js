// d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W04/data.csv")
d3.csv("https://osm3214.github.io/InfoVis2022/W04/task/w04_task01.csv")
    .then(data => {
        data.forEach(d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: { top: 30, right: 10, bottom: 50, left: 50 },
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
            .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(4);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(4);

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

        let circles = self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")

        circles
            .attr("cx", d => self.xscale(d.x))
            .attr("cy", d => self.yscale(d.y))
            .attr("r", d => 4)
            .attr("fill", "steelblue")
            // .attr("opacity", d => d.opacity)
            // .attr("stroke", d => d.color)
            .attr("stroke-width", 4);

        self.yaxis_group
            .call(self.yaxis);

        self.xaxis_group
            .call(self.xaxis);

        self.svg.append("text")
            .attr("x", self.config.margin.left + self.inner_width / 2)
            .attr("y", self.config.margin.top + self.inner_height + 40)
            .style("text-anchor", "middle")
            // .style("font-size", 20)
            // .style("fill", "red")
            .text("X-label");

        self.svg.append("text")
            .attr("transform", `rotate(-90, ${self.config.margin.left - 30}, ${self.config.margin.top + self.inner_height / 2})`)
            .attr("x", self.config.margin.left - 30)
            .attr("y", self.config.margin.top + self.inner_height / 2)
            .style("text-anchor", "middle")
            // .style("font-weight", "bold")
            // .style("text-decoration", "underline")
            .text("Y-label");

        self.svg.append("text")
            .attr("x", self.config.margin.left + self.inner_width / 2)
            .attr("y", self.config.margin.top - 10)
            .attr("text-anchor", "middle")
            .text("Chart Title");
        // .attr("stroke", "blue")
        // .attr("stroke-width", 0.5);

        circles
            .on('mouseover', (e, d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`);
                d3.select(e.srcElement)
                    .attr("r", 8)
                    .attr("fill", "crimson")
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', (e) => {
                d3.select('#tooltip')
                    .style('opacity', 0);
                d3.select(e.srcElement)
                    .attr("r", 4)
                    .attr("fill", "steelblue")
            });

    }
}
