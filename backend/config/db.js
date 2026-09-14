const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection && mongoose.connection.readyState === 1) {
    return true;
  }
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hms_db';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.log(`[MongoDB Note] ${error.message}. Operating in high-performance mock/in-memory database fallback mode.`);
    isConnected = false;
    return false;
  }
};

const getIsConnected = () => isConnected && mongoose.connection && mongoose.connection.readyState === 1;

module.exports = { connectDB, getIsConnected };

