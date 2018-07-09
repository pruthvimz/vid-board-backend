import React from "react";
import ReactDOM from "react-dom";

import Typography from "@material-ui/core/Typography";
import FlInfo from "./FlInfo";

class RenderFlInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderFlInfo: []
    };
  }

  componentDidMount() {
    let renderFlInfo = this.props.flInfoProp.map((flElement, i) => {
      return (
        <FlInfo
          key={i}
          uniqueId={i}
          ref={flInfoRef => (this.flInfoRef = flInfoRef)}
          flProp={flElement}
        />
      );
    });

    this.setState({
      renderFlInfo
    });
  }

  render() {
    return <div id="renderInfoDiv">{this.state.renderFlInfo}</div>;
  }
}

export default RenderFlInfo;
