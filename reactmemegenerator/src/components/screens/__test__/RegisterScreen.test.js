import React from 'react';
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import RegisterScreen from '../RegisterScreen';

it("renders correctly without crashing", async () => {
    render(<Router><RegisterScreen /></Router>);
});