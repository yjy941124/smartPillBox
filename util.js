/**
 * Created by jinyangyu on 3/23/17.
 */
var config = require('./config.js'); //config file contains all tokens and other private info


// setup MongoDB connection information
var mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/smartPillBox';
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

exports.saveUploadFile = function (file) {
    MongoClient.connect(mongodbUrl, function (err, db) {
        var files = db.collection('Files');
        files.insertOne(
            {
                'message': file.message,
                'exclusive' : file.exclusive
            }
        ).then(function () {
            console.log('upload success');
            db.close();
        });
    })
};
exports.getUploadedFile = function (exclusiveKey) {
    return MongoClient.connect(mongodbUrl).then(function (db) {
        var files = db.collection('Files');
        console.log('111');
        return files.findOne({'exclusive': exclusiveKey})
    }).then(function (item) {
        console.log('222');
        return item.message;
    })
};