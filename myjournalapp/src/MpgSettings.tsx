////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Module settings
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import MpgAppBar from "./MpgAppBar";
import {
  Typography,
  Card,
  CardContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@material-ui/core";
import MpgCategory from "./MpgCategory";
import MpgGraph, { MpgDisplayMode } from "./MpgGraph";
import MpgLogger from "./MpgLogger";
import MpgItem from "./MpgItem";
import MpgTheme from "./MpgTheme";
import { AppLocation, AppPage } from "./MpgApp";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface ISettingsProps extends RouteComponentProps {
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  showMessage: Function;
  userSignedIn: boolean;
  allCategories: MpgCategory[];
  mpgGraph: MpgGraph;
  mpgLogger: MpgLogger;
  currentCategoryId: string;
  filteredItems: MpgItem[];
  currentItemId: string;
  createOrUpdateMode: MpgDisplayMode;
  allTags: MpgItem[];
  allEnteries: MpgItem[];
  goToNewEntry: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  displayMode: MpgDisplayMode;
  cardWidth: number
  addPage2Histor: Function
  goBack: Function
  goToList: Function
  goToCurrentContext: Function
  isCurrentContextSet: Function
  allViews: MpgItem[]
  currentContext: MpgItem | undefined
}
interface ISettingsState {
  cardWidth: number
  contextSearchText: string
  contextListVisible: boolean
  matchedContexts: MpgItem[]
  currentContext: MpgItem | undefined
  allViews: MpgItem[]
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Settings class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgSettingsBase extends React.Component<ISettingsProps, ISettingsState> {
  readonly addNewContextId = "ADD_NEW_CONTEXT_ID";
  constructor(props: ISettingsProps) {
    super(props);
    let currentCategoryId = "";
    if (props.allCategories.length > 0) {
      currentCategoryId = props.allCategories[0].getId();
      props.mpgGraph.setCurrentCategoryId(currentCategoryId);
    }
    this.state = {
      cardWidth: props.cardWidth,
      contextSearchText: '',
      contextListVisible: false,
      matchedContexts: [],
      currentContext: props.currentContext,
      allViews: props.allViews,
    };
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  public render = () => {
    return (
      <div>
        <MpgAppBar
          toggleSidebarVisibility={this.props.toggleSidebarVisibility}
          goToNewEntry={this.props.goToNewEntry}
          mpgGraph={this.props.mpgGraph}
          goToCurrentContext={this.props.goToCurrentContext}
          isCurrentContextSet={this.props.isCurrentContextSet}
        />
        <div style={{ paddingTop: 59 }}> </div>
        <div
          style={{
            padding: "0px",
            margin: "10px",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            textAlign: "center",
          }}
        >
          {this.renderSettingsPanel()}
        </div>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render SettingsPanel
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderSettingsPanel = () => {
    return (
      <Card
        elevation={1}
        style={{
          maxWidth: this.state.cardWidth,
          minWidth: this.state.cardWidth,
          margin: 5,
          backgroundColor: MpgTheme.palette.primary.light
        }}
      >
        <CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              justifyItems: "center",
              margin: 0
            }}
          >
             <Typography variant="h6" color="primary" />
            <Typography
              variant="h6"
              style={{
                color: MpgTheme.palette.primary.contrastText,
                fontWeight: "bold"
              }}
            >
              Settings
            </Typography>
            <Typography variant="h6" color="primary" />
          </div>
        </CardContent>
              {this.renderSetCurrentContext()}
      </Card>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render set current context
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderSetCurrentContext = () => {
    const currentContext = this.state.currentContext
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start"
        }}
      >
        <div style={{padding:"10px"}}>
        <Card>
          <div>
            <Typography>
              "Current context:"
            </Typography>
            {currentContext !== undefined
            ? <Chip
              key={currentContext.getId()}
              label={currentContext.getName()}
              color="primary"
              onDelete={event => this.handleContextDelete(event, currentContext.getId())}
              onClick={event => this.handleContextDelete(event, currentContext.getId())}
              variant="outlined"
              style={{ margin: "5px" }}
          />
        : <div></div>}
          </div>
          <TextField
            id="action"
            label="Search or add item as the current context"
            value={this.state.contextSearchText}
            margin="normal"
            style={{ marginLeft: 10, width: "100%" }}
            onChange={this.handleContextSearchTextChange}
            autoComplete="off"
          />
          {this.state.contextListVisible ? (
            <List>
              {this.state.matchedContexts.map(action => (
                <ListItem
                  key={action.getId()}
                  button
                  onClick={event =>
                    this.handleContextClicked(event, action.getId())
                  }
                >
                  <ListItemText primary={action.getName()} />
                </ListItem>
              ))}
              <Divider />
              <ListItem
                key={this.addNewContextId}
                button
                onClick={event =>
                  this.handleContextClicked(event, this.addNewContextId)
                }
              >
                <ListItemText
                  primary={"Add new item: " + this.state.contextSearchText}
                />
              </ListItem>
            </List>
          ) : (
            <div />
          )}
        </Card>
        </div>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle context clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleContextClicked = async (event: any, id: string) => {
    if (id === this.addNewContextId) {
      // await this.saveItem()
      const newContext = this.props.mpgGraph.createViewInstance(
        this.state.contextSearchText
      );
      if (newContext !== undefined) {
        // save the new context
        await this.props.mpgGraph.saveItem(newContext);
        await this.setState({ currentContext: newContext, contextSearchText: "" });
      } else {
        this.props.mpgLogger.unexpectedError(
          `MogItemDetails: handleContextClicked: cannot create new context`
        );
      }
    } else {
      const context = this.props.mpgGraph.getItemById(id);
      if (context !== undefined) {
        await this.setState({
          contextListVisible: false,
          contextSearchText: "",
          currentContext: context,
        });
      } else {
        this.props.mpgLogger.unexpectedError(
          `MpgItemDetails: handleContextClicked: context was not found. id:${id}`
        );
      }
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle context delete
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleContextDelete = async (event: any, id: string) => {
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle context search text change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleContextSearchTextChange = async (event: React.ChangeEvent) => {
    const contextSearchText = (event.target as HTMLInputElement).value;
    // this.props.mpgLogger.debug("ItemDetails: handleTagSearchTextChange: searchText:",tagSearchText)
    if (contextSearchText.length > 0) {
      await this.setState({
        contextSearchText: contextSearchText,
        contextListVisible: true
      });
      await this.setMatchedIContexts();
    } else {
      await this.setState({
        contextSearchText: contextSearchText,
        contextListVisible: false
      });
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // set matched context
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setMatchedIContexts = async () => {
    let foundContexts: MpgItem[] = [];
    const searchText = this.state.contextSearchText.trim().toLowerCase();
    // this.props.mpgLogger.debug("ActionDetails: setMatchedGoals: searchText:",searchText," allGoals:",
    if (searchText.length > 0) {
      let actionsToBeSearched: MpgItem[] = this.state.allViews;
      for (let context of actionsToBeSearched) {
        // this.props.mpgLogger.debug("ItemDetails: setMatchedTags: searchText:",searchText,
        // ", tag name:",tag.getName())
        if (
          context
            .getName()
            .toLowerCase()
            .includes(searchText)
        ) {
          // this.props.mpgLogger.debug("ItemDetails: setMatchedTags: item match")
          foundContexts.push(context);
        }
      }
      // foundItems = this.props.mpgGraph.getItemsExceptCurrentItem().filter(
      //     (item)=>{item.name.includes(this.state.helpsRelsSearch)})
    }
    // this.props.mpgLogger.debug(`ItemDetails: setMatchedTags: foundTags:`,foundTags,`AllTags:`,this.state.allTags)
    await this.setState({ matchedContexts: foundContexts });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component will mount
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillMount = () => {
    if (!this.props.userSignedIn) {
      this.props.history.push("/Landing");
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // component did mount
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  componentDidMount = () =>{
    const appLocation: AppLocation = {page: AppPage.Home}
    this.props.addPage2Histor(appLocation)
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component will receive props
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillReceiveProps(newProps: ISettingsProps) {
    this.setState({
      allViews: newProps.allViews,
      cardWidth: newProps.cardWidth,
      currentContext: newProps.currentContext,
    });
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgSettings = withRouter(MpgSettingsBase)
export default MpgSettings