// The App.js file from the Frontend is responsible for checking if the user is logged in and redirecting to specific screens
// The default Screen is the MemeGenerator

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Routing
import PrivateRoute from "./components/routing/PrivateRoute";

//Screens
import LoginScreen from "./components/screens/LoginScreen/index";
import RegisterScreen from "./components/screens/RegisterScreen/index";
import ForgotPasswordScreen from "./components/screens/ForgotPasswordScreen/index";
import ResetPasswordScreen from "./components/screens/ResetPasswordScreen/index";
import MemeGenerator from "./components/screens/MemeGenerator";

import "react-notifications/lib/notifications.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Switch>
          {/* The Router checks if the user is logged in. If the user is logged in, then the "MemeGenerator" is redirected to which is the fucntionality of the MemeGenerator */}
          <PrivateRoute exact path="/" component={MemeGenerator} />
          <Route exact path="/login" component={LoginScreen} />
          <Route exact path="/register" component={RegisterScreen} />
          <Route
            exact
            path="/forgotpassword"
            component={ForgotPasswordScreen}
          />
          <Route
            exact
            path="/passwordreset/:resetToken"
            component={ResetPasswordScreen}
          />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
