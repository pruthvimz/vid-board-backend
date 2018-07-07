import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";

import JpProfile from "./JpProfile";
import RenderTitleCard from "../../container/RenderTitleCard";
import RenderFlInfo from "../../container/RenderFlInfo";
import Dashboard from "../../container/Dashboard";

class JpInbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: localStorage.getItem("JobPosterEmail")
        ? localStorage.getItem("JobPosterEmail")
        : "",
      flData: []
    };
    this.renderTitleCardRef = React.createRef();
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
    let url = localStorage.getItem("BACKEND_HOST")+"/JpInbox";
    let restMethod = "POST";
    let async = true;
    let whereQuery = {
      email: this.state.email
    };

    let xhttp = new XMLHttpRequest();
    xhttp.open(restMethod, url, async);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        let flData = JSON.parse(xhttp.responseText).message;
        console.log(flData);
        //              this.state.flData = flData;

        this.setState(
          {
            flData
          },
          () => {
            this.renderTitleCardRef.current.reloadTitleCard();
          }
        );

        //              ReactDOM.render(<RenderTitleCard flInterestProp = {this.state.flData} />,document.getElementById('flInfoDiv'));
      }
    }.bind(this);
    xhttp.send(JSON.stringify(whereQuery));
  }

  render() {
    return (
      <Dashboard>
        <Grid container spacing={24} id="jpInboxMainGrid">
          <Grid item xs={4} id="jpProfileViewGrid">
            <JpProfile />
          </Grid>
          <Grid item xs={8} id="jpInboxGrid">
            <RenderTitleCard
              flInterestProp={this.state.flData}
              ref={this.renderTitleCardRef}
            />
          </Grid>
        </Grid>
      </Dashboard>
    );
  }
}

export default JpInbox;
