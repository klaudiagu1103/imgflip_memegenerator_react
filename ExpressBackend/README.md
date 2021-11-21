# Express Backend README

## Description / Folders

- config: Create connection to our MongoDB via Mongoose.
- controllers: used for login & authentication processes / checking private routing once the user is logged in
- dbmodels: Defined Models to save Users, Memes, and Templates to our MongoDB.
- middleware: Middleware for checking authentication & providing custom error messages.
- public: Folder for saving generated files of specific application functionalities (share, snapshot, zip)
- routes: Backend functionalities for frontend-backend communcation (auth, memes, private, webshot)
- utils: Random stuff we didn't know where to put
- app.js: Responsible for starting the Express server and taking care of the routing.
- config.env: Store environment variables for server setup.

  In order to run the project, you can use the following content if your config.env file does not exist:

```
  PORT=3001

  MONGO_URI=mongodb://localhost:27017/Memes

  JWT_SECRET=7ca21e8e0ca6ce6149c2278d4e9cde98a30e0bac0a887daad29833cd84a8c0dbc3b31d
  JWT_EXPIRE=10min

  //SendGrid Account: mail: isabell-kloss@web.de PW: ommisawesome2021
  EMAIL_SERVICE=SendGrid
  EMAIL_USERNAME=apikey
  EMAIL_PASSWORD=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
  EMAIL_FROM=isabell-kloss@web.de
```

Note on Login:

You can create your own custom user to work in the application
For demonstration purposes, your can use the following login credentials after restoring Mongodump:

Email: klaudiagu@yahoo.de
password: 1234567

## Prerequisites

### Mongodump

Note on Database:

We used Mongodump to create an examplary copy of our Database. It can be found in the dump folder in the Express Backend.
Use `mongorestore` to restore the current state; by that you can also see all functionalities of the App working properly.
Link for further information: https://docs.mongodb.com/manual/reference/program/mongorestore/

### Setting up MongoDB

MongoDB will be the database to store data persistently. Wihtin this project, the database will be hosted locally. That is why each user needs to create their own MongoDB.

1. Install it the DB with help of e.g. this tutorial: https://levelup.gitconnected.com/how-to-install-mongodb-database-on-local-environment-19a8a76f1b92 Make sure to have this folder not in the dev folder.
2. Install MongoDB Compass: The GUI that lets you access the database without any terminal commands. Through this GUI you can also create new database or edit database entries.
   Install here: https://www.mongodb.com/try/download/compass
3. We also use Mongoose in this project: https://mongoosejs.com however, it will be install by following the npm install step (see next steps)

### Install Dependencies

Node is required for running the Backend.

In the project directory, you have to run the following command to install the Express Server and other remaining depencencies:

### `npm install`

To be able to restart the server without additional commands you can install nodemon:

### `npm install -g nodemon`

## Getting Started: Database

Start the Database by following the steps of this tutorial: https://levelup.gitconnected.com/how-to-install-mongodb-database-on-local-environment-19a8a76f1b92

As written in the tutorial, you will have two folders in your desktop or users directory, one with name mongodb-setup and the other with name mongodb-data.
Now open terminal and navigate to mongodb-setup/bin folder and execute the following command

### `./mongod --dbpath=<path_to_mongodb-data_folder>`

for example: ./mongod --dbpath=/Users/EXAMPLEUSER/EXAMPLEFOLDER/mongodb-data

Once executed, it will start the MongoDB database server and you will see message “waiting for connections on port 27017” somewhere in the log which means now we can start using MongoDB which runs on default port of 27017.

Now you can start the express server and finally, the React frontend (see respective React Frontend README)

## Getting Started: Express Server

In the project directory, you have to run the following command to run the Express Server, which is then available on localhost/3001:

### `nodemon start` // alternative `npm start`

After that, you can start the React App.
