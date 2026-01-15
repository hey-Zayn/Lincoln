const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectionDB = require("./config/Database/connection");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Handle Uncaught Exceptions (Prevent server crash without log)
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message, err.stack);
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});

// Critical environment validation
const REQUIRED_VARS = ['MONGO_URL', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'Node_Mailer_Email', 'Node_Mailer_App_password'];
REQUIRED_VARS.forEach(v => {
    if (!process.env[v]) {
        console.error(`CRITICAL CONFIG ERROR: ${v} is not defined.`);
    }
});

// Database connection middleware for Serverless
// This ensures the DB is connected before processing any request
const connectDBMiddleware = async (req, res, next) => {
    try {
        await connectionDB();
        next();
    } catch (err) {
        console.error("Database connection middleware error:", err.message);
        res.status(500).json({
            success: false,
            message: "Service temporarily unavailable (Database Error)",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

const allowedOrigins = [
    "https://lincoln-lms.vercel.app",
    "http://localhost:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Apply DB connection middleware to all /api routes
app.use('/api', connectDBMiddleware);

// Health check and environment verification
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        environment: process.env.NODE_ENV || 'development',
        dbConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        vars: {
            hasMongoUrl: !!process.env.MONGO_URL,
            hasJwtSecret: !!process.env.JWT_SECRET,
            hasCloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
            hasNodeMailer: !!process.env.Node_Mailer_Email
        }
    });
});

// apis 
app.use('/api/users', require('./router/user.router'));
app.use('/api/courses', require('./router/course.router'));
app.use('/api/sections', require('./router/section.router'));
app.use('/api/lectures', require('./router/lecture.router'));
app.use('/api/classes', require('./router/class.router'));
app.use('/api/departments', require('./router/department.router'));
app.use('/api/timetable', require('./router/timetable.router'));

app.get('/', (req, res) => {
    res.send('Lincoln LMS API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack || err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Detailed error in server logs'
    });
});

// Initial Database connection for local dev
if (process.env.NODE_ENV !== 'production') {
    connectionDB().then(() => {
        app.listen(port, () => {
            console.log(`Server is running locally on port ${port}`);
        });
    }).catch(err => {
        console.error("FAILED TO INITIALIZE DATABASE LOCALLY:", err.message);
    });
}

// Handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message, err.stack);
    // On Vercel, we don't necessarily exit, but in VM/Container we should
});

module.exports = app;

