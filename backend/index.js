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
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.use(cookieParser())


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

// Database - connection
connectionDB();

// Handle port listening - Vercel handles this automatically, but for local dev:
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running locally on port ${port}`);
    });
}

module.exports = app;

