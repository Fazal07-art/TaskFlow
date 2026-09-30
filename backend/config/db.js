const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[MongoDB] Failed to connect to MONGODB_URI (${err.message}). Falling back to in-memory MongoDB...`);
    }
  }

  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create();
    const inMemoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(inMemoryUri);
    console.log(`[MongoDB] Connected to in-memory MongoDB instance: ${inMemoryUri}`);
    return conn;
  } catch (memoryErr) {
    console.error(`[MongoDB] Critical: Failed to connect to any MongoDB instance:`, memoryErr.message);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (err) {
    console.error('[MongoDB] Error closing database connection:', err);
  }
};

module.exports = { connectDB, closeDB };
