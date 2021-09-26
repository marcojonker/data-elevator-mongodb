/**
 * Test function for data elevator
**/

const TestBase = require('../node_modules/data-elevator/test/test-base.js');
const path = require('path');
const MongoDbLevelController = require('../lib/level-controllers/mongodb-level-controller.js');

//Start testing
const test = new TestBase(path.normalize(path.join(__dirname, '../')), MongoDbLevelController);
test.runDefaultCommandTests();
