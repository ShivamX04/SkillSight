const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

/* =========================
   ALLOWED ORIGINS
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://skill-sight-eight.vercel.app",
];

/* =========================
   MIDDLEWARES
========================= */

app.use(
  cors({
    origin: function (origin, callback) {

      // allow requests with no origin
      // like postman/mobile apps
      if (!origin) {
        return callback(null, true);
      }

      // allow all vercel preview deployments
      if (
        allowedOrigins.includes(origin) ||
        origin.includes("vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

/* =========================
   TEST ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/test", (req, res) => {
  res.send("NEW BUILD WORKING ✅");
});

/* =========================
   ROUTES
========================= */

const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;