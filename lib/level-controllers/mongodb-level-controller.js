/**
 * MongoDbLevelController
 * Store and retrieve current level from mongodb
 **/
const async = require('async');
const MongoClient = require('mongodb').MongoClient;
const Errors = require('data-elevator/lib/errors/elevator-errors');
const BaseLevelController = require('data-elevator/lib/level-controllers/base-level-controller.js');

/**
 * Constructor
 * @param config
 */
class MongoDbLevelController extends BaseLevelController {
  constructor(config) {
    super(config);
    this.database = null;
    this.client = null;
    if (!config.levelControllerConfig.connectionUrl || typeof config.levelControllerConfig.connectionUrl !== 'string' && config.levelControllerConfig.connectionUrl.length === 0) {
      throw Errors.invalidConfig('MongoDb connectionUrl missing in configuration file');
    }

    if (!config.levelControllerConfig.collectionName || typeof config.levelControllerConfig.collectionName !== 'string' && config.levelControllerConfig.collectionName.length === 0) {
      throw Errors.invalidConfig('MongoDb collectionName missing in configuration file');
    }
  }

  /**
     * Disconnect database
     */
  disconnect() {
    if (this.client) {
      this.client.close();
      this.client = null;
      this.database = null;
    }
  }

  /**
     * Get open database connection
     * @param callback(error, database)
     */
  getConnection(callback) {
    if (!this.database) {
      MongoClient.connect(this.config.levelControllerConfig.connectionUrl, this.config.levelControllerConfig.connectionOptions).then((mongoClient) => {
        if (!this.database && !this.client) {
          this.client = mongoClient;
          this.database = mongoClient.db(mongoClient.s.options.dbName);
        }
        return callback(null, this.database);
      }).catch((error) => {
          return callback(Errors.generalError('MongoDb connection error', error), null);
      })
    } else {
      return callback(null, this.database);
    }
  }

  /**
     * Get thet database collection to store or retrieve the current level information from
     * @param callback(error, database, collection)
     */
  getCollection(callback) {
    this.getConnection((error, database) => {
      if (!error) {
        const collection = database.collection(this.config.levelControllerConfig.collectionName);
        return callback(null, database, collection);
      } else {
        return callback(error, null, null);
      }
    });
  }

  /**
     * Get level from database
     * @param callback(error, database, collection, level)
     */
  getLevel(callback) {
    async.waterfall([
      (callback) => {
        this.getCollection(callback);
      }, (database, collection, callback) => {
        collection.findOne().then((level) => {
          return callback(null, database, collection, level);
        }).catch((error) => {
          return callback(Errors.generalError('Failed to get level from MongoDb database.', error));
        });
      }
    ], callback);
  }

  /**
     * Save level
     * @param level
     * @param callback(error)
     */
  saveCurrentLevel(level, callback) {
    async.waterfall([
      (callback) => {
        this.getLevel(callback);
      }, (_database, collection, databaseLevel, callback) => {
        const query = { _id: null };
        if (databaseLevel) {
          query._id = databaseLevel._id;
        }

        collection.updateOne(query, { $set: level }, { upsert: true }).then((_result) => {
          return callback(null);
        }).catch((error) => {
          return callback(Errors.generalError('Failed to store level in MongoDb database.', error));
        });
      }
    ], (error) => {
      this.disconnect();
      return callback(error);
    });
  }

  /**
     * Retrieve the current level
     * @param callback(error, level)
     */
  retrieveCurrentLevel(callback) {
    this.getLevel((error, _database, _collection, level) => {
      this.disconnect();
      return callback(error, level);
    });
  }
}

module.exports = MongoDbLevelController;