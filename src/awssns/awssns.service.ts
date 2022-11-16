import { Injectable } from '@nestjs/common';
import { SNS } from "aws-sdk";

@Injectable()
export default class AwssnsService {
  private client: AWS.SNS;
  constructor() {
    this.client = new SNS({
      region: "us-west-1",
    });
  }

  public getTopic(type: string) {
    switch (type) {
      // TBD create enum of all event types
      case "events":
        return process.env.SNS_TOPIC_ARN;
    }
  }

  async publishMessage(payload: any) {

    const params = {
      Message: JSON.stringify(payload),
      TopicArn: this.getTopic("events"),
    };

    // Create promise and SNS service object
    const response = await this.client.publish(params).promise();

    return {
      MessageId: response.MessageId,
      SequenceNumber: response.SequenceNumber,
    };
  }
}