import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';


const dynamoDb = new AWS.DynamoDB.DocumentClient(); 

@Injectable()
export default class AwsdynamoService {

    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    async addUserToken(userName) {
        // create user token
        let userToken = uuidv4();
        // add user token to dynamo db
    
        // find epoch time of 300 seconds from now
        let epochTime = new Date().getTime() / 1000 + 300;
        
        let params = {
            TableName: process.env.DYNAMODB_TABLE_TTL,
            Item: {
            username:  userName,
            usertoken: userToken,
            tokenttl: epochTime.toString(),
            }
        };
        this.logger.log('info','addUserToken called for user: ' + userName);
        this.logger.log('info','addUserToken token: ' + userToken);
        this.logger.log('info','dynamoDb.put called for user with params: ' + JSON.stringify(params));
        this.logger.log('info', `process.env.DYNAMODB_TABLE_TTL: ${process.env.DYNAMODB_TABLE_TTL}`);
        await dynamoDb.put(params).promise();
        return userToken;
    }
        
    async verifyUserToken(userName, userToken) {
        // get user token from dynamo db
        // exclude expired tokens
        let params = {
            TableName: process.env.DYNAMODB_TABLE_TTL,
            Key: {
            username: userName,
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
