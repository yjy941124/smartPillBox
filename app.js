/**
 * Created by jinyangyu on 2/2/17.
 */
var express = require('express');
var expressLayouts = require('./express-layouts.js');
var router = require('./routes/router.js');
var app = express();
// var bodyParser = require('body-parser');
app.use(require('body-parser').json());
app.use(expressLayouts);
app.use('/public',express.static('./public'));
app.set('views', './views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.get('/', router.home);
app.get('/schedule', router.schedule);
app.post('/schedule', router.submitPost);
app.get('/record', router.record);
app.get('/pillbox', router.pillbox);
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(port);
});

//URL is :node-express-env.prpmrstyrj.us-west-2.elasticbeanstalk.com