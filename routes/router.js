/**
 * Created by jinyangyu on 2/2/17.
 */
var file;
exports.home = function(req, res) {
    res.render('index');
};
exports.schedule = function (req, res) {
    res.render('schedule');
};
exports.submitPost = function (req, res) {

    var backNumber = req.body;
    console.log(req);
    res.send(backNumber);

};
exports.record = function (req, res) {
    res.render('record');
};
exports.pillbox = function (req, res) {
    res.render('pillbox');
};
