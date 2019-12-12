///////////////////////////////////////////////////////////////////////////////////////////////
// MPG item summary component
// displays a summary of an item
// name (removes text after linefeed) and prioririty
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import {
  Typography,
} from "@material-ui/core";
import MpgLogger from "./MpgLogger";
import MpgItem from "./MpgItem";
import MpgTheme from "./MpgTheme";
import MpgGraph from "./MpgGraph";
import { withRouter, RouteComponentProps } from "react-router-dom";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IItemSummaryCompProps extends RouteComponentProps {
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  mpgGraph: MpgGraph;
  mpgLogger: MpgLogger;
  item: MpgItem;
}
interface IItemSummaryCompState {
  item: MpgItem;
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Item summary component class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgItemSummaryCompBase extends React.Component<
  IItemSummaryCompProps,
  IItemSummaryCompState
> {
  constructor(props: IItemSummaryCompProps) {
    super(props);
    this.state = {
      item: props.item,
    }
    }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render entry list
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  render = () => {
    return (
        <div style={{ textAlign: "left", padding: 10 }}>
        <Typography
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: MpgTheme.palette.primary.dark
          }}
          align="left"
        >
          {this.state.item.getName()}
        </Typography>
        <Typography
          style={{ fontSize: "10px", color: MpgTheme.palette.primary.main }}
          align="left"
        >
          Priority: {this.state.item.getNetPriority()} ({this.state.item.getPriority()})
        </Typography>
      </div>
    );
  };
  //////////////////////////////////////////////////////////////////////////////////////////////
  // component will receive props
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillReceiveProps(newProps: IItemSummaryCompProps) {
    this.setState({
        item: newProps.item
    });
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgItemSummaryComp = withRouter(MpgItemSummaryCompBase);
export default MpgItemSummaryComp;