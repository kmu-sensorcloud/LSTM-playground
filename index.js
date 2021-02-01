var coinData = [];

// Load Coin Data
function loadCSV(data) {
    var rows = data.split(/\r?\n|\r/);
    for (var i = 2550; i < rows.length; i++){
        var currentLine = rows[i].split(",");

        for (var j = 1; j < currentLine.length; j++){
            currentLine[j] = parseFloat(currentLine[j]);
        }
        coinData.push(currentLine);
    }
}

$.ajax({
    url: 'coin_desk_data.csv',
    dataType: 'text',
    async:false,
}).done(loadCSV);


// Configure charts
var options = {
    chart: {
        type: 'candlestick',
        height: 500,
        animations: {
            enabled: false,
            speed: 10,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
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
        text: 'CandleStick Chart',
        align: 'left'
    },
    xaxis: {
        type: 'datetime'
    },
    yaxis: {
        tooltip: {
            enabled: true
        },
        decimalsInFloat: 2,
        tickAmount: 10
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

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();
