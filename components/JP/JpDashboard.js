import React from "react";
import ReactDOM from "react-dom";

import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import RenderJobPosts from "../../container/RenderJobPosts";
import JpProfile from "./JpProfile";
import Dashboard from "../../container/Dashboard";

class JpDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: localStorage.getItem("JobPosterEmail")
        ? localStorage.getItem("JobPosterEmail")
        : "",
      jobPostsData: []
    };
    this.renderLoadPostsRef = React.createRef();
    this.addJob = this.addJob.bind(this);
  }

  addJob = e => {
    e.preventDefault();
    this.handleRedirect("/JobPostingForm", {});
  };

  handleRedirect = (pathname, state) => {
    this.props.history.push({
      pathname: pathname,
      state: state
    });
  };

  componentDidMount() {
    let url = localStorage.getItem("BACKEND_HOST")+"/JpDashboard";
    let restMethod = "POST";
    let async = true;
    let whereQuery = { email: this.state.email };

    let xhttp = new XMLHttpRequest();
    xhttp.open(restMethod, url, async);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        let jobPostsData = JSON.parse(xhttp.responseText).message;
        console.log(jobPostsData);
        //              this.state.jobPostsData = jobPostsData;

        this.setState(
          {
            jobPostsData
          },
          () => {
            this.renderLoadPostsRef.current.reloadPosts();
          }
        );
      }
    }.bind(this);
    xhttp.send(JSON.stringify(whereQuery));
  }

  render() {
    return (
      <Dashboard>
        <Grid container spacing={24} id="jpDashboardMainGrid">
          <Grid item xs={4} id="jpProfileViewGrid">
            <JpProfile />
          </Grid>
          <Grid item xs={8} id="jpDashboardGrid">
            {/*<Button variant="contained" color="primary" onClick={this.addJob}>
                Add a job 
                <Icon > +</Icon>
            </Button>*/}

            <Typography variant="headline" component="h2">
              Here are your job post(s)..
            </Typography>
            <RenderJobPosts
              jobPostsProp={this.state.jobPostsData}
              postFor="JpDashboard"
              ref={this.renderLoadPostsRef}
            />
          </Grid>
        </Grid>
      </Dashboard>
    );
  }
}

export default JpDashboard;
