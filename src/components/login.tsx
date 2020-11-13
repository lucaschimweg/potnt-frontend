import React from "react";

type LoginViewProps = {

}

type LoginViewState = {
    username: string,
    password: string
}

export default class LoginView extends React.Component<LoginViewProps, LoginViewState> {


    constructor(props: Readonly<LoginViewProps> | LoginViewProps) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    render() {
        return <div>
            Username: <input type="text" value={this.state.username} onChange={(e) => this.setState({username: e.target.value})}/> <br />
            Password: <input type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/> <br />
            <button onClick={this.login}>Login</button>
        </div>;
    }

    login() {
        alert("Logging in")
    }
}
