# React Frontend README

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Description / Folders

Note: This application only works if a user registers and logs into the application.

src:

- components: all functionalities that we use for our MemeGenerator.
  - Autoplay: Attempt to build autoplay for imagesilder => not fully integrated
  - Charts: Displays graphical statistics of views and likes of all generated Memes.
  - Editor: The main part of the Meme Generation process. All Tempaltes are selected into this component to be edited, saved and shared.
  - ImgFlipAPIMemeGeneration: Creates Links to Memes that are generated via the ImgFlipAPI. This component is not integrated into the final application.
  - ImgFlipTemplates: Provides the user with all Templates that are accessible via the ImgFlip API.
  - MemeHistory: Shows an overview of all Memes that have been created and saved to DB, with additional interaction functionalities.
  - routing: Checking if the User is logged in
  - screens: Here, all main screens that can be rendered are contained.
    - **test**: automated testing for authentication and login screens
    - ForgotPasswordScreen
    - LoginScreen
    - RegisterScreen
    - Resetpasswordscreen
    - MemeGenerator.js: This is the main screen of the application. Once the user is logged in, the user is redirected to the MemeGenerator, which renders all main Meme Generation components. Note: This screen also contains all components which are mentioned in the further course.
  - TemplateOverview: Shows a list of all Templates saved to DB
  - TemplatePicker: Provides different options to upload / create an own Template for Meme Generation
  - Information: Portray different information of the saved Meme in the MemeHistory
  - Meme: Provides functionality to render each Meme in the same way
  - Topbar: Provides Topbar for the MemeGenerator component

App.js: responsible for checking if the user is logged in and redirecting to specific screens. The default screen is the MemeGenerator (in screens folder)

index.js: Entry point of React App where App.js is called
theme.js: Overwrites default application theme of Material UI

### Install Dependencies

In the project directory, you have to run the following command to install the React App and other remaining depencencies:

### `npm install`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
