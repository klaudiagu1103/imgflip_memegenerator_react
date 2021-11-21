/**
 * The user is directed to this route once the user is successfully authenticated.
 * If there is an authentication error, the user needs to reload the page to re redirected to the login page.
 * The authentication is handled in the Express Backend.
 */

import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("authToken") ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
