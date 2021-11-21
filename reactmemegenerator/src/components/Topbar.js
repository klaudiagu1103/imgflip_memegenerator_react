// This component renders the Topbar of the MemeGenerator.
// It provides the Logout functionality.

import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    color: "white",
  },
}));

function ButtonAppBar() {
  let history = useHistory();
  const classes = useStyles();
  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    history.push("/login");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h2" color="light" className={classes.title}>
            OMM MEME GENERATOR
          </Typography>

          <Button
            variant="contained"
            color="white"
            size="large"
            className={classes.button}
            onClick={logoutHandler}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default ButtonAppBar;
