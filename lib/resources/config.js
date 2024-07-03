
/* eslint-disable no-undef */
const environment = process.env.NODE_ENV ? process.env.NODE_ENV : "developent";
/* eslint-enable no-undef */

const config = {
  levelControllerConfig : {
    collectionName: "_data_elevator",
    connectionOptions: null,
    connectionUrl: null
  }
}

switch(environment) {
case "development":
  break;
}

module.exports = config;