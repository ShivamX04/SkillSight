const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173' // fallback for safety
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

/* routes */
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

module.exports = app;