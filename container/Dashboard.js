import React from "react";
import PropTypes from "prop-types";

import { Redirect } from "react-router";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import SnackbarContent from "@material-ui/core/SnackbarContent";

import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import Search from "@material-ui/icons/Search";
import FormatAlignLeft from "@material-ui/icons/FormatAlignLeft";
import Inbox from "@material-ui/icons/Inbox";
//import Message from '@material-ui/icons/Message';

import FlProfileSetup from "../components/FL/FlProfileSetup";
import FlDashboard from "../components/FL/FlDashboard";
import FlAddInfo from "../components/FL/FlAddInfo";
import FlInbox from "../components/FL/FlInbox";

import JpProfileSetup from "../components/JP/JpProfileSetup";
import JobPostingForm from "../components/JP/JobPostingForm";
import JpDashboard from "../components/JP/JpDashboard";
import JpInbox from "../components/JP/JpInbox";

import Auth from "../server/auth/authUserCheck";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appFrame: {
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  appBar: {
    position: "absolute",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "appBarShift-left": {
    marginLeft: drawerWidth
  },
  "appBarShift-right": {
    marginRight: drawerWidth
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  "content-left": {
    marginLeft: -drawerWidth
  },
  "content-right": {
    marginRight: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "contentShift-left": {
    marginLeft: 0
  },
  "contentShift-right": {
    marginRight: 0
  }
});

class Dashboard extends React.Component {
  state = {
    open: false,
    anchor: "left",
    userType: "",
    redirectTo: "",
    requiredLink: ""
  };

  //  static getDerivedStateFromProps(nextProps, prevState) {
  //  static shouldComponentUpdate() {
  //    console.log(newProps.params);
  componentWillMount() {
    let redirectTo;
    let userType = localStorage.getItem("userType");
    console.log("userType : " + userType);
    let requiredLink = window.location.pathname.replace("/", "");

    if (!userType || userType == "") {
      redirectTo = "/";
      this.LogoutAction();
      this.setState({ redirectTo });
      return false;
    }

    let FlAccessLink = localStorage.getItem("FlAccessLink");
    let JpAccessLink = localStorage.getItem("JpAccessLink");
    //    console.log('JpAccessLink : '+JpAccessLink);
    //    console.log('requiredLink : '+requiredLink);

    if (
      (userType == "JobPoster" && JpAccessLink.indexOf(requiredLink) < 0) ||
      (userType == "FlAccessLink" && FlAccessLink.indexOf(requiredLink) < 0)
    ) {
      redirectTo = "/";
      this.LogoutAction();
      this.setState({ redirectTo });
      return false;
    }

    let email =
      userType == "JobPoster"
        ? localStorage.getItem("JobPosterEmail")
        : localStorage.getItem("FreelancerEmail");

    let status = this.getLoginDetail(email, userType, this.redirectValidator);
    //    this.setState({ userType });
  }

  redirectValidator = status => {
    let userType = localStorage.getItem("userType");
    let redirectTo;
    if (userType === "JobPoster") {
      console.log("JobPoster getLoginDetail status : " + status);
      if (status == "Profile Setup") redirectTo = "/JpProfileSetup";
      if (status == "Post Job") redirectTo = "/JobPostingForm";
    } else {
      console.log("status : " + status);
      if (status == "Profile Setup") redirectTo = "/FlProfileSetup";
    }
    this.setState({ userType, redirectTo });
  };

  getLoginDetail = (email, userType, redirectValidator) => {
    //        e.preventDefault()
    console.log("in getLoginDetail email : " + email);
    let url = localStorage.getItem("BACKEND_HOST")+"/getLoginDetail";
    let restMethod = "POST";
    let async = true;
    let data = {
      email: email,
      user_type: userType
    };

    var loginDetail;
    var xhttp = new XMLHttpRequest();
    xhttp.open(restMethod, url, async);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.addEventListener("load", () => {
      if (xhttp.status === 200) {
        loginDetail = JSON.parse(xhttp.response);
        console.log("loginDetail => ");
        console.log(loginDetail);
        redirectValidator(loginDetail.message.status);
      } else {
        this.LogoutAction();
        return "/";
      }
    });

    xhttp.send(JSON.stringify(data));
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value
    });
  };

  LogoutAction = () => {
    let userType = localStorage.getItem("userType");
    userType && userType == "JobPoster"
      ? this.jpLogoutAction()
      : this.flLogoutAction();
  };

  jpLogoutAction = () => {
    Auth.deauthenticateUser();
    localStorage.removeItem("userType");
    localStorage.removeItem("JobPosterEmail");
    localStorage.removeItem("JpAccessLink");
    console.log("Jp Signed out");
  };

  flLogoutAction = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("FreelancerEmail");
    localStorage.removeItem("FlAccessLink");

    if (typeof gapi !== "undefined" && typeof gapi.auth2 !== "undefined") {
      console.log("flLogoutAction dashboard");
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function() {
        console.log("User signed out.");
      });
    }
  };

  handleRedirect = (pathname, state) => {
    this.props.history.push({
      //    this.context.router.history.push({
      pathname: pathname,
      state: state
    });
  };

  render() {
    const { classes, theme } = this.props;
    const { anchor, open } = this.state;

    const drawer = (
      <Drawer
        variant="persistent"
        anchor={anchor}
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>

        <Divider />
        {/* Navigation Links */}
        {this.state.userType === "JobPoster" ? (
          <List>
            <ListItem button>
              <Avatar>
                <ImageIcon />
              </Avatar>
              <Button component={Link} to="/JpProfileSetup">
                Setup Profile
              </Button>
            </ListItem>
            <ListItem button>
              <Avatar>
                <FormatAlignLeft />
              </Avatar>
              <Button component={Link} to="/JobPostingForm">
                Job Posting Form
              </Button>
            </ListItem>
            <ListItem button>
              <Avatar>
                <WorkIcon />
              </Avatar>
              <Button component={Link} to="/JpDashboard">
                Job Posts
              </Button>
            </ListItem>
            <ListItem button>
              <Avatar>
                <Inbox />
              </Avatar>
              <Button component={Link} to="/JpInbox">
                Inbox
              </Button>
            </ListItem>
          </List>
        ) : (
          <List>
            <ListItem button>
              <Avatar>
                <ImageIcon />
              </Avatar>
              <Button component={Link} to="/FlProfileSetup">
                Setup Profile
              </Button>
            </ListItem>
            <ListItem button>
              <Avatar>
                <Search />
              </Avatar>
              <Button component={Link} to="/FlDashboard">
                Search Job
              </Button>
            </ListItem>
            <ListItem button>
              <Avatar>
                <Inbox />
              </Avatar>
              <Button component={Link} to="/FlInbox">
                Inbox
              </Button>
            </ListItem>
          </List>
        )}
      </Drawer>
    );

    let before = null;
    let after = null;

    if (anchor === "left") {
      before = drawer;
    } else {
      after = drawer;
    }

    return (
      <div className={classes.root}>
        {this.state.redirectTo && this.state.redirectTo != "" ? (
          <Redirect to={this.state.redirectTo} />
        ) : null}

        <div className={classes.appFrame}>
          <AppBar
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
              [classes[`appBarShift-${anchor}`]]: open
            })}
          >
            <Toolbar disableGutters={!open}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit" noWrap>
                Vidboard
              </Typography>
              <Button
                component={Link}
                to="/"
                onClick={this.LogoutAction.bind(this)}
                color="inherit"
              >
                Logout
              </Button>
            </Toolbar>
          </AppBar>
          {before}

          <main
            className={classNames(
              classes.content,
              classes[`content-${anchor}`],
              {
                [classes.contentShift]: open,
                [classes[`contentShift-${anchor}`]]: open
              }
            )}
          >
            <div className={classes.drawerHeader} />

            <div>{this.props.children}</div>
            {/* Actual content will be displayed here 
            <Route path = "/JpProfileSetup" component = {JpProfileSetup} />
            <Route path = "/JobPostingForm" component = {JobPostingForm} />
            <Route path = "/JpDashboard" component = {JpDashboard} />
            <Route path = "/JpInbox" component = {JpInbox} />
            
            <Route path = "/(FlProfileSetup)/" component = {FlProfileSetup} />
            <Route path = "/FlAddInfo" component = {FlAddInfo} />
            <Route path = "/FlDashboard" component = {FlDashboard} />
                       */}
          </main>
          {after}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  router: PropTypes.object
};

export default withStyles(styles, { withTheme: true })(Dashboard);
