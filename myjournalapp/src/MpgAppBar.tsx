////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Module MpgAppBar
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import MpgTheme from "./MpgTheme";
import { withRouter, RouteComponentProps } from "react-router";
import MpgGraph, { ListSearchState, CurrentCategoryType, MpgDisplayMode } from "./MpgGraph";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IAppBarProps extends RouteComponentProps{
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  goToNewEntry: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  mpgGraph: MpgGraph
  goToCurrentContext: Function
  isCurrentContextSet: Function
  // mpgLogger: MpgLogger
}
interface IAppBarState {
  recordingNow: boolean;
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG AppBar class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgAppBarBase extends React.Component<IAppBarProps, IAppBarState> {
  readonly appTitle = 'My Graph'
  constructor(props: IAppBarProps) {
    super(props);
    this.state = {
      recordingNow: false,
    };
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public render = () => {
    let contextIconColor = (this.props.isCurrentContextSet())
      ?  'white'
      :  MpgTheme.palette.primary.main
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
            <Icon
              onClick={this.props.toggleSidebarVisibility}
              style={{ margin: "5px" }}
            >
              menu
            </Icon>
            <Icon onClick={this.goToCurrentContext} style={{ margin: "5px",
            color: contextIconColor }}>
              donut_large
            </Icon>
            </div>
            <Typography variant="h5" style={{
              color: MpgTheme.palette.primary.contrastText,
              fontWeight:'bold'}}>
              {this.appTitle}
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
  // go to Current Context
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  goToCurrentContext = async ()=>{
    await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Update);
    const viewCategory = this.props.mpgGraph.getViewCategoryId()
    if(viewCategory !== undefined){
      await this.props.mpgGraph.setCurrentCategoryId(viewCategory);
      await this.props.mpgGraph.setCurrentItemId(this.props.mpgGraph.getCurrentContextId());
      await this.props.history.push("/ItemDetails");
    }else{
      // deal with this better
      console.log('MpgAppBar: view cartegory is undefined');
    }
  }
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