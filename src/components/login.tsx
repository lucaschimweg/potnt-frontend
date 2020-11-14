import React from "react";
import {IPotntApi} from "../api/potntApi";

type LoginViewProps = {
    api: IPotntApi
    onLoggedIn: () => void;
}

type LoginViewState = {
    error: string,
    username: string,
    password: string
}

export default class LoginView extends React.Component<LoginViewProps, LoginViewState> {


    constructor(props: Readonly<LoginViewProps> | LoginViewProps) {
        super(props);
        this.state = {
            error: "",
            username: "",
            password: ""
        }
    }

    render() {
        return <div>
            {(this.state.error !== "") ? this.state.error : ""}
            Username: <input type="text" value={this.state.username} onChange={(e) => this.setState({username: e.target.value})}/> <br />
            Password: <input type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/> <br />
            <button onClick={this.login.bind(this)}>Login</button>
        </div>;
    }

    login() {
        this.props.api.login(this.state.username, this.state.password).then((ok: boolean) => {
            if (ok) {
                this.props.onLoggedIn();
            } else {
                this.setState({
                    error: "Login failed"
                });
            }
        });
    }
}
