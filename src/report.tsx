import * as React from "react";
import * as ReactDOM from 'react-dom';
import SignupView from "./components/signup";
import {PotntApi, PotntSignupApi} from "./api/potntApi";
import ReportView from "./components/report";

function showLoadingView() {
    ReactDOM.render(
        <div>Loading...</div>,
        document.getElementById("root")
    );
}

async function showReportView(tenant: string) {
    let api = new PotntApi(tenant);
    let roads = await api.getRoads();

    if (roads == undefined) {
        ReactDOM.render(
            <div>Error</div>,
            document.getElementById("root")
        );
        return
    }

    ReactDOM.render(
        <ReportView api={api} roads={roads}/>,
        document.getElementById("root")
    );
}


updateFromHash()

window.onhashchange = updateFromHash

function updateFromHash() {
    if (window.location.hash == "") {
        window.location.href = "/"
    }

    const tenant = window.location.hash.substr(1)
    showReportView(tenant)
}
