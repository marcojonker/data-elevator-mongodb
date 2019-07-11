/**
 * MongoDbLevelController
 * Store and retrieve current level from mongodb
 **/

'use strict'

var util = require('util');
var async = require('async');
var path = require('path');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var Errors = require('data-elevator/lib/errors/elevator-errors');
var BaseLevelController = require('data-elevator/lib/level-controllers/base-level-controller.js');

/**
 * Constructor
 * @param config
 */
var MongoDbLevelController = function (config) {
    this.database = null;
    this.client = null;

    BaseLevelController.apply(this, arguments);

    if (!config.levelControllerConfig.connectionUrl || typeof config.levelControllerConfig.connectionUrl !== 'string' && config.levelControllerConfig.connectionUrl.length === 0) {
        throw Errors.invalidConfig('MongoDb connectionUrl missing in configuration file');
    }

    if (!config.levelControllerConfig.collectionName || typeof config.levelControllerConfig.collectionName !== 'string' && config.levelControllerConfig.collectionName.length === 0) {
        throw Errors.invalidConfig('MongoDb collectionName missing in configuration file');
    }
};

util.inherits(MongoDbLevelController, BaseLevelController);

/**
 * Disconnect database
 */
MongoDbLevelController.prototype.disconnect = function () {
    if (this.client) {
        this.client.close();
        this.client = null;
        this.database = null;
    }
};

/**
 * Get open database connection
 * @param callback(error, database)
 */
MongoDbLevelController.prototype.getConnection = function (callback) {
    var self = this;
    if (!this.database) {
        MongoClient.connect(this.config.levelControllerConfig.connectionUrl, this.config.levelControllerConfig.connectionOptions, function (error, mongoClient) {
            if (!self.database && !self.client) {
                self.client = mongoClient;
                self.database = mongoClient.db(mongoClient.s.options.dbName);
            }
            if (error) {
                return callback(Errors.generalError('MongoDb connection error', error), null);
            } else {
                return callback(null, self.database);
            }
        });
    } else {
        return callback(null, this.database);
    }
}

/**
 * Get thet database collection to store or retrieve the current level information from
 * @param callback(error, database, collection)
 */
MongoDbLevelController.prototype.getCollection = function (callback) {
    var self = this;
    self.getConnection(function (error, database) {
        if (!error) {
            var collection = database.collection(self.config.levelControllerConfig.collectionName);
            return callback(null, database, collection);
        } else {
            return callback(error, null, null);
        }
    });
};

/**
 * Get level from database
 * @param callback(error, database, collection, level)
 */
MongoDbLevelController.prototype.getLevel = function (callback) {
    var self = this;

    async.waterfall([
        function (callback) {
            self.getCollection(callback);
        },
        function (database, collection, callback) {
            collection.findOne(null, function (error, level) {
                if (error) {
                    return callback(Errors.generalError('Failed to get level from MongoDb database.', error));
                } else {
                    return callback(null, database, collection, level);
                }
            });
        }
    ], callback);
};

/**
 * Save level
 * @param level
 * @param callback(error)
 */
MongoDbLevelController.prototype.saveCurrentLevel = function (level, callback) {
    var self = this;

    async.waterfall([
        function (callback) {
            self.getLevel(callback);
        },
        function (database, collection, databaseLevel, callback) {
            var query = {_id: null};
            if (databaseLevel) {
                query._id = databaseLevel._id;
            }

            collection.updateOne(query, level, {upsert: true}, function (error, databaseLevel) {
                if (error) {
                    return callback(Errors.generalError('Failed to store level in MongoDb database.', error));
                } else {
                    return callback(null);
                }
            });
        }
    ], function (error) {
        self.disconnect();
        return callback(error);
    });
};

/**
 * Retrieve the current level
 * @param callback(error, level)
 */
MongoDbLevelController.prototype.retrieveCurrentLevel = function (callback) {
    var self = this;

    this.getLevel(function (error, database, collection, level) {
        self.disconnect();
        return callback(error, level);
    });
};

/**
 * Retrieve the content of the manual, this method can be overriden to display a custom manual
 * @param callback(error, content)
 */
BaseLevelController.getManual = function (callback) {
    var manualPath = path.join(__dirname, "../manual/manual.txt");

    fs.readFile(manualPath, 'utf8', function (error, content) {
        if (!error) {
            return callback(null, content);
        } else {
            return callback(Errors.generalError('Manual could not be read from path: ' + manualPath, error));
        }
    });
};

module.exports = MongoDbLevelController;