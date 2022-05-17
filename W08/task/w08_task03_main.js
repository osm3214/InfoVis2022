d3.csv("https://osm3214.github.io/InfoVis2022/W08/task/w08_task01.csv")
    .then(data => {
        console.log(data)

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            radius: function () {
                return Math.min(this.width, this.height) / 2;
            },
            inner_radius: function () { return this.radius() / 2; },
            margin: { top: 10, right: 10, bottom: 10, left: 10 }
        };

        const piechart = new PieChart(config, data);
        piechart.update();
    })
    .catch(error => {
        console.log(error);
    });

class PieChart {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            radius: config.radius,
            inner_radius: config.inner_radius,
            margin: config.margin || { top: 10, right: 10, bottom: 20, left: 60 }
        }
        this.data = data;
        console.log(config)
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`)
            .attr('transform', `translate(${self.config.width / 2}, ${self.config.height / 2})`);

        self.pie = d3.pie()
            .value(d => d.value);

        console.log(self.config.radius)

        self.arc = d3.arc()
            .innerRadius(self.config.inner_radius())
            .outerRadius(self.config.radius());
    }

    update() {
        let self = this;

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll('pie')
            .data(self.pie(self.data))
            .enter()
            .append('path')
            .attr('d', self.arc)
            .attr('fill', 'black')
            .attr('stroke', 'white')
            .style('stroke-width', '2px');
    }
}