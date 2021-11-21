import React from 'react';
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import ResetPasswordScreen from '../ResetPasswordScreen';

it("renders correctly without crashing", async () => {
    render(<Router><ResetPasswordScreen /></Router>);
});