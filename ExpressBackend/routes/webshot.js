/**
 * Feature to take screenshots from Webpages
 */

var express = require("express");
var webshot = require("webshot"); // Source: https://wch.github.io/webshot/articles/intro.html

var router = express.Router();

/* Take a screenshot of a user-provided url  */
router.post("/", function (req, res, next) {
  if (!req.body) res.status(500).json({ msg: "no body received" });
  const { urlToSnap } = req.body;
  if (!urlToSnap) res.status(500).json({ msg: "no url received" });
  // we have to extract the URL
  const urlExtractor = new RegExp(
    "^https?:\\/\\/?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i" // fragment locator
  );
  const cleanedUrlToSnap = urlToSnap.match(urlExtractor)[1]; // Take the final URL of the webshot
  const savePath = `./public/snapshots/${cleanedUrlToSnap}.png`; // Take the cleanedUrlToSnap and save it to the public snapshots folder
  const pathToReturn = `/snapshots/${cleanedUrlToSnap}.png`; // Path to return for saving and frontend functionalities (such as sharing)

  /**
   * Take a snapshot of the provided url and send the path to it back to the user
   * --> always located in public/snapshots/<url>.png
   * */
  webshot(urlToSnap, savePath, function (err) {
    if (err) res.status(500).json({ msg: err });
    return res.json({ msg: "Sucessfully saved", path: pathToReturn });
  });
});

module.exports = router;
