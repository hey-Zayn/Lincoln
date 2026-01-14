const mongoose = require("mongoose");

let isConnected = false;

const connectionDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log("Using existing database connection");
        return;
    }

    if (!process.env.MONGO_URL) {
        console.error("MONGO_URL is not defined in environment variables");
        throw new Error("Missing MONGO_URL");
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        isConnected = !!db.connections[0].readyState;
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error.message);
        throw error;
    }
}

module.exports = connectionDB;