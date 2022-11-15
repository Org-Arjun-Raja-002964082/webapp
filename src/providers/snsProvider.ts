import * as AWS  from 'aws-sdk';
import { Logger } from 'winston';
import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class SnsProvider {
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger;
    private readonly sns: AWS.SNS;
  constructor(
    private topicArn,
    private region, 
    ) {
    this.topicArn = topicArn;
    this.region = region;
    AWS.config.update({ region: region });
    this.sns = new AWS.SNS({
      region: this.region,
    });
  }

  async publishMessage(message) {
    const params = {
      Message: message,
      TopicArn: this.topicArn,
    };

    try {
      const messageData = await this.sns.publish(params).promise();
      this.logger.info(
        `Message ${params.Message} sent to the topic ${params.TopicArn} with id ${messageData.MessageId}`
      );
    } catch (err) {
      console.log(err.message);
    }
  }
}

// module.exports = SnsProvider;