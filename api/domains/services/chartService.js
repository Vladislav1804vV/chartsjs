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
            width: 400,
            height: 400
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

        const base64 = await chartJSNodeCanvas.renderToDataURL(configuration)

        return base64
    }

    getConfiguration(options) {
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