const ApiError = require('../../exceptions/apiError')
const {ChartJSNodeCanvas} = require('chartjs-node-canvas');
const {Chart} = require("chart.js");
const ChartDataLabels = require("chartjs-plugin-datalabels");

class ChartService {
    async createBase64(data) {
        if (!data) {
            throw ApiError.BadRequest('Данные не удалось определить')
        }

        const options = Object.assign(data, {
            width: data.width || 400,
            height: data.height || 400
        })

        const chartJSNodeCanvas = new ChartJSNodeCanvas({
            width: options.width,
            height: options.height,
            chartCallback: (ChartJS) => {
                ChartJS.defaults.responsive = true;
                ChartJS.defaults.maintainAspectRatio = false;
            }
        })

        const configuration = this.getConfiguration(options)

        Chart.register(ChartDataLabels);

        return chartJSNodeCanvas.renderToDataURL(configuration)
    }

    getConfiguration(options) {

        switch (options.kind) {
            case 'line_chart':
                return this.getLineChartConfig(options)
            case 'pie_chart':
                return this.getPieChartConfig(options)
            default:
                throw ApiError.BadRequest('Вид не удалось определить')
        }
    }

    getLineChartConfig(options) {

        if (!options.names) {
            throw ApiError.BadRequest('Названия не удалось определить')
        }

        if (!options.colors) {
            throw ApiError.BadRequest('Цвета не удалось определить')
        }

        if (!options.x_items) {
            throw ApiError.BadRequest('X-элементы не удалось определить')
        }

        if (!options.y_items) {
            throw ApiError.BadRequest('Y-элементы не удалось определить')
        }

        return {
            type: 'line',
            data: {
                labels: options.x_items,
                datasets: options.names.map((name, index) => ({
                    label: name,
                    data: options.y_items[index],
                    backgroundColor: options.colors[index],
                    borderColor: options.colors[index],
                }))
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        }
    }

    getPieChartConfig(options) {

        if (!options.values) {
            throw ApiError.BadRequest('Значения не удалось определить')
        }

        if (!options.colors) {
            throw ApiError.BadRequest('Цвета не удалось определить')
        }

        const names = []
        const colors = []

        const values = options.values.filter((value, index) => {
            if (value) {
                names.push(options.names[index])
                colors.push(options.colors[index])
                return true
            }
            return false
        })

        return {
            type: 'pie',
            data: {
                labels: names,
                datasets: [{
                    data: values,
                    backgroundColor: colors
                }]
            },
            options: {
                animation: {
                    duration: 0
                },
                hover: {
                    animationDuration: 0
                },
                responsiveAnimationDuration: 0
            },
            plugins: [{
                id: 'background-colour',
                beforeDraw: (chart) => {
                    const ctx = chart.ctx;
                    ctx.save();
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, options.width, options.height);
                    ctx.restore();
                }
            }, ChartDataLabels]
        }
    }
}

module.exports = new ChartService()