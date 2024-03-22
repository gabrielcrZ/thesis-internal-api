import amqp from "amqplib/callback_api.js";
import handleOrderUpdate from "./AsyncHandler.js";

const rabbitConnect = () => {
  amqp.connect(
    `amqps://${process.env.RABBIT_USERNAME}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}`,
    (connectionErr, connection) => {
      if (connectionErr) {
        throw connectionErr;
      }

      connection.createChannel((channelErr, channel) => {
        if (channelErr) {
          throw channelErr;
        }

        channel.assertQueue(`${process.env.RABBIT_QUEUE}`, {
          durable: true,
        });

        channel.consume(
          `${process.env.RABBIT_QUEUE}`,
          async (payload) => {
            if (payload != null) {
              let contents = JSON.parse(payload.content.toString());
              await handleOrderUpdate(contents);
            }
          },
          {
            noAck: true,
          }
        );
      });
    }
  );
};

export default rabbitConnect;
