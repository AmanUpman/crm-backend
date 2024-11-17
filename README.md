Mini CRM & Campaign Management App (Backend)
This repository contains the backend for the Mini CRM & Campaign Management App, built using Node.js and Express.js, with MongoDB as the database. It handles customer data, orders, audience segmentation, campaign management, message tracking, and integrates with RabbitMQ for message queuing.

🚀 Features
Customer Management: Create, read, update, delete, and bulk-upload customer data.
Order Management: Manage and view customer orders.
Audience Segmentation: Create custom audience segments based on filter criteria.
Campaign Management: Create, send, and track campaigns.
Message Logging: Log and track message delivery status.
Pub/Sub Integration: Uses RabbitMQ for scalable message queuing.
Google OAuth (Optional): Integration with Google OAuth for authentication.

🛠️ Tech Stack
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Message Queue: RabbitMQ
Authentication: JSON Web Tokens (JWT), Passport.js (Google OAuth)
Environment Management: dotenv
Data Validation: Custom validation utilities

🗂️ RabbitMQ Integration
The app uses RabbitMQ for message queuing. The subscriber.js listens for messages and processes them by saving to the CommunicationsLog and updating message statuses.
Publisher Service (pubSubService.js): Handles sending messages to the queue.
Subscriber (subscriber.js): Consumes messages from the queue and logs them.

