/**
 * This is the backend routing for all functionalities related to a generated Meme
 * We get access to Templates from the ImgFlip API, provide an API for saving Memes to the database, and additional features for Meme interaction (upvote, etc.)
 */

var fetch = require("node-fetch");
var express = require("express");
var router = express.Router();
// ZipFolder Libtary to download created Memes in a Zip Folder | Source: https://www.npmjs.com/package/zip-folder
const zipFolder = require("zip-a-folder");
// Get DB Models for saving Data to MongoDB
const Meme = require("../dbmodels/Meme");
const Template = require("../dbmodels/Template");
// Get Library for generating a URL that can be shared
const dataUrlSaver = require("image-data-uri"); // We use this library to encode/decode our exported canvas image into a URI. | Source: https://www.npmjs.com/package/image-data-uri

// GET Imgflip API memes.
// Fetch Templates from a third party provider (ImgFlip API) which are loaded upon the start of the application
router.get("/", function (req, res, next) {
  fetch("https://api.imgflip.com/get_memes")
    .then((x) => x.json())
    .then((response) => {
      res.json(response);
    });
});

// API - Get already Created Memes
// We create a connection to our MongoDB, i.e. to our meme collection
// Note: Also works without frontend by using Postman
router.get("/get_memes", async (req, res, next) => {
  try {
    const createdmemes = await Meme.find();
    res.json(createdmemes);
  } catch (err) {
    res.json({ message: err });
  }
});

//API - Get Templates uploaded and saved by the user
router.get("/get_templates", async (req, res, next) => {
  try {
    const createdtemplates = await Template.find();
    res.json(createdtemplates);
  } catch (err) {
    res.json({ message: err });
  }
});

/**
 * Save functionality | Feature: from the "API" part "create a single image with bottom/top text"
 * This post method takes the body of the fetch method in the React App and sends the URL ("bodyToSend") to the local Express Server / MongoDB
 * Note: Also works without frontend by using Postman
 */
router.post("/saveMeme", function (req, res, next) {
  // define the request body
  const {
    url,
    exportedImage: exported_image,
    title: title,
    topText,
    bottomText,
    additionalTextA,
    topTextPosX,
    topTextPosY,
    bottomTextPosX,
    bottomTextPosY,
    additionalTextAPosX,
    additionalTextAPosY,
    fontStyle,
    fontColor,
  } = req.body;
  // define the pathToReturn in order to save it to the Database
  const pathToReturn = `/share/${title}.png`;
  /**
   * dataToSave contains all elements of a generated Meme that are going to be saved to the MongoDB "memes" collection
   * Afterwards, dataToSave is passed to the const "newMeme" for saving.
   */
  const dataToSave = {
    exported_image,
    url,
    created_at: new Date().toISOString(),
    title: title,
    topText,
    bottomText,
    additionalTextA,
    topTextPosX,
    topTextPosY,
    bottomTextPosX,
    bottomTextPosY,
    additionalTextAPosX,
    additionalTextAPosY,
    fontStyle,
    fontColor,
    likes: 0, // upon saving, a Meme has 0 likes
    views: 0, // upon saving, a Meme has 0 views
    filePath: pathToReturn,
  };
  // create a new Meme according to the Meme Model for the DB
  const newMeme = new Meme(dataToSave);
  //.save functionality
  newMeme.save((error, doc) => {
    // Check for errors at first
    if (error) {
      res.status(500).json({ msg: "Sorry, internal server errors" });
      console.log("error", error);
    } else {
      // if there are no errors, create a filePath to save the exported image to the public "share" folder.
      const filePath = `./public/share/${title}.png`;

      // Create the full path in case it doesn't exist, for saving in the public share folder
      dataUrlSaver.outputFile(exported_image, filePath).then((savingResult) => {
        console.log(savingResult);
        res.status(200).json({ pathForSharing: pathToReturn, msg: doc });
      });
    }
  });
});

// Generate .zip-file of the public share folder which contains all saved memes
// Note: Works without frontend in Postman
class ZipAFolder {
  static main() {
    zipFolder.zipFolder(
      "./public/share",
      "./public/zip/allmemes.zip",
      function (err) {
        if (err) {
          console.log(
            "Zipping didn't work! Maybe you didn't create any Memes yet?",
            err
          );
        }
      }
    );
  }
}
ZipAFolder.main();

/**
 * Upload own template functionality -> Upload custom Template from user's computer by using fileupload
 * Source for fileupload feature: https://www.npmjs.com/package/express-fileupload
 */
router.post("/uploadTemplate", function (req, res, next) {
  // define the request body
  const { exportedImage: exported_image, name } = req.body;
  // if there is no exported image, return error message
  if (!exported_image || !name) {
    return res.status(400).json({ msg: "No files were uploaded." });
  }
  // define const in order to pass an object into the Editor. templateInfo is used to save the Template accoring to its DB Schema.
  const templateInfo = {
    name,
    exported_image,
  };
  // Create new Template according to MongoDB Schema for saving into the Templates collection
  const newTemplate = new Template(templateInfo);
  // Save functionality -> we can save each Template that we upload into the Editor into our MongoDB so we can also use it at a later stage. Each saved Template is shown in the "your custom Templates" card in the React Frontend.
  newTemplate.save((error, doc) => {
    console.log("error", error);
    if (error) {
      res.status(500).json({ msg: "Sorry, internal server errors" });
    } else {
      res.status(200).json({ msg: "Template saved" });
    }
  });
});

/**
 * Increase Like / Upvote functionality
 */
router.post("/increaseLike", function (req, res, next) {
  // take out properties likes and id out of req.body
  const { likes, id } = req.body;
  // Go into the Meme in the DB and search for the id of the respective template, then update the like property with the upvote.
  Meme.findByIdAndUpdate({ _id: id }, { likes: likes }, function (err, result) {
    if (err) {
      console.log("err", err);
      res.send(err);
    } else {
      res.status(200).json({ msg: "Likes updated" });
    }
  });
});
// Everytime a user selects an already created Meme from the MemeHistory into the Editor, the views are increased.
router.post("/increaseViews", function (req, res, next) {
  console.log("req.body", req.body);
  const { views, id } = req.body; // take out properties likes and id out of req.body
  // Go into the Meme in the DB and search for the id of the respective template, then update the like property with the view.
  Meme.findByIdAndUpdate({ _id: id }, { views: views }, function (err, result) {
    if (err) {
      console.log("err", err);
      res.send(err);
    } else {
      res.status(200).json({ msg: "Views updated" });
    }
  });
});

module.exports = router;
