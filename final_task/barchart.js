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

class BarChart {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 128,
            margin: config.margin || { top: 10, right: 10, bottom: 20, left: 60 },
            inner_margin: config.inner_margin || { top: 10, right: 10, bottom: 10, left: 0 },
            duration: config.duration || 1000
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

        self.yscale = d3.scaleBand()
            .range([0, self.inner_height])
            .paddingInner(.1)
            .paddingOuter(.2);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)

        self.yaxis_group = self.chart.append('g')
    }

    update() {
        let self = this;

        self.xmax = d3.max(self.data, d => d.value);
        self.xscale.domain([0 - self.config.inner_margin.left, self.xmax + self.config.inner_margin.right]);
        self.yscale.domain(self.data.map(d => d.label));

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("rect")
            .data(self.data)
            .join("rect")
            .transition().duration(self.config.duration)
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth())
            .attr("fill", function (d) { return d.value == self.xmax ? "crimson" : "steelblue" });

        self.chart.selectAll("label")
            .data(self.data)
            .join("text")
            .transition()
            .text(d => d.value)
            .attr("class", "label")
            .attr("x", d => self.xscale(d.value) - 12)
            .attr("y", d => self.yscale(d.label) + 12)
            .attr("text-anchor", "middle")
            .attr("font-size", 12)
            .attr("fill", "white")
            .attr("font-family", "sans-serif");

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }

    reverse() {
        let self = this;
        self.data.reverse();
    }
}