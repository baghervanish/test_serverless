const elastic = require("./connection");
const data = require("./data");
require("dotenv").config();


populateDatabase = async function populateDatabase() {
  const docs = [];
  for (const quote of quotes) {
    docs.push(esAction);
    docs.push(quote);
  }
  return elastic.esclient.bulk({
    body: docs
  });
}
module.exports = populateDatabase