class BarChart2 {
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
        this.prefecture = data.columns;
        this.prefecture.shift();
        this.prefecture.shift();

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
            .ticks(47)
            .tickValues(self.prefecture);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(4);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);
        self.yaxis_group = self.chart.append('g');
    }

    update() {
        let self = this;

        if (current_date == -1) {
            let total = {}
            self.data.forEach(function (d) {
                self.prefecture.forEach(function (col) {
                    if (col in total) total[col] += parseInt(d[col]);
                    else total[col] = parseInt(d[col]);
                })
            })
            self.summed_data = d3.entries(total);
        } else {
            self.summed_data = {}
            self.data.forEach(function (d) {
                if (d.Date == current_date) {
                    self.prefecture.forEach(function (col) {
                        self.summed_data[col] = parseInt(d[col]);
                    })
                }
            })
            self.summed_data = d3.entries(self.summed_data)
        }

        self.xscale.domain(self.summed_data.map(d => d.key));
        self.yscale.domain([0, d3.max(self.summed_data, d => d.value)]);

        self.render();
    }

    render() {
        let self = this;

        let bar = self.chart.selectAll(".bar")
            .data(self.summed_data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => self.xscale(d.key))
            .attr("y", d => self.yscale(d.value))
            .attr("width", self.xscale.bandwidth())
            .attr("height", d => (self.inner_height - self.yscale(d.value)))
            .attr("fill", "steelblue");

        self.chart.append("text")
            .attr("x", self.inner_width / 2)
            .attr("y", self.config.margin.top + self.inner_height + 20)
            .attr("text-anchor", "middle")
            .attr("font-size", 12)
            .attr("font-family", "sans-serif")
            .text("Prefecture");

        self.chart.append("text")
            .attr("transform", `rotate(-90, ${self.config.margin.left - 110}, ${self.inner_height / 2})`)
            .attr("x", self.config.margin.left - 110)
            .attr("y", self.inner_height / 2)
            .attr("text-anchor", "middle")
            .attr("font-size", 12)
            .attr("font-family", "sans-serif")
            .text("# of new cases");

        self.xaxis_group
            .call(self.xaxis)
            .selectAll("text")
            .attr("dx", "-30")
            .attr("dy", "-8")
            .attr("transform", "rotate(-90)");

        self.yaxis_group
            .call(self.yaxis);

        bar
            .on("mouseover", (e, d) => {
                d3.select("#tooltip")
                    .style("opacity", 1)
                    .html(`<div class="tooltip-label">${d.key}: ${d.value}</div>`);
                d3.select(e.srcElement)
                    .attr("fill", "crimson");
            })
            .on("mousemove", (e) => {
                const padding = 10;
                d3.select("#tooltip")
                    .style("left", (e.pageX + padding) + "px")
                    .style("top", (e.pageY + padding) + "px");
            })
            .on("mouseleave", (e) => {
                d3.select("#tooltip")
                    .style("opacity", 0);
                d3.select(e.srcElement)
                    .attr("fill", "steelblue");
            });
    }
}