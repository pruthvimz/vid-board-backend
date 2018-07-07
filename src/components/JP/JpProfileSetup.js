import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { withStyles } from "@material-ui/core/styles";

import Dashboard from "../../container/Dashboard";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  menu: {
    width: 200
  }
});

class JpProfileSetup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      individual: false,
      company: "",
      email: localStorage.getItem("JobPosterEmail")
        ? localStorage.getItem("JobPosterEmail")
        : "",
      preference: "",

      video: false,
      photo: false,
      notSure: true,

      status: "Post Job", //Next step
      errorMessage: ""
    };

    this.handleText = this.handleText.bind(this);
    this.handleIndividualSwitch = this.handleIndividualSwitch.bind(this);
    this.handleOtherChk = this.handleOtherChk.bind(this);
    this.handleNotSureChk = this.handleNotSureChk.bind(this);
    this.doOnSubmit = this.doOnSubmit.bind(this);
  }

  handleText = name => e => {
    this.setState({ [name]: e.target.value });
  };

  handleIndividualSwitch = e => {
    this.setState({
      individual: e.target.checked
    });
  };

  handleNotSureChk = name => event => {
    this.setState({ [name]: event.target.checked });
    this.setState({ video: false });
    this.setState({ photo: false });
  };

  handleOtherChk = name => event => {
    this.setState({ [name]: event.target.checked });
    this.setState({ notSure: false });
  };

  //   name:'',
  //    individual : false,
  //    company : '',

  validateForm = () => {
    this.setState({ errorMessage: "" });
    if (
      this.state.name.trim() === "" ||
      this.state.name.split(" ").length <= 1
    ) {
      this.setState({ errorMessage: "Please enter your full name." });
      return false;
    } else if (
      this.state.individual == false &&
      this.state.company.trim() === ""
    ) {
      this.setState({ errorMessage: "Please enter your company name." });
      return false;
    } else if (
      this.state.video == false &&
      this.state.photo == false &&
      this.state.notSure == false
    ) {
      this.setState({
        errorMessage: "Please enter the type of work you are looking for."
      });
      return false;
    }
    return true;
  };

  doOnSubmit = () => {
    let success = this.validateForm();

    if (!success) return false;

    let url = localStorage.getItem("BACKEND_HOST")+"/JpProfileSetup";
    let restMethod = "POST";
    let async = true;

    let preference = "";
    this.state.video ? (preference += "video,") : "";
    this.state.photo ? (preference += "photo,") : "";
    this.state.notSure ? (preference += "notSure,") : "";
    preference = preference.substring(0, preference.length - 1);

    let data = {
      email: this.state.email,
      name: this.state.name,
      individual: this.state.individual,
      company: this.state.company,
      preference: preference,
      status: this.state.status
    };

    console.log("data => ");
    console.log(data);
    //        if(true){
    //            console.log("call restricted");
    //            return false;
    //        }
    let xhttp = new XMLHttpRequest();
    xhttp.open(restMethod, url, async);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        let jsonResponse = JSON.parse(xhttp.responseText);
        console.log(jsonResponse);
        let state = { email: this.state.email };
        this.handleRedirect("/JobPosterDashboard", state);
      }
    }.bind(this);
    xhttp.send(JSON.stringify(data));
  };

  handleRedirect = (pathname, state) => {
    this.props.history.push({
      pathname: pathname,
      state: state
    });
  };

  render() {
    const { classes } = this.props;
    let errorMessage = this.state.errorMessage;

    return (
      <Dashboard>
        <div id="fpProfileSetupDiv">
          {errorMessage && errorMessage !== "" ? (
            <SnackbarContent
              className={classes.snackbar}
              message={errorMessage}
            />
          ) : null}

          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            value={this.state.name}
            placeholder="Jack Bezoz"
            onChange={this.handleText("name")}
            margin="normal"
          />
          <br />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.individual}
                onChange={this.handleIndividualSwitch}
                value="individual"
              />
            }
            label="Individual"
          />
          {!this.state.individual ? (
            <TextField
              id="company"
              label="Company Name"
              className={classes.textField}
              value={this.state.company}
              placeholder="Alphabet"
              onChange={this.handleText("company")}
              margin="normal"
            />
          ) : null}
          <br />
          <TextField
            disabled
            id="email"
            label="Email"
            className={classes.textField}
            value={this.state.email}
            placeholder="abc@xyz.com"
            onChange={this.handleText("email")}
            margin="normal"
          />
          <br />

          <FormControl component="fieldset">
            <FormLabel component="legend">
              What type of work are you mostly looking for?
            </FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.video}
                    onChange={this.handleOtherChk("video")}
                    value="video"
                  />
                }
                label="Video"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.photo}
                    onChange={this.handleOtherChk("photo")}
                    value="photo"
                  />
                }
                label="Photo"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.notSure}
                    onChange={this.handleNotSureChk("notSure")}
                    value="notSure"
                  />
                }
                label="Not sure yet"
              />
            </FormGroup>
          </FormControl>

          <br />

          <Button
            onClick={this.doOnSubmit}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Submit
          </Button>
        </div>
      </Dashboard>
    );
  }
}

export default withStyles(styles)(JpProfileSetup);
