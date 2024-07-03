/**
 * Elevator
 * Data elevator
**/

const ElevatorBase = require('data-elevator/lib/elevator-engine/elevator-base');
const ConsoleLogger = require('data-elevator/lib/logger/console-logger');
const MongoDbLevelController = require('./lib/level-controllers/mongodb-level-controller.js');

//__dirname is added only for the construct command so construct command knows where to find its resources
const elevator = new ElevatorBase(new ConsoleLogger(false), MongoDbLevelController, __dirname);
elevator.run(function(error) { });

