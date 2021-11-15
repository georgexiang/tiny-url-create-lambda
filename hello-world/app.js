// const axios = require('axios') test 1115
// const url = 'http://checkip.amazonaws.com/';
let response;

var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

const { default: ShortUniqueId } = require('short-unique-id');

const uid = new ShortUniqueId();
const TableName = "url-tiny-table";

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
    try {

        console.log("Event received:\n");
        console.log(JSON.stringify(event))
        console.log("Context received:\n");
        console.log(JSON.stringify(context))
        const  paramsQuery  = event.queryStringParameters
        console.log(paramsQuery)
        let original_url
        if(paramsQuery!=null && paramsQuery['original_url'] !=null){       
            original_url=paramsQuery.original_url
            console.log('original_url____'+original_url)
            // console.log(original_url)
        }
        const pathParameters=event.pathParameters
        console.log(pathParameters)
        let tinyid_path
        if(pathParameters!=null && pathParameters['tinyid'] !=null){
            tinyid_path=pathParameters.tinyid
            console.log('tinyid____'+tinyid_path)
        }
        

        //check tinyid if exist
        if(tinyid_path!=='666'){       
            const getResponse = await checkTinyIdIfExists(tinyid_path)
            if (getResponse !=null && getResponse['Item'] !=null ) {
                response = {
                    'statusCode': 200,
                    'url_redirect': getResponse.Item.original_url,
                    'body': JSON.stringify({
                        message: 'tiny id existed.',
                        status: 'existed',
                        data: getResponse.Item
                        // location: ret.data.trim()
                    })
                }               
            }else {
                response = {
                    'statusCode': 404,
                    'body': JSON.stringify({
                        message: 'tiny id'+ tinyid_path+'not existed, make sure input right tiny url.',
                        status: 'not existed'
                        // location: ret.data.trim()
                    })
                }    

            }
            return response
        
        }

         //check original url if exist
        const queryResponse =await  checkUrlIfExists(original_url)
        if (queryResponse.Count != 0) {
            response = {
                'statusCode': 200,
                'body': JSON.stringify({
                    message: 'original url existed.',
                    status: 'existed',
                    data: queryResponse.Items[0]
                })
            }
            return response;
        } 
        
        const params = {
            TableName,
            Item: {
              original_url: original_url,
              tiny_id: uid()
            },
          }
        console.log(params) 

        await docClient.put(params).promise()  
        // const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'tiny url created',
                status: 'created',
                data: params.Item
                // location: ret.data.trim()
            })
        }
    } catch (err) {
        console.log(err)
        return err
    }
    return response
}

async function checkTinyIdIfExists  (tiny_id) {
    try {
        const getResponse= await docClient.get({
        TableName,
        Key: {
          tiny_id
        }
      }).promise();
        console.log(getResponse)
        return getResponse;
    } catch (error) {
      console.log(error)
      return false
    }
  }

  async function  checkUrlIfExists  (original_url) {
    try{
        console.log('checkUrlIfExists__'+original_url)
        const queryResponse = await docClient.query({
            TableName,
            IndexName: 'original_url-index',
            KeyConditionExpression: "original_url = :v_original_url",
            ExpressionAttributeValues: {
            ":v_original_url": original_url
            }
        }).promise()        
        console.log(queryResponse)
        // console.log(queryResponse.Items[0])
        return queryResponse
    }catch (error) {
        console.log(error)
        return false
      }

  } 
  