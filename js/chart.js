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
    async: false,
}).done(loadCSV);


// Load Coin Data
function loadCSV(data) {
    var rows = data.split(/\r?\n|\r/);
    var close = [];

    for (var i = 1; i < rows.length; i++){
        var ma5_temp = [];
        var ma20_temp = [];
        var ma60_temp = [];
        var ma120_temp = [];

        var coinData_temp = [];  // Timestamp & Close Price
        var price_temp = [];

        var currentLine = rows[i].split(",");
        coinData_temp.push(currentLine[0]);  // Add Timestamp
        
        // Change Type(str to float)
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
        
        if (close.length >= 5) {
            ma5_temp = getMALine(currentLine[0], close, 5, ma5_temp);
            ma5.push(ma5_temp);
        }
        if (close.length >= 20) {
            ma20_temp = getMALine(currentLine[0], close, 20, ma20_temp);
            ma20.push(ma20_temp);
        }
        if (close.length >= 60) {
            ma60_temp = getMALine(currentLine[0], close, 60, ma60_temp);
            ma60.push(ma60_temp);
        }
        if (close.length >= 120) {
            ma120_temp = getMALine(currentLine[0], close, 120, ma120_temp);
            ma120.push(ma120_temp);
        }
    }

}

function getMALine(timestamp, close, N, ma_temp) {
    var sum = 0;
    for (var i = close.length - 1; i >= close.length - N; i--) {
        sum += close[i];
    }
    ma_temp.push(timestamp);
    ma_temp.push(sum/N);
    return ma_temp;
}

// function getMinMax() {    FIXME: find min max within selection TODO: event delegation
//     maxes = []
//     for (var i = 1; i < a.length - 1; ++i) {
//         if (a[i-1] < a[i] && a[i] > a[i+1])
//             maxes.push(a[i])
//     } 
// }


// Configure candlestick charts
var candleChartOptions = {
    series: [
    {
        name: 'MA5',
        type: 'line',
        data: ma5
    },
    {
        name: 'MA20',
        type: 'line',
        data: ma20,
    },
    {
        name: 'MA60',
        type: 'line',
        data: ma60,
    },
    {
        name: 'MA120',
        type: 'line',
        data: ma120,
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
        width: [2, 2, 2, 2, 1],
        curve: ['smooth', 'smooth', 'smooth', 'smooth', 'straight']
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
    annotations: {
        xaxis: [
            {
                x: new Date('17 Dec 2017').getTime(),
                borderColor: '#00E396',
                label: {
                    borderColor: '#00E396',
                    style: {
                        fontSize: '12px',
                        color: '#fff',
                        background: '#00E396'
                    },
                    orientation: 'horizontal',
                    offsetY: 7,
                    text: 'High'
                }
            }
        ],
        points: [{
            x: new Date('17 Dec 2017').getTime(),
            y: 19065.70,
            marker: {
                size: 5,
                fillColor: '#fff',
                strokeColor: 'red',
                radius: 2,
                cssClass: 'apexcharts-custom-class'
            },
            label: {
                borderColor: '#FF4560',
                offsetY: 0,
                style: {
                    color: '#fff',
                    background: '#FF4560',
                },
                text: 'Sell',
            }
        }, {
            x: new Date('06 Feb 2018').getTime(),
            y: 7701.20,
            marker: {
                size: 5,
                fillColor: '#fff',
                strokeColor: 'red',
                radius: 2,
                cssClass: 'apexcharts-custom-class'
            },
            label: {
                borderColor: '#FF4560',
                offsetY: 0,
                style: {
                    color: '#fff',
                    background: '#FF4560',
                },
                text: 'Buy',
            }
        }],
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
                min: new Date('27 Nov 2017').getTime(),
                max: new Date('23 Feb 2018').getTime(),
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
