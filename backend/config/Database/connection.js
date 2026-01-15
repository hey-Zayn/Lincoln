const mongoose = require("mongoose");

const connectionDB = async () => {
    mongoose.set('strictQuery', true);

    const { readyState } = mongoose.connection;

    if (readyState === 1) {
        // console.log("Using existing database connection");
        return;
    }

    if (readyState === 2) {
        console.log("Database connection is currently in progress...");
        return;
    }

    if (!process.env.MONGO_URL) {
        console.error("CRITICAL ERROR: MONGO_URL is not defined in environment variables");
        throw new Error("Missing MONGO_URL");
    }

    try {
        console.log("Establishing new database connection...");
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error.message);
        // On Vercel/Serverless, we want to fail the request but not necessarily the entire instance
        throw error;
    }
}

module.exports = connectionDB;