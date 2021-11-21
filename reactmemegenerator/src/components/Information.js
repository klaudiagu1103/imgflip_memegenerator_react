/**
 * This component renders the Information of the Meme in the Meme History, such as likes and views.
 */

// React imports
import React from "react";
import { Fragment } from "react";
import IconButton from "@material-ui/core/IconButton";
import ThumbUp from "@material-ui/icons/ThumbUp";

export const Information = (props) => {
  const { template, setShouldReloadSavedMemes } = props;
  const increaseLike = () => {
    template.likes = template.likes + 1;
    const bodyToSend = { likes: template.likes, id: template.id };
    fetch("http://localhost:3001/memes/increaseLike", {
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

  return (
    <Fragment>
      <p>
        {template.likes} {template._id} Likes
        <IconButton size="large" variant="contained" onClick={increaseLike}>
          <ThumbUp />
        </IconButton>
        <br></br>
        {template.views} Views
      </p>
    </Fragment>
  );
};
