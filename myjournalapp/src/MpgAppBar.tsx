////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IAppBarProps {
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  goToNewEntry: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  desktop: boolean;
}
interface IAppBarState {
  desktop: boolean;
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG AppBar class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgAppBar extends React.Component<IAppBarProps, IAppBarState> {
  constructor(props: IAppBarProps) {
    super(props);
    this.state = {
      desktop: props.desktop
    };
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public render = () => {
    let myJournal = 'My Journal'
    let viewMode = myJournal+" (Desktop)"
    if (!this.state.desktop) viewMode = myJournal+" (Mobile)"
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <Icon
              onClick={this.props.toggleSidebarVisibility}
              style={{ margin: "15px" }}
            >
              menu
            </Icon>
            <Typography variant="h6" color="inherit">
              {viewMode}
            </Typography>
            <Icon onClick={this.props.goToNewEntry} style={{ margin: "15px" }}>
              add
            </Icon>
          </Toolbar>
        </AppBar>
      </div>
    );
  };
  //////////////////////////////////////////////////////////////////////////////////////////////
  // component will receive props
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillReceiveProps(newProps: IAppBarProps) {
    // this.props.mpgLogger.debug("Home: componentWillReceiveProps: allCategories:",newProps.allCategories)
    this.setState({
        desktop: newProps.desktop,
    });
  }
}
export default MpgAppBar;
