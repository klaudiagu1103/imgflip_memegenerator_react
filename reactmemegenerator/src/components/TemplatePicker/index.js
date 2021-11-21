/**
 * This component is responsible for providing different functionalities with which the user can upload or create their custom Meme Templates
 * Custom Meme Templates can be self-uploaded, provided from an image from a URL, a screenshot from a URL, a webcam picture, or self-drawn.
 */

// React imports
import React, { useRef, useState } from "react";
import { Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import { ReactSketchCanvas } from "react-sketch-canvas"; // Source: https://www.npmjs.com/package/react-sketch-canvas

import { v4 as uuidv4 } from "uuid"; // Unique ID generator

// Notifications containers | Source: https://www.npmjs.com/package/react-notifications
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

// Material UI styles
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const TemplatePicker = (props) => {
  const { setTemplateInEditor, setShouldReloadSavedTemplates } = props;
  const [selectedTemplate, setSelectedTemplate] = useState();
  const [uploadedTemplateName, setUploadedTemplateName] = useState("");
  const [uploadedTemplateDataUrl, setUploadedTemplateDataUrl] = useState("");
  const [webshotUrl, setWebshotUrl] = useState("");
  const formRef = useRef(); // accesing input element
  const [showunvalidURLtext, SetshowunvalidURLtext] = useState(false);
  const sketchCanvas = React.createRef();
  const classes = useStyles(); // const classes is created, which refers to useStyles

  //Webcam consts
  const [playing, setPlaying] = useState(false);
  const webcamHeight = 250;
  const webcamWidth = 330;

  //Start Webcam
  const startWebcam = () => {
    setPlaying(true);
    navigator.getUserMedia(
      {
        video: true,
      },
      (stream) => {
        let video = document.getElementsByClassName("app_videoFeed")[0];
        if (video) {
          video.srcObject = stream;
        }
      },
      (err) => console.error(err)
    );
  };

  //Stop Webcam
  const stopWebcam = () => {
    setPlaying(false);
    let video = document.getElementsByClassName("app_videoFeed")[0];
    video.srcObject.getTracks()[0].stop();
  };
  //Take Snapshot
  const takeSnapshot = () => {
    let video = document.getElementsByClassName("app_videoFeed")[0];
    const canvas = document.getElementById("snapshot");
    var img = document.querySelector("img") || document.createElement("img");
    var context;
    var width = webcamWidth,
      height = webcamHeight;
    context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, width, height);
    img.src = canvas.toDataURL("image/png");
    const templateInfoForEditor = {
      url: img.src,
      id: uuidv4(), // generate a random unique id
      isUserUploaded: true,
    };

    setTemplateInEditor(templateInfoForEditor);
  };

  // Generate a Random Template from the ImgFlipAPI Tempates
  const RandomTemplate = async () => {
    const memeArrayRaw = await fetch("https://api.imgflip.com/get_memes"); // get memes from the ImgFlip API
    const {
      data: { memes: memeArray }, // define a memeArray => Go into the object to get the data as we want the url
    } = await memeArrayRaw.json();

    const randomIndex = Math.floor(Math.random() * memeArray.length); // Generate a random number according to the size of the array (here it is 100 memes long)
    const templateInfoForEditor = memeArray[randomIndex]; // The template will be the object at a random Index number of the Array.

    setTemplateInEditor(templateInfoForEditor);
  };

  // Uploads a template picked by the user and saves it to the database collection "templates" --> Creates a database collection for custom meme templates
  const uploadTemplateToServer = () => {
    // If no template is selected from the files, don't do anything
    if (!selectedTemplate) return;
    const bodyToSend = JSON.stringify({
      name: uploadedTemplateName,
      exportedImage: uploadedTemplateDataUrl,
    });

    //sends the file to the backend
    fetch("http://localhost:3001/memes/uploadTemplate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyToSend,
    })
      .then((response) => response.json())
      .then((data) => {
        setShouldReloadSavedTemplates(true);
        createNotification("success_saved");
      })
      .catch((error) => {
        console.log("error", error);
        createNotification("error");
      });
  };
  // Notifications to handle successful file input => A box that appears on the top right side of the webapp
  const createNotification = (type) => {
    console.log("type", type);

    switch (type) {
      case "info":
        return NotificationManager.info("Info message");

      case "success_saved":
        return NotificationManager.success("Template saved to database");

      case "success_uploaded":
        return NotificationManager.success(
          "You have selected your own template. Click 'save' to save it to your Template collection."
        );

      case "success_URL":
        return NotificationManager.success("You have provided your own URL.");

      case "success_screenshot":
        return NotificationManager.success("Website Screenshot taken!");

      case "warning":
        return NotificationManager.warning(
          "Warning message",
          "Close after 3000ms",
          3000
        );

      case "error":
        return NotificationManager.error(
          "Error message",
          "Oh no!",
          5000,
          () => {
            alert("callback");
          }
        );

      default:
        return;
    }
  };
  // Create a URL of the uploaded image that can be saved to the DB into the Templates collection
  const createDataUrlForSavingToDB = (file) => {
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string
        if (reader.result) setUploadedTemplateDataUrl(reader.result);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // This is the template picker for user uploaded templates
  const handleFileInput = (e) => {
    // Extract the selected file/image by the user
    const selectedFile = e.target.files[0];
    // If no image is selected, simply return
    if (!selectedFile) return;

    const { name } = selectedFile;
    setUploadedTemplateName(name);

    // Create a new temporary local url that points to the selected image --> This URL is saved to the DB collection and can be accessed as long as the application is running
    const newPreviewUrl = URL.createObjectURL(selectedFile);
    const dataUrlForImage = createDataUrlForSavingToDB(selectedFile);
    if (dataUrlForImage) setUploadedTemplateDataUrl(dataUrlForImage);

    // Prepare the template to be used in the <Meme /> component
    // requires properties name, url, and id
    const templateInfoForEditor = {
      name, // original file name
      url: newPreviewUrl,
      id: uuidv4(), // generate a random unique id
      isUserUploaded: true,
    };

    setSelectedTemplate(selectedFile);
    setTemplateInEditor(templateInfoForEditor);
    createNotification("success_uploaded");
  };

  // this function checks if a provided string is a valid URL (for the url provided template feature)
  // Source: https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
  function validURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }

  // This is the template picker for a user provided URL
  // Note: Due to CORS issues, this feature does not work with every URL. If you use e.g. Imgflip urls, the functionality works.
  const handleURLinput = (e) => {
    const url = e.target.value;
    // Is the entered string a URL?
    if (!validURL(url)) {
      SetshowunvalidURLtext(true);
    }
    if (validURL(url)) {
      // If yes, then take the Image from the URL &  set it as Template for the Editor
      const templateInfoForEditor = {
        url: url,
        id: uuidv4(), // generate a random unique id
        isUserUploaded: true,
      };

      setTemplateInEditor(templateInfoForEditor);
      SetshowunvalidURLtext(false);
      createNotification("success_URL");
    }
  };

  // Handler for Screenshot functionality
  const handleWebshotUrlInput = (e) => {
    const url = e.target.value;
    if (!url) return;
    setWebshotUrl(url);
  };

  const handleSubmitWebshotUrl = () => {
    if (!webshotUrl) return;

    //sends the webshot file to the backend
    fetch("http://localhost:3001/webshot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urlToSnap: webshotUrl,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data) return;
        const { path } = data;
        const webshotInfoForEditor = {
          url: `http://localhost:3000/${path}`,
          id: uuidv4(), // generate a random unique id
          isUserUploaded: true,
        };

        setTemplateInEditor(webshotInfoForEditor);
        createNotification("success_screenshot");
      })
      .catch((error) => {
        console.log("error", error);
        createNotification("error");
      });
  };

  // Webapp user interface
  return (
    <div className="file-uploader">
      <p>Upload a template from your Computer</p>
      <input
        // if type="file" on an html input, the browser automatically launches the file picker ("Datei auswählen")
        type="file"
        name="uploadedTemplate"
        onChange={handleFileInput}
        accept="image/png, image/jpeg"
        title="Pick Template"
        placeholder="Pick Template"
        ref={formRef}
      />
      <Button
        color="default"
        variant="contained"
        size="small"
        startIcon={<SaveIcon />}
        onClick={uploadTemplateToServer}
        title="Save Template to Database"
        placeholder="Upload"
        disabled={!uploadedTemplateDataUrl && true}
      >
        Save self-uploaded template to database
      </Button>
      <NotificationContainer />
      <br></br>
      <p>Provide a template from URL</p>

      {/* User provided template from URL */}
      <input
        type="text"
        name="URL"
        onTextChange={handleURLinput}
        accept="text"
        title="Provide URL"
        placeholder="Provide URL"
        ref={formRef}
      ></input>

      {showunvalidURLtext && (
        <div>
          <p>This is not a valid URL</p>
        </div>
      )}

      <br></br>
      <br></br>
      <Button
        color="default"
        variant="contained"
        size="small"
        onClick={RandomTemplate}
        title="Random"
        placeholder="Random"
      >
        Random Meme!
      </Button>
      <NotificationContainer />
      <br></br>
      <br></br>

      {/* User provided template from URL */}
      <input
        type="text"
        name="webshot-url"
        onChange={handleWebshotUrlInput}
        accept="text"
        title="Provide URL to take a screenshot"
        placeholder="Provide URL to take a screenshot"
        id="webshot-url-field"
      ></input>
      <Button
        color="default"
        variant="contained"
        size="small"
        startIcon={<SaveIcon />}
        onClick={handleSubmitWebshotUrl}
        title="Save Template to Database"
        placeholder="Upload"
        disabled={!webshotUrl && true}
      >
        Take a snapshot of a website
      </Button>

      <div className="app_container">
        <video
          height={webcamHeight}
          width={webcamWidth}
          muted
          autoPlay
          className="app_videoFeed"
        ></video>
      </div>
      <div className="app_inputs">
        {playing ? (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={stopWebcam}
          >
            Stop Webcam
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={startWebcam}
          >
            Start Webcam
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={takeSnapshot}
        >
          Take Snapshot
        </Button>

        <canvas id="snapshot" width="330" height="250"></canvas>

        <div>
          {/* Draw your own Meme section */}
          <p>Draw your own Meme</p>
          <ReactSketchCanvas
            ref={sketchCanvas}
            strokeWidth={4}
            strokeColor="black"
            width="300px"
            height="300px"
          />
          <br></br>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              sketchCanvas.current
                .exportImage("png")
                .then((data) => {
                  console.log(data);
                  const templateInfoForEditor = {
                    url: data,
                    id: uuidv4(),
                    isUserUploaded: true,
                  };
                  setTemplateInEditor(templateInfoForEditor);
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
          >
            Get Image
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              sketchCanvas.current.clearCanvas();
            }}
          >
            Clear Image
          </Button>
          <br></br>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              sketchCanvas.current.undo();
            }}
          >
            Undo
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              sketchCanvas.current.redo();
            }}
          >
            Redo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplatePicker;
