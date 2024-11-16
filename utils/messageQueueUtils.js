const amqp = require('amqplib');

exports.publishToQueue = async (queueName, data) => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error('Error in message queue:', error);
  }
};
