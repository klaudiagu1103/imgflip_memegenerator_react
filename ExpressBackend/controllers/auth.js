/**
 * This file is responsible for the backend connections for all login & authentication processes
 * Source for Tutorial: https://www.youtube.com/watch?v=YocRq-KesCM&t=1027s

 */

const crypto = require("crypto"); // Cryptography Library. Source: https://www.npmjs.com/package/crypto-js
const User = require("../dbmodels/User"); // Model for saving a user to the DB
const ErrorResponse = require("../utils/errorResponse"); // Error Responses
const sendEmail = require("../utils/sendEmail"); // Send Email component

//Register User
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  // Define parameters the User collection should contain
  // This is what a user needs to enter to register.
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    // send Token upon successful registration => Each user gets a unique token for authenication.
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// Login User
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check if user exists by email
  // If there are no such user credentials: ErrorResponse
  try {
    const user = await User.findOne({ email }).select("+password"); // Check the DB collection
    if (!user) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }
    // Check if passwords match
    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }
    // Send Token upon Login
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Forgot Password Initialization
exports.forgotpassword = async (req, res, next) => {
  // Check if user exists and send email
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Email could not be sent", 404));
    }

    // Reset Token and add to database (hashed)
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset url to email
    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    const message = `
        <h1>You have requested a password reset</h1>
        <p>Please go to this link to reset your password</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (error) {
      user.resetResetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
};

// Reset Token is created based on request from forgot Password
exports.resetpassword = async (req, res, next) => {
  // Crypto Library is used for encryption
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Reset Success",
    });
  } catch (error) {
    next(error);
  }
};
// Upon successful authentication, each Token is signed => See User Model in dbmodels
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};
