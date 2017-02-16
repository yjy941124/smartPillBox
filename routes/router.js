/**
 * Created by jinyangyu on 2/2/17.
 */
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
exports.fileUpload = function (req, res) {
    var file = req.body.value;
    console.log(file);
    res.send(req.body);
};