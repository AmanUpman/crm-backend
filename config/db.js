const mongoose = require('mongoose');



const MONGODB_URI = 'mongodb://localhost:27017/crm_database';
const connectDB = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        // Additional options can be added as needed
    };

    try {
        await mongoose.connect('mongodb://localhost:27017/crm_database', options);
        console.log('MongoDB connected successfully');
    } catch (error) {
      console.log(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }

    mongoose.connection.on('error', (err) => {
      console.log(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB connection lost. Attempting to reconnect...');
        connectDB(); // Reconnect on disconnect
    });
};

// Graceful shutdown
const shutdown = () => {
    mongoose.connection.close(() => {
      console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Initial connection
module.exports = connectDB;
