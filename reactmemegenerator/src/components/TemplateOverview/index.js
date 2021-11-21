// This Component Renders the Overview of Custom Templates, that can be saved to the database after selecting them in the TenplatePicker.
// Once a user selects an own picture from their computer in "Templatepicker" and then slick on the "save", it is shown in this overview.
// The user is able to click on the templates in the overview and get them within the "TemplateForEditor" function, to continue editing them in the Meme Editor.
import React, { useEffect, useState } from "react";
import { Meme } from "../Meme";

const TemplateOverview = (props) => {
  const {
    setTemplateInEditor,
    shouldReloadSavedTemplates,
    setShouldReloadSavedTemplates,
  } = props;

  const [templatesFromDatabase, setTemplatesFromDatabase] = useState();
  const [shouldLoadInitially, setShouldLoadInitially] = useState(true);

  // using our API to get Templates saved in our MongoDB to show in a list in the frontend
  const loadSavedTemplatesFromServer = async () => {
    fetch("http://localhost:3001/memes/get_templates")
      .then((x) => x.json())
      .then((response) => setTemplatesFromDatabase(response));
  };
  // Reload functionality: Once you save a new Template, the view is updated.
  useEffect(() => {
    if (shouldReloadSavedTemplates === true || shouldLoadInitially === true) {
      loadSavedTemplatesFromServer();
      setShouldLoadInitially(false);
      setShouldReloadSavedTemplates(false);
    }
  }, [
    shouldReloadSavedTemplates,
    shouldLoadInitially,
    setShouldReloadSavedTemplates,
  ]);
  // Render function: Functionality how the Templates are displayed.
  const renderSavedTemplatesFromDatabase = () => {
    if (!templatesFromDatabase)
      return <p>No Templates yet. Create and save a new one..</p>;
    return templatesFromDatabase.map((template) => {
      // template is the Schema from the Database
      const templateForEditor = {
        url: template.exported_image,
        name: template.name,
      };
      return (
        <Meme
          template={{
            url: template.exported_image,
            name: template.url,
          }}
          onClick={() => setTemplateInEditor(templateForEditor)}
        ></Meme>
      );
    });
  };

  return <div>{renderSavedTemplatesFromDatabase()}</div>;
};

export default TemplateOverview;
