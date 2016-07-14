var req = require('request');
var N = require('numbers');
var fs = require('fs');

exports.LoadFile = function (file, predict) {
    var delimiter = /[\s,]+/;

    return (new Promise(function (resolve, reject) {
        if (file.indexOf('http') >= 0) {
            req.get(url, function (err, res, body) {
                if (err) {
                    return reject(err);
                }

                var arr = DATA2ARR(body, delimiter);
                var pos = predict == 'first' ? 0 : predict == 'last' ? arr[0].length - 1 : predict;
                resolve(IsolateColumn(arr, pos));
            });
        } else {
            fs.readFile(file, 'utf8', function (err, data) {
                if (err) {
                    return reject(err);
                }
                var arr = DATA2ARR(data, delimiter);
                var pos = predict == 'first' ? 0 : predict == 'last' ? arr[0].length - 1 : predict;
                resolve(IsolateColumn(arr, pos));
            });
        }
    }));
}

function IsolateColumn(arr, col) {
    var Y = [],
        X = arr;
    if (col >= X[0].length) {
        return 'Invalid position';
    }

    for (var i = 0; i < X.length; i++) {
        Y.push([X[i][col]]);
        X[i].splice(col, 1);
    }

    return {
        y: Y,
        x: X
    };
}


function DATA2ARR(csv, delimiter) {
    var data = csv.split('\n');
    for (var i = 0; i < data.length; i++) {
        if (data[i] == '') {
            data.splice(i, 1);
            i--;
            continue;
        }
        data[i] = data[i].split(delimiter);
        for (var j = 0; j < data[i].length; j++) {
            if (/^\d*\.?\d+\s?$/.test(data[i][j])) {
                data[i][j] = parseFloat(data[i][j]);
            } else if (data[i][j] == '') {
                data[i].splice(j, 1);
                j--;
            }
        }
    }
    return data;
}


//function IsolateTrainingSet = function (X, Y, percent) {
//    percent = percent < 1 ? percent : percent / 100;
//
//    var m = X.length,
//        trainingsize = Math.round(m * percent);
//
//
//}


//function TOcsv(arr) {
//    for (var i = 0; i < arr.length; i++) {
//        arr[i] = arr[i].join(',');
//    }
//    return arr.join('\n');
//}