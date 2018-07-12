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

class FlAddInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: localStorage.getItem("FreelancerEmail")
        ? localStorage.getItem("FreelancerEmail")
        : "",
      skills: "",
      work: "",

      errors: "",
      status: "Dashboard"
    };

    this.handleText = this.handleText.bind(this);
    this.handleTag = this.handleTag.bind(this);
    this.doOnSubmit = this.doOnSubmit.bind(this);
  }

  componentWillMount() {
    console.log("FROM componentWillMount in FLAddInfo");
  }

  componentDidMount() {
    console.log("FROM componentDidMount in FLAddInfo");

    //will add script
    tagsInput(document.querySelector('input[type="tags"]'));

    let t = document.getElementById("skills");
    t.addEventListener("input", this.handleTag("skills"));
    t.addEventListener("change", this.handleTag("skills"));

    //        function log(e) {
    //                console.log(e.target.value.replace(/,/g,', '));
    //                this.handleTag(e);
    //        }
  }

  handleTag = name => e => {
    this.setState({ [name]: e.target.value.replace(/,/g, ", ") });
  };

  handleText = name => e => {
    this.setState({ [name]: e.target.value });
  };

  doOnSubmit = e => {
    e.preventDefault();

    let url = localStorage.getItem("BACKEND_HOST")+"/FlAddInfo";
    let restMethod = "POST";
    let async = true;

    let data = {
      email: this.state.email,
      skills: this.state.skills,
      work: this.state.work,
      status: "Dashboard"
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
        let success = JSON.parse(xhttp.responseText).success;
        console.log(success);

        if (success) {
          let state = { email: this.state.email };
          this.handleRedirect("/FlDashboard", state);
        }
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
    const { country, location } = this.state;
    const { classes } = this.props;

    return (
      <Dashboard>
        <div>
          <input
            name="hashtags"
            type="tags"
            id="skills"
            value={this.state.skills}
            pattern="^#"
            placeholder="#hashtags"
          />

          <br />
          <br />

          <textarea
            className="work_textarea"
            value={this.state.work}
            onChange={this.handleText("work")}
            placeholder="work"
          />

          <br />
          <button onClick={this.doOnSubmit}> Save </button>
        </div>
      </Dashboard>
    );
  }
}
FlAddInfo.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FlAddInfo);
