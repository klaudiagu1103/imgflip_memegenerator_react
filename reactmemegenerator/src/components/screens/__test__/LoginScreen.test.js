// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

import React from 'react';
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import LoginScreen from '../LoginScreen';

it("renders correctly without crashing", async () => {
    render(<Router><LoginScreen /></Router>);
});