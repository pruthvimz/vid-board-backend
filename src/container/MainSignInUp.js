import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
//import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from "@material-ui/core/Grid";
import SnackbarContent from "@material-ui/core/SnackbarContent";

import JpLogin from "../components/JP/JpLogin.jsx";
import FlLogin from "../components/FL/FlLogin.jsx";

//import JpMain from './../../JpMain'
//import FlMain from './../../FlMain'

const styles = theme => ({
  rootGrid: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  }
});

class MainSignInUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showJp: false,
      showFl: false
    };
  }
  
  componentDidMount = () => {
    const hostname = window && window.location && window.location.hostname;

    let backendHost;

    if(hostname === 'https://vid-board.herokuapp.com') {
      backendHost = 'https://vid-board-backend.herokuapp.com';
    } else {
      backendHost = process.env.REACT_APP_LOCAL_BACKEND || 'http://localhost:8080';
    }

//    export const BACKEND = `${backendHost}`;
    localStorage.setItem('BACKEND_HOST',backendHost)
//    console.log("BACKEND_HOST : ",localStorage.getItem("BACKEND_HOST"))
  }

  show = from => {
    //        console.log(from)
    from == "Jp" ? this.setState({ showJp: true }) : null;
    from == "Fl" ? this.setState({ showFl: true }) : null;
  };

  handleClickOpen = () => {
    this.setState({
      showJp: true
    });
  };

  handleClose = value => {
    this.setState({ showJp: false });
  };

  //    handleJp = () => {
  //      this.setState({ showJp: !this.state.showJp });
  //    };
  handleFl = () => {
    this.setState({ showFl: !this.state.showFl });
  };

  render() {
    const { classes } = this.props;
    let successMessage = localStorage.getItem("successMessage");
    console.log('successMessage : '+successMessage)
    return (
      <div className={classes.rootGrid} id="mainSignInUpDiv">
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              Vidboard
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Grid container spacing={24} id="mainSignInUpMainGrid">
          <Grid item xs={12} id="mainSignInUpGrid">
            {successMessage != 'undefined' 
                && successMessage != "" ? (
                  <SnackbarContent
                    className={classes.snackbar}
                    message={successMessage}
                  />
                ) : null}
            <img src="images/corporate.jpg" alt="Snow" />

            <button className="btnJp" onClick={() => this.show("Jp")}>
              Job Poster
            </button>
            {this.state.showJp ? (
              <Dialog
                open={this.state.showJp}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent>
                  <JpLogin />
                </DialogContent>
              </Dialog>
            ) : null}

            {this.state.showFl ? <FlLogin /> : null}
            <button className="btnFl" onClick={this.handleFl}>
              Freelancer
            </button>
            
          </Grid>
        </Grid>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              Copyright 2018 Vidboard. All rights reserved Email us at:
              info@vidboard.com
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(MainSignInUp);
