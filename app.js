/**
 * Created by jinyangyu on 2/2/17.
 */
var express = require('express');
var expressLayouts = require('./express-layouts.js');
var router = require('./routes/router.js');
var app = express();

var privateKey;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use('/public',express.static('./public'));
var util = require('./util');
app.set('views', './views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.get('/', router.home);
app.get('/pillbox/schedule', router.schedule);
app.post('/schedule', router.submitPost);

app.post('/uploadFile', function (req, res) {
    var file = req.body;
    console.log('before save');
    console.log(file);
    util.saveUploadFile(file);

    res.send(file);
});
app.get('/uploadFile', function (req, res) {
    console.log(file);
    res.send(file);
});
app.get('/record', router.record);
app.get('/pillbox', router.pillbox);
app.post('/uploadPrivateKey', function (req, res) {
    privateKey = req.body.value;
    console.log(privateKey);
    res.send(privateKey);
});
app.get('/uploadPrivateKey', function (req, res) {
    res.send(privateKey);
});
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(port);
});
app.get('/getUploadedFile/:exclusiveKey', function (req, res) {
    var exclusiveKey = req.params.exclusiveKey;
    var message = JSON.stringify(util.getUploadedFile());
    var fakenumber = '1';
    console.log('query success');
    res.send(message);
});

//URL is :node-express-env.prpmrstyrj.us-west-2.elasticbeanstalk.com
//URL is :node-express-env.prpmrstyrj.us-west-2.elasticbeanstalk.com/