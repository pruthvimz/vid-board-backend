import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import PropTypes from "prop-types";
import FlLogin from "./FlLogin.jsx";

import FlProfileSetup from "./FlProfileSetup";
import FlDashboard from "./FlDashboard";
import FlAddInfo from "./FlAddInfo";
import FlProfile from "./FlProfile";
import FlInbox from "./FlInbox";

class FlRoutes extends React.Component {
  render() {
    return (
      <div>
        {/*
                        <ul>
                            <li><Link to="/Login">Login</Link></li>
                            <li><Link to="/FlProfileSetup">FlProfileSetup</Link></li>
                            <li><Link to="/FlProfile">FlProfile</Link></li>
                            <li><Link to="/FlAddInfo">FlAddInfo</Link></li>
                            <li><Link to="/FlDashboard">FlDashboard</Link></li>
                            <li><Link to="/FlInbox">FlInbox</Link></li>
                        </ul>
                        */}
        <div>
          <Route path="/Login/" component={FlLogin} />
          <Route path="/FlProfileSetup/" component={FlProfileSetup} />
          <Route path="/FlProfile" component={FlProfile} />
          <Route path="/FlAddInfo" component={FlAddInfo} />
          <Route path="/FlDashboard" component={FlDashboard} />
          <Route path="/FlInbox" component={FlInbox} />
        </div>
      </div>
    );
  }
}

export default FlRoutes;
