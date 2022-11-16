import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient(); 

@Injectable()
export default class AwsdynamoService {

    async addUserToken(userName) {
        // create user token
        let userToken = uuidv4();
        // add user token to dynamo db
    
        // find epoch time of 300 seconds from now
        let epochTime = new Date().getTime() / 1000 + 300;
    
        let params = {
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
            username: {
                S: userName,
            },
            usertoken: {
                S: userToken,
            },
            tokenttl: {
                N: epochTime.toString(),
            },
            },
        };
        await dynamoDb.put(params).promise();
        return userToken;
    }
        
    async verifyUserToken(userName, userToken) {
        // get user token from dynamo db
        // exclude expired tokens
        let params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
            username: {
                S: userName,
            },
            },
        };
    
        let data = await dynamoDb.get(params).promise();
        if (data.Item && data.Item.usertoken && data.Item.tokenttl) {
            let userTokenFromDb = data.Item.usertoken.S;
            let tokenTTL = parseInt(data.Item.tokenttl.N);
            let currentTime = new Date().getTime() / 1000;
            if (userTokenFromDb === userToken && currentTime < tokenTTL) {
            return true;
            }
        }
        return false;
    }
}
