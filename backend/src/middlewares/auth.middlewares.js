const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blackList.model');

async function authUser(req, res, next) {
  try {
    console.log("🔥 MIDDLEWARE HIT");
    console.log("COOKIES:", req.cookies);
    console.log("AUTH HEADER:", req.headers.authorization);

    let token;

    // ✅ 1. PRIORITY: GET TOKEN FROM COOKIE
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // ✅ 2. FALLBACK: GET TOKEN FROM AUTH HEADER
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ❌ NO TOKEN
    if (!token) {
      return res.status(401).json({
        message: "Token not provided",
      });
    }

    // ✅ CHECK BLACKLIST
    const isTokenBlackListed = await tokenBlacklistModel.findOne({ token });

    if (isTokenBlackListed) {
      return res.status(401).json({
        message: "Token is invalid (blacklisted)",
      });
    }

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ ATTACH USER TO REQUEST
    req.user = decoded;

    next();

  } catch (err) {
    console.error("Auth Middleware Error:", err);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

module.exports = { authUser };