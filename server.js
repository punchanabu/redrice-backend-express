const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const server = require('./server');
const errorHandler = require('./middleware/errorHandler');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// load env vars
dotenv.config({ path: './config/config.env' });

// import routes
const restaurant = require('./routes/restaurant');
const auth = require('./routes/auth');
const reservation = require('./routes/reservation');

// connect DB
connectDB();

const app = express();
// body parser
app.use(express.json());

// security
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
// Rate Limiting
const limiter = rateLimit({
    windowsMs: 10 * 60 * 1000, // 10 mins
    max: 100,
});
app.use(limiter);
app.use(hpp());

app.use(cookieParser());

// use routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/restaurant', restaurant);
app.use('/api/v1/reservation', reservation);

// use centralize error handler
app.use(errorHandler);

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
