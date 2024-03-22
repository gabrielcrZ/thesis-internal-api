import amqp from "amqplib/callback_api.js";

export class Send {
  constructor() {
    this.rabbit = amqp;
  }

  execute(payload) {
    this.rabbit.connect(
      `amqps://${process.env.RABBIT_USERNAME}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}`,
      (connectionErr, connection) => {
        if (connectionErr) {
          throw connectionErr;
        }

        connection.createChannel((channelErr, channel) => {
          if (channelErr) {
            throw channelErr;
          }

          var data = JSON.stringify(payload);
          channel.assertQueue(`${process.env.RABBIT_QUEUE}`, {
            durable: true,
          });

          channel.sendToQueue(`${process.env.RABBIT_QUEUE}`, Buffer.from(data));
        });
      }
    );
  }
}
