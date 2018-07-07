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
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { withStyles } from "@material-ui/core/styles";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import InputRange from "react-input-range";
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
  }
});

class FlInbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //        email:this.props.location.state.email,
      email: localStorage.getItem("FreelancerEmail")
        ? localStorage.getItem("FreelancerEmail")
        : "yash.97373@gmail.com",
      searchText: "",
      searchIn: "Title",
      budget: { min: 200, max: 700 },
      equipment: false,
      accommodation: false,
      preferLocal: false,

      counter: 0,
      jobPostsData: []
    };

    this.renderLoadPostsRef = React.createRef();

    this.handleText = this.handleText.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);

    this.doOnSubmit = this.doOnSubmit.bind(this);
  }

  componentDidMount() {
    this.doOnSubmit();
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

  doOnSubmit = e => {
    if (e) e.preventDefault();

    let url = localStorage.getItem("BACKEND_HOST")+"/FlInbox";
    let restMethod = "POST";
    let async = true;

    let data = {
      email: this.state.email
    };

    console.log("data => ");
    console.log(data);

    let xhttp = new XMLHttpRequest();
    xhttp.open(restMethod, url, async);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        let jobPostsData = JSON.parse(xhttp.responseText).message;
        console.log(jobPostsData);
        //              this.state.jobPostsData = jobPostsData;

        //                if(jobPostsData && jobPostsData.length > 0){
        console.log("Going to render job posts");
        console.log("counter before : " + this.state.counter);
        this.setState(
          {
            jobPostsData,
            counter: this.state.counter + 1
          },
          () => {
            this.renderLoadPostsRef.current.reloadPosts();
          }
        );
        console.log("counter after : " + this.state.counter);
        //                }else{
        //                    this.setState({
        //                        noRecordFound : 'No Record Found'
        //                    })
        //                }
      }
    }.bind(this);
    xhttp.send(JSON.stringify(data));
  };

  render() {
    const { country, region } = this.state;
    const { classes } = this.props;

    return (
      <Dashboard>
        <Grid container spacing={24} id="flInboxMainGrid">
          <Grid item xs={4} id="flProfileViewGrid">
            <FlProfile />
          </Grid>
          <Grid item xs={8} id="flInboxGrid">
            <RenderJobPosts
              jobPostsProp={this.state.jobPostsData}
              postFor="FlInbox"
              ref={this.renderLoadPostsRef}
            />
            {this.state.jobPostsData.length < 1
                ? <SnackbarContent
                    message="No record found"
                />
                : null}              
          </Grid>
        </Grid>
      </Dashboard>
    );
  }
}
FlInbox.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FlInbox);
