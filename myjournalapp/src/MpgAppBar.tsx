////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import MpgTheme from "./MpgTheme";
import { withRouter, RouteComponentProps } from "react-router";
import MpgGraph, { ListSearchState, CurrentCategoryType } from "./MpgGraph";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IAppBarProps extends RouteComponentProps{
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  goToNewEntry: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  mpgGraph: MpgGraph
}
interface IAppBarState {
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG AppBar class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgAppBarBase extends React.Component<IAppBarProps, IAppBarState> {
  constructor(props: IAppBarProps) {
    super(props);
    this.state = {
    };
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public render = () => {
    let myJournal = 'My Journal'
    let title = myJournal
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <Icon
              onClick={this.props.toggleSidebarVisibility}
              style={{ margin: "5px" }}
            >
              menu
            </Icon>
            <Typography variant="h5" style={{
              color: MpgTheme.palette.primary.contrastText,
              fontWeight:'bold'}}>
              {title}
            </Typography>
            <div>
            <Icon onClick={this.goToSearch} style={{ margin: "5px" }}>
              search
            </Icon>
            <Icon onClick={this.props.goToNewEntry} style={{ margin: "5px" }}>
              add
            </Icon>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  };
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // go to search
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  goToSearch = async () => {
    await this.props.mpgGraph.setListSearchState(ListSearchState.Search);
    await this.props.mpgGraph.setCurrentItemType(CurrentCategoryType.Entry);
    this.props.history.push("/Search");
  };
  //////////////////////////////////////////////////////////////////////////////////////////////
  // component will receive props
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillReceiveProps(newProps: IAppBarProps) {
    // this.props.mpgLogger.debug("Home: componentWillReceiveProps: allCategories:",newProps.allCategories)
    this.setState({
    });
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgAppBar = withRouter(MpgAppBarBase);
export default MpgAppBar;
// export default MpgAppBar;
