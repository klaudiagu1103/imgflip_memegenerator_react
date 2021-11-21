/**
 * This component renders an overview of ImgFlipAPI Meme Templates and provides a search box with which the user can search for template attributes based on the template name
 * Source for SearchBox: https://www.youtube.com/watch?v=Q8JyF3wpsHc
 */
import React, { useState, useEffect } from "react";
import { Meme } from "../Meme";

const ImgFlipTemplates = (props) => {
  const { setTemplateInEditor } = props;
  const [search, setSearch] = useState("");
  const [filteredMemes, setFilteredMemes] = useState([]);
  const [templates, setTemplates] = useState([]);

  // Backend request to get ImgFlip API templates
  useEffect(() => {
    fetch("http://localhost:3001/memes")
      .then((x) => x.json())
      .then((response) => setTemplates(response.data.memes));
  }, []);

  // function to filter meme images based on name
  useEffect(() => {
    setFilteredMemes(
      templates.filter((template) =>
        template.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, templates]);

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Search for Memes"
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredMemes.map((template) => {
        const templateForEditor = {
          url: template.url,
          alt: template.name,
        };
        return (
          <Meme
            template={{
              url: template.url,
              alt: template.name,
            }}
            onClick={() => setTemplateInEditor(templateForEditor)}
          ></Meme>
        );
      })}
    </div>
  );
};

export default ImgFlipTemplates;
