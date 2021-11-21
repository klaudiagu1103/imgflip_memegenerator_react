/**
 * This is the main screen that is shown to the user.
 * It loads several components with the different functionalities we need for our Meme Generator.
 */

// React imports
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"; // We are using the following speech reconition API: https://github.com/JamesBrill/react-speech-recognition/blob/master/docs/API.md
import { saveAs } from "file-saver";

// Components
import Topbar from "../Topbar";
import TemplatePicker from "../TemplatePicker";
import Editor from "../Editor";
import MemeHistory from "../MemeHistory";
import TemplateOverview from "../TemplateOverview";
import ImgFlipTemplates from "../ImgFlipTemplates";
import Charts from "../Charts";
import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";

// MaterialUI | Source: https://material-ui.com/getting-started/installation/
// For building our Frontend UI, we used Material UI Grid Layout and structured the whole page according to Grid containers and Paper boxes.
import { Grid, Paper, Typography, Box, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

// style classes for the Material UI components
const useStyles = makeStyles((theme) => ({
  grid: {
    width: "100%",
    height: "100%",
    margin: "0px",
  },
  root: {
    flexGrow: 1,
    height: "100%",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  scroll: {
    overflow: "scroll",
    height: "1500px",
  },
  scroll2: {
    overflow: "scroll",
    height: "800px",
  },
  search: {
    overflow: "scroll",
    height: "430px",
  },
  margin: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

var memeIndex = 0; //initially setting the memeIndex for the slider to 0

// The history variable checks if the user is logged in.
const MemeGenerator = ({ history }) => {
  const [error, setError] = useState("");
  const [privateData, setPrivateData] = useState("");
  const { transcript, resetTranscript } = useSpeechRecognition();
  const PUBLIC_URL = "http://localhost:3001"; // For Zip download
  // Template consts
  const [templates, setTemplates] = useState([]); //is referred to the templates from the Imgflip API
  const [template, setTemplate] = useState(null); //is referred to the meme template in the editor that can be edited
  const [newMemeCreated, setNewMemeCreated] = useState(false);
  const [newTemplateCreated, setNewTemplateCreated] = useState(false);

  //This function is executed when the user clicks on the right arrow at the top of the editor
  const clickRight = async () => {
    const memeArrayRaw = await fetch("https://api.imgflip.com/get_memes"); // get memes from the ImgFlip API
    const {
      data: { memes: memeArray }, // define a memeArray => Go into the object to get the data as we want the url
    } = await memeArrayRaw.json();

    memeIndex = memeIndex + 1;
    const templateInfoForEditor = memeArray[memeIndex];
    setTemplate(templateInfoForEditor);
  };

  //This function is executed when the user clicks on the left arrow at the top of the editor
  const clickLeft = async () => {
    const memeArrayRaw = await fetch("https://api.imgflip.com/get_memes"); // get memes from the ImgFlip API
    const {
      data: { memes: memeArray }, // define a memeArray => Go into the object to get the data as we want the url
    } = await memeArrayRaw.json();

    if (memeIndex === 0) {
      createNotification("firstTemplate");
      const templateInfoForEditor = memeArray[memeIndex];
      setTemplate(templateInfoForEditor);
    } else {
      memeIndex = memeIndex - 1;
      const templateInfoForEditor = memeArray[memeIndex];
      setTemplate(templateInfoForEditor);
    }
  };

  // Random Button to get a random ImgFlip template => Here, it is used for the Speech Recoginition Feature
  const RandomTemplate = async () => {
    const memeArrayRaw = await fetch("https://api.imgflip.com/get_memes"); // get memes from the ImgFlip API
    const {
      data: { memes: memeArray }, // define a memeArray => Go into the object to get the data as we want the url
    } = await memeArrayRaw.json();

    const randomIndex = Math.floor(Math.random() * memeArray.length); // Generate a random number according to the size of the array (here it is 100 memes long)
    const templateInfoForEditor = memeArray[randomIndex]; // The template will be the object at a random Index number of the Array.

    setTemplate(templateInfoForEditor);
  };

  // Create notifications which are shown on the top right side of the  screen
  const createNotification = (type) => {
    console.log("type", type);

    switch (type) {
      case "firstTemplate":
        return NotificationManager.info(
          "You have already selected the first template"
        );

      default:
        return;
    }
  };

  // First attempt tobuild function of download .zip-File of all saved Memes
  // const saveFile = () => {
  //   saveAs(
  //     PUBLIC_URL + "/public/zip/allmemes.zip",
  //     "allmemes.zip"
  //   );
  //   console.log(saveFile);
  //   }

  // Second attempt tobuild function of download .zip-File of all saved Memes
  // get .zip-File from server using axios
  const getDownloadFile = async () => {
    return axios
      .get(PUBLIC_URL + "/zip/allmemes.zip", {
        responseType: "application/file",
      })
      .then((response) => response.zipFile());
  };

  // download .zip-File from server
  const saveFile = () => {
    getDownloadFile().then((zipFile) => saveAs(zipFile, "allmemes.zip"));
  };

  // Third attempt of .zip-download
  // saveFile = () => {
  //   fetch((PUBLIC_URL + '/zip/allmemes.zip')
  //     .then(response => {
  //       response.blob().then(blob => {
  //         let url = window.URL.createObjectURL(blob);
  //         let a = document.createElement('a');
  //         a.href = url;
  //         a.download = 'allmemes.zip';
  //         a.click();
  //       });
  //       //window.location.href = response.url;
  //   }));
  // }

  const classes = useStyles(); // const classes is created, which refers to useStyles (Material UI styles)

  // Here, we get the images from the Imgflip API through a backend request, it can be found in the routes folder
  useEffect(() => {
    fetch("http://localhost:3001/memes")
      .then((x) => x.json())
      .then((response) => setTemplates(response.data.memes));
  }, []);

  useEffect(() => {
    // if no Token, automatically redirect due to no allowance for private route
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    }
    // Checks if the user is logged in
    const fetchPrivateDate = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          // Pass in Authorization Token
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      // Private Route
      try {
        const { data } = await axios.get("/api/private", config);
        setPrivateData(data.data);
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("You are not authorized please refresh and login");
      }
    };

    fetchPrivateDate();
  }, [history]);

  // Here, we initialize the Listening function of our Speech Reconition
  // SOurce: https://www.youtube.com/watch?v=08oWSkFQUF0&t=20s
  // Note: useCallback will return a memorized version of the callback that only changes if one of the dependencies has changed
  // We include "switch" to handle all the cases that can be initialized via Speech recoginition
  const handleListening = useCallback(() => {
    switch (transcript) {
      case "next":
        clickRight(memeIndex + 1); // click right when the user says "next"
        resetTranscript(); // reset Transcript neeeds to be added after each case to "restart" the Transcript, otherwise it will just append the "next" one after another and not do any action.
        break; // break at the end of each block => if the case appies then the function stops here
      case "previous":
        clickLeft(memeIndex - 1); // click left when the user says "previous"
        resetTranscript();
        break;
      case "random":
        RandomTemplate();
        resetTranscript();
        break;
      default:
        // default comes at the end of the switch function. NOTE: Append new cases BEFORE default.
        resetTranscript(); // reset also as the default case of the Transcript
        break;
    }
    console.log(transcript);
  }, [clickRight, clickLeft, RandomTemplate]);

  // Here, we start the voice recoginition => We start using the Speech Recogition API. It needs to be async because you have to wait for the promise, which in this case is the transcript data of the browser.
  const initializeVoiceRecog = async () => {
    try {
      if (SpeechRecognition) {
        const recognitionStarted = await SpeechRecognition.startListening({
          language: "en-US",
          continuous: true,
        });
        console.log("recognitionStarted", recognitionStarted);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    initializeVoiceRecog();
  }, []); // only call it at the beginning, this is why the dependency array is empty => Initialize

  useEffect(() => {
    if (transcript) handleListening(); // Check if there is a new transcript
  }, [transcript]); // Only call if there is a transcprit => depedency

  // Webapp user interface
  return error ? (
    <span className="error-message">{error}</span>
  ) : (
    <>
      <div style={{ textAlign: "center" }}>
        <div className={classes.root}>
          <Grid container spacing={2} direction="row" alignItems="stretch">
            <Grid item xs={12}>
              <Paper className={classes.paper} elevation={3}>
                <Topbar></Topbar>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2} direction="row">
            <Grid item xs={3}>
              <Paper className={classes.paper} elevation={3} position="fixed">
                <div elevation={3} className={classes.scroll}>
                  {/* Get MEMES for the sidebar with Searchbar*/}
                  <Grid container spacing={3}>
                    <Grid item sm={3} elevation={3}>
                      <ImgFlipTemplates
                        setTemplateInEditor={(img) => setTemplate(img)}
                      ></ImgFlipTemplates>
                    </Grid>
                  </Grid>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={6} className={classes.grid}>
              <Grid container spacing={1} direction="row">
                <Grid item xs={12}>
                  <Paper
                    className={classes.paper}
                    elevation={3}
                    position="center"
                  >
                    {/* Meme Editor */}
                    <Typography variant="h5" color="primary">
                      EDITOR
                    </Typography>
                    <p />
                    <Box>
                      {/* Image Slider */}
                      <Button
                        variant="contained"
                        size="medium"
                        onClick={clickLeft}
                        startIcon={<ArrowBackIcon />}
                        className={classes.button}
                      >
                        Previous Template
                      </Button>
                      <Button
                        variant="contained"
                        size="medium"
                        onClick={clickRight}
                        endIcon={<ArrowForwardIcon />}
                        className={classes.button}
                      >
                        Next Template
                      </Button>
                      <p />
                      <Editor
                        memeToEdit={template}
                        handleReloadMemes={(bool) => setNewMemeCreated(bool)}
                      ></Editor>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper
                    className={classes.paper}
                    elevation={3}
                    position="fixed"
                  >
                    {/* All Memes */}
                    <Typography variant="h5" color="primary">
                      ALL MEMES
                    </Typography>
                    <Button className={classes.button} onClick={saveFile}>
                      Download .zip-File
                    </Button>
                    <br></br>
                    <div elevation={3} className={classes.scroll2}>
                      {/* <AutoPlayMethods> */}
                      <MemeHistory
                        setShouldReloadSavedMemes={(bool) =>
                          setNewMemeCreated(bool)
                        }
                        shouldReloadSavedMemes={newMemeCreated}
                        setTemplateInEditor={(img) => {
                          setTemplate(img);
                        }}
                      />
                      {/* </AutoPlayMethods> */}
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper className={classes.paper} elevation={3}>
                    {/* Your Templates */}
                    <Typography variant="h5" color="primary">
                      YOUR CUSTOM TEMPLATES
                    </Typography>
                    <div elevation={3} className={classes.scroll2}>
                      <TemplateOverview
                        setShouldReloadSavedTemplates={(bool) =>
                          setNewTemplateCreated(bool)
                        }
                        shouldReloadSavedTemplates={newTemplateCreated}
                        setTemplateInEditor={(img) => {
                          setTemplate(img);
                        }}
                      />
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.paper} elevation={3}>
                {/* Settings */}
                <Typography variant="h5" color="primary">
                  OPTIONS
                </Typography>
                <TemplatePicker
                  setShouldReloadSavedTemplates={(bool) =>
                    setNewTemplateCreated(bool)
                  }
                  // passing our uploaded image up to the App.js, to pass it down to the Meme component
                  setTemplateInEditor={(infoForEditor) =>
                    setTemplate(infoForEditor)
                  }
                ></TemplatePicker>
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={3}>
            <Typography variant="h5" color="primary">
                  STATISTICS OF MEMES
                </Typography>
              <Charts />
            </Paper>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default MemeGenerator;
