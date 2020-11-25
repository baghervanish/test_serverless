'use strict';



module.exports.hello = async event => {

  // const isElasticReady = await elastic.checkConnection();
  // console.log(isElasticReady,"3333333333333333333333333333333333")

   // Let's search!
   const { body } = await client.search({
    index: 'quotes',
    // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
    body: {
      query: {
        match: { quote: 'winter' }
      }
    }
  })

  console.log(body.hits.hits)
}

run().catch(console.log)


  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
