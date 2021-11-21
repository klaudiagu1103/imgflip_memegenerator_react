/**
 * The ImgFlipAPIMemeGeneration was used at the beginning of the project
 * It used to generate an ImgFlip Link to the Generated Meme which was able to be accessed externally.
 */

// const objectToQueryParam = (obj) => {
//   // this is used for the caption_image so it does not have to be added into the URL. It will loop through the obj params to get the key and their values. The "objectToQueryParam" is then added to the URL instead all of the keys and the values, such as "username", "password", "template_id", etc.
//   const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
//   return "?" + params.join("&");
// };

// const updateText = async (e) => {
//   if (!template.isUserUploaded) {
//     // if template is not user uploaded, then use the updateText function. This needs to be changed into an editor that can both handle text inputs for Imgflip API templates and customones.
//     console.log("button update text");
//     e.preventDefault(); // This makes sure that the Form is not refreshed every time it is submitted
//     // add the logic to create meme from the imgflip api
//     const params = {
//       //these are the properties of caption_image of the imgflip api
//       template_id: template.id,
//       text0: topText,
//       text1: bottomText,
//       username: "isakl",
//       password: "omm2020",
//     };
//     const response = await fetch(
//       `https://api.imgflip.com/caption_image${objectToQueryParam(params)}`
//     );
//     const imgFlipResponse = await response.json();
//     editedMemeUrl = imgFlipResponse.data.url;
//     setEditedMemeUrl(imgFlipResponse.data.url);
//     console.log(editedMemeUrl);

//     function pictureChange() {
//       document.getElementById("memeStateDiv").innerHTML =
//         "<img id='memeState' src='' alt='memeState' width='250'>";
//       document.getElementById("memeState").src = editedMemeUrl;
//     }
//     pictureChange();

//     //setMeme(editedMemeUrl); // After editing the Meme, the Imgflip API creates a new URL with the edited Meme which is even accessible over the Imgflip site.
//   }
// };
