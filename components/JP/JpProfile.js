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

class JpProfile extends React.Component {
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

    let url = localStorage.getItem("BACKEND_HOST")+"/JpProfile";
    let restMethod = "POST";
    let async = true;

    let data = {
      email: localStorage.getItem("JobPosterEmail")
        ? localStorage.getItem("JobPosterEmail")
        : ""
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

    let jp = this.state.profileData;

    return (
      <div id="jpProfileMainDiv">
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="headline" component="h2">
              {jp.name}
            </Typography>
            {!jp.individual ? (
              <Typography component="p">{jp.company}</Typography>
            ) : null}
            <Typography component="p">{jp.email}</Typography>
            <Typography component="p">Looking for&nbsp;</Typography>
            <Chip label={jp.looking_for} />
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

JpProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(JpProfile);
