var date = new Date();
const time = date.toLocaleTimeString();
const dateElements = date.toLocaleDateString().split('/');
var year = dateElements[2];
var month = dateElements[0];
var day = dateElements[1];
const currentDate = year + '/' + getZero(month) + '/' + getZero(day) + ' ' + time;

document.getElementById('update-time').innerHTML = currentDate;
document.getElementById('current-value').innerHTML = 'current value here...';
document.getElementById("log-script").innerHTML = 'logs here...';


function refresh() {
    location.reload();
}

function getZero(num) {
    if (num.length < 2) {
        return "0" + num;
    }
    return num;
}
