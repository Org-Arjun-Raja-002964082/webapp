import { Inject, Injectable } from '@nestjs/common';
import { SNS } from "aws-sdk";
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export default class AwssnsService {
  private client: AWS.SNS;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {
    this.client = new SNS({
      region: "us-west-1",
    });
  }

  async publishMessage(payload: any) {

    this.logger.log('info', 'publishMessage called with payload: ' + JSON.stringify(payload));
    this.logger.log('info', `process.env.SNS_TOPIC_ARN: ${process.env.SNS_TOPIC_ARN}`);
    const params = {
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: JSON.stringify(payload)
    };
    this.logger.log('info','publishMessage called with params: ' + JSON.stringify(params));
    // Create promise and SNS service object
    const response = await this.client.publish(params).promise();

    return {
      MessageId: response.MessageId,
      SequenceNumber: response.SequenceNumber,
    };
  }
}