class BarChart {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 128,
            margin: config.margin || { top: 10, right: 10, bottom: 20, left: 60 },
            inner_margin: config.inner_margin || { top: 10, right: 0, bottom: 0, left: 0 },
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

        self.xscale = d3.scaleBand()
            .range([0, self.inner_width])
            .padding(0.05);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(12)
            .tickValues(["01/01", "02/01", "03/01", "04/01", "05/01", "06/01", "07/01", "08/01", "09/01", "10/01", "11/01", "12/01"]);
        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(4);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);
        self.yaxis_group = self.chart.append('g');
    }

    update() {
        let self = this;

        self.xscale.domain(self.data.map(d => d.date));
        self.yscale.domain([0, d3.max(self.data, d => d.value) + self.config.inner_margin.top]);
        console.log(d3.max(self.data, d => d.value))

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll(".bar")
            .data(self.data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => self.xscale(d.date))
            .attr("y", d => self.yscale(d.value))
            .attr("width", self.xscale.bandwidth())
            .attr("height", d => (self.inner_height - self.yscale(d.value)));

        self.chart.selectAll("text")
            .append("text")
            .attr("x", 0)
            .attr("y", self.config.height / 2)
            .attr("text-anchor", "middle")
            .attr("font-size", 12)
            .attr("font-family", "sans-serif")
            .text("# of new cases");

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }
}