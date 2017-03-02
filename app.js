/**
 * Created by jinyangyu on 2/2/17.
 */
var express = require('express');
var expressLayouts = require('./express-layouts.js');
var router = require('./routes/router.js');
var app = express();
var file;
var privateKey;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use('/public',express.static('./public'));
app.set('views', './views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.get('/', router.home);
app.get('/pillbox/schedule', router.schedule);
app.post('/schedule', router.submitPost);
app.post('/uploadFile', function (req, res) {
    file = req.body;
    console.log(file);
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

//URL is :node-express-env.prpmrstyrj.us-west-2.elasticbeanstalk.com
//URL is :node-express-env.prpmrstyrj.us-west-2.elasticbeanstalk.com/