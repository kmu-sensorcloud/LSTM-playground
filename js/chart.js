var coinData = [];
var volData = [];
var timeData = [];
var ma5 = [];
var ma20 = [];
var ma60 = [];
var ma120 = [];


$.ajax({
    url: 'data/bitcoin_historical_data.csv',
    dataType: 'text',
    async:false,
}).done(loadCSV);


// Load Coin Data
function loadCSV(data) {
    var rows = data.split(/\r?\n|\r/);
    var close = [];

    for (var i = 1; i < rows.length; i++){
        var ma20_temp = [];
        var coinData_temp = [];
        var price_temp = [];

        var currentLine = rows[i].split(",");
        coinData_temp.push(currentLine[0]);

        for (var j = 1; j < currentLine.length; j++){
            currentLine[j] = parseFloat(currentLine[j]);
            price_temp.push(currentLine[j]);
        }
        price_temp.pop();
        coinData_temp.push(price_temp);

        volData.push(currentLine.pop());
        coinData.push(coinData_temp);
        timeData.push(currentLine[0]);

        close.push(currentLine[currentLine.length - 1]);
        if (close.length === 20) {
            var sum = close.reduce((a, b) => a + b, 0);
            ma20_temp.push(currentLine[0]);
            ma20_temp.push(sum/20);
            ma20.push(ma20_temp);
            close.shift();
        }
    }
}


// Configure candlestick charts
var candleChartOptions = {
    series: [{
        name: 'MA20',
        type: 'line',
        data: ma20,
    },
        {
            name: 'candle',
            type: 'candlestick',
            data: coinData,
    }],
    chart: {
        type: 'line',
        height: 450,
        id: 'candles',
        animations: {
            enabled: false,
        },
        toolbar: {
            autoSelected: 'pan',
            show: false
        },
        zoom: {
            enabled: true,
            autoScaleYaxis: false
        },
    },
    noData: {
        text: 'No Data'
    },
    title: {
        text: 'Bitcoin Price Chart',
        align: 'left'
    },
    stroke: {
        width: [2, 1],
        curve: ['smooth', 'straight']
    },
    tooltip: {
        shared: true,
        x: {
            format: 'yyyy-MM-dd'
        },
        y: {

        }
    },
    xaxis: {
        type: 'datetime',
        tooltip: {
            enabled: true
        },
    },
    yaxis: {
        title: {
            text: 'BTC(USD)',
        },
        tooltip: {
            enabled: false
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
                min: new Date('01 Jan 2018').getTime(),
                max: new Date('31 Mar 2018').getTime(),
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
    xaxis: {
        type: 'datetime',
        categories: timeData,
    },
    yaxis: {
        tickAmount: 5
    }
};

var barChart = new ApexCharts(document.querySelector("#bar-chart"), barChartOptions);
barChart.render();
