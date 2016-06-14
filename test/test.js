/**
 * Test function for data elevator
**/

'use strict'

var TestBase = require('../node_modules/data-elevator/test/test-base.js');
var path = require('path');
var MongoDbLevelController = require('../lib/level-controllers/mongodb-level-controller.js');

var test = new TestBase(path.normalize(path.join(__dirname, '../')), MongoDbLevelController);
test.runDefaultCommandTests();
