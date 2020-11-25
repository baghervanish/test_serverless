// const { Client } = require('@elastic/elasticsearch')
// var elasticsearch = require('elasticsearch');
// const client = new elasticsearch.Client({ node: 'http://localhost:9200' })
// const { Client } = require('@elastic/elasticsearch')
// var elasticsearch = require('elasticsearch');


var elastic = require('./new');
// const elastic = require("../elastic");
// const quotes  = require("./quotes.json");

const esAction = {
  index: {
    _index: elastic.index,
    _type: elastic.type
  }
};

async function populateDatabase() {
    const docs = [];
    for (const quote of quotes) {
      docs.push(esAction);
      docs.push(quote);
    }
    return elastic.esclient.bulk({ body: docs });
  }




  // var aaqwq =client.indices.create({
//     index: 'product',        
//     body: {
//         name: 'aaa',
//         title: 'aaa'
//       }
// });

// const createIndex = async function(indexName){
//     return await 
// }

// const createIndex  = async function putMapping () {
//     console.log("Creating Mapping index");
//     client.indices.putMapping({
//         index: 'users',
//         type: 'staff',
//         body: {
//         properties: { 
//             firstname: { type: 'text' },
//             lastname: { type: 'text' },
//             email: { type: 'text' },
//             phone_number: { type: 'text' },
//             created_on: { type: 'date' },
//             updated_at: { type: 'date' } }
//         }
//     }, (err,resp, status) => {
//         if (err) {
//           console.error(err, status);   
//         }
//         else {
//             console.log('Successfully Created Index', status, resp);
//         }
//     });
// }


// client.indices.putMapping({
//     index: 'myindex',
//     type: 'mytype',
//     body: {
//     properties: {
//     'propertyname': {
//     'type': 'string'
//     },
//     }
//     }
//     },function(err,resp,status){
//     if (err) {
//     console.log(err);
//     }
//     else {
//     console.log(resp);
//     }
//     });

// module.exports = createIndex;
