/**
 * This is the Component for the Editor Box in the Middle of the Webapp in which Meme Templates are selected into in order to be edited and saved as a Meme.
 */

// React imports
import React, { useState, useEffect, useRef } from "react";

// Material UI imports
import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

// Share Buttons | Source: https://www.npmjs.com/package/react-share
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
} from "react-share";

// Use styling for our Material UI elements
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

/**
 * Editor Canvas: We create a Canvas with Black Background into which we set our different templates for Meme creation
 * Within this Canvas, we also add the Meme Texts.
 * After editing the Meme in the Canvas, the Canvas is exported and can be saved to the DB.
 * Source for Canvas Setup: https://www.youtube.com/watch?v=-AwG8yF06Po
 */

// we pre-define the canvas width and height
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const maxCanvasWidth = 600;

// Editor which contains the Canvas
const Editor = (props) => {
  const { memeToEdit, handleReloadMemes } = props; // props for reaload functionalities which are also used in other components
  const classes = useStyles(); // const classes is created, which refers to useStyles

  const [image, setImage] = useState(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [templates, setTemplates] = useState([]);

  const canvas = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  const formRef = useRef(); // accesing input element
  const [memeTitle, setMemeTitle] = useState("");

  const [fontColor, setFontColor] = useState("white"); // default font color
  const [fontStyle, setFontStyle] = useState("30px Impact"); // default font style
  const [topText, setTopText] = useState(""); // by default no text
  const [topTextPosX, setTopTextPosX] = useState(CANVAS_WIDTH / 2);
  const [topTextPosY, setTopTextPosY] = useState(CANVAS_HEIGHT * 0.1);
  const [bottomTextPosX, setBottomTextPosX] = useState(CANVAS_WIDTH / 2);
  const [bottomTextPosY, setBottomTextPosY] = useState(CANVAS_HEIGHT * 0.9);
  const [bottomText, setBottomText] = useState("");
  const [additionalTextA, setAdditionalTextA] = useState("");
  const [additionalTextAPosX, setAdditionalTextAPosX] = useState(
    CANVAS_HEIGHT / 2
  );
  const [additionalTextAPosY, setAdditionalTextAPosY] = useState(
    CANVAS_WIDTH * 0.5
  );
  // Setter for Path to be shared in the share section
  const [pathForSharing, setPathForSharing] = useState("");
  // Setter to check if a new meme Template is selected in order to hide Share Buttons before saving.
  const [previousMeme, setPreviousMeme] = useState();
  // Setter to adjust Meme text positions in relation to the selected Template size

  // Fetching Templates through a backend request
  useEffect(() => {
    fetch("http://localhost:3001/memes")
      .then((x) => x.json())
      .then((response) => setTemplates(response.data.memes));
  }, []);

  const setDefaultTextPosition = () => {
    setTopTextPosX(canvasWidth / 2);
    setTopTextPosY(canvasHeight * 0.1);
    setBottomTextPosX(canvasWidth / 2);
    setBottomTextPosY(canvasHeight * 0.9);
    setAdditionalTextAPosX(canvasWidth / 2);
    setAdditionalTextAPosY(canvasHeight * 0.5);
  };
  // functionality to delete text
  const deleteText = () => {
    setTopText("");
    setBottomText("");
    setAdditionalTextA("");
  };

  // Handle Input for the Meme Title provided by the User
  const handleTitleInput = (e) => {
    const title = e.target.value;

    if (handleTitleInput) {
      const memeTitle = {
        title: title,
      };
      setMemeTitle(memeTitle);
    }
  };

  // Define functions with which the font colors and styles are changed OnClick => See Buttons at the bottom
  const changeFontColorBlack = () => {
    setFontColor("black");
  };
  const changeFontColorWhite = () => {
    setFontColor("white");
  };
  const changeFontBold = () => {
    setFontStyle("30px Impact");
  };
  const changeFontItalic = () => {
    setFontStyle("Italic 30px Impact");
  };
  const changeFontStyle = () => {
    setFontStyle("50px Impact");
  };

  // Function to save Meme to DB (takes the exported Canvas)
  // Takes bodyToSend to save it accoring to the DB Schema of "Meme"
  const saveMemeFromEditorToDB = () => {
    const bodyToSend = JSON.stringify({
      url: memeToEdit.url,
      exportedImage: exportCanvasAsImage(),
      title: memeTitle.title,
      topText: topText,
      bottomText: bottomText,
      additionalTextA: additionalTextA,
      topTextPosX: topTextPosX,
      topTextPosY: topTextPosY,
      bottomTextPosX: bottomTextPosX,
      bottomTextPosY: bottomTextPosY,
      additionalTextAPosX: additionalTextAPosX,
      additionalTextAPosY: additionalTextAPosX,
      fontStyle: fontStyle,
      fontColor: fontColor,
    });

    // the upcoming fetch method sends the generated Meme (accessible through the new URL above) to the Express Backend Server. In the Express App, there is a route "saveMeme" in the Meme.js file that sends the URL with the generated Meme to the Server.
    // This is the Feature from the "API" part "create a single image with bottom/top text"
    fetch("http://localhost:3001/memes/saveMeme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyToSend,
    })
      .then((x) => x.json())
      .then((response) => {
        if (response) {
          // After the user saves the Meme to DB, it is also saved in the public share folder and the filePath is provided for the share functionalities.
          const { pathForSharing } = response;
          setPathForSharing("http://localhost:3001" + pathForSharing);
          handleReloadMemes(true); // After a Meme is saved, the MemeHistory is realoaded with the newly saved Meme.
        }
      })
      .catch((e) => console.log("e", e));
  };

  // Here, we export the current content of the canvas to an image, so it can be dowloaded in the download function.
  // The default file fize is 1 / 100%
  // jpeg compression for maximum file size
  // There are two download buttons, one normal and one "compressed" download button, which then sets the size to 10%
  const exportCanvasAsImage = (size = 1) => {
    const ctx = document.getElementById("meme-canvas");
    return ctx.toDataURL("image/jpeg", size); // source: https://developer.mozilla.org/de/docs/Web/API/HTMLCanvasElement/toDataURL
  };

  // Function for downloading the created meme
  const downloadMeme = (size = 1) => {
    var link = document.createElement("a");

    const { title } = memeTitle; // The title of the meme to be downloaded is set
    link.download = title;
    link.href = exportCanvasAsImage(size);
    console.log("exportCanvasAsImage", exportCanvasAsImage);
    link.click();
  };

  // Here, we set the "Image" which is the template to be edited for our Meme
  useEffect(() => {
    try {
      if (!memeToEdit) return; // if there is no Template to edit, do nothing

      const { url, filePath } = memeToEdit; // memeToEdit is the Meme Template that is set into the Editor
      if (filePath) setPathForSharing(filePath); // Check if filePath is existing for sharing saved Meme
      // Meme according to DB Schema
      const meme = new Image();
      meme.src = url;
      meme.title = memeTitle;
      meme.topText = topText;
      meme.bottomText = bottomText;
      meme.additionalTextA = additionalTextA;
      meme.topTextPosX = topTextPosX;
      meme.topTextPosY = topTextPosY;
      meme.bottomTextPosX = bottomTextPosX;
      meme.bottomTextPosY = bottomTextPosY;
      meme.additionalTextAPosX = additionalTextAPosX;
      meme.additionalTextAPosY = additionalTextAPosX;
      meme.fontStyle = fontStyle;
      meme.fontColor = fontColor;
      // Directly load the selected meme
      meme.onload = () => {
        setImage(meme);
        const { height, width } = meme;
        // If the image size is bigger than the currently set canvas size, then adjust the image size according to the canvas maxWidth
        if (width > maxCanvasWidth) {
          setCanvasWidth(maxCanvasWidth);
          setCanvasHeight((height * maxCanvasWidth) / width);
          setImageHeight(maxCanvasWidth);
          setImageWidth((height * maxCanvasWidth) / width);
        } else {
          setCanvasHeight(height);
          setCanvasWidth(width);
          setImageHeight(height);
          setImageWidth(width);
        }
      };

      meme.setAttribute("crossorigin", "anonymous"); // Added this, so the url of the meme can be worked with.
    } catch (error) {
      console.log("error", error);
    }
  }, [
    additionalTextA,
    additionalTextAPosX,
    bottomText,
    bottomTextPosX,
    bottomTextPosY,
    fontColor,
    fontStyle,
    memeTitle,
    memeToEdit,
    topText,
    topTextPosX,
    topTextPosY,
  ]);
  // ctx is the canvas that is created for the Editor
  useEffect(() => {
    if (image && canvas) {
      const ctx = canvas.current.getContext("2d"); // Build Canvas only if an image is selected

      ctx.fillStyle = "black"; // the canvas is filled with black background color
      ctx.fillRect(0, 0, canvasWidth, canvasHeight); // the canvas rectangle is filled according to the set width and height

      const contentOffset = 10;
      const factorWidth = canvasWidth / imageWidth;
      const factorHeight = canvasHeight / imageHeight;

      // drawImage is responsible for taking the image that the user selected and putting it on the Canvas (ctx). Source: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
      ctx.drawImage(
        image,
        contentOffset,
        contentOffset,
        imageWidth * factorWidth - contentOffset * 2,
        imageHeight * factorHeight - contentOffset * 2
      );

      // set the font with which the text is entered in the Editor
      ctx.font = fontStyle;
      ctx.fillStyle = fontColor;
      ctx.textAlign = "center";
      // text edit options
      ctx.fillText(topText, topTextPosX, topTextPosY);
      ctx.fillText(bottomText, bottomTextPosX, bottomTextPosY);
      ctx.fillText(additionalTextA, additionalTextAPosX, additionalTextAPosY);
    }
  }, [
    image,
    canvas,
    topText,
    bottomText,
    additionalTextA,
    topTextPosX,
    topTextPosY,
    bottomTextPosY,
    bottomTextPosX,
    additionalTextAPosX,
    additionalTextAPosY,
    imageWidth,
    imageHeight,
    fontColor,
    fontStyle,
    canvasHeight,
    canvasWidth,
  ]);

  // Reset the path for sharing if the template has changed
  // The user needs to save a meme from the Editor in order to receive a sharing link and make the sharing buttons visible
  useEffect(() => {
    if (image?.src !== previousMeme?.src) {
      setPathForSharing(null);
      setPreviousMeme(image);
    }
  }, [image, previousMeme]);

  // Webapp interface of the Editor Component
  return (
    <div>
      <div>
        {/* User provided Title for the Meme */}
        <TextField
          style={{ width: 200 }}
          size="small"
          type="text"
          name="URL"
          label="Meme Title"
          variant="outlined"
          ref={formRef}
          onChange={handleTitleInput}
        />
      </div>
      <br />
      <div>
        {image ? (
          <canvas
            id={"meme-canvas"}
            ref={canvas}
            width={canvasWidth}
            height={canvasHeight}
          />
        ) : (
          // if no image is selected, show the following message
          <p>Select a Meme, please</p>
        )}
      </div>
      <br />
      {/* Set default text position according to the image size */}
      <Button
        variant="contained"
        color="primary"
        onClick={setDefaultTextPosition}
        disabled={!image && true}
        className={classes.button}
      >
        SET DEFAULT TEXT POSITION
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={deleteText}
        disabled={!image && true}
        className={classes.button}
      >
        DELETE TEXT
      </Button>
      <br />
      <br />
      <div>
        {/* Input of text */}
        <TextField
          style={{ width: 200 }}
          size="small"
          type="text"
          label="Upper text"
          variant="outlined"
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
        />
        <IconButton
          size="large"
          variant="contained"
          onClick={(e) => setTopTextPosX(topTextPosX - 10)}
        >
          <ArrowBackIcon />
        </IconButton>
        <TextField
          style={{ width: 80 }}
          size="small"
          type="text"
          variant="outlined"
          label="Position X"
          value={topTextPosX}
          onChange={(e) => setTopTextPosX(e.target.value)}
        />
        <IconButton
          size="large"
          variant="contained"
          onClick={(e) => setTopTextPosX(topTextPosX + 10)}
        >
          <ArrowForwardIcon />
        </IconButton>
        <IconButton
          size="large"
          variant="contained"
          onClick={(e) => setTopTextPosY(topTextPosY - 10)}
        >
          <ArrowUpwardIcon />
        </IconButton>
        <TextField
          style={{ width: 80 }}
          size="small"
          type="text"
          variant="outlined"
          label="Position Y"
          value={topTextPosY}
          onChange={(e) => setTopTextPosY(e.target.value)}
        />
        <IconButton
          size="large"
          variant="contained"
          onClick={(e) => setTopTextPosY(topTextPosY + 10)}
        >
          <ArrowDownwardIcon />
        </IconButton>
        <br />
        <br></br>
        <TextField
          style={{ width: 200 }}
          size="small"
          type="text"
          label="Bottom text"
          variant="outlined"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
        />
        <IconButton
          size="large"
          variant="contained"
          onClick={(e) => setBottomTextPosX(bottomTextPosX - 10)}
        >
          <ArrowBackIcon />
        </IconButton>
        <TextField
          style={{ width: 80 }}
          size="small"
          type="text"
          variant="outlined"
          label="Position X"
          value={bottomTextPosX}
          onChange={(e) => setBottomTextPosX(e.target.value)}
        />
        <IconButton
          size="large"
          variant="contained"
          onClick={(e) => setBottomTextPosX(bottomTextPosX + 10)}
        >
          <ArrowForwardIcon />
        </IconButton>
        <IconButton
          size="large"
          variant="contained"
          onClick={(e) => setBottomTextPosY(bottomTextPosY - 10)}
        >
          <ArrowUpwardIcon />
        </IconButton>
        <TextField
          style={{ width: 80 }}
          size="small"
          type="text"
          variant="outlined"
          label="Position Y"
          value={bottomTextPosY}
          onChange={(e) => setBottomTextPosY(e.target.value)}
        />
        <IconButton
          size="large"
          variant="contained"
          onClick={(e) => setBottomTextPosY(bottomTextPosY + 10)}
        >
          <ArrowDownwardIcon />
        </IconButton>
        <br />
        <br></br>
        <TextField
          style={{ width: 200 }}
          size="small"
          type="text"
          label="Additional Text A"
          variant="outlined"
          value={additionalTextA}
          onChange={(e) => setAdditionalTextA(e.target.value)}
        />
        <IconButton
          size="large"
          variant="contained"
          onClick={(e) => setAdditionalTextAPosX(additionalTextAPosX - 10)}
        >
          <ArrowBackIcon />
        </IconButton>
        <TextField
          style={{ width: 80 }}
          size="small"
          type="text"
          variant="outlined"
          label="Position X"
          value={additionalTextAPosX}
          onChange={(e) => setAdditionalTextAPosX(e.target.value)}
        />
        <IconButton
          size="large"
          variant="contained"
          onClick={(e) => setAdditionalTextAPosX(additionalTextAPosX + 10)}
        >
          <ArrowForwardIcon />
        </IconButton>
        <IconButton
          size="large"
          variant="contained"
          onClick={(e) => setAdditionalTextAPosY(additionalTextAPosY - 10)}
        >
          <ArrowUpwardIcon />
        </IconButton>
        <TextField
          style={{ width: 80 }}
          size="small"
          type="text"
          variant="outlined"
          label="Position Y"
          value={additionalTextAPosY}
          onChange={(e) => setAdditionalTextAPosY(e.target.value)}
        />
        <IconButton
          size="large"
          variant="contained"
          onClick={(e) => setAdditionalTextAPosY(additionalTextAPosY + 10)}
        >
          <ArrowDownwardIcon />
        </IconButton>
      </div>
      <br></br>
      <div>
        {/* Changing text format */}
        <Button
          size="small"
          variant="outlined"
          color="black"
          onClick={changeFontColorBlack}
        >
          Font: Black
        </Button>
        <Button size="small" variant="outlined" onClick={changeFontColorWhite}>
          Font: White
        </Button>
        <Button size="small" variant="outlined" onClick={changeFontItalic}>
          Font: Italic
        </Button>
        <Button size="small" variant="outlined" onClick={changeFontBold}>
          Small Bold Font
        </Button>
        <Button size="small" variant="outlined" onClick={changeFontStyle}>
          Bigger Bold Font
        </Button>
      </div>
      <br></br>
      <div>
        {/* Save and Download Buttons */}
        <Button
          variant="contained"
          color="primary"
          onClick={saveMemeFromEditorToDB}
          disabled={!image && true}
          className={classes.button}
        >
          SAVE MEME
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={downloadMeme}
          disabled={!image && true}
          className={classes.button}
        >
          DOWNLOAD
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => downloadMeme(0.1)} // The file fize is set to 10%. We have to define a function here, so downloadMeme takes the argument of 0.1 and sets the size to it.
          disabled={!image && true}
          className={classes.button}
        >
          DOWNLOAD COMPRESSED
        </Button>
      </div>
      {/* Share Buttons: Show the share buttons only if there is a pathForSharing of if the pathForSharing String is not an Empty String */}
      {pathForSharing && pathForSharing !== "" && (
        <div>
          <FacebookShareButton url={pathForSharing}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={pathForSharing}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <EmailShareButton url={pathForSharing}>
            <EmailIcon size={32} round />
          </EmailShareButton>
        </div>
      )}
    </div>
  );
};

export default Editor;
