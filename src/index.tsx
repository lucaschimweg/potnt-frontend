import LoginView from "./components/login";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import SignupView from "./components/signup";
import {PotntSignupApi} from "./api/potntApi";

ReactDOM.render(
    <SignupView api={new PotntSignupApi()} onSignedUp={afterSignUp}/>,
    document.getElementById("root")
);

function afterSignUp(bearer: string, tenant: string) {
    window.sessionStorage.setItem(`bearer/${tenant}`, bearer);
    window.location.href = `/app#${tenant}`
}
