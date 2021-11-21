/**
 * This component displays statistical charts of likes and views of all generated memes.
 */
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts"; //Source: https://www.npmjs.com/package/react-google-charts

const Charts = (props) => {
  const [memesFromDatabase, setMemesFromDatabase] = useState();

  // using our API to get Memes saved in our MongoDB
  const loadSavedMemesFromServer = async () => {
    fetch("http://localhost:3001/memes/get_memes")
      .then((x) => x.json())
      .then((response) => setMemesFromDatabase(response));
  };

  useEffect(() => {
    loadSavedMemesFromServer();
  }, []);

  // Webapp interface of the Charts Component
  const renderCharts = () => {
    if (!memesFromDatabase) return <p>No Memes yet.</p>;
    return memesFromDatabase.map((meme) => {
      const templateForEditor = {
        url: meme.exported_image,
        name: meme.name,
        title: meme.title,
        topText: meme.topText,
        bottomText: meme.bottomText,
        additionalTextA: meme.AdditionalTextA,
        views: meme.views,
        likes: meme.likes,
        filePath: "http://localhost:3001" + meme.filePath,
      };
      return (
        <Chart
          width={"300px"}
          height={"300px"}
          chartType="Bar"
          loader={<div>Loading Chart</div>}
          data={[
            ["Memes", "Views", "Likes"],
            [meme.title, meme.views, meme.likes],
          ]}
          options={{
            // Material design options
            chart: {
              title: meme.title,
              subtitle: "Views and Likes",
            },
          }}
        />
      );
    });
  };

  return <div>{renderCharts()}</div>;
};
export default Charts;
