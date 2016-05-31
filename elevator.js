/**
 * Elevator
 * Data elevator
**/

'use strict'

var ElevatorBase = require('data-elevator/elevator-base');
var ConsoleLogger = require('data-elevator/logger/console-logger');
var LevelController = require('./lib/controllers/level-controllers/mongodb-level-controller.js');

//__dirname is added only for the construct command so construct command knows where to find its resources
var elevator = new ElevatorBase(new ConsoleLogger(false), LevelController, __dirname);
elevator.run(function(error) { });

