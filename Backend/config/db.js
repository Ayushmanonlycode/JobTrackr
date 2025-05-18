const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return mongoose.connection;
  }
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dashboard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      // Maintain up to 10 socket connections
      maxPoolSize: 10,
      // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000,
    });
    
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    return null;
  }
};

module.exports = connectDB; 