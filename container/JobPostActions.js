import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 1000,
    backgroundColor: theme.palette.background.paper
  }
});

class JobPostAction extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="jobPostActionDiv">
        {this.props.postFor == "FlDashboard" ? (
          <Button size="large" color="primary" onClick={this.props.postHandler}>
            Interested
          </Button>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(JobPostAction);
