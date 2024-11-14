const PORT = process.env.MONGODB_PORT || 27017;
const HOST = process.env.MONGODB_HOST || "localhost";

console.log(HOST)

var config = {
    levelControllerConfig: {
       collectionName: "_data_elevator",
       connectionUrl: `mongodb://${HOST}:${PORT}/admin`
    }
}

module.exports = config;
