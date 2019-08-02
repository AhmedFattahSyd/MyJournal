///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Item Details component
// displays details of an item
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import MpgAppBar from "./MpgAppBar";
import {
  Card,
  CardContent,
  Icon,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  CardActionArea
} from "@material-ui/core";
import MpgGraph, { CreateOrUpdateModes } from "./MpgGraph";
import MpgLogger from "./MpgLogger";
import MpgItem from "./MpgItem";
import { MpgCategoryNames } from "./MpgInitialCategories";
import MpgHome from "./MpgHome";
import MpgCategory from "./MpgCategory";
import MpgItemList from "./MpgItemList";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IItemDetailsProps extends RouteComponentProps {
  createOrUpdateMode: CreateOrUpdateModes;
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  showMessage: Function;
  userSignedIn: boolean;
  currentCategoryId: string;
  mpgGraph: MpgGraph;
  mpgLogger: MpgLogger;
  currentItemId: string;
  allTags: MpgItem[];
  allEnteries: MpgItem[];
  deskTop: boolean;
  filteredItems: MpgItem[]
  allCategories: MpgCategory[]
  goToNewEntry: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void
}
interface IItemDetailsState {
  currentCategoryId: string;
  currentCategoryName: string;
  createOrUpdateMode: CreateOrUpdateModes;
  newOrUpdate: string;
  itemName: string;
  currentItemId: string;
  itemImportance: number;
  tagSearchText: string;
  actionSearchText: string;
  tagListVisible: boolean;
  actionListVisible: boolean;
  allTags: MpgItem[];
  matchedTags: MpgItem[];
  selectedTags: MpgItem[];
  allGoals: MpgItem[];
  goalSearchText: string;
  goalListVisible: boolean;
  matchedGoals: MpgItem[];
  selectedGoals: MpgItem[];
  itemsWithTags: MpgItem[];
  allActions: MpgItem[];
  selectedActions: MpgItem[];
  matchedActions: MpgItem[];
  showRelatedItems: boolean;
  itemDataChanged: boolean;
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Item Details class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgItemDetailsBase extends React.Component<
  IItemDetailsProps,
  IItemDetailsState
> {
  readonly addNewTagId = "ADD_NEW_TAG_ID";
  readonly addNewGoalId = "ADD_NEW_GOAL_ID";
  readonly addNewActionId = "ADD_NEW_ACTION_ID";
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // constructor
  ///////////////////////////////////////////////////////////////////////////////////////////////
  constructor(props: IItemDetailsProps) {
    super(props);
    const item = this.props.mpgGraph.getItemById(props.currentItemId);
    let itemImportance = 0;
    if (item != undefined) {
      itemImportance = item.getImportance();
    }
    let itemsWithTags: MpgItem[] = [];
    if (item != undefined) {
      itemImportance = item.getImportance();
      // itemsWithTags = this.getItemsWithTags()
    }
    // let showRelatedItem = this.showRelatedItems()
    this.state = {
      currentCategoryId: props.currentCategoryId,
      currentCategoryName: "???",
      createOrUpdateMode: props.createOrUpdateMode,
      newOrUpdate: "???",
      itemName: "???",
      currentItemId: props.currentItemId,
      itemImportance: itemImportance,
      tagSearchText: "",
      actionSearchText: "",
      tagListVisible: false,
      allTags: props.allTags,
      matchedTags: [],
      selectedTags: [],
      allGoals: [],
      goalSearchText: "",
      goalListVisible: false,
      matchedGoals: [],
      selectedGoals: [],
      itemsWithTags: itemsWithTags,
      allActions: this.props.allEnteries,
      selectedActions: [],
      matchedActions: [],
      actionListVisible: false,
      showRelatedItems: false,
      itemDataChanged: false
    };
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  public render = () => {
    return (
      <div>
        {this.props.deskTop ? this.renderDesktop() : this.renderMobile()}
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public renderMobile = () => {
    // this.props.mpgLogger.debug(`ItemDetails: render: allTags:`, this.state.allTags)
    return (
      <div>
        <MpgAppBar
          toggleSidebarVisibility={this.props.toggleSidebarVisibility}
          goToNewEntry={this.props.goToNewEntry}
        />
        <div style={{ paddingTop: 59 }}> </div>
        <div
          style={{
            padding: "10px",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            textAlign: "center"
          }}
        >
          {this.renderItemDetails()}
        </div>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render desktop
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public renderDesktop = () => {
    return (
      <div>
        {this.renderItemDetails()}
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render item details
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderItemDetails = () => {
    const cardWidth = 360;
    // this.props.mpgLogger.debug(`MpgItemDetails: renderItemDetails: state:`,this.state)
    return (
      <Card
        elevation={1}
        style={{ maxWidth: cardWidth, minWidth: cardWidth, margin: 10 }}
      >
        <CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: 5
            }}
          >
             <Typography variant="h6" color="primary" />
            <Typography variant="h5" color="primary">
              {this.state.newOrUpdate + " " + this.state.currentCategoryName}
            </Typography>
            <Typography variant="h6" color="primary" />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start"
            }}
          >
            <TextField
              id="itemName"
              label="Name"
              value={this.state.itemName}
              margin="normal"
              style={{ marginLeft: 10, marginRight: 10, width: "100%" }}
              onChange={this.handleItemNameChange}
              onKeyPress={this.handleKeyPressed}
              onBlur={this.saveItem}
            />
            <TextField
              id="itemImportance"
              label="Importance"
              value={this.state.itemImportance}
              margin="normal"
              style={{ marginLeft: 10, width: "9%" }}
              onChange={this.handleItemImportanceChange}
              onKeyPress={this.handleKeyPressed}
              onBlur={this.saveItem}
            />
            <Divider />
            {this.showTags() ? this.renderTags() : <div />}
            <Divider />
            {this.showAddActions() ? this.renderAddActions() : <div />}
            <Divider />
            {this.state.showRelatedItems ? this.renderRelatedItems() : <div />}
          </div>
        </CardContent>
      </Card>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render add axtions
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderAddActions = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start"
        }}
      >
        <Typography variant="body1" color="textPrimary">
          Actions
        </Typography>
        <TextField
          id="action"
          label="Search or add item"
          value={this.state.actionSearchText}
          margin="normal"
          style={{ marginLeft: 10, width: "100%" }}
          onChange={this.handleActionSearchTextChange}
          autoComplete="off"
        />
        {this.state.actionListVisible ? (
          <List>
            {this.state.matchedActions.map(action => (
              <ListItem
                key={action.getId()}
                button
                onClick={event =>
                  this.handleItemClicked(event, action.getId())
                }
              >
                <ListItemText primary={action.getName()} />
              </ListItem>
            ))}
            <Divider />
            <ListItem
              key={this.addNewActionId}
              button
              onClick={event =>
                this.handleItemClicked(event, this.addNewActionId)
              }
            >
              <ListItemText
                primary={"Add new item: " + this.state.actionSearchText}
              />
            </ListItem>
          </List>
        ) : (
          <div />
        )}
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render tags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderTags = () => {
    // this.props.mpgLogger.debug('MpgActionDetails: selected tags:',this.state.selectedTags)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start"
        }}
      >
        <Typography variant="body1" color="textPrimary">
          Tags
        </Typography>
        <TextField
          id="tag"
          label="Search for tags"
          value={this.state.tagSearchText}
          margin="normal"
          style={{ marginLeft: 10, width: "50%" }}
          onChange={this.handleTagSearchTextChange}
          autoComplete="off"
        />
        {this.state.tagListVisible ? (
          <List>
            {this.state.matchedTags.map(tag => (
              <ListItem
                key={tag.getId()}
                button
                onClick={event => this.handleTagClicked(event, tag.getId())}
              >
                <ListItemText primary={tag.getName()} />
              </ListItem>
            ))}
            <Divider />
            <ListItem
              key={this.addNewTagId}
              button
              onClick={event => this.handleTagClicked(event, this.addNewTagId)}
            >
              <ListItemText
                primary={"Add new tag: " + this.state.tagSearchText}
              />
            </ListItem>
          </List>
        ) : (
          <div />
        )}
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {this.state.selectedTags.map(tag => (
            <Chip
              key={tag.getId()}
              label={tag.getName()}
              color="primary"
              onDelete={event => this.handleTagDelete(event, tag.getId())}
              variant="outlined"
              style={{ margin: "5px" }}
            />
          ))}
        </div>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render items
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderRelatedItems = () => {
    const cardWidth = 320;
    // const theme = createMuiTheme();
    // const background = theme.palette.background
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "2px 5px 2px 5px",
          flexWrap: "wrap"
        }}
      >
        <Typography
          style={{ fontSize: "14px", fontWeight: "bold" }}
          align="left"
        >
          Related items
        </Typography>
        {this.state.itemsWithTags.map(item => (
          <Card
            key={item.getId()}
            elevation={1}
            style={{
              maxWidth: cardWidth,
              minWidth: cardWidth,
              margin: "2px 5px 2px 5px"
            }}
          >
            <CardActionArea>
              <CardContent>
                <Typography
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                  align="left"
                >
                  {item.getName()}
                </Typography>
                {true ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "5px"
                    }}
                  >
                    <Icon
                      style={{ fontSize: "20px" }}
                      onClick={event =>
                        this.handleItemUpdate(event, item.getId())
                      }
                    >
                      edit
                    </Icon>
                    <Icon
                      style={{ fontSize: "20px" }}
                      onClick={event =>
                        this.handleItemDelete(event, item.getId())
                      }
                    >
                      delete
                    </Icon>
                  </div>
                ) : (
                  <div />
                )}
              </CardContent>
            </CardActionArea>
            {/* </Link> */}
          </Card>
        ))}
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get current tags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getCurrentTags = (): MpgItem[] => {
    let currentTags: MpgItem[] = [];
    this.setCurrentCategoryName();
    if (this.showTags()) {
      currentTags = this.state.selectedTags;
    } else {
      const currentTag = this.props.mpgGraph.getItemById(
        this.state.currentItemId
      );
      if (currentTag != undefined) {
        currentTags.push(currentTag);
      } else {
        this.props.mpgLogger.unexpectedError(
          `MpgItemDetails: getCurrentTags: item is undefined. id: ${
            this.state.currentItemId
          }`
        );
      }
    }
    return currentTags;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle delete icon clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemDelete = async (event: React.MouseEvent, id: string) => {
    try {
      await this.props.mpgGraph.deleteItem(id);
    } catch (err) {
      this.props.mpgLogger.unexpectedError(err, "ItemList: deleteItem: error:");
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle update icon clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemUpdate = async (event: React.MouseEvent, itemId: string) => {
    // const itemType = this.props.mpgGraph.getItemType(itemId)
    const item = this.props.mpgGraph.getItemById(itemId);
    // this.props.mpgLogger.debug('ItemList: handleItemUpdate: itemType:',itemType)
    if (item != undefined) {
      await this.props.mpgGraph.setCreateOrUpdateMode(
        CreateOrUpdateModes.Update
      );
      await this.props.mpgGraph.setCurrentItemId(itemId);
      await this.props.mpgGraph.setCurrentCategoryId(item.getCategoryId());
      await this.props.history.push("/ItemDetails");
      // await this.props.mpgGraph.setCreateOrUpdateMode(CreateOrUpdateModes.Update)
      // await this.props.mpgGraph.setCurrentItemId(itemId)
    } else {
      this.props.mpgLogger.unexpectedError(
        "ItemList: handleItemUpdate: undefined item"
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // showTags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  showTags = (): boolean => {
    return (
      this.state.currentCategoryName == MpgCategoryNames.View ||
      this.state.currentCategoryName == MpgCategoryNames.Entry
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // show related item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  showRelatedItems = (): boolean => {
    // const itemType = this.props.mpgGraph.getItemType(this.state.currentItemId)
    // if (itemType == MpgCategoryNames.Tag) {
    //   return true
    // } else {
    //   return false
    // }
    return (
      this.state.currentCategoryName == MpgCategoryNames.View ||
      this.state.currentCategoryName == MpgCategoryNames.Tag
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // show add actions
  ///////////////////////////////////////////////////////////////////////////////////////////////
  showAddActions = (): boolean => {
    return (
      this.state.currentCategoryName == MpgCategoryNames.View ||
      this.state.currentCategoryName == MpgCategoryNames.Tag
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle action delete
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleActionDelete = async (event: any, id: string) => {
    // this.props.mpgLogger.debug(`MpgItemDetails: handleTagDelete: tagId:`,id,` allTags:`,this.props.mpgGraph.getAllTagsSorted())
    const action = this.props.mpgGraph.getActionById(id);
    if (action != undefined) {
      const newActions = this.state.selectedActions.filter(
        item => item.getId() != id
      );
      // this.props.mpgLogger.debug(`MpgItemDetails: handleTagDelete: newTags:`,newTags)
      await this.setState({
        selectedActions: newActions,
        actionSearchText: "",
        actionListVisible: false
      });
    } else {
      this.props.mpgLogger.unexpectedError(
        `MpgActionDetails: handleActionDelete: action was not found. id:${id}`
      );
    }
    await this.saveItem();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle item clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemClicked = async (event: any, id: string) => {
    if (id == this.addNewActionId) {
      this.setState({ itemDataChanged: true });
      // await this.saveItem()
      const newAction = this.props.mpgGraph.createActionInstance(
        this.state.actionSearchText
      );
      if (newAction != undefined) {
        // save the action
        await this.props.mpgGraph.saveEntry(newAction);
        await this.props.mpgGraph.addTagsToItem(
          newAction,
          this.getCurrentTags()
        );
        const newActions = this.state.selectedActions;
        newActions.push(newAction);
        await this.setState({ actionListVisible: false, actionSearchText: "" });
      } else {
        this.props.mpgLogger.unexpectedError(
          `MogItemDetails: handleActionClicked: cannot create new action. actionCategorrId was not found`
        );
      }
    } else {
      const action = this.props.mpgGraph.getActionById(id);
      if (action != undefined) {
        // add tags to the action
        await this.props.mpgGraph.addTagsToItem(action, this.getCurrentTags());
        const newActions = this.state.selectedActions;
        newActions.push(action);
        await this.setState({
          actionListVisible: false,
          actionSearchText: ""
        });
      } else {
        this.props.mpgLogger.unexpectedError(
          `MpgItemDetails: handleActionClicked: action was not found. id:${id}`
        );
      }
    }
    // hopefully this is the right place to save the item
    // this.props.mpgLogger.debug(`handleActionClicked`, ` selected tags:`, this.state.selectedTags)
    await this.saveItem();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle action search text change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleActionSearchTextChange = async (event: React.ChangeEvent) => {
    const actionSearchText = (event.target as HTMLInputElement).value;
    // this.props.mpgLogger.debug("ItemDetails: handleTagSearchTextChange: searchText:",tagSearchText)
    if (actionSearchText.length > 0) {
      await this.setState({
        actionSearchText: actionSearchText,
        actionListVisible: true
      });
      await this.setMatchedIActions();
    } else {
      await this.setState({
        actionSearchText: actionSearchText,
        actionListVisible: false
      });
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // set matched goals
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // setMatchedIGoals = async () => {
  //   let foundGoals: MpgItem[] = []
  //   const searchText = this.state.goalSearchText.trim().toLowerCase()
  //   // this.props.mpgLogger.debug("ActionDetails: setMatchedGoals: searchText:",searchText," allGoals:",
  //   // this.state.allGoals)
  //   if (searchText.length > 0) {
  //     let goalsToBeSearched: MpgItem[] = this.state.allGoals
  //     for (let goal of goalsToBeSearched) {
  //       // this.props.mpgLogger.debug("ItemDetails: setMatchedTags: searchText:",searchText,
  //       // ", tag name:",tag.getName())
  //       if (goal.getName().toLowerCase().includes(searchText)) {
  //         // this.props.mpgLogger.debug("ItemDetails: setMatchedTags: item match")
  //         foundGoals.push(goal)
  //       }
  //     }
  //     // foundItems = this.props.mpgGraph.getItemsExceptCurrentItem().filter(
  //     //     (item)=>{item.name.includes(this.state.helpsRelsSearch)})
  //   }
  //   // this.props.mpgLogger.debug(`ItemDetails: setMatchedTags: foundTags:`,foundTags,`AllTags:`,this.state.allTags)
  //   await this.setState({ matchedGoals: foundGoals })
  // }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // set matched actions
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setMatchedIActions = async () => {
    let foundActions: MpgItem[] = [];
    const searchText = this.state.actionSearchText.trim().toLowerCase();
    // this.props.mpgLogger.debug("ActionDetails: setMatchedGoals: searchText:",searchText," allGoals:",
    // this.state.allGoals)
    if (searchText.length > 0) {
      let actionsToBeSearched: MpgItem[] = this.state.allActions;
      for (let action of actionsToBeSearched) {
        // this.props.mpgLogger.debug("ItemDetails: setMatchedTags: searchText:",searchText,
        // ", tag name:",tag.getName())
        if (
          action
            .getName()
            .toLowerCase()
            .includes(searchText)
        ) {
          // this.props.mpgLogger.debug("ItemDetails: setMatchedTags: item match")
          foundActions.push(action);
        }
      }
      // foundItems = this.props.mpgGraph.getItemsExceptCurrentItem().filter(
      //     (item)=>{item.name.includes(this.state.helpsRelsSearch)})
    }
    // this.props.mpgLogger.debug(`ItemDetails: setMatchedTags: foundTags:`,foundTags,`AllTags:`,this.state.allTags)
    await this.setState({ matchedActions: foundActions });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle tag delete
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleTagDelete = async (event: any, id: string) => {
    // this.props.mpgLogger.debug(`MpgItemDetails: handleTagDelete: tagId:`,id,` allTags:`,this.props.mpgGraph.getAllTagsSorted())
    this.setState({ itemDataChanged: true });
    const tag = this.props.mpgGraph.getTagById(id);
    if (tag != undefined) {
      const newTags = this.state.selectedTags.filter(
        item => item.getId() != id
      );
      // this.props.mpgLogger.debug(`MpgItemDetails: handleTagDelete: newTags:`,newTags)
      await this.setState({
        selectedTags: newTags,
        tagSearchText: "",
        tagListVisible: false
      });
      await this.setState({
        itemsWithTags: this.getItemsWithATags(),
        itemDataChanged: true
      });
    } else {
      this.props.mpgLogger.unexpectedError(
        `MogItemDetails: handleTagDelete: tag was not found. id:${id}`
      );
    }
    await this.saveItem();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // getItemsWithTags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getItemsWithATags = (): MpgItem[] => {
    // let tags = this.state.selectedTags
    // let foundItems: MpgItem[] = []
    // if (this.state.currentCategoryName == MpgCategoryNames.View) {
    //   foundItems = this.props.mpgGraph.getActionsWithAllTag(this.getCurrentTags())
    // } else {
    //   if (this.state.currentCategoryName == MpgCategoryNames.View){}
    //   foundItems = this.props.mpgGraph.getItemsWithTags(this.getCurrentTags())
    // }
    // this.props.mpgLogger.debug(`MpgContext: getItemsWithTags: currentCategory is: ${this.state.currentCategoryName}`)
    return this.props.mpgGraph.getEntriesWithAllTag(this.getCurrentTags());
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle tag clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleTagClicked = async (event: any, id: string) => {
    await this.setState({ itemDataChanged: true });
    if (id == this.addNewTagId) {
      const newTag = this.props.mpgGraph.createTagInstance(
        this.state.tagSearchText
      );
      if (newTag != undefined) {
        // save the tag
        this.props.mpgGraph.saveTag(newTag);
        const newTags = this.state.selectedTags;
        newTags.push(newTag);
        await this.setState({
          selectedTags: newTags,
          tagListVisible: false,
          tagSearchText: ""
        });
        await this.setState({ itemsWithTags: this.getItemsWithATags() });
      } else {
        this.props.mpgLogger.unexpectedError(
          `MogItemDetails: handleTagClicked: cannot create new tag. TagCategorrId was not found`
        );
      }
    } else {
      const tag = this.props.mpgGraph.getTagById(id);
      if (tag != undefined) {
        const newTags = this.state.selectedTags;
        newTags.push(tag);
        await this.setState({
          selectedTags: newTags,
          tagListVisible: false,
          tagSearchText: ""
        });
        await this.setState({ itemsWithTags: this.getItemsWithATags() });
      } else {
        this.props.mpgLogger.unexpectedError(
          `MogItemDetails: handleTagClicked: tag was not found. id:${id}`
        );
      }
    }
    // this.props.mpgLogger.debug(`MpgItemDetails: handleTagClicked`, ` state:`, this.state)
    await this.saveItem();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get matched tags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getMatchedTags = (): MpgItem[] => {
    const matchedTAgs: MpgItem[] = [];
    return matchedTAgs;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle cancel
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleCancel = () => {
    this.props.history.goBack();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle item importance change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemImportanceChange = (event: React.ChangeEvent) => {
    const itemImportance = parseInt((event.target as HTMLInputElement).value);
    if (itemImportance != NaN && itemImportance > 0) {
      this.setState({ itemImportance: itemImportance });
    } else {
      this.setState({ itemImportance: 0 });
      // todo: we should select the field to allow changing the zero
    }
    this.setState({ itemDataChanged: true });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle tag search text change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleTagSearchTextChange = async (event: React.ChangeEvent) => {
    const tagSearchText = (event.target as HTMLInputElement).value;
    // this.props.mpgLogger.debug("ItemDetails: handleTagSearchTextChange: searchText:",tagSearchText)
    if (tagSearchText.length > 0) {
      await this.setState({
        tagSearchText: tagSearchText,
        tagListVisible: true
      });
      await this.setMatchedITags();
    } else {
      await this.setState({
        tagSearchText: tagSearchText,
        tagListVisible: false
      });
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // set matched tags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setMatchedITags = async () => {
    let foundTags: MpgItem[] = [];
    const searchText = this.state.tagSearchText.trim().toLowerCase();
    // this.props.mpgLogger.debug("ItemDetails: setMatchedTags: searchText:", searchText, " all tags:", this.state.allTags)
    if (searchText.length > 0) {
      let tagsToBeSearched: MpgItem[] = this.state.allTags;
      for (let tag of tagsToBeSearched) {
        // this.props.mpgLogger.debug("ItemDetails: setMatchedTags: searchText:",searchText,
        // ", tag name:",tag.getName())
        if (
          tag
            .getName()
            .toLowerCase()
            .includes(searchText)
        ) {
          // this.props.mpgLogger.debug("ItemDetails: setMatchedTags: item match")
          foundTags.push(tag);
        }
      }
      // foundItems = this.props.mpgGraph.getItemsExceptCurrentItem().filter(
      //     (item)=>{item.name.includes(this.state.helpsRelsSearch)})
    }
    // this.props.mpgLogger.debug(`ItemDetails: setMatchedTags: foundTags:`,foundTags,`AllTags:`,this.state.allTags)
    await this.setState({ matchedTags: foundTags });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // setCategory name
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setCurrentCategoryName = () => {
    let currentCategoryName = "???";
    const currentCategory = this.props.mpgGraph.getCategoryById(
      this.state.currentCategoryId
    );
    if (currentCategory != undefined) {
      currentCategoryName = currentCategory.getName();
    }
    this.setState({ currentCategoryName: currentCategoryName });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component will mount
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillMount = () => {
    if (!this.props.userSignedIn) {
      this.props.history.push("/Landing");
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component will receive props
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillReceiveProps = async (newProps: IItemDetailsProps) => {
    // this.props.mpgLogger.debug("ItemList: componentWillReceiveProps: newProps:",newProps)
    await this.setState({
      currentCategoryId: newProps.currentCategoryId,
      createOrUpdateMode: newProps.createOrUpdateMode,
      currentItemId: newProps.currentItemId,
      allTags: newProps.allTags,
      allActions: newProps.allEnteries
    });
    this.setCurrentCategoryName();
    this.setCreateOrUpdateMode();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // set create or update mode
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setCreateOrUpdateMode = async () => {
    // await this.setState({
    //   selectedTags: [],
    //   itemsWithTags: [],
    // })
    // this.props.mpgLogger.debug(`MpgItemDetails: setCreateOrUpdateMode: state:`,this.state)
    if (this.state.createOrUpdateMode == CreateOrUpdateModes.Update) {
      const item = this.props.mpgGraph.getItemById(this.state.currentItemId);
      if (item != undefined) {
        await this.setState({
          selectedTags: item.getTags()
        });
        let relatedItems: MpgItem[] = []
        relatedItems = this.getItemsWithATags();
        // this.props.mpgLogger.debug(`MpgItemDetails: setCreateOrUpdateMode: relatedItems:`, relatedItems)
        this.setCurrentCategoryName();
        // this.props.mpgLogger.debug(`MpgItemDetails: setCreateOrUpdateMode: item's tags: ${item.getTags()}`)
        // load tags
        await this.setState({
          newOrUpdate: "Update",
          itemName: item.getName(),
          itemImportance: item.getImportance(),
          selectedTags: item.getTags(),
          selectedGoals: item.getGoals(),
          selectedActions: item.getActions(),
          itemsWithTags: relatedItems,
          showRelatedItems: this.showRelatedItems()
        });
      } else {
        this.props.mpgLogger.unexpectedError(
          `ItemDetails: setCreateOrUpdate: currentItem is undefined`
        );
      }
    } else {
      this.setState({
        newOrUpdate: "New",
        itemName: "",
        itemImportance: 0
      })
    }
    // this.props.mpgLogger.debug(`MpgItemDetails: setCreateOrUpdateMode: state and end of call:`,this.state)
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle item name change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemNameChange = async (event: React.ChangeEvent) => {
    // console.log("handleItemNameChange: event:",event);
    this.setState({
      itemName: (event.target as HTMLInputElement).value,
      itemDataChanged: true
    });
    // we will save item now
    // review if network delay is too much
    // this.saveItem()
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle key pressed
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleKeyPressed = async (event: any) => {
    //we should use the correct event type
    if (event.key === "Enter") {
      await this.saveItem();
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle action key pressed
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handleActionKeyPressed = (event: any, id: string) => {  //we should use the correct event type
  //   if (event.key === 'Enter') {
  //     this.handleActionClicked(event, id)
  //   }
  // }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle save
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSave = async () => {
    try {
      await this.saveItem()
      if(!this.props.deskTop){
        this.props.history.goBack();
      }
      this.props.mpgGraph.setCurrentCategoryId(this.state.currentCategoryId);
    } catch (error) {
      this.props.mpgLogger.unexpectedError(
        "MpgItemDetails: handleSave.",
        error
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // save new item (withoit exit)
  ///////////////////////////////////////////////////////////////////////////////////////////////
  saveItem = async () => {
    try {
      this.props.showMessage('Saving data ...')
      if (this.state.itemDataChanged) {
        // this.props.mpgLogger.debug(`MpgItemDetails: SaveItem`, ` state:`, this.state)
        if (this.state.createOrUpdateMode == CreateOrUpdateModes.Create) {
          await this.props.mpgGraph.createItem(
            this.state.currentCategoryId,
            this.state.itemName,
            this.state.itemImportance,
            this.state.selectedTags,
            this.state.selectedGoals,
            this.state.selectedActions
          );
          const currentItemId = this.props.mpgGraph.getCurrentItemId();
          await this.setState({
            createOrUpdateMode: CreateOrUpdateModes.Update,
            currentItemId: currentItemId,
            itemDataChanged: false
          })
          // this.props.mpgLogger.debug(`ItemDetails: Saving item`,` current item id:`,this.state.currentItemId)
          await this.setCreateOrUpdateMode()
          // this.props.mpgLogger.debug(`MpgItemDetails: Saving item`, ` state after crreating item:`, this.state)
        } else {
          // this.props.mpgLogger.debug("ItemDetails: handleSave: item name:",this.state.itemName);
          await this.props.mpgGraph.updateItem(
            this.state.currentItemId,
            this.state.currentCategoryId,
            this.state.itemName,
            this.state.itemImportance,
            this.state.selectedTags,
            this.state.selectedGoals,
            this.state.selectedActions
          );
          await this.setState({ itemDataChanged: false });
        }
      }
      this.props.showMessage('Data has been saved on the cloud')
    } catch (error) {
      this.props.mpgLogger.unexpectedError(
        "MpgItemDetails: handleSave.",
        error
      );
    }
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgItemDetails = withRouter(MpgItemDetailsBase);
export default MpgItemDetails;
