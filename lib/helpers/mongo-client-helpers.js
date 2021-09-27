const MongoClient = require('mongodb').MongoClient;

class MongoClientHelpers {
  constructor() {
    this.client = null;
    this.database = null;
  }

  /**
     * Close the currently opened database
     */
  closeDatabase() {
    if (this.client) {
      this.client.close();
      this.client = null;
      this.database = null;
    }
  }

  /**
     * Get a database connection
     * @param FloorWorkerParameters - These parameters contain the connection settings
     * @param callback(error, database)
     */
  getConnection(floorWorkerParameters, callback) {
    if (!this.database) {
      const config = floorWorkerParameters.config.levelControllerConfig;
      MongoClient.connect(config.connectionUrl, config.connectionOptions, (error, mongoClient) => {
        this.client = mongoClient;
        this.database = mongoClient.db(mongoClient.s.options.dbName);
        this.database.on('close', () => {
          this.database = null;
        });
        return callback(error, this.database);
      });
    } else {
      return callback(null, this.database);
    }
  }

  /**
     * Get a collection
     * @param FloorWorkerParameters - These parameters contain the connection settings
     * @param collectionName - The name of the collection
     * @param callback(error, database, collection)
     */
  getCollection(floorWorkerParameters, collectionName, callback) {
    this.getConnection(floorWorkerParameters, (error, database) => {
      if (!error) {
        database.collection(collectionName, (error, collection) => {
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
  getDocuments(floorWorkerParameters, collectionName, callback) {
    this.getCollection(floorWorkerParameters, collectionName, (error, database, collection) => {
      if (!error) {
        collection.find({}).toArray((error, documents) => {
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
  }
}

module.exports = new MongoClientHelpers();
