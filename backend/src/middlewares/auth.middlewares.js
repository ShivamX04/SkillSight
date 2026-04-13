const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blackList.model')


async function authUser(req, res, next) {

    
console.log("🔥 MIDDLEWARE HIT");
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("AUTH HEADER:", req.headers.authorization)
  let token;

  // ✅ Check header first
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } 
  // ✅ Fallback to cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  const isTokenBlackListed = await tokenBlacklistModel.findOne({ token });

  if (isTokenBlackListed) {
    return res.status(401).json({
      message: "Token is Invalid.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token.",
    });
  }
}

module.exports = {authUser}