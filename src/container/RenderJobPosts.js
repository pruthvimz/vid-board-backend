import React from "react";
import ReactDOM from "react-dom";

import JobPost from "./JobPost";

class RenderJobPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderJobs: []
    };
  }

  componentDidMount() {
    this.reloadPosts();
  }

  reloadPosts = () => {
    let renderJobs = this.props.jobPostsProp.map((jobElement, i) => {
      return (
        <JobPost
          key={i}
          uniqueId={i}
          ref={jobPostRef => (this.jobPostRef = jobPostRef)}
          jobProp={jobElement}
          postFor={this.props.postFor}
        />
      );
    });

    this.setState({
      renderJobs
    });
  };

  render() {
    return <div id="renderJobPostsDiv">{this.state.renderJobs}</div>;
  }
}

export default RenderJobPosts;
