const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// ✅ FIXED CORS (STRICT + COOKIE SUPPORT)
app.use(cors({
  origin: "https://skill-sight-eight.vercel.app", // 🔥 your frontend URL
  credentials: true
}));

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Test routes
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/test", (req, res) => {
  res.send("NEW BUILD WORKING ✅");
});

/* routes */
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

module.exports = app;