import LoginView from "./components/login";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import SignupView from "./components/signup";
import MainView from "./components/mainView";
import {DummyPotntApi} from "./api/dummyApi";

ReactDOM.render(
    <MainView api={new DummyPotntApi()}/>,
    document.getElementById("root")
);
