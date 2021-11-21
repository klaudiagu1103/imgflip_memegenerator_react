// This is the Meme-component that returns the image selected in a standardized way.

import React from "react";

export const Meme = ({ template, onClick }) => {
  return (
    <img
      style={{ width: 300 }}
      key={template?.id} // The questionmark makes it optional
      src={template?.url}
      alt={template?.name}
      title={template?.title}
      onClick={onClick}
    />
  );
};
