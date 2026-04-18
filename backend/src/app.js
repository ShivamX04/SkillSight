const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  "https://skill-sight-eight.vercel.app",
  "https://skill-sight-lv8dac1h9-shivamx04s-projects.vercel.app",
  "https://skill-sight-ajvsn5knk-shivamx04s-projects.vercel.app" // ✅ ADD THIS
];

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin || 
      origin.includes("vercel.app") // ✅ allow all Vercel previews
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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