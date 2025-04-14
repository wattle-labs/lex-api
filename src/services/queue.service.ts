import { PubSub, Topic } from '@google-cloud/pubsub';

export class QueueService<T> {
  private pubsub: PubSub;
  private topic: Topic;

  constructor(topicName: string) {
    this.pubsub = new PubSub();
    if (!topicName) {
      throw new Error('Topic name is required');
    }
    this.topic = this.pubsub.topic(topicName);
  }

  async add(jobName: string, data: T) {
    const message = {
      data: Buffer.from(JSON.stringify(data)),
      attributes: {
        jobName,
      },
    };
    return await this.topic.publishMessage(message);
  }
}
