var MongoClient = require('mongodb').MongoClient;

function MongoClientHelpers() {
    this.client = null;
    this.database = null;
}

/**
 * Close the currently opened database
 */
MongoClientHelpers.prototype.closeDatabase = function () {
    if (this.client) {
        this.client.close();
        this.client = null;
        this.database = null;
    }
};

/**
 * Get a database connection
 * @param FloorWorkerParameters - These parameters contain the connection settings
 * @param callback(error, database)
 */
MongoClientHelpers.prototype.getConnection = function (floorWorkerParameters, callback) {
    var self = this;
    if (!self.database) {
        var config = floorWorkerParameters.config.levelControllerConfig;
        MongoClient.connect(config.connectionUrl, config.connectionOptions, function (error, mongoClient) {
            self.client = mongoClient;
            self.database = mongoClient.db(mongoClient.s.options.dbName);
            self.database.on('close', function () {
                self.database = null;
            });
            return callback(error, self.database);
        });
    } else {
        return callback(null, self.database);
    }
};

/**
 * Get a collection
 * @param FloorWorkerParameters - These parameters contain the connection settings
 * @param collectionName - The name of the collection
 * @param callback(error, database, collection)
 */
MongoClientHelpers.prototype.getCollection = function (floorWorkerParameters, collectionName, callback) {
    var self = this;
    this.getConnection(floorWorkerParameters, function (error, database) {
        if (!error) {
            database.collection(collectionName, function (error, collection) {
                if (!error) {
                    return callback(null, database, collection);
                } else {
                    return callback(error, null, null);
                }
            });
        } else {
            return callback(error, null, null);
        }
    });
}

/**
 * Get all documents of a collection
 * @param floorWorkerParameters - These parameters contain the connection settings
 * @param collectionName - The name of the collection
 * @param callback(error, database, collection, documents)
 */
MongoClientHelpers.prototype.getDocuments = function (floorWorkerParameters, collectionName, callback) {
    this.getCollection(floorWorkerParameters, collectionName, function (error, database, collection) {
        if (!error) {
            collection.find({}).toArray(function (error, documents) {
                if (!error) {
                    return callback(null, database, collection, documents);
                } else {
                    return callback(error, null, null, null);
                }
            });
        } else {
            return callback(error, null, null);
        }
    });
};

module.exports = new MongoClientHelpers();
