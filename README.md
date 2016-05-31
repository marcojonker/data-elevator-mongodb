# DATA ELEVATOR MONGODB? #

The data elevator mongodb is an easy to use and very flexible utility for migrating data sources based on the NPM module [data elevator](Link URL). The only difference is that data elevator mongodb stores its current migration level in a MongoDb database.

Storing the current migration level in a database brings advantages when a project shares its data source with multiple running instances of a project. For example when multiple developers working with one database or the project runs on multiple servers.

# INSTALL #

* Add the data-elevator-mongodb to packages.json
* Install the module
```
#!shell

npm install
```

# QUICKSTART #
*
Note: It is best to run commands from the root directory of you project because the project handles directories relative to the location the process was started from.*

1 Construct a new data elevator for the project.
```
#!shell
node ./node-modules/data-elevator-mongodb/elevator.js construct
```
2 Add a new floor.
```
#!shell
node ./data-elevator/elevator.js add --name="add phone number to users"
```
3 Enter you migration code in the generated floor file located in './data-elevator/floors/'.

4 Move the elevator up to migrate your data.
```
#!shell
node ./data-elevator/elevator.js up
```

# COMMANDS #

Parameters explained:

```
#!shell

--<parameter_name> (<alias>, <r=required, o=optional>) <description>     

```
### construct ###

Construct a new data elevator in you project. In principle this command is only performed once per project.

```
#!shell
Command: 'node ./node-modules/data-elevator-mongodb/elevator.js construct'
    
Parameters:
    --working-dir= (-w, o) Location to construct elevator (def=./data-elevator)
    --verbose      (-v, o) Verbose mode

Examples:
    node ./node-modules/data-elevator-mongodb/elevator.js construct
    node ./node-modules/data-elevator-mongodb/elevator.js construct  -c="./config"
```

### add ###

A new floor file will be created in which data migrations can be implemented. It is recommended to use the '--name' parameters for easier identification of the purpose of a floor.

```
#!shell
Command:   'node ./<working-dir>/elevator.js add'
    
Parameters:
    --name         (-n, o) Custom name of the floor
    --config-dir=  (-c, o) Data elevator config dir (default=./data-elevator)
    --verbose      (-v, o) Verbose mode

Examples:
    node ./data-elevator/elevator.js add
    node ./data-elevator/elevator.js add -n="migrating users" -c="./config"
```

### up ###

Elevator will move up and perform the migrations for each floor passed by.

```
#!shell
Command:    'node ./<working-dir>/elevator.js up'
    
Parameters:
    --floor       (-f, o) Floor to move to, if undefined elevator moves to the top   
    --config-dir  (-c, o) Data elevator config dir (default=./data-elevator)
    --verbose     (-v, o) Verbose mode

Examples:
    node ./data-elevator/elevator.js up
    node ./data-elevator/elevator.js up -f=5 -c="./config"

```

### down ###

Elevator will move down and perform the migrations for each floor passed by.

```
#!shell
Command:    'node ./<working-dir>/elevator.js down'

Parameters:
    --floor       (-f, r) Floor to move to
    --config-dir  (-c, o) Data elevator config dir (default=./data-elevator)
    --verbose     (-v, o) Verbose mode

Examples:
    node ./data-elevator/elevator.js down -f=2
    node ./data-elevator/elevator.js down -f=5 -c="./config"
```

### status ###

Display the last action of the elevator.

```
#!shell
Command:    'node ./<working-dir>/elevator.js status'

Parameters:
    --config-dir  (-c, o) Data elevator config dir (default=./data-elevator)
    --verbose     (-v, o) Verbose mode

Examples:
    node ./data-elevator/elevator.js status
    node ./data-elevator/elevator.js status -c="./config"
```

# CONFIGURATION #

* **levelControllerConfig.collectionName:** Name of the collection to store the migration level in
* **levelControllerConfig.connectionOptions:** Connection options,
* **levelControllerConfig.connectionUrl:** Url for database connection

```
#!javascript

var config = {
    levelControllerConfig: {
       collectionName: "_data_elevator",
       connectionOptions: null,
       connectionUrl: "localhost:27012/test"
    }
}

```

# FLOOR TEMPLATE #

When a new floor is added the file 'floor-template.js' from the working directory is used as the template. Alterations to floor template are added to new floors. The minimal template contains at least the 'onUp' and 'onDown' function.

```
#!javascript
module.exports = {
    /**
     * Data transformation that need to be performed when migrating the data up
     * @param floorWorkerParameters - instance of FloorWorkerParameters
     * @param callback(error) - If an error is returned then all the subsequent migration will not be handled
     */
    onUp : function(floorWorkerParameters, callback) {
        return callback(null);
    }, 
    /**
     * Data transformation that need to be performed when migrating the data down
     * @param floorWorkerParameters - instance of FloorWorkerParameters
     * @param callback(error) - If an error is returned then all the subsequent migration will not be handled
     */
    onDown : function(floorWorkerParameters, callback) {
        return callback(null);
    }
}

```

### FloorWorkerParameters ###

The FloorWorkerParameters gives access to the current configuration, the logger and the current floor object. 

```
#!javascript

var FloorWorkerParameters = function(config, logger, floor) {
    this.config = config;
    this.floor = floor;
    this.logger = logger;
};

```

# CUSTOM STUFF #

This documentation contains only the basics about implementing a data elevator. For a more detailed documentation about the customization possibilities see the [data elevator documentation](Link URL).