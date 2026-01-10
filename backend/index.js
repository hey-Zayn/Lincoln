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
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser())


// apis 
app.use('/api/users', require('./router/user.router'));
app.use('/api/courses', require('./router/course.router'));
app.use('/api/sections', require('./router/section.router'));
app.use('/api/lectures', require('./router/lecture.router'));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Database - connection
connectionDB();

app.listen(port, () => {
    console.log(`Server is runing and listening on port ${port}`);
});

