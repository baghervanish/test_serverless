'use strict';

const { Client } = require('@elastic/elasticsearch');
const mime = require('mime');
const client = new Client({ node: 'https://search-productdata-gewson6zruy7khdgnogwvy5jha.ap-southeast-2.es.amazonaws.com' });

module.exports.handler = async events => {
   // Let's search!
   const { body } = await client.search({
    index: 'country',
    body: 
    {
      "query": {
          "match_all": {}
      }
  }
  

  })
  console.log(body.hits.hits[1]._source,"aaaaaaaaaaaaaaaaaaaa")
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: events,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
