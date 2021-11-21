/**
 * Model to save a Template to MongoDB
 * In this case, a Template refers to a custom defined picture by the user, not from the ImgFlip API.
 * The different options for user-provided Templates can be found in the React Component "TemplatePicker"
 */

// Mongoose connection
const mongoose = require("mongoose");
//Schema
const Schema = mongoose.Schema;

// TEMPLATE Schema
const TemplateSchema = new Schema({
  name: String,
  exported_image: String,
});

//Create Model in MongoDB
module.exports = mongoose.model("template", TemplateSchema);
