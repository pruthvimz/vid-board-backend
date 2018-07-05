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
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import Message from "@material-ui/icons/Message";
import Work from "@material-ui/icons/Work";

const styles = {
  card: {
    maxWidth: 1000
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  }
};

class FlInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      interested: false,
      status: this.props.flProp.status
    };

    this.showInterest = this.showInterest.bind(this);
  }

  showInterest = (e, job_interest_id) => {
    e.preventDefault();

    let url = "http://localhost:8080/showJpInterest";
    let restMethod = "POST";
    let async = true;

    let data = {
      job_interest_id: job_interest_id,
      status: "Matched"
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
        let response = JSON.parse(xhttp.responseText);
        console.log(response);
        if (response.success) {
          this.setState({
            status: "Matched"
          });
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
    let flProp = this.props.flProp;
    let skillsArr = flProp.skills.split(",");

    let skills_chips = skillsArr.map((flElement, i) => {
      return <Chip key={i} label={flElement} className={classes.chip} />;
    });
    
    return (
      <div id="flInfoMainDiv" ref="job_post_card">
        <Card className={classes.card}>
          <CardContent>
            <List>
              <ListItem>
                <Avatar className={classes.avatar}>
                  <PhotoCamera />
                </Avatar>
                {skills_chips}
              </ListItem>
              <ListItem>
                <Avatar className={classes.avatar}>
                  <Work />
                </Avatar>
                <Typography component="p">
                  <textarea
                    className="work_textarea"
                    defaultValue={flProp.work}
                    disable="true"
                  />
                </Typography>
              </ListItem>
              <ListItem>
                <Avatar className={classes.avatar}>
                  <Message />
                </Avatar>
                <Typography component="p">{flProp.message}</Typography>
              </ListItem>
            </List>
          </CardContent>

          <CardActions>
            {true ? (
              <Button
                size="large"
                color="primary"
                disabled={this.state.status == "Matched" ? true : false}
                onClick={() => this.showInterest(event, this.props.flProp.id)}
              >
                {this.state.status == "Matched" ? "Matched" : "Interested"}
              </Button>
            ) : null}
          </CardActions>
        </Card>
      </div>
    );
  }
}

FlInfo.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FlInfo);
