import LoginView from "./components/login";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import MainView from "./components/mainView";
import {IPotntApi, PotntApi} from "./api/potntApi";

updateFromHash()

window.onhashchange = updateFromHash

function updateFromHash() {
    if (window.location.hash == "") {
        window.location.href = "/"
    }

    const tenant = window.location.hash.substr(1)
    findSessionOrLogin(tenant)
}

function logout(tenant: string) {
    window.sessionStorage.removeItem(`bearer/${tenant}`);
    updateFromHash();
}

function startAppForTenant(api: IPotntApi, tenant: string) {
    ReactDOM.render(
        <MainView api={api} tenant={tenant} logout={() => logout(tenant)}/>,
        document.getElementById("root")
    );
}

function findSessionOrLogin(tenant: string) {
    let bearer = window.sessionStorage.getItem(`bearer/${tenant}`);
    if (bearer == null) {
        login(tenant)
    } else {
        var api = new PotntApi(tenant)
        api.bearerToken = bearer
        startAppForTenant(api, tenant)
    }
}

function login(tenant: string) {
    var api = new PotntApi(tenant)
    ReactDOM.render(
        <LoginView tenant={tenant} api={api} onLoggedIn={() => {
            window.sessionStorage.setItem(`bearer/${tenant}`, api.bearerToken);
            startAppForTenant(api, tenant)
        }}/>,
        document.getElementById("root")
    );
}
