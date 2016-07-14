var N = require('numbers');


/**
 * Performs the Normal Equation.
 * @param {Array} X
 * @param {Array} Y
 * @return {Array} Theta
 */
exports.NormalEquation = function (X, Y) {
    X = ScaleFeatures(X);
    X = PadCol(X, 1);
    var Xtran = N.matrix.transpose(X);
    var Xnorm = N.matrix.multiply(Xtran, X);
    var Xinv = N.matrix.inverse(Xnorm);
    var that = N.matrix.multiply(Xinv, Xtran);
    var theta = N.matrix.multiply(that, Y);
    return theta;
}


/**
 * Tests new theta on test data. Returns percent corret.
 * @param {Array} theta
 * @param {Array} X
 * @param {Array} Y
 * @return {Number} percent
 */
exports.Test = function (theta, X, Y) {
    X = PadCol(X, 1);
    var total = Y.length,
        correct = 0,
        Ytran = N.matrix.transpose(Y),
        mean = N.statistic.mean(Ytran[0]),
        error = mean * 0.05;
    var prediction = N.matrix.multiply(X, theta);
    for (var i = 0; i < total; i++) {
        if (Math.abs(prediction[i][0] - Y[i][0]) <= error) {
            correct++;
        }
    }
    console.log((correct * 100 / total) + '% guessed correctly.');
    return (correct / total);
}


/**
 * Performs Gradient Descent
 * @param {Array} X
 * @param {Array} Y
 * @return {Array} Theta
 */
exports.GradientDescent = function (X, Y) {
    X = ScaleFeatures(X);
    X = PadCol(X, 1);
    var alpha = 0.3,
        m = X.length,
        n = X[0].length,
        asymptote = false,
        theta = InitVector(n, ''),
        thetaP = InitVector(n, 'rand'),
        Xtran,
        hypo,
        sum,
        thetaTran,
        count = 0;

    while (!asymptote) {
        theta = new Array(n);
        for (var i = 0; i < n; i++) {
            sum = 0;
            for (var j = 0; j < m; j++) {
                hypo = N.matrix.multiply([X[j]], thetaP);
                sum += (hypo[0] - Y[j][0]) * X[j][i];
            }
            theta[i] = [thetaP[i][0] - (alpha * (sum / m))];
        }
        asymptote = Threshold(theta, thetaP);
        thetaP = theta;
        count++;
    }

    console.log('Gradient Descent closed after ' + count + ' iterations.')
    return theta;
}

/**
 * Scale all features to similar value range
 * @param {Array} X
 * @return {Array} norm
 */
function ScaleFeatures(X) {
    var m = X.length,
        n = X[0].length,
        Xtran = N.matrix.transpose(X),
        mean,
        stdev;

    for (var i = 0; i < n; i++) {
        mean = N.statistic.mean(Xtran[i]);
        stdev = N.statistic.standardDev(Xtran[i]);
        for (var j = 0; j < m; j++) {
            Xtran[i][j] = (Xtran[i][j] - mean) / stdev;
        }
    }
    return N.matrix.transpose(Xtran);
}


/**
 * Initializes a vector with size-dimention & the given val
 * @param {Number} size
 * @param {String} val
 * @return {Array} vec
 */
function InitVector(size, val) {
    var temp = new Array(size);
    for (var i = 0; i < size; i++) {
        val = val !== 'rand' ? val : Math.random();
        temp[i] = [val];
    }
    return temp;
}


/**
 * Adds a column to the front of matrix contaning given value
 * @param {Array} X
 * @param {String} val
 * @return {Array} mat
 */
function PadCol(X, val) {
    for (var i = 0; i < X.length; i++) {
        X[i].unshift(val);
    }
    return X;
}

/**
 * Calculates if the two arrays are different by more than a constant threshold
 * @param {Array} vec1
 * @param {Array} vec2
 * @return {Boolean} yes
 */
function Threshold(vec1, vec2) {
    var threshold = 0.000005;
    var m = vec1.length,
        sum = 0;
    for (var i = 0; i < m; i++) {
        sum += Math.abs(vec1[i][0] - vec2[i][0]);
    }
    return (sum / m) <= threshold;
}