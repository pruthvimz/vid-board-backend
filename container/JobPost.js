import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";
import SnackbarContent from "@material-ui/core/SnackbarContent";

import JobPostDetail from "./JobPostDetail";

const styles = {
  card: {
    maxWidth: 1000
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  }
};

class JobPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      errorMessage: "",
      showCard: true
    };

    this.showInterest = this.showInterest.bind(this);
  }

  showInterest = (e, jp_email, job_post_id) => {
    e.preventDefault();

    if (this.state.message == "") {
      //have add some animation while remove
      this.setState({ errorMessage: "Please enter Message." });
      return false;
    }

    let url = localStorage.getItem("BACKEND_HOST")+"/showFlInterest";
    let restMethod = "POST";
    let async = true;

    let data = {
      fl_email: localStorage.getItem("FreelancerEmail")
        ? localStorage.getItem("FreelancerEmail")
        : "",
      jp_email: jp_email,
      job_post_id: job_post_id,
      message: this.state.message,
      status: "Applied"
    };
    this.setState({ showCard: false });

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
        console.log(jobPostsData);

        this.setState({
          jobPostsData
        });
        if (jobPostsData && jobPostsData.length > 0) {
          console.log("Going to render job posts");
        } else {
          console.log("In else");
        }
      }
    }.bind(this);
    xhttp.send(JSON.stringify(data));
  };

  handleText = name => e => {
    this.setState({ [name]: e.target.value });
  };

  render() {
    const { classes } = this.props;

    let postFor = this.props.postFor;
    let showCard = this.state.showCard;
    let errorMessage = this.state.errorMessage;

    return (
      <div
        id="jobPostMainDiv"
        ref="job_post_card"
      >
        {/* Job post dashboard for Freelancer job search */}
        {postFor == "FlDashboard" && showCard ? (
          <Card className={classes.card}>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <CardContent>
                  {errorMessage && errorMessage !== "" ? (
                    <SnackbarContent
                      className={classes.snackbar}
                      message={errorMessage}
                    />
                  ) : null}
                  <JobPostDetail jobProp={this.props.jobProp} />
                </CardContent>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <CardContent>
                  <TextField
                    id="multiline-static"
                    label="Message"
                    multiline
                    rows="4"
                    placeholder="Write about you youself"
                    className={classes.textField}
                    onChange={this.handleText("message").bind(this)}
                    margin="normal"
                  />
                </CardContent>
                <CardActions>
                  <Button
                    size="large"
                    color="primary"
                    onClick={() =>
                      this.showInterest(
                        event,
                        this.props.jobProp.email,
                        this.props.jobProp.id
                      )
                    }
                  >
                    Interested
                  </Button>
                </CardActions>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Card>
        ) : null}
        {postFor == "JpDashboard" ? (
          <Card className={classes.card}>
            {/* Job post dashboard for Job Poster */}
            <CardContent>
              <JobPostDetail jobProp={this.props.jobProp} />
            </CardContent>
          </Card>
        ) : null}

        {postFor == "FlInbox" ? (
          <Card className={classes.card}>
            {/* Job post dashboard for Job Poster */}
            <CardContent>
              <JobPostDetail jobProp={this.props.jobProp} />

              <List>
                <ListItem>
                  <ListItemText
                    primary="Message"
                    secondary={this.props.jobProp.message}
                  />
                </ListItem>
              </List>
              <Typography component="p" />
            </CardContent>
            <CardActions>
              <Button size="large" color="primary">
                {this.props.jobProp.status}
              </Button>
            </CardActions>
          </Card>
        ) : null}

        <Divider />
      </div>
    );
  }
}

JobPost.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(JobPost);
