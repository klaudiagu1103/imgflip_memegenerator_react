/**
 * Model to save a Meme to MongoDB
 */

// Mongoose connection
const mongoose = require("mongoose");
//Schema
const Schema = mongoose.Schema;

// Meme Schema
const MemeSchema = new Schema({
  id: Number,
  name: String,
  url: String,
  width: Number,
  height: Number,
  box_count: Number,
  exported_image: String,
  created_at: String,
  title: String,
  topText: String,
  bottomText: String,
  additionalTextA: String,
  topTextPosX: Number,
  topTextPosY: Number,
  bottomTextPosX: Number,
  bottomTextPosY: Number,
  additionalTextAPosX: Number,
  additionalTextAPosY: Number,
  fontStyle: String,
  fontColor: String,
  likes: Number,
  views: Number,
  filePath: String,
});

//Create Model in MongoDB
module.exports = mongoose.model("meme", MemeSchema);
