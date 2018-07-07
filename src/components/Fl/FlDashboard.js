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
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import InputRange from "react-input-range";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Grid from "@material-ui/core/Grid";

import FlProfile from "./FlProfile";
import RenderJobPosts from "../../container/RenderJobPosts";
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
  },
  info: {
    backgroundColor: theme.palette.primary.light
  }
});

class FlDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //        email:this.props.location.state.email,
      email: localStorage.getItem("FreelancerEmail")
        ? localStorage.getItem("FreelancerEmail")
        : "",
      searchText: "",
      searchIn: "Title",
      budget: { min: 200, max: 700 },
      equipment: false,
      accommodation: false,
      preferLocal: false,

      counter: 0,
      jobPostsData: [],

      review: ""
    };

    this.renderLoadPostsRef = React.createRef();

    this.handleText = this.handleText.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);

    this.doOnSubmit = this.doOnSubmit.bind(this);
  }

  componentDidMount() {
    this.getLoginDetail(localStorage.getItem("FreelancerEmail"), "Freelancer");
    //        console.log('componentDidMount review : '+review)
  }

  handleText = name => e => {
    this.setState({ [name]: e.target.value });
  };

  handleSwitch = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  selectRegion(val) {
    this.setState({ region: val });
  }

  getLoginDetail = (email, user_type) => {
//    console.log("in getLoginDetail");
    let url = localStorage.getItem("BACKEND_HOST")+"/getLoginDetail";
    let restMethod = "POST";
    let async = true;
    let data = {
      email,
      user_type
    };

    let loginDetail;
    let xhttp = new XMLHttpRequest();
    xhttp.open(restMethod, url, async);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.addEventListener("load", () => {
      if (xhttp.status === 200) {
        loginDetail = JSON.parse(xhttp.response);
        let review = loginDetail.message.review;

        if (review && review == "Approved") {
          this.doOnSubmit();
        } else {
          this.setState({
            errorMessage: "Please wait till your resume get approve."
          });
        }
        this.setState({ review });
      } else {
        console.log("Error from search job");
      }
    });

    xhttp.send(JSON.stringify(data));
  };

  doOnSubmit = e => {
    if (e) e.preventDefault();

    let url = localStorage.getItem("BACKEND_HOST")+"/FlDashboard";
    let restMethod = "POST";
    let async = true;

    let data = {
      email: this.state.email,
      searchText: this.state.searchText,
      searchIn: this.state.searchIn,
      min_budget: this.state.budget.min,
      max_budget: this.state.budget.max,
      equipment: this.state.equipment,
      accommodation: this.state.accommodation,
      preferLocal: this.state.preferLocal
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
        let jobPostsData = JSON.parse(xhttp.responseText).message;
        this.setState(
          {
            jobPostsData,
            counter: this.state.counter + 1
          },
          () => {
            this.renderLoadPostsRef.current.reloadPosts();
          }
        );
      }
    }.bind(this);
    xhttp.send(JSON.stringify(data));
  };

  render() {
    const { country, region } = this.state;
    const { classes } = this.props;
    let errorMessage = this.state.errorMessage;
    const searchInArray = [
      {
        value: "Title"
      },
      {
        value: "Description"
      },
      {
        value: "Skills"
      }
    ];

    return (
      <Dashboard>
        <Grid container spacing={24} id="flDashboardMainGrid">
          <Grid item xs={4} className="flProfileViewGrid">
            <FlProfile />
          </Grid>
          <Grid item xs={8} id="flDashboardGrid">
              <form className={[classes.container, "flDashboardForm"].join(' ')}>
                  <SnackbarContent
                    className={classes.info}
                    message="Applied job will be available in Inbox"
                  />

                  {errorMessage && errorMessage != "" ? (
                    <SnackbarContent message={errorMessage} />
                  ) : null}

                  <TextField
                    id="select-currency-native"
                    select
                    label="Select your search criteria"
                    className={classes.textField}
                    value={this.state.searchIn}
                    onChange={this.handleText("searchIn")}
                    SelectProps={{
                      native: true,
                      MenuProps: {
                        className: classes.menu
                      }
                    }}
                    helperText=""
                    margin="normal"
                  >
                    {searchInArray.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                  </TextField>

                  <TextField
                    id="searchText"
                    label={this.state.searchIn}
                    className={classes.textField}
                    value={this.state.searchText}
                    type="search"
                    placeholder="Search for your dream job"
                    onChange={this.handleText("searchText")}
                    margin="normal"
                  />

                  <br />
                  <br />

                  <FormHelperText>Conpensation</FormHelperText>
                  <br />

                  <InputRange
                    minValue={100}
                    maxValue={1000}
                    value={this.state.budget}
                    onChange={budget => this.setState({ budget })}
                  />

                  <br />

                  <FormControl component="fieldset">
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={this.state.equipment}
                            onChange={this.handleSwitch("equipment")}
                            value="equipment"
                          />
                        }
                        label="Need Equipment?"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={this.state.accommodation}
                            onChange={this.handleSwitch("accommodation")}
                            value="accommodation"
                          />
                        }
                        label="Need Accommodations?"
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={this.state.preferLocal}
                            onChange={this.handleSwitch("preferLocal")}
                            value="preferLocal"
                          />
                        }
                        label="Prefer a local Job?"
                      />
                    </FormGroup>
                  </FormControl>

                  <br />

                  {/*this.state.preferLocal ? (<div>
                <RegionDropdown
                  country={country}
                  value={region}
                  onChange={(val) => this.selectRegion(val)} /><br/><br/><br/>
          </div> ):null*/}

                  <button
                    onClick={
                      errorMessage && errorMessage == ""
                        ? this.doOnSubmit
                        : null
                    }
                    disable="true"
                  >
                    {" "}
                    Submit{" "}
                  </button>
              </form>

              <div id="flJobSearchList">                
                  <RenderJobPosts
                    jobPostsProp={this.state.jobPostsData}
                    postFor="FlDashboard"
                    ref={this.renderLoadPostsRef}
                  />
                  {this.state.jobPostsData.length < 1 && this.state.counter > 0
                    ? <SnackbarContent
                        message="No record found"
                        />
                    : null}               
              </div>
          </Grid>
        </Grid>
      </Dashboard>
    );
  }
}
FlDashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FlDashboard);
