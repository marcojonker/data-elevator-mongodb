/**
 * Elevator
 * Data elevator
**/

'use strict'

var util = require('util');
var ElevatorBase = require('data-elevator/lib/elevator-engine/elevator-base');
var ConsoleLogger = require('data-elevator/lib/logger/console-logger');
var MongoDbLevelController = require('data-elevator-mongodb/lib/level-controllers/mongodb-level-controller');

/**
 * Constructor
 * @param logger
 * @param LevelController
 */
var Elevator = function(logger, LevelController) {
    Elevator.super_.apply(this, arguments);
};

util.inherits(Elevator, ElevatorBase);

var elevator = new Elevator(new ConsoleLogger(false), MongoDbLevelController);

//Run the elevator
elevator.run(function(error) { });