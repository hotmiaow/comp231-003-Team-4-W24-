const functions = require('firebase-functions');
const { MongoClient } = require("mongodb");
const Db = functions.config().secret.mongo_url;
const client = new MongoClient(Db);

let _db;

module.exports = {
  connectToServer: async function (callback) {
    try {
      await client.connect();
    } catch (e) {
      console.error(e);
    }

    _db = client.db("Restaurants");

    return _db === undefined ? false : true;
  },
  getDb: function () {
    return _db;
  },
};
