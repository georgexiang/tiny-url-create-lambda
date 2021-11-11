'use strict';

const app = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;


var fs = require( 'fs' )

const path = require('path');
// //   



let rootPath = path.resolve(__dirname,'../../..'); //代码文件的根路径

console.log('rootPath:'+rootPath)

const filenameJson =rootPath+'/events/event.json'

const data = fs.readFileSync(filenameJson, 'utf8');
// parse JSON string to JSON object
 event = JSON.parse(data);

describe('Tests index', function () {
    it('verifies successful response', async () => {
        const result = await app.lambdaHandler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.be.equal("hello world");
        // expect(response.location).to.be.an("string");
    });
});



// /Users/workspace/lamda/lambda-function/tiny-url-function/tiny-url-create-func/hello-world/events/event.json
// /Users/workspace/lamda/lambda-function/tiny-url-function/tiny-url-create-func/events/event.json