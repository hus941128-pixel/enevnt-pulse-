const app = require('./app');
const connectDB = require('./config/db');
const { port, nodeEnv } = require('./config/env');

const startServer = async () => {
  await connectDB();

  const server = app.listen(port, () => {
    console.log(`EventPulse server running on port ${port} [${nodeEnv}]`);
  });

  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      const mongoose = require('mongoose');
      await mongoose.connection.close();
      console.log('Server and database connections closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer();
