require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*"
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    res.status(400).json({
      error: true,
      message: "Full name is required"
    });
  }

  if (!email) {
    res.status(400).json({
      error: true,
      message: "Email is required"
    });
  }

  if (!password) {
    res.status(400).json({
      error: true,
      message: "Password is required"
    });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User already exists"
    });
  }

  const user = new User({
    fullName,
    email,
    password
  });

  await user.save();

  const accesToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m"
  });

  return res.json({
    error: false,
    user,
    accesToken,
    message: "Registration successfully"
  });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      error: true,
      message: "Email is required"
    });
  }

  if (!password) {
    return res.status(400).json({
      error: true,
      message: "Password is required"
    });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({
      message: "User not foun"
    });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accesToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m"
    });

    return res.json({
      error: false,
      message: "Login successfully",
      email,
      accesToken
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid credentials"
    });
  }
});

app.listen(8000);

module.exports = app;
