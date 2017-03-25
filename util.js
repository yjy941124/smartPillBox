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
    return MongoClient.connect(mongodbUrl, function (err, db) {
        console.log("111");
        var files = db.collection('Files');
        return files.findOne({'exclusive' : exclusiveKey}, function (err, result) {
            if (err) {
                console.log(err);
            }
            if (result) {
                console.log('I have a result');
                console.log(result);
                return result.message;
            }
        })
    })
};