// config/db.js
const mongoose = require('mongoose');

const USER = 'Cinema';
const PASSWORD = '12345';
const HOST = '127.0.0.1'; 
const DB_NAME = 'cinebook'; 

// The URI is correct: user, password, and target DB are all defined on cinebook.
const MONGO_URI = `mongodb://${USER}:${PASSWORD}@${HOST}:27017/${DB_NAME}`; 

const connectDB = async () => {
    try {
        // Use the simplified URI without any specific authentication options
        await mongoose.connect(MONGO_URI);
        
        // Final success message for the deliverable
        console.log('✅ MongoDB connected successfully with limited Cinema user!');
        
    } catch (error) {
        // Only output the standard failure message and exit
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;