////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgApp module
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import React from "react";
import MpgLanding from "./MpgLanding";
import { Route, Redirect, RouteComponentProps, withRouter } from "react-router";
import MpgSignup from "./MpgSignup";
import MpgHome from "./MpgHome";
import MpgSignin from "./MpgSignin";
import MpgGraph, { MpgDisplayMode } from "./MpgGraph";
import MpgConfirmSignup from "./MpgConfirmSignup";
import MpgLogger, { MpgLoggingMode } from "./MpgLogger";
import { MpgError } from "./MpgError";
import { MpgUser } from "./MpgUser";
import MpgCategory from "./MpgCategory";
import {
  Paper,
  Typography,
  Snackbar,
  Button,
  IconButton,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Icon,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions
} from "@material-ui/core";
import MpgItem from "./MpgItem";
import Home from "@material-ui/icons/Home";
import CancelPresentation from "@material-ui/icons/CancelPresentation";
import { flexbox } from "@material-ui/system";
///////////////////////////////////////////////////////////////////////////////////////////////
// define props and state
///////////////////////////////////////////////////////////////////////////////////////////////
interface IMpgAppProps extends RouteComponentProps {}
interface IMpgAppState {
  userSignedIn: boolean;
  userName: string;
  appErrorState: boolean;
  appErrorMsg: string;
  appError: MpgError;
  messageVisible: boolean;
  message: string;
  messageWaitTime: number;
  sidebarVisible: boolean;
  desktop: boolean;
  testDialogOpen: boolean;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg App class
// this is the main controller of the UI
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class MpgAppBase extends React.Component<IMpgAppProps, IMpgAppState> {
  private desktopMinScreenWidth = 1000;
  private mpgGraph: MpgGraph;
  private mpgLogger: MpgLogger;
  private mpgUser: MpgUser;
  private allCategories: MpgCategory[] = [];
  // private deskTop = true;
  private filteredItems: MpgItem[] = [];
  private currentCategoryId: string = "";
  private currentItemId: string = ""; // item being displayed or edited
  private displayMode: MpgDisplayMode = MpgDisplayMode.List;
  private allTags: MpgItem[] = [];
  private allEnteries: MpgItem[] = [];
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // constructor
  ///////////////////////////////////////////////////////////////////////////////////////////////
  constructor(props: IMpgAppProps) {
    super(props);
    this.mpgLogger = new MpgLogger(this.handleFatalAppError);
    this.mpgLogger.setLoggingMode(MpgLoggingMode.debug);
    this.mpgGraph = new MpgGraph(
      this.mpgLogger,
      this.showMessage,
      this.dataRefreshed
    );
    this.mpgUser = this.mpgGraph.getMpguser(); // should we keep user here or get it when we want it from graph
    let desktop = true;
    window.innerWidth > this.desktopMinScreenWidth
      ? (desktop = true)
      : (desktop = false);
    this.state = {
      userSignedIn: false,
      userName: "New user",
      appErrorState: false,
      appErrorMsg: "No error",
      appError: new MpgError(""),
      messageVisible: false,
      message: " ",
      messageWaitTime: 6000,
      sidebarVisible: false,
      desktop: desktop,
      testDialogOpen: false
    };
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render method
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public render() {
    return (
      <div>
        {this.state.appErrorState
          ? this.renderErrorPage()
          : this.renderNormalApp()}
      </div>
    );
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // render normal app
  /////////////////////////////////////////////////////////////////////////////////////////////////
  public renderNormalApp() {
    return (
      <div>
        {this.renderMessage()}
        {this.renderDrawer()}
        {this.renderTestDialog()}
        <Route
          path="/Home"
          render={props => (
            <MpgHome
              {...props}
              toggleSidebarVisibility={this.toggleSidebarVisibility}
              showMessage={this.showMessage}
              userSignedIn={this.state.userSignedIn}
              mpgGraph={this.mpgGraph}
              mpgLogger={this.mpgLogger}
              allCategories={this.allCategories}
              desktop={this.state.desktop}
              filteredItems={this.filteredItems}
              currentItemId={this.currentItemId}
              currentCategoryId={this.currentCategoryId}
              createOrUpdateMode={this.displayMode}
              allTags={this.allTags}
              allEnteries={this.allEnteries}
              goToNewEntry={this.goToNewEntry}
              displayMode={this.displayMode}
            />
          )}
        />
        {/* <Route
          path="/ItemList"
          render={props => (
            <MpgItemList
              {...props}
              toggleSidebarVisibility={this.toggleSidebarVisibility}
              showMessage={this.showMessage}
              userSignedIn={this.state.userSignedIn}
              currentCategoryId={this.currentCategoryId}
              mpgGraph={this.mpgGraph}
              mpgLogger={this.mpgLogger}
              filteredItems={this.filteredItems}
              currentItemId={this.currentItemId}
              desktop={this.state.desktop}
              allCategories={this.allCategories}
              ViewCreateUpdateMode={this.createOrUpdateMode}
              allTags={this.allTags}
              allEnteries={this.allEnteries}
              goToNewEntry={this.goToNewEntry}
            />
          )}
        /> */}
        {/* <Route
          path="/ItemDetails"
          render={props => (
            <MpgItemDetails
              {...props}
              toggleSidebarVisibility={this.toggleSidebarVisibility}
              showMessage={this.showMessage}
              userSignedIn={this.state.userSignedIn}
              currentCategoryId={this.currentCategoryId}
              mpgGraph={this.mpgGraph}
              mpgLogger={this.mpgLogger}
              createOrUpdateMode={this.createOrUpdateMode}
              currentItemId={this.currentItemId}
              allTags={this.allTags}
              allEnteries={this.allEnteries}
              desktop={this.state.desktop}
              filteredItems={this.filteredItems}
              allCategories={this.allCategories}
              goToNewEntry={this.goToNewEntry}
            />
          )}
        /> */}
        <Route
          path="/Landing"
          render={props => (
            <MpgLanding
              {...props}
              toggleSidebarVisibility={this.toggleSidebarVisibility}
              goToNewEntry={this.goToNewEntry}
              desktop={this.state.desktop}
            />
          )}
        />
        <Route
          path="/Signup"
          render={props => (
            <MpgSignup
              {...props}
              toggleSidebarVisibility={this.toggleSidebarVisibility}
              mpgGraph={this.mpgGraph}
              goToNewEntry={this.goToNewEntry}
              desktop={this.state.desktop}
            />
          )}
        />
        <Route
          path="/ConfirmSignup"
          render={props => (
            <MpgConfirmSignup
              {...props}
              toggleSidebarVisibility={this.toggleSidebarVisibility}
              mpgGraph={this.mpgGraph}
              goToNewEntry={this.goToNewEntry}
              desktop={this.state.desktop}
            />
          )}
        />
        <Route
          path="/Signin"
          render={props => (
            <MpgSignin
              {...props}
              toggleSidebarVisibility={this.toggleSidebarVisibility}
              showMessage={this.showMessage}
              setUserState={this.setUserState}
              mpgUser={this.mpgUser}
              goToNewEntry={this.goToNewEntry}
              desktop={this.state.desktop}
            />
          )}
        />
        <Route
          exact
          path="/"
          render={() =>
            this.state.userSignedIn ? (
              <Redirect to="/Landing" />
            ) : (
              <Redirect to="/Landing" />
            )
          }
        />
      </div>
    );
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // test dialog
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderTestDialog = () => {
    return (
      <div>
        <dialog
          open={this.state.testDialogOpen}
          aria-labelledby="testDialog"
          style={{ backgroundColor: "grey" }}
        >
          <DialogTitle id="testDialog">Test Dialog</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleTestDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleTestDialogClose} color="primary">
              Subscribe
            </Button>
          </DialogActions>
        </dialog>
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // handleTestDialogClose
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleTestDialogClose = () => {
    this.setState({ testDialogOpen: false });
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // openTestDialog
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  openTestDialog = () => {
    this.setState({ testDialogOpen: true });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // message
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderMessage() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={this.state.messageVisible}
        autoHideDuration={this.state.messageWaitTime}
        onClose={this.handleCloseMessage}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">{this.state.message}</span>}
        action={[
          <Button
            key="undo"
            color="secondary"
            size="small"
            onClick={this.handleCloseMessage}
          >
            Close
          </Button>,
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleCloseMessage}
          >
            {/* <CloseIcon /> */}
          </IconButton>
        ]}
      />
    );
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // renderDrawer
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderDrawer = () => {
    return (
      <SwipeableDrawer
        open={this.state.sidebarVisible}
        onClose={this.toggleDrawer("left", false)}
        onOpen={this.toggleDrawer("left", true)}
      >
        <div
          tabIndex={0}
          role="button"
          onClick={this.toggleDrawer("left", false)}
          onKeyDown={this.toggleDrawer("left", false)}
        >
          {this.renderMenuItems()}
        </div>
      </SwipeableDrawer>
    );
  };
  //////////////////////////////////////////////////////////////////////////////////////////////
  // event handlers
  ///////////////////////////////////////////////////////////////////////////////////////////////
  toggleDrawer = (side: any, open: boolean) => () => {
    if (side === "") {
      side = "";
    }
    this.setState({
      sidebarVisible: open
    });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // go to Views
  ///////////////////////////////////////////////////////////////////////////////////////////////
  goToViews = async () => {
    this.mpgGraph.setDisplayMode(MpgDisplayMode.List);
    const viewCategoryId = this.mpgGraph.getViewCategoryId();
    if (viewCategoryId !== undefined) {
      await this.mpgGraph.setCurrentCategoryId(viewCategoryId);
      if (!this.state.desktop) {
        this.props.history.push("/Home");
      }
    } else {
      this.handleFatalAppError(
        "Unexpected error",
        new MpgError(`MpgApp: goToViews: viewsCategoryId is undefined`)
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render menu items
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderMenuItems = () => {
    return (
      <div>
        <List style={{ width: "300px" }}>
          <ListItem button onClick={this.goHome}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <Divider />
          <ListItem button onClick={this.goToViews}>
            <ListItemIcon>
              <Icon>view_headline</Icon>
            </ListItemIcon>
            <ListItemText primary="Views" />
          </ListItem>
          <ListItem button onClick={this.goToEntries}>
            <ListItemIcon>
              <Icon>view_headline</Icon>
            </ListItemIcon>
            <ListItemText primary="Entries" />
          </ListItem>
          <ListItem button onClick={this.goToTags}>
            <ListItemIcon>
              <Icon>view_headline</Icon>
            </ListItemIcon>
            <ListItemText primary="Tags" />
          </ListItem>
          <Divider />
          <ListItem button onClick={this.goToNewEntry}>
            <ListItemIcon>
              <Icon>add</Icon>
            </ListItemIcon>
            <ListItemText primary="New entry" />
          </ListItem>
          <Divider />
          <ListItem button onClick={this.handleSignout}>
            <ListItemIcon>
              <CancelPresentation />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </ListItem>
        </List>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle Signout
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSignout = async () => {
    try {
      let result = await this.mpgUser.signout();
      if (result.success) {
        this.props.history.push("/Signin");
        this.showMessage("You are signed out");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      this.showMessage("Unable to signout. Reason: " + error);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // go to new entry
  ///////////////////////////////////////////////////////////////////////////////////////////////
  goToNewEntry = async () => {
    this.showMessage("New entry ...");
    const entryCategoryId = this.mpgGraph.getEntryCategoryId();
    if (entryCategoryId !== undefined) {
      await this.mpgGraph.setCurrentCategoryId(entryCategoryId);
      await this.mpgGraph.setDisplayMode(MpgDisplayMode.Create);
      // if (!this.state.desktop) {
      //   await this.props.history.push("/Home");
      // }
    } else {
      this.mpgLogger.unexpectedError(
        `MpgApp: goToEntry: entry category id is undefeined`
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // go to Tags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  goToTags = async () => {
    await this.mpgGraph.setDisplayMode(MpgDisplayMode.List);
    const tagCategoryId = this.mpgGraph.getTagCategoryId();
    if (tagCategoryId !== undefined) {
      await this.mpgGraph.setCurrentCategoryId(tagCategoryId);
      if (!this.state.desktop) {
        this.props.history.push("/Home");
      }
      await this.mpgGraph.setCurrentCategoryId(tagCategoryId);
    } else {
      this.handleFatalAppError(
        "Unexpected error",
        new MpgError(`MpgApp: goToTags: tagCategoryId is undefined`)
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // go to Entries
  ///////////////////////////////////////////////////////////////////////////////////////////////
  goToEntries = async () => {
    await this.mpgGraph.setDisplayMode(MpgDisplayMode.List);
    const actionCategoryId = this.mpgGraph.getEntryCategoryId();
    if (actionCategoryId !== undefined) {
      await this.mpgGraph.setCurrentCategoryId(actionCategoryId);
      if (!this.state.desktop) {
        this.props.history.push("/Home");
      }
      await this.mpgGraph.setCurrentCategoryId(actionCategoryId);
    } else {
      this.handleFatalAppError(
        "Unexpected error",
        new MpgError(`MpgApp: goActions: actionCategoryId is undefined`)
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // go home
  ///////////////////////////////////////////////////////////////////////////////////////////////
  goHome = () => {
    this.state.userSignedIn
      ? this.props.history.push("/home")
      : this.props.history.push("/landing");
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render error page
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderErrorPage = () => {
    return (
      <div>
        <Paper elevation={9} style={{ padding: "10px", margin: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "10px",
              flexDirection: "column"
            }}
          >
            <Typography variant="h6" style={{ textAlign: "center" }}>
              Someting went wrong
            </Typography>
            <div style={{ height: "50px" }} />
            <Typography variant="body1">
              Error:
              {this.state.appErrorMsg}
              <br />
              {this.state.appError.message}
            </Typography>
            <div style={{ height: "10px" }} />
          </div>
        </Paper>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // setUserState
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setUserState = async (userSignedIn: boolean, userName: string) => {
    try {
      await this.setState({ userSignedIn: userSignedIn, userName: userName });
      await this.mpgGraph.init(this.state.userName);
      // await this.mpgGraph.checkUserTableAndCreate(this.state.userName)
      if (this.mpgGraph.doesUserDataTableExists()) {
        // this.mpgLogger.debug('MpgApp: setUserState: user table exists')
        // we now check user table anmd loda data in init()
        // await this.mpgGraph.loadData()
      } else {
        // this.mpgLogger.debug('MpgApp: setUserState: user table does not exist')
        throw new MpgError(
          "MpgApp: user data table does not exist and cannot be created"
        );
      }
    } catch (err) {
      // this.mpgLogger.debug('MpgApp: setUserState:err:',err)
      this.mpgLogger.unexpectedError(
        "Error accessing remote data table.\n",
        err
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle close message
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleCloseMessage = () => {
    this.setState({ messageVisible: false });
  };
  //////////////////////////////////////////////////////////////////////////////////////////////
  // Handle app error
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleFatalAppError = (msg: string, err: MpgError) => {
    this.setState({
      appErrorState: true,
      appError: err,
      appErrorMsg: "\n" + msg
    });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // data has been refereshed
  // update state
  ///////////////////////////////////////////////////////////////////////////////////////////////
  dataRefreshed = async (
    error: MpgError,
    unexpectedError: boolean,
    allCategories: MpgCategory[],
    filteredAllItems: MpgItem[],
    currentCategoryId: string,
    currentItemId: string,
    displayMode: MpgDisplayMode,
    allTags: MpgItem[]
  ) => {
    // this.mpgLogger.debug(
    //   "MpgApp: dataRefreshed: allCatagories:",
    //   this.allCategories
    // );
    this.allCategories = allCategories;
    this.filteredItems = filteredAllItems;
    this.currentCategoryId = currentCategoryId;
    this.currentItemId = currentItemId;
    this.displayMode = displayMode;
    this.allTags = allTags;
    // set state for variables that affect rendering of this component
    await this.setState({
      appError: error,
      appErrorState: unexpectedError
    });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // utility methods
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // show message
  ///////////////////////////////////////////////////////////////////////////////////////////////
  showMessage = (message: string, messageWaitTime: number = 3000) => {
    this.setState({
      messageVisible: true,
      message: message,
      messageWaitTime: messageWaitTime
    });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // toggle sidebar visibility
  ///////////////////////////////////////////////////////////////////////////////////////////////
  toggleSidebarVisibility = () => {
    this.state.sidebarVisible
      ? this.setState({ sidebarVisible: false })
      : this.setState({ sidebarVisible: true });
    // console.log("Toggling sidebar visiblity. sidebarVisible:", this.state.sidebarVisible);
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // component will mount
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  componentWillMount = () => {
    this.updateSize();
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // update desktop setting
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  updateSize = () => {
    window.innerWidth > this.desktopMinScreenWidth
      ? this.setState({ desktop: true })
      : this.setState({ desktop: false });
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // component did mount
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  componentDidMount = () => {
    window.addEventListener("resize", this.updateSize);
    // window.addEventListener("keyup", e => this.handleKeyPressed(e));
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // component will unmount
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateSize);
    // window.removeEventListener("keypressed", e => this.handleKeyPressed(e));
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // handle keyup
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleKeyPressed = (event: any) => {
    // console.log('key up: event',event);
    // if (event.key === "i") {
    //   this.goToNewEntry();
    // }
    // if (event.key === "t") {
    //   this.openTestDialog();
    // }
  };
}
///////////////////////////////////////////////////////////////////////////////////////////////
// export
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgApp = withRouter(MpgAppBase);
// const MpgApp = withTheme()(MpgAppWithRouter)
export default MpgApp;
