import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Marking from './pages/Marking';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/markings" component={Marking} />
        </Switch>
    </BrowserRouter>
);

export default Routes;