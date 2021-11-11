
// var event='\{
//     "body": "{\"message\": \"hello world\"}",
// }\' 
var fs = require( 'fs' )

const path = require('path');

let rootPath = path.resolve(__dirname,'..'); //代码文件的根路径

console.log('rootPath:'+rootPath)

const filenameJson =rootPath+'/events/event.json'

const data = fs.readFileSync(filenameJson, 'utf8');
// parse JSON string to JSON object
const event = JSON.parse(data);

// console.log(event)

 const  body  = event.queryStringParameters
 console.log(body)


 const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = "url-tiny-table";

const redirectUrl = async ( ) => {

  const queryResponse = await docClient.query({
    TableName,
    IndexName : 'original_url-index',
    KeyConditionExpression: "original_url = :v_original_url",
    ExpressionAttributeValues: {
      ":v_original_url": 'http://www.original.com/12'
    }
  }).promise();

  console.log(queryResponse)

  if (queryResponse.Items.length < 1) {
    console.log('not found')
  }else {
    
  }


};

redirectUrl()

// const checkTinyIdIfExists = async (tiny_id) => {
//     try {
//       const existingId = await docClient.get({
//         TableName,
//         Key: {
//           tiny_id
//         }
//       }).promise();
//       console.log( existingId)
//       console.log(Object.keys(tiny_id).length)
//     //   console.log(Object.keys(tiny_id).length !== 0 || existingId)
//     //   return Object.keys(tiny_id).length !== 0 || existingId;
//       return existingId
//     } catch (error) {
//       return false
//     }
//   }

//  var existingId=  checkTinyIdIfExists('D6M1zR')
//  console.log(existingId)

// var original_url='dddd'
// // var AWS = require("aws-sdk");
// // var docClient = new AWS.DynamoDB.DocumentClient();

// console.log('checkUrlIfExists__'+original_url)
// const queryResponse = await docClient.query({
//     TableName,
//     IndexName: 'original_url-index',
//     KeyConditionExpression: "original_url = :v_original_url",
//     ExpressionAttributeValues: {
//     ":v_original_url": original_url
//     }
// }).promise()        
// console.log(queryResponse)