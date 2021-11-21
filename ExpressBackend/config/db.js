/**
 * Here, we create the connection to our MongoDB by using Mongoose.
 * We use Mongoose to not write DB commands when saving elements to our Database.
 *
 * For our Development, we also used nodemon, which reloaded our connection everytime we re-saved our changes.
 * Source: https://mongoosejs.com
 */

const mongoose = require("mongoose");

const connectDB = async () => {
  // MONGO URI: Alias for the Database Collection MONGO_URI=mongodb://localhost:27017/Memes (can be found in config.env)
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });
};
console.log("MongoDB connected"); // This is the message that we get as a success in our Express Server.

module.exports = connectDB;
