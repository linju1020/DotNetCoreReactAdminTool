var readlineSync = require('readline-sync');
var fs = require('fs');
const { exit } = require('process');

async function sleep(millisecond) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, millisecond)
    })
}

function readinput_str({ tip = 'Please enter', defaultValue = '', required = false }) {
    let val = '';
    while (true) {
        var defaultTxt = defaultValue.length > 0 ? ` (Default: ${defaultValue}) ` : ' ';
        val = readlineSync.question(`${tip}${defaultTxt}> `).trim();
        if (val == '') val = defaultValue.trim();
        if (required && val.length == 0) { }
        else { break; }
    }
    return val;
}

function readinput_int({ tip = 'Please enter', defaultValue = 0, min = 0, max = 99999 }) {
    let val = '';
    var defaultTxt = defaultValue.length > 0 ? ` (Default: ${defaultValue}) ` : ' ';
    val = readlineSync.question(`${tip}${defaultTxt}> `).trim();
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

var deleteFolderRecursive = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

const _DealType = (_type) => {
    switch (_type) {
        case 'int4':
        case 'int8':
        case 'int16':
        case 'int32':
        case 'serial':
            return 'int';

        case 'decimal':
        case 'double':
        case 'money':
            return 'Double';

        case 'varchar':
        case 'text':
            return 'string';

        case 'boolean':
            return 'bool';

        case 'timestamp':
        case 'date':
            return 'DateTime';

    }
    return "XXX";
}

var createFieldsCodes = function (tablefields) {
    var strs = [];
    for (var i in tablefields) {
        var type = _DealType(tablefields[i].type);
        var name = tablefields[i].field;
        strs.push(`public ${type} ${name} {get;set;}`);
    }
    return strs.join('\r\n');
}
var createFieldsCodesRemoveKey = function (tablefields) {
    var strs = [];
    for (var i in tablefields) {
        if (i == 0) continue;
        var type = _DealType(tablefields[i].type);
        var name = tablefields[i].field;
        strs.push(`public ${type} ${name} {get;set;}`);
    }
    return strs.join('\r\n');
}
var writeFieldsCodes = function (tablefields) {
    var strs = [];
    for (var i in tablefields) {
        var name = tablefields[i].field;
        strs.push(`item.${name} = request.${name};`);
    }
    return strs.join('\r\n');
}
var writeFieldsCodesRemoveKey = function (tablefields) {
    var strs = [];
    for (var i in tablefields) {
        if (i == 0) continue;
        var name = tablefields[i].field;
        strs.push(`item.${name} = request.${name};`);
    }
    return strs.join('\r\n');
}

module.exports = {
    sleep, readinput_str, readinput_int, deleteFolderRecursive, alertAndQuit,
    createFieldsCodes, createFieldsCodesRemoveKey,
    writeFieldsCodes, writeFieldsCodesRemoveKey
};