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
  MpgDisplayMode as MpgCreateUpdateMode,
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
import { MpgCategoryType } from "./MpgInitialCategories"; 
import MpgSettings from "./MpgSettings";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// app location interface
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export enum AppPage {
  Home = "Home",
  List = "List",
  Details = "Details"
}
export interface AppLocation {
  page: AppPage;
  listSearchState?: ListSearchState;
  listSearchCategory?: MpgCategoryType;
  searchText?: string;
  searchTags?: MpgItem[];
  itemId?: string;
}
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
  newItemType: CurrentCategoryType;
  cardWidth: number;
  currentItem: MpgItem | undefined;
  createUpdateMode: MpgCreateUpdateMode;
  listSearchCategoryType: MpgCategoryType;
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
  private displayMode: MpgCreateUpdateMode = MpgCreateUpdateMode.Create;
  private allTags: MpgItem[] = [];
  private allEntries: MpgItem[] = [];
  readonly primaryColor = blue[800];
  private version = "Alpha 4 - released: 14 November 2019";
  private aboutMessage = "My Journal - version " + this.version;
  private allViews: MpgItem[] = [];
  readonly maxCardWidth = 500;
  private pageHistory: AppLocation[] = [];
  private searchText: string = "";
  private searchTags: MpgItem[] = [];
  private currentContext: MpgItem | undefined
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
      newItemType: CurrentCategoryType.View,
      cardWidth:
        window.innerWidth < this.maxCardWidth
          ? window.innerWidth
          : this.maxCardWidth,
      currentItem: undefined,
      createUpdateMode: MpgCreateUpdateMode.Create,
      listSearchCategoryType: MpgCategoryType.View,
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
                cardWidth={this.state.cardWidth}
                addPage2Histor={this.addPage2History}
                goBack={this.goBack}
                goToList={this.goToList}
                goToCurrentContext={this.goToCurrentContext}
                isCurrentContextSet={this.isCurrentContextSet}
              />
            )}
          />
            <Route
            path="/UserPref"
            render={props => (
              <MpgSettings
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
                cardWidth={this.state.cardWidth}
                addPage2Histor={this.addPage2History}
                goBack={this.goBack}
                goToList={this.goToList}
                goToCurrentContext={this.goToCurrentContext}
                isCurrentContextSet={this.isCurrentContextSet}
                allViews={this.allViews}
                currentContext={this.currentContext}
              />
            )}
          />
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
                cardWidth={this.state.cardWidth}
                addPage2Histor={this.addPage2History}
                goBack={this.goBack}
                goToCurrentContext={this.goToCurrentContext}
                isCurrentContextSet={this.isCurrentContextSet}
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
                addPage2Histor={this.addPage2History}
                goBack={this.goBack}
                searchText={this.searchText}
                searchTags={this.searchTags}
                listSearchCategoryType={this.state.listSearchCategoryType}
                createNewItem={this.createNewItem}
                updateItem={this.updateItem}
                setListSearchCategoryType={this.setListSearchCategoryType}
                goToCurrentContext={this.goToCurrentContext}
                isCurrentContextSet={this.isCurrentContextSet}
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
                goToCurrentContext={this.goToCurrentContext}
                isCurrentContextSet={this.isCurrentContextSet}
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
                goToCurrentContext={this.goToCurrentContext}
                isCurrentContextSet={this.isCurrentContextSet}
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
                goToCurrentContext={this.goToCurrentContext}
                isCurrentContextSet={this.isCurrentContextSet}
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
                goToCurrentContext={this.goToCurrentContext}
                isCurrentContextSet={this.isCurrentContextSet}
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
  // goToCurrentContext
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  goToCurrentContext = ()=>{
    this.showMessage('This function has not been implemented yet')
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // is current context set
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  isCurrentContextSet = (): boolean =>{
    return this.mpgGraph.isCurrentContextSet()
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // create item from speech
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  createItemFromSpeech = (name: string)=>{
    this.mpgLogger.debug("Creating item:",name);
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // set list search category type
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setListSearchCategoryType = async (category: MpgCategoryType) => {
    this.setState({ listSearchCategoryType: category });
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // add page to histor
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  addPage2History = (location: AppLocation) => {
    this.pageHistory.push(location);
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // go back
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  goBack = () => {
    // this.mpgLogger.debug('MpgApp: goToSearchPage: pageHistor:', this.pageHistory)
    let location = this.pageHistory.pop();
    // we need to pop twice to get to the previous page
    location = this.pageHistory.pop();
    // this.mpgLogger.debug('MpgApp: goToSearchPage: location:', location)
    if (location !== undefined) {
      switch (location.page) {
        case AppPage.List:
          this.goToListOrSearchPage(location);
          break;
        case AppPage.Home:
        default:
          this.goHome();
          break;
      }
    } else {
      this.goHome();
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // go to list
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  goToList = (category: MpgCategoryType, state: ListSearchState) => {
    switch (category) {
      case MpgCategoryType.View:
        this.goToViews(state);
        break;
      case MpgCategoryType.Entry:
        this.goToEntries(state);
        break;
      case MpgCategoryType.Tag:
        this.goToTags(state);
        break;
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // go to list or earch page
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  goToListOrSearchPage = (location: AppLocation) => {
    switch (location.listSearchState) {
      case ListSearchState.Search:
        this.goToSearchPage(location);
        break;
      case ListSearchState.List:
      default:
        this.goToListPage(location);
        break;
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // go to search page
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  goToSearchPage = async (location: AppLocation) => {
    if (location.searchText !== undefined) {
      this.searchText = location.searchText;
    }
    if (location.searchTags !== undefined) {
      this.searchTags = location.searchTags;
    }
    // await this.mpgGraph.setListSearchState(ListSearchState.Search);
    // if(location.listSearchCategory !== undefined){
    //   await this.mpgGraph.setCurrentItemType(location.listSearchCategory);
    // }else{
    //   await this.mpgGraph.setCurrentItemType(CurrentCategoryType.View);
    // }
    await this.setState({});
    this.props.history.push("/Search");
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // go to list page
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  goToListPage = (location: AppLocation) => {
    switch (location.listSearchCategory) {
      case MpgCategoryType.Entry:
        this.goToEntries();
        break;
      case MpgCategoryType.Tag:
        this.goToTags();
        break;
      case MpgCategoryType.View:
      default:
        this.goToViews();
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
            backgroundColor: MpgTheme.palette.primary.dark,
            color: MpgTheme.palette.primary.contrastText
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
  goToViews = async (state: ListSearchState = ListSearchState.List) => {
    await this.setState({
      listSearchCategoryType: MpgCategoryType.View,
      listSearchState: state
    });
    this.props.history.push("/Search");
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
          <ListItem button onClick={this.goToSettings}>
            <ListItemIcon>
            <Icon>settings_applications</Icon>
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
          <Divider />
          <ListItem button onClick={event => this.goToViews}>
            <ListItemIcon>
              <Icon>view_headline</Icon>
            </ListItemIcon>
            <ListItemText primary="Views" />
          </ListItem>
          <ListItem button onClick={event => this.goToEntries}>
            <ListItemIcon>
              <Icon>view_headline</Icon>
            </ListItemIcon>
            <ListItemText primary="Entries" />
          </ListItem>
          <ListItem button onClick={event => this.goToTags}>
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
          <ListItem button onClick={this.exportAllData}>
            <ListItemIcon>
              <Icon>cloud_download</Icon>
            </ListItemIcon>
            <ListItemText primary="Export data" />
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
  // export all data
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  exportAllData = async () => {
    try {
      // this.download('test.json',"{'text': 'My Personal Graph'}")
      this.showMessage("Sorry, function has not been implemented yet");
    } catch (err) {
      this.mpgLogger.unexpectedError(
        "MpgApp: exportAllData: unable to download file. Error",
        err
      );
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // download text
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  download = async (filename: string, text: string) => {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
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
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // create new item
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  createNewItem = (type: MpgCategoryType) => {
    switch (type) {
      case MpgCategoryType.Entry:
        this.goToNewEntry();
        break;
      case MpgCategoryType.View:
        this.goToNewView();
        break;
      case MpgCategoryType.Tag:
        this.goToNewTag();
        break;
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // update item
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  updateItem = async (item: MpgItem) => {
    if (this.state.userSignedIn) {
      await this.setState({ currentItem: item });
      await this.mpgGraph.setDisplayMode(MpgCreateUpdateMode.Update);
      await this.props.history.push("/ItemDetails");
    } else {
      this.showMessage("Please signin first");
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
        await this.mpgGraph.setDisplayMode(MpgCreateUpdateMode.Create);
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
        await this.mpgGraph.setDisplayMode(MpgCreateUpdateMode.Create);
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
        await this.mpgGraph.setDisplayMode(MpgCreateUpdateMode.Create);
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
  goToTags = async (state: ListSearchState = ListSearchState.List) => {
    await this.setState({
      listSearchCategoryType: MpgCategoryType.Tag,
      listSearchState: state
    });
    this.props.history.push("/Search");
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // go to Entries
  ///////////////////////////////////////////////////////////////////////////////////////////////
  goToEntries = async (state: ListSearchState = ListSearchState.List) => {
    await this.setState({
      listSearchCategoryType: MpgCategoryType.Entry,
      listSearchState: state
    });
    this.props.history.push("/Search");
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
  // go user settings
  ///////////////////////////////////////////////////////////////////////////////////////////////
  goToSettings = () => {
    this.showMessage("This function has not been implemented yet")
    // this.state.userSignedIn
    //   ? this.props.history.push("/UserPref")
    //   : this.props.history.push("/landing");
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
    displayMode: MpgCreateUpdateMode,
    allTags: MpgItem[],
    allEntries: MpgItem[],
    allViews: MpgItem[],
    currentItemType: CurrentCategoryType,
    listSearchState: ListSearchState,
    currentContext: MpgItem | undefined,
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
    this.currentContext = currentContext
    // set state for variables that affect rendering of this component
    await this.setState({
      appError: error,
      appErrorState: unexpectedError,
      newItemType: currentItemType,
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
  showMessage = (message: string, messageWaitTime: number = 60000) => {
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
    this.setState({
      cardWidth:
        window.innerWidth < this.maxCardWidth
          ? window.innerWidth
          : this.maxCardWidth
    });
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
