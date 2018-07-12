import React from "react";
import PropTypes from "prop-types";
import JpSignUpIn from "./JpSignUpIn";
import Auth from "./../../server/auth/authUserCheck";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

export default class JpLogin extends React.Component {
  constructor(props, context) {
    super(props, context);

    const storedMessage = localStorage.getItem("successMessage");
    let successMessage = "";

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem("successMessage");
    }

    this.state = {
      errors: {
        email: "",
        password: "",
        confirmPwd: ""
      },
      message: "",
      successMessage,
      action: "SignIn",
      user: {
        email: "",
        password: "",
        confirmPwd: ""
      }
    };

    //    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);

    //    this.handleText = this.handleText.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    //    this.onKeyPress = this.onKeyPress.bind(this);
    this.doSignUp = this.doSignUp.bind(this);
    this.doSignIn = this.doSignIn.bind(this);
  }

  handleAction = e => {
    this.setState({
      action: this.state.action == "SignUp" ? "SignIn" : "SignUp"
    });
  };

  handleText = name => e => {
    this.setState({ [name]: e.target.value });
  };

  handleRedirect = (pathname, state) => {
    this.props.history.push({
      pathname: pathname,
      state: state
    });
  };

  onKeyPress = event => {
    if (event.key == "Enter") {
      this.handleOnSubmit(event);
    }
  };

  handleOnSubmit = e => {
    this.state.action == "SignUp" ? this.doSignUp(e) : this.doSignIn(e);
  };

  jpLogoutAction = () => {
    Auth.deauthenticateUser();
    localStorage.removeItem("userType");
    localStorage.removeItem("JobPosterEmail");
    this.setState({
      details: {
        userType: "",
        username: null,
        email: null,
        age: null,
        photo: null
      }
    });
    //    location.reload()
    this.handleRedirect("/JpLogin", null);
  };

  doSignUp = e => {
    e.preventDefault();
    let email = this.state.user.email;
    let password = this.state.user.password;
    let confirmPwd = this.state.user.confirmPwd;

    let url = localStorage.getItem("BACKEND_HOST")+"/auth/signup";
    let restMethod = "POST";
    let async = true;
    let data = {
      email: email,
      password: password,
      confirmPwd: confirmPwd,
      user_type: "Job Poster",
      mode: "Sign Up",
      status: "Profile Setup"
    };

    console.log("doSignUp => " + url);
    let response = {};
    let xhttp = new XMLHttpRequest();
    xhttp.open(restMethod, url, async);
    xhttp.setRequestHeader("Content-type", "application/json");
    
    xhttp.addEventListener("load", () => {
      if (xhttp.status === 200) {
        this.setState({
          errors: {
            email: "",
            password: ""
          }
        });
        response = JSON.parse(xhttp.response);
        localStorage.setItem("successMessage", response.message);
        //                this.context.router.history.push('/JpProfile')
        this.context.router.history.push("/JpDashboard"); //see dashboard
      } else {
        response = JSON.parse(xhttp.response);
        console.log(response);
        this.setState({
          errors: response.errors,
          message: response.message
        });
      }
    });

    xhttp.send(JSON.stringify(data));
  };

  doSignIn = e => {
    e.preventDefault();
    console.log("in do Sign In");
    let url = localStorage.getItem("BACKEND_HOST")+"/auth/login";
    let restMethod = "POST";
    let async = true;
    let data = {
      email: this.state.user.email,
      password: this.state.user.password,
      type: "Job Poster"
    };

    let jsonResponse;
    console.log("doSignIn => " + url);
    console.log(data);
    let xhttp = new XMLHttpRequest();
    xhttp.open(restMethod, url, async);
    xhttp.setRequestHeader("Content-type", "application/json");
    //        xhttp.setRequestHeader("authorization", Auth.getToken);
    //        xhttp.responseType = 'json';

    xhttp.addEventListener("load", () => {
      if (xhttp.status === 200) {
        console.log("xhttp.status : " + xhttp.status);
        this.setState({
          errors: {},
          message: ""
        });
        jsonResponse = JSON.parse(xhttp.response);
        //                console.log('jsonResponse.token : ' + jsonResponse.token);
        Auth.authenticateUser(jsonResponse.token);
        localStorage.setItem("userType", "JobPoster");
        localStorage.setItem("JobPosterEmail", this.state.user.email);
        localStorage.setItem(
          "JpAccessLink",
          "JpProfile,JpProfileSetup,JobPostingForm,JpDashboard,JpInbox"
        );

        console.log(
          "Login localStorage.getItem('userType') : " +
            localStorage.getItem("userType")
        );
        //                this.handleRedirect("/JobPosterDashboard");
        //                this.context.router.history.push('/Dashboard')
        this.context.router.history.push("/JpDashboard"); //Dashboard
      } else {
        let response = JSON.parse(xhttp.response);
        console.log(response);
        this.setState({
          errors: response.errors,
          message: response.message
        });
      }
    });

    xhttp.send(JSON.stringify(data));
  };

  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  onBackButtonEvent(e) {
    e.preventDefault();
    this.transitionTo("/");
  }

  handleRedirect = (pathname, state) => {
    this.props.history.push({
      pathname: pathname,
      state: state
    });
  };

  render() {
    return (
        <div id="jpLoginMainDiv">
          <JpSignUpIn
            className="btnFl"
            onSubmit={this.handleOnSubmit}
            onChange={this.changeUser}
            errors={this.state.errors}
            message={this.state.message}
            successMessage={this.state.successMessage}
            user={this.state.user}
            handleAction={this.handleAction}
            action={this.state.action}
          />
        </div>
    );
  }
}

JpLogin.contextTypes = {
  router: PropTypes.object.isRequired
};
