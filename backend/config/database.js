
// ============================================
// FILE: config/database.js
// ============================================
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelgoHo';
    // Hide password in console logs for security
    const loggedUri = connUri.replace(/:([^:@]+)@/, ':****@');
    console.log(`⏳ Connecting to MongoDB at ${loggedUri}...`);
    await mongoose.connect(connUri);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
