const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
dotenv.config();

const connectionDB = require("./config/Database/connection");


const app = express();
const port = process.env.PORT;


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
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
app.use(cookieParser())

// Health check and environment verification
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        environment: process.env.NODE_ENV,
        hasMongoUrl: !!process.env.MONGO_URL,
        hasJwtSecret: !!process.env.JWT_SECRET
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
    console.error('SERVER ERROR:', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Detailed error in server logs'
    });
});

// Database - connection
connectionDB().catch(err => {
    console.error("FAILED TO INITIALIZE DATABASE:", err.message);
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running locally on port ${port}`);
    });
}

module.exports = app;

