var data = [
    { x: 0, y: 100 },
    { x: 40, y: 5 },
    { x: 120, y: 80 },
    { x: 150, y: 30 },
    { x: 200, y: 50 }
];

d3.csv("https://osm3214.github.io/InfoVis2022/W08/task/w08_task02.csv")

var width = 256;
var height = 128;

var svg = d3.select('#drawing_region')
    .attr('width', width)
    .attr('height', height);

const line = d3.line()
    .x(d => d.x)
    .y(d => d.y);

svg.append('path')
    .attr('d', line(data))
    .attr('stroke', 'black')
    .attr('fill', 'none');

class LineChart {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 128,
            margin: config.margin || { top: 10, right: 10, bottom: 20, left: 60 }
        }
        this.data = data;
        console.log(data);
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
            .domain([0, d3.max(self.data, d => d.value)])
            .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
            .domain(self.data.map(d => d.label))
            .range([0, self.inner_height])
            .paddingInner(0.1);

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

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("rect")
            .data(self.data)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth());

        self.xaxis_group
            .call(self.xaxis);
        self.yaxis_group
            .call(self.yaxis);
    }