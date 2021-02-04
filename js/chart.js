var coinData = [];
var volData = [];
var timeData = [];

// Load Coin Data
function loadCSV(data) {
    var rows = data.split(/\r?\n|\r/);
    for (var i = 1; i < rows.length; i++){
        var currentLine = rows[i].split(",");

        for (var j = 1; j < currentLine.length; j++){
            currentLine[j] = parseFloat(currentLine[j]);
        }
        volData.push(currentLine.pop());
        coinData.push(currentLine);
        timeData.push(currentLine[0]);
    }
}

$.ajax({
    url: 'data/bitcoin_historical_data.csv',
    dataType: 'text',
    async:false,
}).done(loadCSV);


// Configure candlestick charts
var candleChartOptions = {
    chart: {
        type: 'candlestick',
        height: 450,
        id: 'candles',
        animations: {
            enabled: false,
            // speed: 10,
            // animateGradually: {
            //     enabled: true,
            //     delay: 150
            // },
            // dynamicAnimation: {
            //     enabled: true,
            //     speed: 350
            // }
        },
        toolbar: {
            autoSelected: 'pan',
            show: false
        },
        zoom: {
            enabled: true
        }
    },
    series: [{
        data: coinData
    }],
    noData: {
        text: 'No Data'
    },
    title: {
        text: 'Bitcoin Price ($)',
        align: 'left'
    },
    xaxis: {
        type: 'datetime',
    },
    yaxis: {
        title: {
            text: 'BTC',
        },
        tooltip: {
            enabled: true
        },
        decimalsInFloat: 2,
        tickAmount: 5
    },
    grid: {
        padding: {
            left: 20,
            right: 20
        }
    },
    plotOptions: {
        candlestick: {
            wick: {
                useFillColor: true,
            }
        }
    }
}

var candleChart = new ApexCharts(document.querySelector("#candle-chart"), candleChartOptions);
candleChart.render();


// Configure bar charts
var barChartOptions = {
    series: [{
        data: volData
    }],
    chart: {
        height: 150,
        type: 'bar',
        brush: {
            enabled: true,
            target: 'candles'
        },
        animations: {
            enabled: false,
            // speed: 10,
            // animateGradually: {
            //     enabled: true,
            //     delay: 150
            // },
            // dynamicAnimation: {
            //     enabled: true,
            //     speed: 350
            // }
        },
        selection: {
            enabled: true,
            xaxis: {
                min: "2017-01-01",
                max: "2017-12-31"
            },
            fill: {
                color: '#ccc',
                opacity: 0.3
            },
            stroke: {
                color: '#0D47A1',
            }
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 0
    },
    labels: timeData,
    xaxis: {
        type: 'datetime',
    },
    yaxis: {
        labels: {
            show: false
        },
        tooltip: {
            enabled: true
        },
    }
};

var barChart = new ApexCharts(document.querySelector("#bar-chart"), barChartOptions);
barChart.render();
