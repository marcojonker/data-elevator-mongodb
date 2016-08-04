
/** ============================================================================
 * This example migrate the object status from 1 to 2
*  ============================================================================*/

var MongoClientHelpers = require('data-elevator-mongodb/lib/helpers/mongo-client-helpers');
var async = require('async');

module.exports = {
    /**
     * Data transformation that need to be performed when migrating the data up
     * @param floorWorkerParameters - instance of FloorWorkerParameters
     * @param callback(error) - If an error is returned then all the subsequent migration will not be handled
     */
    onUp : function(floorWorkerParameters, callback) {
        MongoClientHelpers.getDocuments(floorWorkerParameters, 'dataobjects', function(error, database, collection, documents) {
            async.each(documents, 
                function(document, callback) {
                    if(document.objectStatus == 1) {
                        document.objectStatus = 2;
                        collection.update({"_id": document._id}, document, null, function(error, document) {
                            return callback(error);
                        })
                    } else {
                        return callback(null);
                    }
                }, 
                function(error) {
                    MongoClientHelpers.closeDatabase();
                    return callback(error);
                });
        });
    }, 
    /**
     * Data transformation that need to be performed when migrating the data down
     * @param floorWorkerParameters - instance of FloorWorkerParameters
     * @param callback(error) - If an error is returned then all the subsequent migration will not be handled
     */
    onDown : function(floorWorkerParameters, callback) {
        MongoClientHelpers.getDocuments(floorWorkerParameters, 'dataobjects', function(error, database, collection, documents) {
            async.each(documents, 
                function(document, callback) {
                    if(document.objectStatus == 2) {
                        document.objectStatus = 1;
                        collection.update({"_id": document._id}, document, null, function(error, document) {
                            return callback(error);
                        })
                    } else {
                        return callback(null);
                    }
                }, 
                function(error) {
                    MongoClientHelpers.closeDatabase();
                    return callback(error);
                });
        });
    }
}


/** ============================================================================
 * This example migrate the object status from 1 to 2
*  ============================================================================*/
