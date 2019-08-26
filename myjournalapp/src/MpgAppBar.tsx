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
}
interface IAppBarState {
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG AppBar class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgAppBar extends React.Component<IAppBarProps, IAppBarState> {
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
              style={{ margin: "15px" }}
            >
              menu
            </Icon>
            <Typography variant="h6" color="inherit">
              {title}
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
    });
  }
}
export default MpgAppBar;
