const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// ✅ FIXED CORS (supports all Vercel deployments)
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    // allow all Vercel domains
    if (origin.includes("vercel.app")) {
      return callback(null, true);
    }

    // allow localhost (for development)
    if (origin.includes("localhost")) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// ✅ Other middlewares
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