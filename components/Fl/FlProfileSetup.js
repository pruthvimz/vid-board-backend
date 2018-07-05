import React from "react";
import ReactDOM from "react-dom";

import PropTypes from "prop-types";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { withStyles } from "@material-ui/core/styles";
import InputRange from "react-input-range";
import Grid from "@material-ui/core/Grid";

import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
let tagsInput = require("tags-input");

import Dashboard from "./../../container/Dashboard";

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

class FlProfileSetup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: localStorage.getItem("FreelancerEmail")
        ? localStorage.getItem("FreelancerEmail")
        : "",
      name: "",
      location: "",
      travel: false,
      video: "",
      review: "Pending",
      resume: "",
      status: "Dashboard",
      country: "United States",

      skills: "",
      work: "",

      errorMessage: ""
    };

    this.handleText = this.handleText.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);

    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.doOnSubmit = this.doOnSubmit.bind(this);
  }

  componentDidMount() {
    //        console.log('FROM componentDidMount in FLAddInfo');
    //will add script
    tagsInput(document.querySelector('input[type="tags"]'));

    let t = document.getElementById("skills");
    t.addEventListener("input", this.handleTag("skills"));
    t.addEventListener("change", this.handleTag("skills"));
  }

  handleText = name => e => {
    this.setState({ [name]: e.target.value });
  };

  handleSwitch = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  selectRegion(val) {
    this.setState({ location: val });
  }

  handleTag = name => e => {
    this.setState({ [name]: e.target.value.replace(/,/g, ", ") });
  };

  handleText = name => e => {
    this.setState({ [name]: e.target.value });
  };

  handleUploadFile(event) {
    console.log("Uploading");
    let self = this;
    let reader = new FileReader();
    let file = event.target.files[0];

    if (!file) return false;

    if (
      file.type.indexOf("application/pdf") < 0 &&
      file.type.indexOf("application/vnd") < 0
    ) {
      this.setState({
        errorMessage: "Please upload valid file type for Resume."
      });
      return false;
    } else {
      this.setState({ errorMessage: "" });
    }
    if (file.size / 1024 / 1024 > 2) {
      this.setState({ errorMessage: "Please upload maximum 2 mb of Resume." });
      return false;
    } else {
      this.setState({ errorMessage: "" });
    }

    reader.onload = function(upload) {
      self.setState({
        resume: upload.target.result
      });
    };
    reader.readAsDataURL(file);
    setTimeout(function() {
      self.setState({
        resume: self.state.resume
      });
    }, 1000);
  }

  validateForm = () => {
    this.setState({ errorMessage: "" });
    if (
      this.state.name.trim() === "" ||
      this.state.name.split(" ").length <= 1
    ) {
      this.setState({ errorMessage: "Please enter your Full Name." });
      return false;
    } else if (this.state.resume.trim() === "") {
      //Also restricted file type and size
      this.setState({ errorMessage: "Please upload valid file for Resume." });
      return false;
    } else if (this.state.location.trim() === "") {
      this.setState({ errorMessage: "Please select your Location." });
      return false;
    } else if (
      this.state.video.trim() === "" ||
      this.state.video.trim().length < 10
    ) {
      this.setState({ errorMessage: "Please provide valid Video Link." });
      return false;
    } else if (
      this.state.skills.trim() === "" ||
      this.state.skills.trim().length < 10
    ) {
      this.setState({ errorMessage: "Please provide more skills." });
      return false;
    } else if (this.state.work.trim() === "") {
      this.setState({ errorMessage: "Please provide Work detail." });
      return false;
    }
    return true;
  };

  doOnSubmit = e => {
    e.preventDefault();

    let success = this.validateForm();
    console.log(success);
    if (!success) return false;
    return false; //Remove

    let url = "http://localhost:8080/FlProfileSetup";
    let restMethod = "POST";
    let async = true;

    let data = {
      email: this.state.email,
      name: this.state.name,
      location: this.state.location,
      travel: this.state.travel,
      video: this.state.video,
      review: this.state.review,
      resume: this.state.resume,
      skills: this.state.skills,
      work: this.state.work,
      status: this.state.status
    };
    
    let xhttp = new XMLHttpRequest();
    xhttp.open(restMethod, url, async);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        let jsonResponse = JSON.parse(xhttp.responseText);
        console.log(jsonResponse);
      }
    }.bind(this);
    xhttp.send(JSON.stringify(data));
  };

  render() {
    const { country, location } = this.state;
    const { classes } = this.props;

    let errorMessage = this.state.errorMessage;

    return (
      <Dashboard>
        <div id="flProfileSetupDiv">
          {errorMessage && errorMessage !== "" ? (
            <SnackbarContent
              className={classes.snackbar}
              message={errorMessage}
            />
          ) : null}
          <form className={classes.container} encType="multipart/form-data" id="flProfileSetupForm">
            <Grid container spacing={24}>
              <Grid item xs={8} id="flBasicProfileGrid">                
                <TextField
                  id="name"
                  label="Name"
                  className={classes.textField}
                  value={this.state.name}
                  placeholder="Enter Name"
                  onChange={this.handleText("name")}
                  margin="normal"
                />
                <br />
                <br />
                <TextField
                  disabled
                  id="email"
                  label="Email"
                  className={classes.textField}
                  value={this.state.email}
                  placeholder="Enter Email"
                  onChange={this.handleText("email")}
                  margin="normal"
                />
                <br />
                <br />
                <input
                  id="inputFile"
                  type="file"
                  onChange={this.handleUploadFile}
                />
                <br />
                <br />
                <RegionDropdown
                  country={country}
                  value={location}
                  onChange={val => this.selectRegion(val)}
                />
                <br />
                <br />
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.travel}
                      onChange={this.handleSwitch("travel")}
                      value="travel"
                    />
                  }
                  label="Willing to travel for jobs?"
                />
                <br />
                <TextField
                  id="video"
                  label="Video link"
                  className={classes.textField}
                  value={this.state.video}
                  placeholder="Enter youtube/vimeo link"
                  onChange={this.handleText("video")}
                  margin="normal"
                />
                <br />                
              </Grid>
              <Grid item xs={4} id="flAddProfileGrid">
                <input
                  name="skills"
                  type="tags"
                  id="skills"
                  value={this.state.skills}
                  pattern="^#"
                  placeholder="+ Add Skills"
                />
                <br />
                <br />

                <textarea
                  className="work_textarea"
                  value={this.state.work}
                  onChange={this.handleText("work")}
                  placeholder="work"
                />

                <Button
                  onClick={this.doOnSubmit}
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Dashboard>
    );
  }
}
FlProfileSetup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FlProfileSetup);
