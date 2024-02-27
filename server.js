const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./config/db');
const server = require('./server');
const cookieParser = require('cookie-parser');

// load env vars
dotenv.config({ path: './config/config.env' });

// routes
const auth = require('./routes/auth');

// connect DB
connectDB();

const app = express();
// body parser
app.use(express.json());

app.use(cookieParser());

app.use('/api/v1/auth', auth);

const PORT = process.env.PORT || 5000;
app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    ),
);

// handle promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // close server & exit process
    server.close(() => process.exit(1));
});
