const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require("../models/blackList.model");

/**
 * @name registerUserController
 * @route POST /api/auth/register
 */
async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: 'All fields are required'
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedUsername = username.toLowerCase().trim();

  const isUserAlreadyExist = await userModel.findOne({
    $or: [
      { email: normalizedEmail },
      { username: normalizedUsername }
    ]
  });

  if (isUserAlreadyExist) {
    return res.status(409).json({
      message: 'User already exists'
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username: normalizedUsername,
    email: normalizedEmail,
    password: hash
  });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // ✅ FIXED COOKIE
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000
  });

  res.status(201).json({
    message: "User registered Successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    }
  });
}

/**
 * @name loginUserController
 * @route POST /api/auth/login
 */
async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email and password"
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email and password"
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // ✅ FIXED COOKIE (CRITICAL)
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    message: "User loggedIn",
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
}

/**
 * @name logoutUserController
 */
async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if (token) {
    await tokenBlacklistModel.create({ token });
  }

  // ✅ FIXED CLEAR COOKIE
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });

  res.status(200).json({
    message: 'User logged out successfully'
  });
}

/**
 * @name getMeController
 */
async function getMeController(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized - No user found"
      });
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User details fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error("GET ME ERROR:", error); // 🔥 VERY IMPORTANT
    res.status(500).json({
      message: "Server error"
    });
  }
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController
};