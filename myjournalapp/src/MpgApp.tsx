////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgApp module
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import React from "react";
import MpgLanding from "./MpgLanding";
import { Route, Redirect, RouteComponentProps, withRouter } from "react-router";
import MpgSignup from "./MpgSignup";
import MpgItemDetails from "./MpgItemDetails";
import MpgSearch from "./MpgListSearch";
import MpgSignin from "./MpgSignin";
import MpgGraph, {
  MpgDisplayMode,
  ListSearchState,
  CurrentCategoryType
} from "./MpgGraph";
import MpgConfirmSignup from "./MpgConfirmSignup";
import MpgLogger, { MpgLoggingMode } from "./MpgLogger";
import { MpgError } from "./MpgError";
import { MpgUser } from "./MpgUser";
import MpgCategory from "./MpgCategory";
import MpgTheme from "./MpgTheme";
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
  DialogActions,
  MuiThemeProvider,
  SnackbarContent
} from "@material-ui/core";
import MpgItem from "./MpgItem";
import Home from "@material-ui/icons/Home";
import CancelPresentation from "@material-ui/icons/CancelPresentation";
import blue from "@material-ui/core/colors/blue";
import MpgHome from "./MpgHome";
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
  searchDialogOpen: boolean;
  listSearchState: ListSearchState;
  currentItemType: CurrentCategoryType;
  cardWidth: number
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg App class
// this is the main controller of the UI
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class MpgAppBase extends React.Component<IMpgAppProps, IMpgAppState> {
  // private desktopMinScreenWidth = 1000;
  private mpgGraph: MpgGraph;
  private mpgLogger: MpgLogger;
  private mpgUser: MpgUser;
  private allCategories: MpgCategory[] = [];
  // private deskTop = true;
  private filteredItems: MpgItem[] = [];
  private currentCategoryId: string = "";
  private currentItemId: string = ""; // item being displayed or edited
  private displayMode: MpgDisplayMode = MpgDisplayMode.Create;
  private allTags: MpgItem[] = [];
  private allEntries: MpgItem[] = [];
  readonly primaryColor = blue[800];
  // private windowWidth = window.innerWidth
  private version = "Beta 6 - released: 2 September 2019";
  private aboutMessage = "My Journal - version " + this.version;
  private allViews: MpgItem[] = [];
  readonly maxCardWidth = 500
  // private listSearchState = ListSearchState.List
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
    // let desktop = true;
    // window.innerWidth > this.desktopMinScreenWidth
    //   ? (desktop = true)
    //   : (desktop = false);
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
      searchDialogOpen: false,
      listSearchState: ListSearchState.List,
      currentItemType: CurrentCategoryType.View,
      cardWidth: window.innerWidth < this.maxCardWidth? window.innerWidth : this.maxCardWidth  
    };
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // reload data
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  reloadData = async () => {
    this.state.userSignedIn
      ? this.props.history.push("/home")
      : this.props.history.push("/landing");
    await this.mpgGraph.loadData();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render method
  ///////////////////////////////////////////////////////////////////////////////////////////////
  render() {
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
  renderNormalApp() {
    return (
      <MuiThemeProvider theme={MpgTheme}>
        <div
          style={{
            backgroundColor: MpgTheme.palette.background.default,
            minHeight: window.innerHeight
          }}
        >
          {this.renderMessage()}
          {this.renderDrawer()}
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
                filteredItems={this.filteredItems}
                currentItemId={this.currentItemId}
                currentCategoryId={this.currentCategoryId}
                createOrUpdateMode={this.displayMode}
                allTags={this.allTags}
                allEnteries={this.allEntries}
                goToNewEntry={this.goToNewEntry}
                displayMode={this.displayMode}
                primaryColor={this.primaryColor}
                cardWidth={this.state.cardWidth}
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
              allCategories={this.allCategories}
              displayMode={this.displayMode}
              allTags={this.allTags}
              allEnteries={this.allEntries}
              goToNewEntry={this.goToNewEntry}
              primaryColor={this.primaryColor}
              windowWidth={this.state.windowWidth}
            />
          )}
        /> */}
          <Route
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
                displayMode={this.displayMode}
                currentItemId={this.currentItemId}
                allTags={this.allTags}
                allEntries={this.allEntries}
                filteredItems={this.filteredItems}
                allCategories={this.allCategories}
                goToNewEntry={this.goToNewEntry}
                primaryColor={this.primaryColor}
                cardWidth={this.state.cardWidth}
              />
            )}
          />
          <Route
            path="/Search"
            render={props => (
              <MpgSearch
                {...props}
                toggleSidebarVisibility={this.toggleSidebarVisibility}
                showMessage={this.showMessage}
                userSignedIn={this.state.userSignedIn}
                mpgGraph={this.mpgGraph}
                mpgLogger={this.mpgLogger}
                allTags={this.allTags}
                allEntries={this.allEntries}
                goToNewEntry={this.goToNewEntry}
                cardWidth={this.state.cardWidth}
                allViews={this.allViews}
                listSearchState={this.state.listSearchState}
                currentItemType={this.state.currentItemType}
              />
            )}
          />
          <Route
            path="/Landing"
            render={props => (
              <MpgLanding
                {...props}
                toggleSidebarVisibility={this.toggleSidebarVisibility}
                goToNewEntry={this.goToNewEntry}
                mpgGraph={this.mpgGraph}
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
                mpgGraph={this.mpgGraph}
              />
            )}
          />
          <Route
            exact
            path="/"
            render={() =>
              this.state.userSignedIn ? (
                <Redirect to="/Home" />
              ) : (
                <Redirect to="/Landing" />
              )
            }
          />
        </div>
      </MuiThemeProvider>
    );
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // toggle list search state
  // switch to the use of set list search state
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  toggleListSearchState = () => {
    switch (this.state.listSearchState) {
      case ListSearchState.List:
        this.setState({ listSearchState: ListSearchState.Search });
        break;
      case ListSearchState.Search:
        this.setState({ listSearchState: ListSearchState.List });
        break;
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // saerch dialog
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderSearchDialog = () => {
    return (
      <div>
        <dialog
          open={this.state.searchDialogOpen}
          aria-labelledby="Search"
          style={{ backgroundColor: "grey" }}
        >
          <DialogTitle id="saerchDialog">Search</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter text for earch</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="searchText"
              label="Search text"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSearchDialogClose} color="primary">
              Search
            </Button>
            <Button onClick={this.handleSearchDialogClose} color="primary">
              close
            </Button>
          </DialogActions>
        </dialog>
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // handle saerch DialogClose
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleSearchDialogClose = () => {
    this.setState({ searchDialogOpen: false });
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // open search Dialog
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  openSearchDialog = () => {
    this.setState({ searchDialogOpen: true });
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
      >
        <SnackbarContent
          style={{
            backgroundColor: MpgTheme.palette.primary.contrastText,
            color: MpgTheme.palette.primary.dark
          }}
          message={<span id="message-id">{this.state.message}</span>}
          action={[
            <Button
              key="undo"
              color="inherit"
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
            ></IconButton>
          ]}
        />
      </Snackbar>
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
    await this.mpgGraph.setCurrentItemType(CurrentCategoryType.View);
    await this.mpgGraph.setListSearchState(ListSearchState.List);
    this.props.history.push("/Search");
    // const viewCategoryId = this.mpgGraph.getViewCategoryId();
    // if (viewCategoryId !== undefined) {
    //   // await this.mpgGraph.setCurrentCategoryId(viewCategoryId);
    //   await this.setState({
    //     listSearchState: ListSearchState.List,
    //     currentItemType: CurrentCategoryType.View
    //   });
    //   this.props.history.push("/Search");
    // } else {
    //   this.handleFatalAppError(
    //     "Unexpected error",
    //     new MpgError(`MpgApp: goToViews: viewsCategoryId is undefined`)
    //   );
    // }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // go to search
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  goToSearch = async () => {
    await this.mpgGraph.setListSearchState(ListSearchState.Search);
    await this.mpgGraph.setCurrentItemType(CurrentCategoryType.Entry);
    this.props.history.push("/Search");
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
          <ListItem button onClick={this.goToNewView}>
            <ListItemIcon>
              <Icon>add</Icon>
            </ListItemIcon>
            <ListItemText primary="New view" />
          </ListItem>
          <ListItem button onClick={this.goToNewTag}>
            <ListItemIcon>
              <Icon>add</Icon>
            </ListItemIcon>
            <ListItemText primary="New tag" />
          </ListItem>
          <Divider />
          <ListItem button onClick={this.goToSearch}>
            <ListItemIcon>
              <Icon>search</Icon>
            </ListItemIcon>
            <ListItemText primary="Search" />
          </ListItem>
          <Divider />
          <ListItem button onClick={this.showAboutMessage}>
            <ListItemIcon>
              <Icon>info</Icon>
            </ListItemIcon>
            <ListItemText primary="About My Journal" />
          </ListItem>
          <Divider />
          <ListItem button onClick={this.reloadData}>
            <ListItemIcon>
              <Icon>autorenew</Icon>
            </ListItemIcon>
            <ListItemText primary="Reload data from cloud" />
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
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // show about message
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  showAboutMessage = () => {
    this.showMessage(this.aboutMessage, 6000);
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
    if (this.state.userSignedIn) {
      const entryCategoryId = this.mpgGraph.getEntryCategoryId();
      if (entryCategoryId !== undefined) {
        await this.mpgGraph.setCurrentCategoryId(entryCategoryId);
        await this.mpgGraph.setDisplayMode(MpgDisplayMode.Create);
        await this.props.history.push("/ItemDetails");
      } else {
        this.mpgLogger.unexpectedError(
          `MpgApp: goToEntry: entry category id is undefeined`
        );
      }
    } else {
      this.showMessage("Please signin first");
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // go to new view
  ///////////////////////////////////////////////////////////////////////////////////////////////
  goToNewView = async () => {
    if (this.state.userSignedIn) {
      const viewCategoryId = this.mpgGraph.getViewCategoryId();
      if (viewCategoryId !== undefined) {
        await this.mpgGraph.setCurrentCategoryId(viewCategoryId);
        await this.mpgGraph.setDisplayMode(MpgDisplayMode.Create);
        await this.props.history.push("/ItemDetails");
      } else {
        this.mpgLogger.unexpectedError(
          `MpgApp: goToEntry: view category id is undefeined`
        );
      }
    } else {
      this.showMessage("Please signin first");
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // go to new tag
  ///////////////////////////////////////////////////////////////////////////////////////////////
  goToNewTag = async () => {
    if (this.state.userSignedIn) {
      const tagCategoryId = this.mpgGraph.getTagCategoryId();
      if (tagCategoryId !== undefined) {
        await this.mpgGraph.setCurrentCategoryId(tagCategoryId);
        await this.mpgGraph.setDisplayMode(MpgDisplayMode.Create);
        await this.props.history.push("/ItemDetails");
      } else {
        this.mpgLogger.unexpectedError(
          `MpgApp: goToEntry: view category id is undefeined`
        );
      }
    } else {
      this.showMessage("Please signin first");
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // go to Tags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  goToTags = async () => {
    await this.mpgGraph.setCurrentItemType(CurrentCategoryType.Tag);
    await this.mpgGraph.setListSearchState(ListSearchState.List);
    this.props.history.push("/Search");
    // const tagCategoryId = this.mpgGraph.getTagCategoryId();
    // if (tagCategoryId !== undefined) {
    //   await this.mpgGraph.setCurrentCategoryId(tagCategoryId);
    //   await this.setState({
    //     listSearchState: ListSearchState.List,
    //     currentItemType: CurrentCategoryType.Tag
    //   });
    //   this.props.history.push("/Search");
    //   // await this.mpgGraph.setCurrentCategoryId(tagCategoryId);
    // } else {
    //   this.handleFatalAppError(
    //     "Unexpected error",
    //     new MpgError(`MpgApp: goToTags: tagCategoryId is undefined`)
    //   );
    // }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // go to Entries
  ///////////////////////////////////////////////////////////////////////////////////////////////
  goToEntries = async () => {
    await this.mpgGraph.setCurrentItemType(CurrentCategoryType.Entry);
    await this.mpgGraph.setListSearchState(ListSearchState.List);
    this.props.history.push("/Search");
    // const entryCategoryId = this.mpgGraph.getEntryCategoryId();
    // if (entryCategoryId !== undefined) {
    //   // await this.mpgGraph.setCurrentCategoryId(entryCategoryId);
    //   await this.setState({
    //     listSearchState: ListSearchState.List,
    //     currentItemType: CurrentCategoryType.Entry
    //   });
    //   this.props.history.push("/Search");
    // } else {
    //   this.handleFatalAppError(
    //     "Unexpected error",
    //     new MpgError(`MpgApp: goActions: entryCategoryId is undefined`)
    //   );
    // }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // go home
  ///////////////////////////////////////////////////////////////////////////////////////////////
  goHome = () => {
    this.state.userSignedIn
      ? this.props.history.push("/Home")
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
    allTags: MpgItem[],
    allEntries: MpgItem[],
    allViews: MpgItem[],
    currentItemType: CurrentCategoryType,
    listSearchState: ListSearchState
  ) => {
    // console.log('MpgApp: dataRefreshed: currentItemType: ',currentItemType);
    this.allCategories = allCategories;
    this.filteredItems = filteredAllItems;
    this.currentCategoryId = currentCategoryId;
    this.currentItemId = currentItemId;
    this.displayMode = displayMode;
    this.allTags = allTags;
    this.allEntries = allEntries;
    this.allViews = allViews;
    // set state for variables that affect rendering of this component
    await this.setState({
      appError: error,
      appErrorState: unexpectedError,
      currentItemType: currentItemType,
      listSearchState: listSearchState
    });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // utility methods
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // component did catch
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  componentDidCatch = (err: Error, info: any) => {
    const error = new MpgError(err.message + "\n" + info);
    this.setState({ appError: error, appErrorState: true });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // show message
  ///////////////////////////////////////////////////////////////////////////////////////////////
  showMessage = (message: string, messageWaitTime: number = 6000) => {
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
    this.setState({cardWidth: window.innerWidth < this.maxCardWidth? window.innerWidth: this.maxCardWidth })
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
