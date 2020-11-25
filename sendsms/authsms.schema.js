// module.exports = {
//     insert: {
//         "type": "object",
//         "properties": {
//             "mobile": { "type": "string" },
//             "password": { "type": "string" },
//             "fromDate": { "type": "string" },
//             "toDate": { "type": "string" },
//             "verify": { "type": "boolean" },
//         },
//         "required": ["mobile", "password"]
//     },
//     update: {
//         "type": "object",
//         "properties": {
//             "mobile": { "type": "string" },
//             "password": { "type": "string" },
//             "fromDate": { "type": "string" },
//             "toDate": { "type": "string" },
//             "verify": { "type": "boolean" },
//         },
//         "required": ["verify"]
//     },
// }

var esclient = require('./connection');
module.exports = async function createIndex(index) {
    try {
      await esclient.indices.create({ index });
      console.log(`Created index ${index}`);
    } catch (err) {
      console.error(`An error occurred while creating the index ${index}:`);
      console.error(err);
    }
  }
  
