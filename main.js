var Data = require('./services/data');
var M = require('./services/math');

var data = {
    housing: 'https://archive.ics.uci.edu/ml/machine-learning-databases/housing/housing.data',
    housinglocal: './data/housing.csv'
}

Data.LoadFile(data.housinglocal, 'last').then(function (data) {
    Main(data.x, data.y);
}).catch(function (err) {
    console.log(err);
})

function Main(X, Y) {

    var theta = M.GradientDescent(X, Y);
    console.log(theta);
    var theta = M.NormalEquation(X, Y);
    console.log(theta);

    M.Test(theta, X, Y);

}