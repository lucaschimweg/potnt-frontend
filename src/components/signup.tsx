import React, {ChangeEvent} from "react";
import {PotntSignupApi} from "../api/potntApi";

type SignupViewProps = {
    api: PotntSignupApi,
    onSignedUp: (bearer: string, name: string) => void
}

type SignupViewState = {
    error: string,
    username: string,
    password: string,
    password2: string,
    passwordsMatch: boolean,
    name: string
}

export default class SignupView extends React.Component<SignupViewProps, SignupViewState> {


    constructor(props: Readonly<SignupViewProps> | SignupViewProps) {
        super(props);
        this.state = {
            error: "",
            username: "",
            password: "",
            password2: "",
            passwordsMatch: true,
            name: ""
        }
    }

    render() {
        return <div>
            {(this.state.error !== "") ? this.state.error : ""}
            Tenant Name: <input type="text" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}/> <br />
            Username: <input type="text" value={this.state.username} onChange={(e) => this.setState({username: e.target.value})}/> <br />
            Password: <input type="password" value={this.state.password} onChange={this.passwordChange.bind(this)}/> <br />
            RepeatPassword: <input type="password" value={this.state.password2} onChange={this.password2Change.bind(this)}/>
            {(!this.state.passwordsMatch) ? "Passwords do not match!" : ""} <br />
            <button onClick={this.signup.bind(this)}>Login</button>
        </div>;
    }

    signup() {
        if (!this.state.passwordsMatch) return;
        this.props.api.signUp(this.state.username, this.state.password, this.state.name). then((api) => {
            if (api != undefined) {
                this.props.onSignedUp(api.bearerToken, this.state.name);
            } else {
                this.setState({
                    error: "Name already in use"
                });
            }
        })
    }

    passwordChange(e: ChangeEvent<HTMLInputElement>) {
        this.setState({password: e.target.value, passwordsMatch: e.target.value === this.state.password2});
    }

    password2Change(e: ChangeEvent<HTMLInputElement>) {
        this.setState({password2: e.target.value, passwordsMatch: e.target.value === this.state.password});
    }
}
