import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class DynamoDbProvider {
    private readonly dynamoDb: DynamoDB;
    constructor(
        private readonly region,
        private readonly dynamoDbTableName,
      ) {
        this.dynamoDb = new DynamoDB({
            region: this.region,
        });
    }


    async addUserToken(userName) {
        // create user token
        let userToken = uuidv4();
        // add user token to dynamo db
    
        // find epoch time of 300 seconds from now
        let epochTime = new Date().getTime() / 1000 + 300;
    
        let params = {
          TableName: this.dynamoDbTableName,
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
        await this.dynamoDb.putItem(params).promise();
        return userToken;
    }
    
    async verifyUserToken(userName, userToken) {
        // get user token from dynamo db
        // exclude expired tokens
        let params = {
          TableName: this.dynamoDbTableName,
          Key: {
            username: {
              S: userName,
            },
          },
        };
    
        let data = await this.dynamoDb.getItem(params).promise();
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
