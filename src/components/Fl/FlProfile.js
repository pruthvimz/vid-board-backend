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
import Chip from "@material-ui/core/Chip";

const styles = {
  card: {
    maxWidth: 300
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  }
};

class FlProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profileData: {}
    };

    this.fetchJpProfile = this.fetchJpProfile.bind(this);
  }

  componentDidMount() {
    this.fetchJpProfile();
  }

  fetchJpProfile = () => {
    //        e.preventDefault();

    let url = localStorage.getItem("BACKEND_HOST")+"/FlProfile";
    let restMethod = "POST";
    let async = true;

    let data = {
      email: localStorage.getItem("FreelancerEmail")
        ? localStorage.getItem("FreelancerEmail")
        : "yash.97373@gmail.com"
    };
    //        console.log("data => ");
    //        console.log(data);
    let xhttp = new XMLHttpRequest();
    xhttp.open(restMethod, url, async);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        let profileData = JSON.parse(xhttp.responseText).message;
        console.log(profileData);

        this.setState({
          profileData
        });
      }
    }.bind(this);
    xhttp.send(JSON.stringify(data));
  };

  render() {
    const { classes } = this.props;

    let fl = this.state.profileData;

    return (
      <div id="FlProfileDiv">
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="headline" component="h2">
              {fl.name}
            </Typography>
            <Typography component="p">{fl.email}</Typography>
            <Typography component="p">{fl.location}</Typography>
            <Typography component="p">{fl.travel}</Typography>
            <Typography component="p">{fl.video}</Typography>
            <Typography component="p">{fl.review}</Typography>
            <a target="_blank" href={fl.resume}>
              Resume
            </a>
          </CardContent>
          <CardActions>
            {/*<Button size="large" color="primary" 
            onClick={() => this.showInterest(event,this.props.jobProp.email,this.props.jobProp.id) }>
            Interested
          </Button>*/}
          </CardActions>
        </Card>
      </div>
    );
  }
}

FlProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FlProfile);
