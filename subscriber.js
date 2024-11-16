import amqp from 'amqplib';
import { publishToQueue } from './services/pubSubService.js';
import CommunicationsLog from './models/CommunicationsLog.js';
// Adjust import for CommonJS module (using default import)
import messageController from './controllers/messageController.js'; 

// Define the RabbitMQ URL from environment variables
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = 'messages';

// Function to establish a connection and listen for messages
const listenForMessages = async () => {
    try {
        // Establish connection with RabbitMQ
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Assert the queue (ensure it exists)
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log(`Listening for messages on queue: ${QUEUE_NAME}`);

        // Consume messages from the queue
        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                // Parse the message content
                const messageData = JSON.parse(msg.content.toString());
                console.log('Message received:', messageData);

                // Process the message (save it to the CommunicationsLog)
                const communicationsLog = new CommunicationsLog({
                    campaignId: messageData.campaignId,
                    customerId: messageData.customerId,
                    message: messageData.content,
                    status: 'sent', // Initial status can be 'sent' or whatever is relevant
                });

                // Save the communication log to the database
                await communicationsLog.save();
                console.log('Message logged in CommunicationsLog:', communicationsLog);

                // Update message status (simulating a delivery or failure check)
                // Adjust the method call from messageController
                await messageController.updateMessageStatus(messageData.messageId, 'delivered'); // Example of updating status

                // Acknowledge the message
                channel.ack(msg);
            }
        });

    } catch (error) {
        console.error('Error while connecting to RabbitMQ or processing message:', error);
    }
};

// Start the subscriber
listenForMessages();
