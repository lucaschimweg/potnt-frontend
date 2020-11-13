import React, {ChangeEvent} from "react";

type SignupViewProps = {

}

type SignupViewState = {
    username: string,
    password: string,
    password2: string,
    passwordsMatch: boolean,
    name: string
}

export default class SignupView extends React.Component<SignupViewProps, SignupViewState> {


    constructor(props: Readonly<SignupViewProps> | SignupViewState) {
        super(props);
        this.state = {
            username: "",
            password: "",
            password2: "",
            passwordsMatch: true,
            name: ""
        }
    }

    render() {
        return <div>
            Tenant Name: <input type="text" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}/> <br />
            Username: <input type="text" value={this.state.username} onChange={(e) => this.setState({username: e.target.value})}/> <br />
            Password: <input type="password" value={this.state.password} onChange={this.passwordChange.bind(this)}/> <br />
            RepeatPassword: <input type="password" value={this.state.password2} onChange={this.password2Change.bind(this)}/>
            {(!this.state.passwordsMatch) ? "Passwords do not match!" : ""} <br />
            <button onClick={this.signup}>Login</button>
        </div>;
    }

    signup() {
        alert("Logging in");
    }

    passwordChange(e: ChangeEvent<HTMLInputElement>) {
        this.setState({password: e.target.value, passwordsMatch: e.target.value === this.state.password2});
    }

    password2Change(e: ChangeEvent<HTMLInputElement>) {
        this.setState({password2: e.target.value, passwordsMatch: e.target.value === this.state.password});
    }
}
