// This component is repsonsible for showing all previously created Memes from the user.
// Visible in "All Memes"

import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Meme } from "../Meme";
import { Information } from "../Information";
import Speech from "react-speech"; // Source: https://www.npmjs.com/package/react-speech
import Typography from "@material-ui/core/Typography";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

const MemeHistory = (props) => {
  const {
    setTemplateInEditor,
    shouldReloadSavedMemes,
    setShouldReloadSavedMemes,
  } = props; // props as fucntionalities are used in other components

  const [memesFromDatabase, setMemesFromDatabase] = useState();
  const [shouldLoadInitially, setShouldLoadInitially] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredMemes, setFilteredMemes] = useState([]);

  // using our API to get Memes saved in our MongoDB
  const loadSavedMemesFromServer = async () => {
    fetch("http://localhost:3001/memes/get_memes")
      .then((x) => x.json())
      .then((response) => setMemesFromDatabase(response));
  };
  // Whenever a Meme is created and saved, the Overview is reloaded
  useEffect(() => {
    if (shouldReloadSavedMemes === true || shouldLoadInitially === true) {
      loadSavedMemesFromServer();
      setShouldLoadInitially(false);
      setShouldReloadSavedMemes(false);
    }
  }, [shouldReloadSavedMemes, shouldLoadInitially, setShouldReloadSavedMemes]);

  // Search and Filter Options for Memes saved in the Database
  useEffect(() => {
    if (!memesFromDatabase) return [];
    setFilteredMemes(
      memesFromDatabase.filter(
        (meme) =>
          meme.title?.toLowerCase().includes(search.toLowerCase()) ||
          meme.topText.toLowerCase().includes(search.toLowerCase()) ||
          meme.bottomText.toLowerCase().includes(search.toLowerCase()) ||
          meme.likes.toString().includes(search.toString()) ||
          meme.views.toString().includes(search.toString()) ||
          meme.created_at?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, memesFromDatabase]);

  // Method which increases views if a Meme is selected from the History into the Editor
  const increaseViews = (views, id) => {
    views = views + 1;
    const bodyToSend = { views: views, id: id };
    fetch("http://localhost:3001/memes/increaseViews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        setShouldReloadSavedMemes();
      })
      .catch((error) => {});
  };

  // Webapp interface of the Meme History ("All Memes")
  const renderSavedMemesFromDatabase = () => {
    if (!memesFromDatabase)
      return <p>No Templates yet. Create and save a new one..</p>;
    return (
      <div className="App">
        <input
          type="text"
          placeholder="Search for Memes"
          onChange={(e) => setSearch(e.target.value)}
        />
        {filteredMemes.map((meme) => {
          // meme is the Schema from the Database
          // The Memes that were saved to the database before, can be put into the Editor within the "templateForEditor" function
          // Note: We take the exported Image into the editor, therefore we can only "GET" our previously created images, but cannot re-edit the Meme i.e. the already entered text.
          const templateForEditor = {
            url: meme.exported_image,
            name: meme.name,
            title: meme.title,
            topText: meme.topText,
            bottomText: meme.bottomText,
            additionalTextA: meme.AdditionalTextA,
            views: meme.views,
            filePath: "http://localhost:3001" + meme.filePath,
          };
          return (
            <Fragment>
              <Typography variant="h6" color="primary">
                <p>
                  {" "}
                  <Speech text={meme.title} textAsButton="true" />
                  <VolumeUpIcon />
                </p>
              </Typography>
              <Meme
                template={{
                  url: meme.exported_image,
                  name: meme.url,
                }}
                onClick={() =>
                  setTemplateInEditor(templateForEditor) &
                  increaseViews(meme.views, meme._id) &
                  setShouldReloadSavedMemes(true)
                }
              ></Meme>
              <Information
                template={{
                  id: meme._id,
                  url: meme.exported_image,
                  name: meme.url,
                  likes: meme.likes,
                  views: meme.views,
                }}
                setShouldReloadSavedMemes={() =>
                  setShouldReloadSavedMemes(true)
                }
              ></Information>
            </Fragment>
          );
        })}
      </div>
    );
  };

  return <div>{renderSavedMemesFromDatabase()}</div>;
};

export default MemeHistory;
