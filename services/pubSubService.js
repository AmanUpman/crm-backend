const amqp = require('amqplib');

// Function to publish data to a specified queue
const publishToQueue = async (queueName, data) => {
    try {
        // Connect to RabbitMQ using the URL from environment variables
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Ensure the queue exists
        await channel.assertQueue(queueName, { durable: true });

        // Send the message to the queue
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
        console.log(`Message sent to queue ${queueName}:`, data);

        // Close the channel and connection after sending the message
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error in publishing to queue:', error);
    }
};

// Export the function to make it available for use in other parts of the application
module.exports = {
    publishToQueue
};
