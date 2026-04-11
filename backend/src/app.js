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

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://skill-sight-eight.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* routes */
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

module.exports = app;