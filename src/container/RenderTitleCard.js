import React from "react";
import ReactDOM from "react-dom";

import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import RenderFlInfo from "./RenderFlInfo";
import SnackbarContent from "@material-ui/core/SnackbarContent";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";

class RenderTitleCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderPostInterest: []
    };
  }

  componentDidMount() {
    this.reloadTitleCard();
  }

  reloadTitleCard = () => {
    let renderPostInterest = this.props.flInterestProp.map(
      (interestElement, x) => {
        return (
          <div key={x} id="titleCardDiv">
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="headline" component="h1">
                  {interestElement.title}
                  <Chip label={interestElement.interested_fl.length} />
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <RenderFlInfo flInfoProp={interestElement.interested_fl} />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <Divider />
          </div>
        );
      }
    );
    this.setState({
      renderPostInterest
    });
  };

  render() {
    return (
      <div className="fl-list" id="renderTitleCardDiv">
        {this.state.renderPostInterest.length > 0
          ? this.state.renderPostInterest
          : <SnackbarContent                   
                message="No record found"
            />}
      </div>
    );
  }
}

export default RenderTitleCard;
