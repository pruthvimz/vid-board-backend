import React from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Redirect
} from "react-router-dom";
import PropTypes from "prop-types";

import JpLogin from "./JpLogin.jsx";

import JobPosterSignUp from "./JpSignUpIn";
import JpProfile from "./JpProfile";
import JobPostingForm from "./JobPostingForm";
import Dashboard from "./../../container/Dashboard";
import JpDashboard from "./JpDashboard";

import JpProfileSetup from "./JpProfileSetup";
import JpInbox from "./JpInbox";
//import Logout from './Logout'
import Auth from "../../server/auth/authUserCheck";

//const PrivateRoute = ({ component: Component, ...rest }) => (
//
//  <Route {...rest} render={(props) => (
//    Auth.isUserAuthenticated() === true
//      ? <Component {...props} />
//      : <Redirect to={{
//          pathname: '/',
//          state: { from: props.location }
//        }} />//
//  )} />
//)

//function PrivateRoute (props) {
class PrivateRoute extends React.Component {
  constructor(props, context) {
    super(props, context);
    console.log(
      "PrivateRoute Auth.isUserAuthenticated : " + Auth.isUserAuthenticated()
    );
  }

  render() {
    return Auth.isUserAuthenticated() === true ? (
      <Route path={this.props.path} component={this.props.component} />
    ) : (
      <Redirect
        to={{
          pathname: "/",
          state: { from: this.props.location }
        }}
      />
    );
  }
}

class JpRoutes extends React.Component {
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
    location.reload();
  };

  render() {
    return (
      <div>
        {/*
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/Dashboard">Dashboard</Link></li>
                            <li><Link to="/JpLogin">JpLogin</Link></li>
                            <li><Link to="/JpProfileSetup">Profile Setup</Link></li>
                            <li><Link to="/JpProfile">JpProfile</Link></li>                            
                            <li><Link to="/JobPostingForm">JobPostingForm</Link></li>
                            <li><Link to="/JpDashboard">JpDashboard</Link></li>                                                       
                            <li><Link to="/JpInbox">JpInbox</Link></li>
                            <a href="/" onClick={this.jpLogoutAction.bind(this)}> Log Out </a>
                        </ul>
                       */}
        <div>
          <Route path="/JpLogin/" component={JpLogin} />
          <Route path="/JpProfileSetup" component={JpProfileSetup} />
          <Route path="/JpProfile" component={JpProfile} />
          <Route path="/JobPostingForm" component={JobPostingForm} />
          <Route path="/JpDashboard" component={JpDashboard} />
          <Route path="/JpInbox" component={JpInbox} />
        </div>
      </div>
    );
  }
}

export default JpRoutes;
