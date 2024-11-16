const amqp = require('amqplib');
const CommunicationsLog = require('../models/CommunicationsLog');

const consumeMessages = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queueName = 'messageQueue';

        await channel.assertQueue(queueName, { durable: true });

        channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                const log = JSON.parse(msg.content.toString());

                // Simulate sending message
                log.status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
                await CommunicationsLog.findByIdAndUpdate(log._id, { status: log.status });

                console.log(`Processed message for customer ID ${log.customerId}, Status: ${log.status}`);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error in consuming messages:', error);
    }
};

consumeMessages();
