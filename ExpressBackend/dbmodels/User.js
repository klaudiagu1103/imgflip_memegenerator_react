/**
 * Model to save a User to MongoDB
 */

const crypto = require("crypto"); // Encryption Library
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // bcryptjs is a Library that we use for hashing and comparing passwords in node. | Source: https://www.npmjs.com/package/bcrypt
const jwt = require("jsonwebtoken"); // jsonwebtoken is a Library that we use for securely transmitting digitally signed information in the authentication process. | Source: https://www.npmjs.com/package/jsonwebtoken

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
  },

  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },

  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// if password is not remodified we do not rehash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  // salt is bcrypt function that takes password and generates hash (10 digits)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// This method compares the password that is entered with the password of the user that is already saved in the database
UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // Move date into future + 10min so that reset password is only possible within 10 minutes.
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

  return resetToken;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
