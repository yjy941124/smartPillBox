/**
 * Created by jinyangyu on 3/23/17.
 */
var bcrypt = require('bcryptjs'),
    Q = require('q'),
    config = require('./config.js'); //config file contains all tokens and other private info


// setup MongoDB connection information
var mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/smartPillBox';
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

exports.saveUploadFile = function (file) {
    MongoClient.connect(mongodbUrl, function (err, db) {
        var files = db.collection('Files');
        files.insertOne(file).then();
    })
}