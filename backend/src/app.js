const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// ✅ CORS FIRST (VERY IMPORTANT)
app.use(cors({
  origin: "https://skill-sight-eight.vercel.app",
  credentials: true
}));

// ✅ Other middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// 🔥 ADD THIS BELOW
app.get("/test", (req, res) => {
  res.send("NEW BUILD WORKING");
});

/* routes */
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

module.exports = app;