
# DATA ELEVATOR MONGODB #

The data elevator mongodb is an easy to use and very flexible utility for migrating data sources based on the NPM module [data elevator](Link URL). The only difference is that data elevator mongodb stores its current migration level in a mongodb database.

Storing the current migration level in a database brings advantages when a project shares its data source with multiple running instances of a project. For example when multiple developers working with one database or the project runs on multiple servers.

# QUICKSTART #

**STEP 1:** Install
```
npm install data-elevator-mongodb
```
**STEP 2:** Construct a new data elevator for the project.
```
node ./node-modules/data-elevator-mongodb construct
```
**STEP 3:** Add a new migration.
```
node ./data-elevator/elevator add "add phone number to users"
```
**STEP 4:** Enter you migration code in the generated floor file.
```
see: ./data-elevator/floors/
```
**STEP 5:** Move the elevator to migrate data.
```
node ./data-elevator/elevator move top
node ./data-elevator/elevator move ground
node ./data-elevator/elevator move 2
```
**STEP 6:** Use help command to get information about additional commands
```
node ./data-elevator/elevator help
```

# CONFIGURATION #

* **levelControllerConfig.collectionName:** Name of the collection to store the migration level in
* **levelControllerConfig.connectionOptions:** Connection options see [MongoDb website](http://www.mongodb.com) 
* **levelControllerConfig.connectionUrl:** Url for database connection

```
var config = {
    levelControllerConfig: {
       collectionName: "_data_elevator",
       connectionOptions: null,
       connectionUrl: null
    }
}
```

# FURTHER DOCUMENTATION #

For further documenation about commands or customizations see [data elevator documentation](https://www.npmjs.com/package/data-elevator).

# RELATED MODULES #

* data-elevator ([npm](https://www.npmjs.com/package/data-elevator), [bitbucket](https://bitbucket.org/cacadu/data-elevator/overview)) - store elevator migration levels in a plain file
* data-elevator-elasticsearch ([npm](https://www.npmjs.com/package/data-elevator-elasticsearch), [bitbucket](https://bitbucket.org/cacadu/data-elevator-elasticsearch/overview)) - store elevator migration levels in elasticsearch
* data-elevator-mongodb ([npm](https://www.npmjs.com/package/data-elevator-mongodb), [bitbucket](https://bitbucket.org/cacadu/data-elevator-mongodb/overview)) - store elevator migration levels in mongodb
* data-elevator-mysql ([npm](https://www.npmjs.com/package/data-elevator-mysql), [bitbucket](https://bitbucket.org/cacadu/data-elevator-mysql/overview)) - store elevator migration levels in mysql
* data-elevator-postgres ([npm](https://www.npmjs.com/package/data-elevator-postgres), [bitbucket](https://bitbucket.org/cacadu/data-elevator-postgres/overview)) - store elevator migration levels in postgres
* data-elevator-sqlite3 ([npm](https://www.npmjs.com/package/data-elevator-sqlite3), [bitbucket](https://bitbucket.org/cacadu/data-elevator-sqlite3/overview)) - store elevator migration levels in sqlite3
