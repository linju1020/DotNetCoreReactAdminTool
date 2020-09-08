var readlineSync = require('readline-sync');
const { exit } = require('process');

function readinput_str({ tip = 'Please enter', defaultValue = '', required = false }) {
    let val = '';
    while (true) {
        var defaultTxt = defaultValue.length > 0 ? ` (Default: ${defaultValue}) ` : ' ';
        val = readlineSync.question(`${tip}${defaultTxt}> `).trim().toLowerCase();
        if (val == '') val = defaultValue.trim();
        if (required && val.length == 0) { }
        else { break; }
    }
    return val;
}

function readinput_int({ tip = 'Please enter', defaultValue = 0, min = 0, max = 99999 }) {
    let val = '';
    let isdo = true;

    var defaultTxt = defaultValue.length > 0 ? ` (Default: ${defaultValue}) ` : ' ';
    val = readlineSync.question(`${tip}${defaultTxt}> `).trim().toLowerCase();
    if (val == '') val = defaultValue.toString();
    if (isNaN(parseInt(val))) val = defaultValue.toString();
    if (parseInt(val) < min) val = min.toString();
    if (parseInt(val) > max) val = max.toString();
    return parseInt(val);
}

function alertAndQuit(msg = '') {
    if (msg.length > 0)
        console.log(msg);
    exit();
}

module.exports = { readinput_str, readinput_int, alertAndQuit };