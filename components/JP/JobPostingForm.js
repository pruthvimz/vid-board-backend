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
import { withStyles } from "@material-ui/core/styles";
import InputRange from "react-input-range";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Button from "@material-ui/core/Button";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
let tagsInput = require("tags-input");
import Grid from "@material-ui/core/Grid";

import JpProfile from "./JpProfile";
import Dashboard from "./../../container/Dashboard";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: 0,
    marginRight: 0,
    width: "100%"
  },
  menu: {
    width: 200
  }
});

class JobPostingForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //        email:this.props.location.state.email,
      email: localStorage.getItem("JobPosterEmail")
        ? localStorage.getItem("JobPosterEmail")
        : "",
      title: "",
      description: "",
      //        budget: {},
      budget: { min: 500, max: 700 },
      skills: "",
      equipment: false,
      accommodation: false,
      preferLocal: false,
      country: "United States",
      region: "",
      errorMessage: ""
    };

    this.handleText = this.handleText.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);

    this.doOnSubmit = this.doOnSubmit.bind(this);
  }
  componentDidMount() {
    //will add script
    tagsInput(document.querySelector('input[type="tags"]'));

    let t = document.getElementById("skills");
    t.addEventListener("input", this.handleTag("skills"));
    t.addEventListener("change", this.handleTag("skills"));
  }

  handleTag = name => e => {
    this.setState({ [name]: e.target.value.replace(/,/g, ", ") });
  };

  handleText = name => e => {
    this.setState({ [name]: e.target.value });
  };

  handleSwitch = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  selectRegion(val) {
    this.setState({ region: val });
  }

  validateForm = () => {
    this.setState({ errorMessage: "" });
    if (this.state.title.trim() === "") {
      this.setState({ errorMessage: "Please enter Titile of job." });
      return false;
    } else if (
      this.state.description.trim() === "" ||
      this.state.description.trim().length < 10
    ) {
      this.setState({
        errorMessage: "Please enter at least five word Job description."
      });
      return false;
    } else if (this.state.skills.trim() === "") {
      this.setState({ errorMessage: "Please enter required Skills." });
      return false;
    }
    return true;
  };

  doOnSubmit = e => {
    e.preventDefault();

    let success = this.validateForm();

    if (!success) return false;

    let url = localStorage.getItem("BACKEND_HOST")+"/AddJobPost";
    let restMethod = "POST";
    let async = true;

    let data = {
      email: this.state.email,
      title: this.state.title,
      description: this.state.description,
      budgetMin: this.state.budget.min,
      budgetMax: this.state.budget.max,
      skills: this.state.skills,
      equipment: this.state.equipment,
      accommodation: this.state.accommodation,
      preferLocal: this.state.preferLocal,
      region: this.state.region,
      status: "Dashboard"
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
    const { country, region } = this.state;
    const { classes } = this.props;
    //        let min = this.state.min;
    //        let max = this.state.max;
    let errorMessage = this.state.errorMessage;

    return (
      <Dashboard>
        <Grid container spacing={24} id="jpJobPostFormMainGrid">
          <Grid item xs={4} className="jpProfileViewGrid">
            <JpProfile />
          </Grid>
          <Grid item xs={8} id="jpJobPostFormGrid">
              <form className={classes.container} autoComplete="on" id="jpJobPostForm">
                {errorMessage && errorMessage !== "" ? (
                  <SnackbarContent
                    className={classes.snackbar}
                    message={errorMessage}
                  />
                ) : null}
                <TextField
                  id="title"
                  label="Title of job"
                  className={classes.textField}
                  value={this.state.title}
                  placeholder="Write most suitable title for your job."
                  onChange={this.handleText("title")}
                  margin="normal"
                />
                <br />
                <TextField
                  id="multiline-static"
                  label="Description"
                  multiline
                  rows="3"
                  placeholder="Write job description."
                  className={classes.textField}
                  onChange={this.handleText("description")}
                  margin="normal"
                />
                <br />

                <FormHelperText>Required skills</FormHelperText>
                <input
                  name="skills"
                  type="tags"
                  id="skills"
                  value={this.state.skills}
                  pattern="^#"
                  placeholder="+ Skills"
                />

                <br />
                <br />

                <FormHelperText>Budget</FormHelperText>
                <br />
                <InputRange
                  minValue={100}
                  maxValue={1000}
                  value={this.state.budget}
                  formatLabel={value => `${value}$`}
                  onChange={budget => this.setState({ budget })}
                />

                <br />

                <FormControl component="fieldset">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.equipment}
                          onChange={this.handleSwitch("equipment")}
                          value="equipment"
                        />
                      }
                      label="Equipment included?"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.accommodation}
                          onChange={this.handleSwitch("accommodation")}
                          value="accommodation"
                        />
                      }
                      label="Accommodations reimbursed?"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.preferLocal}
                          onChange={this.handleSwitch("preferLocal")}
                          value="preferLocal"
                        />
                      }
                      label="Prefer a local freelancer?"
                    />
                  </FormGroup>
                </FormControl>

                <br />

                {this.state.preferLocal ? (
                  <div>
                    <RegionDropdown
                      country={country}
                      value={region}
                      onChange={val => this.selectRegion(val)}
                    />
                    <br />
                    <br />
                    <br />
                  </div>
                ) : null}

                <Button
                  onClick={this.doOnSubmit}
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Submit
                </Button>
              </form>
          </Grid>
        </Grid>
      </Dashboard>
    );
  }
}
JobPostingForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(JobPostingForm);
