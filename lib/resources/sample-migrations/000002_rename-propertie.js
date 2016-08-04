/**
 * This example renames a proberty called statText to statusText on all objects in a collection
*/
var MongoClientHelpers = require('data-elevator-mongodb/lib/helpers/mongo-client-helpers');
var async = require('async');

module.exports = {
    /**
     * Data transformation that need to be performed when migrating the data up
     * @param floorWorkerParameters - instance of FloorWorkerParameters
     * @param callback(error) - If an error is returned then all the subsequent migration will not be handled
     */
    onUp : function(floorWorkerParameters, callback) {
        MongoClientHelpers.getCollection(floorWorkerParameters, 'dataobjects', function(error, database, collection) {
                var renameFields = {
                    'statText': 'statusText' 
                };

                collection.update({}, { $rename: renameFields }, {multi: true}, function(error) {
                    MongoClientHelpers.closeDatabase();
                    return callback(error);
                })
        });
    }, 
    /**
     * Data transformation that need to be performed when migrating the data down
     * @param floorWorkerParameters - instance of FloorWorkerParameters
     * @param callback(error) - If an error is returned then all the subsequent migration will not be handled
     */
    onDown : function(floorWorkerParameters, callback) {
        MongoClientHelpers.getCollection(floorWorkerParameters, 'quotes', function(error, database, collection) {
                var renameFields = {
                    'statusText': 'statText' 
                };

                collection.update({}, { $rename: renameFields }, {multi: true}, function(error) {
                    MongoClientHelpers.closeDatabase();
                    return callback(error);
                })
        });
    }
}