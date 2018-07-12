import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import { browserHistory } from "react-router";

import "!style-loader!css-loader!react-input-range/lib/css/index.css";
import Saparator from "./container/Saparator";

import MainSignInUp from "./container/MainSignInUp";
import Dashboard from "./container/Dashboard";
import JpRoutes from "./components/JP/JpRoutes";
import FlRoutes from "./components/FL/FlRoutes";

//import JpMain from './JpMain'
//import FlMain from './FlMain'

class Vidboard extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <div>
          {/* Use excat or (/) */}
          <Route exact path="/" component={MainSignInUp} />
          {/* Make router available for Dashboard */}
          <Route exact path="/Logout" component={Dashboard} />
          <JpRoutes />
          <FlRoutes />
        </div>
      </Router>
    );
  }
}

export default Vidboard;
