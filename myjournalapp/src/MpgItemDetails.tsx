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
import MpgGraph, { MpgDisplayMode } from "./MpgGraph";
import MpgLogger from "./MpgLogger";
import MpgItem from "./MpgItem";
import MpgCategory from "./MpgCategory";
import MpgTheme from "./MpgTheme";
import MpgItemListComp from "./MpgItemListComp";
import { AppLocation, AppPage } from "./MpgApp";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IItemDetailsProps extends RouteComponentProps {
  displayMode: MpgDisplayMode;
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
  allEntries: MpgItem[];
  filteredItems: MpgItem[];
  allCategories: MpgCategory[];
  goToNewEntry: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  cardWidth: number;
  addPage2Histor: Function;
  goBack: Function;
  goToCurrentContext: Function
  isCurrentContextSet: Function
}
interface IItemDetailsState {
  currentCategoryId: string;
  // currentCategoryName: string;
  displayMode: MpgDisplayMode;
  itemName: string;
  currentItemId: string;
  itemPriority: number;
  itemNetPriority: number;
  tagSearchText: string;
  entrySearchText: string;
  tagListVisible: boolean;
  entryListVisible: boolean;
  allTags: MpgItem[];
  matchedTags: MpgItem[];
  existingTags: MpgItem[];
  existingParentTags: MpgItem[];
  existingChildTags: MpgItem[];
  allGoals: MpgItem[];
  goalSearchText: string;
  goalListVisible: boolean;
  matchedGoals: MpgItem[];
  selectedGoals: MpgItem[];
  itemsWithTags: MpgItem[];
  allEntries: MpgItem[];
  selectedEntries: MpgItem[];
  matchedEntries: MpgItem[];
  showRelatedItems: boolean;
  itemDataChanged: boolean;
  screenTitle: string;
  deleteInProgress: boolean;
  cardWidth: number;
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Item Details class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgItemDetailsBase extends React.Component<
  IItemDetailsProps,
  IItemDetailsState
> {
  readonly addNewTagId = "ADD_NEW_TAG_ID";
  readonly addNewEntryId = "ADD_NEW_ENTRY_ID";
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // constructor
  ///////////////////////////////////////////////////////////////////////////////////////////////
  constructor(props: IItemDetailsProps) {
    super(props);
    // Amplify.configure(awsconfig);
    // Amplify.addPluggable(new AmazonAIPredictionsProvider());
    const currentItem = props.mpgGraph.getItemById(props.currentItemId);
    let itemPriority = 0;
    let itemName = "";
    let screenName = "New " + props.mpgGraph.getCurrentCateoryName();
    let existingTags: MpgItem[] = [];
    let entriesWithTags: MpgItem[] = [];
    let existingParentTags: MpgItem[] = [];
    let existingChildTags: MpgItem[] = [];
    let itemNetPriority = 0;
    if (currentItem !== undefined) {
      entriesWithTags = [];
      itemPriority = currentItem.getPriority();
      itemNetPriority = currentItem.getNetPriority();
      itemName = currentItem.getName();
      itemPriority = currentItem.getPriority();
      existingTags = currentItem.getTags();
      screenName = "Update " + props.mpgGraph.getCurrentCateoryName();
      if (props.mpgGraph.isCurrentCategoryTag()) {
        existingParentTags = currentItem.getParents();
        existingChildTags = currentItem.getChildren();
      }
    }
    this.state = {
      currentCategoryId: props.currentCategoryId,
      displayMode: props.displayMode,
      itemName: itemName,
      currentItemId: props.currentItemId,
      itemPriority: itemPriority,
      tagSearchText: "",
      entrySearchText: "",
      tagListVisible: false,
      allTags: props.allTags,
      matchedTags: [],
      existingTags: existingTags,
      allGoals: [],
      goalSearchText: "",
      goalListVisible: false,
      matchedGoals: [],
      selectedGoals: existingTags,
      itemsWithTags: entriesWithTags,
      allEntries: this.props.allEntries,
      selectedEntries: [],
      matchedEntries: [],
      entryListVisible: false,
      showRelatedItems: false,
      itemDataChanged: false,
      screenTitle: screenName,
      deleteInProgress: false,
      existingParentTags: existingParentTags,
      existingChildTags: existingChildTags,
      itemNetPriority: itemNetPriority,
      cardWidth: props.cardWidth,
    };
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // init data
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  initData = (props: IItemDetailsProps) => {};
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // goback
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  goBack = async () => {
    // this.props.history.push("/Search");
    // this.props.history.goBack()
    this.props.goBack();
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // renderItemTags
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderItemTags = () => {
    return (
      <Card elevation={1} style={{ margin: 10 }}>
        <CardContent>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {this.state.existingTags.map(tag => (
              <Chip
                key={tag.getId()}
                label={tag.getName()}
                color="primary"
                onDelete={event => this.handleTagDelete(event, tag.getId())}
                onClick={event => this.handleTagUpdate(event, tag.getId())}
                variant="outlined"
                style={{ margin: "5px" }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render item details
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderItemDetails = () => {
    let saveIconColor = this.state.itemDataChanged
      ? MpgTheme.palette.secondary.main
      : MpgTheme.palette.primary.contrastText;
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
            <div style={{ display: "flex" }}>
              <Icon
                onClick={this.goBack}
                style={{
                  margin: 5,
                  color: MpgTheme.palette.primary.contrastText,
                  fontSize: 18,
                  fontWeight: "bold"
                }}
              >
                keyboard_backspace
              </Icon>
            </div>
            <Typography
              variant="h6"
              style={{
                color: MpgTheme.palette.primary.contrastText,
                fontWeight: "bold"
              }}
            >
              {this.state.screenTitle}
            </Typography>
            <Icon
                onClick={this.handleSave}
                style={{
                  margin: 5,
                  color: saveIconColor,
                  fontSize: 18,
                  fontWeight: "bold"
                }}
              >
                save
              </Icon>
          </div>
          <Card>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                margin: 10
              }}
            >
              {/* <audio id="player" controls></audio> */}
              <TextField
                id="itemName"
                label="Name"
                value={this.state.itemName}
                multiline
                margin="normal"
                style={{ marginLeft: 10, marginRight: 10, width: "95%" }}
                onChange={this.handleItemNameChange}
                // onKeyPress={this.handleKeyPressed}
                autoFocus={true}
                onBlur={this.saveCurrentItem}
              />
              <div style={{ display: "flex" }}>
                <TextField
                  id="itemPriority"
                  label="Priority"
                  value={this.state.itemPriority}
                  margin="normal"
                  style={{ marginLeft: 10, width: "10%" }}
                  onChange={this.handleItemPriorityChange}
                  onKeyPress={this.handleKeyPressed}
                  onBlur={this.saveCurrentItem}
                />
                <TextField
                  id="itemNetPriority"
                  label="Net priority"
                  value={this.state.itemNetPriority}
                  margin="normal"
                  style={{ marginLeft: 40, width: "30%" }}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </div>
            </div>
          </Card>
          {/* <Divider /> */}
          {this.showAddParentChildTags() ? this.renderAddParentTags() : <div />}
          {this.showAddParentChildTags() ? this.renderAddChildTags() : <div />}
          {this.showAddTags() ? this.renderAddTags() : <div />}
          {this.showAddEntry() ? this.renderAddEntry() : <div />}
          {this.showEntriesWithTags() ? this.renderEntriesWithTags() : <div />}
          {/*{this.showRelatedEntries()? this.renderRelatedItems(): <div />} */}
          {/* </div> */}
        </CardContent>
      </Card>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // save and close
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  saveAndClose = async () => {
    await this.saveCurrentItem();
    await this.goBack();
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // showEntriesWithTags
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  showEntriesWithTags = (): boolean => {
    return (
      this.props.mpgGraph.isCurrentCategoryView() ||
      this.props.mpgGraph.isCurrentCategoryTag()
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // showRelated Entries
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  showRelatedEntries = (): boolean => {
    return false;
    // return (this.props.mpgGraph.isCurrenTcategoryView() ||
    // this.props.mpgGraph.isCurrenTcategoryTag())
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // show add Entry
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  showAddEntry = (): boolean => {
    return (
      this.props.mpgGraph.isCurrentCategoryView() ||
      this.props.mpgGraph.isCurrentCategoryTag()
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render entries with tags
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderEntriesWithTags = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "column",
          margin: 0
        }}
      >
        <Typography
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: MpgTheme.palette.primary.contrastText
          }}
        >
          Entries with tags
        </Typography>
        <MpgItemListComp
          itemList={this.state.itemsWithTags}
          toggleSidebarVisibility={this.props.toggleSidebarVisibility}
          mpgGraph={this.props.mpgGraph}
          mpgLogger={this.props.mpgLogger}
          displayMode={this.props.displayMode}
        />
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get tags for item
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getTagsForItem = (id: string): MpgItem[] => {
    let foundTags: MpgItem[] = [];
    let item = this.props.mpgGraph.getItemById(id);
    if (item !== undefined) {
      foundTags = item.getTags();
    } else {
      this.props.mpgLogger.unexpectedError(
        "MpgItemDetails: getTagsForItem: undefined item for id:" + id
      );
    }
    return foundTags;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render action area
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderActionIcons = () => {
    let saveIconColor = this.state.itemDataChanged
      ? MpgTheme.palette.primary.contrastText
      : MpgTheme.palette.primary.light;
    return (
      <div
        style={{
          height: 25,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          margin: 0,
          backgroundColor: MpgTheme.palette.primary.main
        }}
      >
        <Icon
          onClick={this.goBack}
          style={{
            margin: 5,
            color: MpgTheme.palette.primary.contrastText,
            fontSize: 18
          }}
        >
          view_headline
        </Icon>
        {/* <Icon
          onClick={this.handleDeleteCurrentItem}
          style={{ margin: 5, color: "white", fontSize: 18 }}
        >
          delete
        </Icon> */}
        <Icon
          onClick={this.saveCurrentItem}
          style={{ margin: 5, color: saveIconColor, fontSize: 18 }}
        >
          save
        </Icon>
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // handle save
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleSave = async () => {
    await this.saveCurrentItem();
    // await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.List)
    // this.props.history.goBack();
    this.goBack();
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // handle cancel
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // handleCancel = async () => {
  //   await this.saveItem()
  //   this.props.history.goBack()
  // }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render add entry
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderAddEntry = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start"
        }}
      >
        <Typography
          color="textPrimary"
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: MpgTheme.palette.primary.contrastText
          }}
        >
          search for or create entries
        </Typography>
        <Card>
          <TextField
            id="action"
            label="Search or add item"
            value={this.state.entrySearchText}
            margin="normal"
            style={{ marginLeft: 10, width: "100%" }}
            onChange={this.handleEntrySearchTextChange}
            autoComplete="off"
          />
          {this.state.entryListVisible ? (
            <List>
              {this.state.matchedEntries.map(action => (
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
                key={this.addNewEntryId}
                button
                onClick={event =>
                  this.handleItemClicked(event, this.addNewEntryId)
                }
              >
                <ListItemText
                  primary={"Add new item: " + this.state.entrySearchText}
                />
              </ListItem>
            </List>
          ) : (
            <div />
          )}
        </Card>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render Add tags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderAddTags = () => {
    return (
      <div>
        <Typography
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: MpgTheme.palette.primary.contrastText
          }}
          align="center"
        >
          Tags
        </Typography>
        <Card>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start"
            }}
          >
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
                    onClick={event => this.handleAddNewTag(event, tag.getId())}
                  >
                    <ListItemText primary={tag.getName()} />
                  </ListItem>
                ))}
                <Divider />
                <ListItem
                  key={this.addNewTagId}
                  button
                  onClick={event =>
                    this.handleAddNewTag(event, this.addNewTagId)
                  }
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
              {this.state.existingTags.map(tag => (
                <Chip
                  key={tag.getId()}
                  label={tag.getName()}
                  color="primary"
                  onDelete={event => this.handleTagDelete(event, tag.getId())}
                  onClick={event => this.handleTagUpdate(event, tag.getId())}
                  variant="outlined"
                  style={{ margin: "5px" }}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render Add Parent tags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderAddParentTags = () => {
    return (
      <div>
        <Typography
          color="textPrimary"
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: MpgTheme.palette.primary.contrastText
          }}
        >
          search for or create parent tags
        </Typography>
        <Card>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start"
            }}
          >
            <Typography variant="body1" color="textPrimary">
              {/* {this.getTagFullName(this.state.currentItemId)} */}
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
                    onClick={event =>
                      this.handleAddParentTag(event, tag.getId())
                    }
                  >
                    <ListItemText primary={tag.getName()} />
                  </ListItem>
                ))}
                <Divider />
                <ListItem
                  key={this.addNewTagId}
                  button
                  onClick={event =>
                    this.handleAddParentTag(event, this.addNewTagId)
                  }
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
              {this.state.existingParentTags.map(tag => (
                <Chip
                  key={tag.getId()}
                  label={tag.getName()}
                  color="primary"
                  onDelete={event =>
                    this.handleParentTagDelete(event, tag.getId())
                  }
                  onClick={event => this.handleTagUpdate(event, tag.getId())}
                  variant="outlined"
                  style={{ margin: "5px" }}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render Add Child tags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderAddChildTags = () => {
    return (
      <div>
        <Typography
          color="textPrimary"
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: MpgTheme.palette.primary.contrastText
          }}
        >
          Search for or create child tags
        </Typography>
        <Card>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start"
            }}
          >
            <Typography variant="body1" color="textPrimary">
              {/* {this.getTagFullName(this.state.currentItemId)} */}
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
                    onClick={event =>
                      this.handleAddChildTag(event, tag.getId())
                    }
                  >
                    <ListItemText primary={tag.getName()} />
                  </ListItem>
                ))}
                <Divider />
                <ListItem
                  key={this.addNewTagId}
                  button
                  onClick={event =>
                    this.handleAddChildTag(event, this.addNewTagId)
                  }
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
              {this.state.existingChildTags.map(tag => (
                <Chip
                  key={tag.getId()}
                  label={tag.getName()}
                  color="primary"
                  onDelete={event =>
                    this.handleChildTagDelete(event, tag.getId())
                  }
                  onClick={event => this.handleTagUpdate(event, tag.getId())}
                  variant="outlined"
                  style={{ margin: "5px" }}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get tag full name
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getTagFullName = (id: string, existingName = ""): string => {
    let tagFullName = existingName;
    let tag: MpgItem | undefined;
    if (id !== "") {
      tag = this.props.mpgGraph.getTagById(id);
      if (tag !== undefined) {
        // this.props.mpgLogger.debug('MpgItemDetails: getTagFullName: tag:',tag.getName())
        for (let parent of tag.getParents()) {
          tagFullName =
            this.getTagFullName(parent.getId(), tagFullName) +
            " > " +
            tagFullName;
          // this.props.mpgLogger.debug('MpgItemDetails: getTagFullName: fullname:',tagFullName)
        }
        tagFullName += tag.getName() + "\n";
      } else {
        this.props.mpgLogger.unexpectedError(
          "MpgItemDetails: getTagFullName: tag is undefined, id: " + id
        );
      }
    }
    return tagFullName;
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
        {this.state.selectedEntries.map(item => (
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
                        this.handleItemWithTagsUpdate(event, item.getId())
                      }
                    >
                      edit
                    </Icon>
                    <Icon
                      style={{ fontSize: "20px" }}
                      onClick={event =>
                        this.handleDeleteRelatedItem(event, item.getId())
                      }
                    >
                      delete
                    </Icon>
                    <Icon
                      style={{ fontSize: "20px" }}
                      onClick={event =>
                        this.handleRemoveRelatedItem(event, item.getId())
                      }
                    >
                      remove
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
    if (this.showAddTags()) {
      currentTags = this.state.existingTags;
    } else {
      const currentTag = this.props.mpgGraph.getItemById(
        this.state.currentItemId
      );
      if (currentTag !== undefined) {
        currentTags.push(currentTag);
      } else {
        this.props.mpgLogger.unexpectedError(
          `MpgItemDetails: getCurrentTags: item is undefined. id: ${this.state.currentItemId}`
        );
      }
    }
    return currentTags;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle delete current item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleDeleteCurrentItem = async () => {
    try {
      this.setState({ deleteInProgress: true });
      this.props.mpgLogger.debug(
        "MpgItemDetails: handleDeleteCurrentItem: starting delete "
      );
      await this.props.mpgGraph.deleteItemById(this.state.currentItemId);
      this.props.mpgLogger.debug(
        "MpgItemDetails: handleDeleteCurrentItem: item deleted. going back "
      );
      this.setState({ deleteInProgress: false });
      this.goBack();
    } catch (err) {
      this.props.mpgLogger.unexpectedError(
        err,
        "ItemDetails: deleteItem: error:"
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle delete related item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleDeleteRelatedItem = async (event: React.MouseEvent, id: string) => {
    try {
      await this.props.mpgGraph.deleteItemById(id);
    } catch (err) {
      this.props.mpgLogger.unexpectedError(
        err,
        "ItemDetails: handleDeleteRelatedItem: error:"
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle remove related item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleRemoveRelatedItem = async (event: React.MouseEvent, id: string) => {
    try {
      await this.props.mpgGraph.deleteItemById(id);
    } catch (err) {
      this.props.mpgLogger.unexpectedError(
        err,
        "ItemDetails: handleDeleteRelatedItem: error:"
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle update items with tags  clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemWithTagsUpdate = async (
    event: React.MouseEvent,
    itemId: string
  ) => {
    // const itemType = this.props.mpgGraph.getItemType(itemId)
    const item = this.props.mpgGraph.getItemById(itemId);
    // this.props.mpgLogger.debug('ItemList: handleItemUpdate: itemType:',itemType)
    if (item !== undefined) {
      await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Update);
      await this.props.mpgGraph.setCurrentItemId(itemId);
      await this.props.mpgGraph.setCurrentCategoryId(item.getCategoryId());
      await this.props.history.push("/ItemDetails");
      // await this.props.mpgGraph.setCreateOrUpdateMode(CreateOrUpdateModes.Update)
      // await this.props.mpgGraph.setCurrentItemId(itemId)
    } else {
      this.props.mpgLogger.unexpectedError(
        "ItemList: handleItemWithTagUpdate: undefined item"
      );
    }
    // await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Update);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle update tag
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleTagUpdate = async (event: React.MouseEvent, itemId: string) => {
    // this.props.mpgLogger.debug('MpgItemDetails: handleTagUpdate: ')
    const item = this.props.mpgGraph.getItemById(itemId);
    // this.props.mpgLogger.debug('ItemList: handleItemUpdate: itemType:',itemType)
    if (item !== undefined) {
      await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Update);
      await this.props.mpgGraph.setCurrentItemId(itemId);
      await this.props.mpgGraph.setCurrentCategoryId(item.getCategoryId());
      await this.props.history.push("/ItemDetails");
      // await this.props.mpgGraph.setCreateOrUpdateMode(CreateOrUpdateModes.Update)
      // await this.props.mpgGraph.setCurrentItemId(itemId)
    } else {
      this.props.mpgLogger.unexpectedError(
        "ItemList: handleItemWithTagUpdate: undefined item"
      );
    }
    // await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Update);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle update tag for item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleTagUpdate4Item = async (
    event: React.MouseEvent,
    item: MpgItem,
    tag: MpgItem
  ) => {
    await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Update);
    await this.props.mpgGraph.setCurrentItemId(tag.getId());
    await this.props.history.push("/ItemDetails");
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // showTags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  showAddTags = (): boolean => {
    return (
      // this.state.currentCategoryName === MpgCategoryType.View ||
      // this.state.currentCategoryName === MpgCategoryType.Entry
      this.props.mpgGraph.isCurrentCategoryView() ||
      this.props.mpgGraph.isCurrentcategoryEntry()
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // show Add Parent Tags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  showAddParentChildTags = (): boolean => {
    return this.props.mpgGraph.isCurrentCategoryTag();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // show related item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  showRelatedItems = (): boolean => {
    // const itemType = this.props.mpgGraph.getItemType(this.state.currentItemId)
    // if (itemType === MpgCategoryNames.Tag) {
    //   return true
    // } else {
    //   return false
    // }
    return (
      this.props.mpgGraph.isCurrentCategoryView() ||
      this.props.mpgGraph.isCurrentcategoryEntry()
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // show add actions
  ///////////////////////////////////////////////////////////////////////////////////////////////
  showAddActions = (): boolean => {
    return (
      this.props.mpgGraph.isCurrentCategoryView() ||
      this.props.mpgGraph.isCurrentcategoryEntry()
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle action delete
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleActionDelete = async (event: any, id: string) => {
    // this.props.mpgLogger.debug(`MpgItemDetails: handleTagDelete: tagId:`,id,` allTags:`,this.props.mpgGraph.getAllTagsSorted())
    const action = this.props.mpgGraph.getActionById(id);
    if (action !== undefined) {
      const newActions = this.state.selectedEntries.filter(
        item => item.getId() !== id
      );
      // this.props.mpgLogger.debug(`MpgItemDetails: handleTagDelete: newTags:`,newTags)
      await this.setState({
        selectedEntries: newActions,
        entrySearchText: "",
        entryListVisible: false
      });
    } else {
      this.props.mpgLogger.unexpectedError(
        `MpgActionDetails: handleActionDelete: action was not found. id:${id}`
      );
    }
    await this.saveCurrentItem();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle item clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemClicked = async (event: any, id: string) => {
    if (id === this.addNewEntryId) {
      this.setState({ itemDataChanged: true });
      // await this.saveItem()
      const newEntry = this.props.mpgGraph.createEntryInstance(
        this.state.entrySearchText
      );
      if (newEntry !== undefined) {
        // save the action
        await this.props.mpgGraph.saveItem(newEntry);
        await this.props.mpgGraph.addTagsToItem(
          newEntry,
          this.getCurrentTags()
        );
        const newActions = this.state.selectedEntries;
        newActions.push(newEntry);
        await this.setState({ entryListVisible: false, entrySearchText: "" });
      } else {
        this.props.mpgLogger.unexpectedError(
          `MogItemDetails: handleActionClicked: cannot create new action. actionCategorrId was not found`
        );
      }
    } else {
      const action = this.props.mpgGraph.getActionById(id);
      if (action !== undefined) {
        // add tags to the action
        await this.props.mpgGraph.addTagsToItem(action, this.getCurrentTags());
        const newActions = this.state.selectedEntries;
        newActions.push(action);
        await this.setState({
          entryListVisible: false,
          entrySearchText: ""
        });
      } else {
        this.props.mpgLogger.unexpectedError(
          `MpgItemDetails: handleActionClicked: action was not found. id:${id}`
        );
      }
    }
    // hopefully this is the right place to save the item
    // this.props.mpgLogger.debug(`handleActionClicked`, ` selected tags:`, this.state.selectedTags)
    await this.saveCurrentItem();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle action search text change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleEntrySearchTextChange = async (event: React.ChangeEvent) => {
    const actionSearchText = (event.target as HTMLInputElement).value;
    // this.props.mpgLogger.debug("ItemDetails: handleTagSearchTextChange: searchText:",tagSearchText)
    if (actionSearchText.length > 0) {
      await this.setState({
        entrySearchText: actionSearchText,
        entryListVisible: true
      });
      await this.setMatchedIEntries();
    } else {
      await this.setState({
        entrySearchText: actionSearchText,
        entryListVisible: false
      });
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // set matched entries
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setMatchedIEntries = async () => {
    let foundActions: MpgItem[] = [];
    const searchText = this.state.entrySearchText.trim().toLowerCase();
    // this.props.mpgLogger.debug("ActionDetails: setMatchedGoals: searchText:",searchText," allGoals:",
    // this.state.allGoals)
    if (searchText.length > 0) {
      let actionsToBeSearched: MpgItem[] = this.state.allEntries;
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
    await this.setState({ matchedEntries: foundActions });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle tag delete
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleTagDelete = async (event: any, id: string) => {
    // this.props.mpgLogger.debug(`MpgItemDetails: handleTagDelete: tagId:`,id,` allTags:`,this.props.mpgGraph.getAllTagsSorted())
    this.setState({ itemDataChanged: true });
    const tag = this.props.mpgGraph.getTagById(id);
    if (tag !== undefined) {
      const newTags = this.state.existingTags.filter(
        item => item.getId() !== id
      );
      // this.props.mpgLogger.debug(`MpgItemDetails: handleTagDelete: newTags:`,newTags)
      await this.setState({
        existingTags: newTags,
        tagSearchText: "",
        tagListVisible: false
      });
      await this.setState({
        itemsWithTags: this.getEntriesWithAllTags(),
        itemDataChanged: true
      });
    } else {
      this.props.mpgLogger.unexpectedError(
        `MogItemDetails: handleTagDelete: tag was not found. id:${id}`
      );
    }
    await this.saveCurrentItem();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle tag delete for item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleTagDelete4Item = async (event: any, item: MpgItem, tag: MpgItem) => {
    this.setState({ itemDataChanged: true });
    let tags = item.getTags();
    tags = tags.filter(aTag => aTag.getId() !== tag.getId());
    await this.props.mpgGraph.updateItemDetails(
      item.getId(),
      item.getCategoryId(),
      item.getName(),
      item.getPriority(),
      tags
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle parent tag delete
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleParentTagDelete = async (event: any, id: string) => {
    // this.props.mpgLogger.debug(`MpgItemDetails: handleTagDelete: tagId:`,id,` allTags:`,this.props.mpgGraph.getAllTagsSorted())
    this.setState({ itemDataChanged: true });
    const tag = this.props.mpgGraph.getTagById(id);
    if (tag !== undefined) {
      const newTags = this.state.existingParentTags;
      // this.props.mpgLogger.debug(
      //   `MpgItemDetails: handleTagDelete: newTags:`,
      //   newTags
      // );
      const index = newTags.findIndex(item => item.getId() === id);
      newTags.splice(index, 1);
      // this.props.mpgLogger.debug(
      //   `MpgItemDetails: handleTagDelete: newTags:`,
      //   newTags
      // );
      await this.setState({
        existingParentTags: newTags,
        tagSearchText: "",
        tagListVisible: false
      });
      await this.setState({
        itemDataChanged: true
      });
    } else {
      this.props.mpgLogger.unexpectedError(
        `MogItemDetails: handleTagDelete: tag was not found. id:${id}`
      );
    }
    await this.saveCurrentItem();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle child tag delete
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleChildTagDelete = async (event: any, id: string) => {
    // this.props.mpgLogger.debug(`MpgItemDetails: handleTagDelete: tagId:`,id,` allTags:`,this.props.mpgGraph.getAllTagsSorted())
    this.setState({ itemDataChanged: true });
    const tag = this.props.mpgGraph.getTagById(id);
    if (tag !== undefined) {
      const newTags = this.state.existingChildTags;
      // this.props.mpgLogger.debug(
      //   `MpgItemDetails: handleTagDelete: newTags:`,
      //   newTags
      // );
      const index = newTags.findIndex(item => item.getId() === id);
      newTags.splice(index, 1);
      // this.props.mpgLogger.debug(
      //   `MpgItemDetails: handleTagDelete: newTags:`,
      //   newTags
      // );
      await this.setState({
        existingChildTags: newTags,
        tagSearchText: "",
        tagListVisible: false
      });
      await this.setState({
        itemDataChanged: true
      });
    } else {
      this.props.mpgLogger.unexpectedError(
        `MogItemDetails: handleTagDelete: tag was not found. id:${id}`
      );
    }
    await this.saveCurrentItem();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // getEntriesWithTags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getEntriesWithAllTags = (): MpgItem[] => {
    return this.props.mpgGraph.getEntriesWithAllTagsNoCurrent(
      this.getCurrentTags()
    );
    // if (this.props.mpgGraph.isCurrentCategoryView()) {
    //   foundEntries = this.props.mpgGraph.getEntriesWithAllTag(
    //     this.getCurrentTags()
    //   );
    // } else {
    //   if (this.props.mpgGraph.isCurrentCategoryTag()) {
    //     const currentTags: MpgItem[] = [];
    //     const currentTag = this.props.mpgGraph.getTagById(
    //       this.state.currentItemId
    //     );
    //     // this.props.mpgLogger.debug('MpgItemDetals: getEntriesWithAllTags:',
    //     // 'current tag:',currentTag)
    //     if (currentTag !== undefined) {
    //       currentTags.push(currentTag);
    //       foundEntries = this.props.mpgGraph.getEntriesWithAllTag(
    //         this.getCurrentTags()
    //       );
    //       // this.props.mpgLogger.debug('MpgItemDetals: getEntriesWithAllTags: currentTags',currentTags,
    //       //   'current tag:',currentTag)
    //       // console.log('MpgItemDetals: getEntriesWithAllTags: currentTags',currentTags,
    //       // 'current tag:',currentTag)
    //       // foundEntries = this.props.mpgGraph.getEntriesWithAllTagsOrChildren(currentTags);
    //     } else {
    //       this.props.mpgLogger.unexpectedError(
    //         "MpgItemDetails: getEntriesWithAllTags:",
    //         " current tag is undefeined"
    //       );
    //     }
    //   }
    // }
    // sort entries
    // we should delegeste this to Graph
    // foundEntries = foundEntries.sort((item1, item2) => {
    //   return item2.getNetPriority() - item1.getNetPriority();
    // });
    // return foundEntries;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle tag clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handleTagClicked = async (event: any, id: string) => {
  //   this.showAddParentTags?
  //     this.handleAddParentTag(event, id)
  //     :
  //     this.handleAddNewTag(event, id)
  // await this.setState({ itemDataChanged: true });
  // if (id === this.addNewTagId) {
  //   const newTag = this.props.mpgGraph.createTagInstance(
  //     this.state.tagSearchText
  //   );
  //   if (newTag !== undefined) {
  //     // save the tag
  //     this.props.mpgGraph.saveTag(newTag);
  //     const newTags = this.state.existingTags;
  //     newTags.push(newTag);
  //     await this.setState({
  //       existingTags: newTags,
  //       tagListVisible: false,
  //       tagSearchText: "",
  //       itemDataChanged: true
  //     });
  //     await this.setState({ itemsWithTags: this.getEntriesWithAllTags() });
  //   } else {
  //     this.props.mpgLogger.unexpectedError(
  //       `MogItemDetails: handleTagClicked: cannot create new tag. TagCategorrId was not found`
  //     );
  //   }
  // } else {
  //   const tag = this.props.mpgGraph.getTagById(id);
  //   if (tag !== undefined) {
  //     const newTags = this.state.existingTags;
  //     newTags.push(tag);
  //     await this.setState({
  //       existingTags: newTags,
  //       tagListVisible: false,
  //       tagSearchText: "",
  //       itemDataChanged: true
  //     });
  //     await this.setState({ itemsWithTags: this.getEntriesWithAllTags() });
  //   } else {
  //     this.props.mpgLogger.unexpectedError(
  //       `MogItemDetails: handleTagClicked: tag was not found. id:${id}`
  //     );
  //   }
  // }
  // // this.props.mpgLogger.debug(
  // //   `MpgItemDetails: handleTagClicked (exiting)`,
  // //   ` state:`,
  // //   this.state
  // // );
  // await this.saveItem();
  // }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle add new tag
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleAddNewTag = async (event: any, id: string) => {
    await this.setState({ itemDataChanged: true });
    if (id === this.addNewTagId) {
      const newTag = this.props.mpgGraph.createTagInstance(
        this.state.tagSearchText
      );
      if (newTag !== undefined) {
        // save the tag
        this.props.mpgGraph.saveTag(newTag);
        const newTags = this.state.existingTags;
        newTags.push(newTag);
        await this.setState({
          existingTags: newTags,
          tagListVisible: false,
          tagSearchText: "",
          itemDataChanged: true
        });
        await this.setState({ itemsWithTags: this.getEntriesWithAllTags() });
      } else {
        this.props.mpgLogger.unexpectedError(
          `MogItemDetails: handleTagClicked: cannot create new tag. TagCategorrId was not found`
        );
      }
    } else {
      const tag = this.props.mpgGraph.getTagById(id);
      if (tag !== undefined) {
        const newTags = this.state.existingTags;
        newTags.push(tag);
        await this.setState({
          existingTags: newTags,
          tagListVisible: false,
          tagSearchText: "",
          itemDataChanged: true
        });
        await this.setState({ itemsWithTags: this.getEntriesWithAllTags() });
      } else {
        this.props.mpgLogger.unexpectedError(
          `MogItemDetails: handleTagClicked: tag was not found. id:${id}`
        );
      }
    }
    // this.props.mpgLogger.debug(
    //   `MpgItemDetails: handleTagClicked (exiting)`,
    //   ` state:`,
    //   this.state
    // );
    await this.saveCurrentItem();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle parent tag
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleAddParentTag = async (event: any, id: string) => {
    // this.props.mpgLogger.debug(
    //   `MpgItemDetails: handleTagClicked: state:`,
    //   this.state
    // );
    await this.setState({ itemDataChanged: true });
    if (id === this.addNewTagId) {
      const newTag = this.props.mpgGraph.createTagInstance(
        this.state.tagSearchText
      );
      if (newTag !== undefined) {
        // save the tag
        this.props.mpgGraph.saveTag(newTag);
        // adding a newly created parent is always safe
        const newTags = this.state.existingParentTags;
        newTags.push(newTag);
        await this.setState({
          existingParentTags: newTags,
          tagListVisible: false,
          tagSearchText: "",
          itemDataChanged: true
        });
        await this.saveCurrentItem();
        // await this.setState({ itemsWithTags: this.getEntriesWithAllTags() });
      } else {
        this.props.mpgLogger.unexpectedError(
          `MogItemDetails: handleTagClicked: cannot create new tag. TagCategorrId was not found`
        );
      }
    } else {
      const tag = this.props.mpgGraph.getTagById(id);
      if (tag !== undefined) {
        if (
          this.props.mpgGraph.isAddingItemSafe(this.state.currentItemId, tag)
        ) {
          const newTags = this.state.existingParentTags;
          newTags.push(tag);
          await this.setState({
            existingParentTags: newTags,
            tagListVisible: false,
            tagSearchText: "",
            itemDataChanged: true
          });
          await this.saveCurrentItem();
        } else {
          this.props.showMessage(
            "Cannot add parent. It is already in ancestors or decsendants"
          );
        }
        // await this.setState({ itemsWithTags: this.getEntriesWithAllTags() });
      } else {
        this.props.mpgLogger.unexpectedError(
          `MogItemDetails: handleTagClicked: tag was not found. id:${id}`
        );
      }
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle child tag
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleAddChildTag = async (event: any, id: string) => {
    // this.props.mpgLogger.debug(
    //   `MpgItemDetails: handleTagClicked: state:`,
    //   this.state
    // );
    await this.setState({ itemDataChanged: true });
    if (id === this.addNewTagId) {
      const newTag = this.props.mpgGraph.createTagInstance(
        this.state.tagSearchText
      );
      if (newTag !== undefined) {
        // save the tag
        this.props.mpgGraph.saveTag(newTag);
        // adding a newly created tag is always safe
        // so we don't need to check safety
        const newTags = this.state.existingChildTags;
        newTags.push(newTag);
        await this.setState({
          existingChildTags: newTags,
          tagListVisible: false,
          tagSearchText: "",
          itemDataChanged: true
        });
        await this.saveCurrentItem();
      } else {
        this.props.mpgLogger.unexpectedError(
          `MogItemDetails: handleAddChildTag: cannot create new tag. TagCategorrId was not found`
        );
      }
    } else {
      const tag = this.props.mpgGraph.getTagById(id);
      if (tag !== undefined) {
        if (
          this.props.mpgGraph.isAddingItemSafe(this.state.currentItemId, tag)
        ) {
          const newTags = this.state.existingChildTags;
          newTags.push(tag);
          await this.setState({
            existingChildTags: newTags,
            tagListVisible: false,
            tagSearchText: "",
            itemDataChanged: true
          });
          await this.saveCurrentItem();
        } else {
          this.props.showMessage(
            "Cannot add parent. It is already in ancestors or decsendants"
          );
        }
        // await this.setState({ itemsWithTags: this.getEntriesWithAllTags() });
      } else {
        this.props.mpgLogger.unexpectedError(
          `MogItemDetails: handleTagClicked: tag was not found. id:${id}`
        );
      }
    }
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
  handleCancel = async () => {
    // await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.List);
    this.goBack();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle item priority change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemPriorityChange = (event: React.ChangeEvent) => {
    const itemPriroty = parseInt((event.target as HTMLInputElement).value);
    if (itemPriroty > 0) {
      this.setState({ itemPriority: itemPriroty });
    } else {
      this.setState({ itemPriority: 0 });
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
    // this.props.mpgLogger.debug(
    //   "ItemDetails: setMatchedTags: searchText:",
    //   searchText,
    //   " all tags:",
    //   this.state.allTags
    // );
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
  // setCurrentCategoryName = () => {
  //   let currentCategoryName = "???";
  //   const currentCategory = this.props.mpgGraph.getCategoryById(
  //     this.state.currentCategoryId
  //   );
  //   if (currentCategory !== undefined) {
  //     currentCategoryName = currentCategory.getName();
  //   }
  //   this.setState({ currentCategoryName: currentCategoryName });
  // };
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
  // componentWillReceiveProps = async (newProps: IItemDetailsProps) => {
  //   this.props.mpgLogger.debug(
  //     "ItemDetails: componentWillReceiveProps: newProps:",
  //     newProps
  //   );
  //   this.props.mpgLogger.debug(
  //     "ItemDetails: componentWillReceiveProps: state:",
  //     this.state
  //   );
  //   if (!this.state.deleteInProgress) {
  //     if (newProps.displayMode === MpgDisplayMode.Update) {
  //       const item = this.props.mpgGraph.getItemById(newProps.currentItemId);
  //       if (item !== undefined) {
  //         const tags = item.getTags();
  //         // this.props.mpgLogger.debug(
  //         //   "ItemDetails: componentWillReceiveProps: tags:",
  //         //   tags
  //         // );
  //         await this.setState({
  //           displayMode: newProps.displayMode,
  //           screenTitle: "Update " + this.props.mpgGraph.getCyrrentCateoryName(),
  //           itemName: item.getName(),
  //           itemImportance: item.getImportance(),
  //           selectedTags: tags,
  //           currentCategoryId: newProps.currentCategoryId,
  //           currentItemId: newProps.currentItemId,
  //           allTags: newProps.allTags,
  //           allEntries: newProps.allEntries,
  //           selectedEntries: item.getEntries(),
  //           itemsWithTags: this.getEntriesWithAllTags()
  //         });
  //       } else {
  //         this.props.mpgLogger.unexpectedError(
  //           `ItemDetails: componentWillreceiveProps: currentItem is undefined`
  //         );
  //       }
  //     } else {
  //       const title = "New " + this.props.mpgGraph.getCyrrentCateoryName();
  //       await this.setState({
  //         screenTitle: title,
  //         itemName: "",
  //         itemImportance: 0,
  //         selectedTags: [],
  //         allTags: newProps.allTags,
  //         allEntries: newProps.allEntries,
  //         selectedEntries: [],
  //         itemsWithTags: this.getEntriesWithAllTags()
  //       });
  //     }
  //   }
  // };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component will receive props
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillReceiveProps = async (newProps: IItemDetailsProps) => {
    // this.props.mpgLogger.debug("ItemList: componentWillReceiveProps: newProps:",newProps)
    await this.setState({
      currentCategoryId: newProps.currentCategoryId,
      displayMode: newProps.displayMode,
      currentItemId: newProps.currentItemId,
      allTags: newProps.allTags,
      allEntries: newProps.allEntries,
      cardWidth: newProps.cardWidth
    });
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
    let existingParentTags: MpgItem[] = [];
    let existingChildTags: MpgItem[] = [];
    if (this.state.displayMode === MpgDisplayMode.Update) {
      const item = this.props.mpgGraph.getItemById(this.state.currentItemId);
      if (item !== undefined) {
        await this.setState({
          existingTags: item.getTags()
        });
        let entriesWithTags: MpgItem[] = [];
        entriesWithTags = this.getEntriesWithAllTags();
        // this.props.mpgLogger.debug(`MpgItemDetails: setCreateOrUpdateMode: relatedItems:`, relatedItems)
        // this.props.mpgLogger.debug(`MpgItemDetails: setCreateOrUpdateMode: item's tags: ${item.getTags()}`)
        // load tags
        if (this.props.mpgGraph.isCurrentCategoryTag) {
          existingParentTags = item.getParents();
          existingChildTags = item.getChildren();
        }
        await this.setState({
          displayMode: MpgDisplayMode.Update,
          itemName: item.getName(),
          itemPriority: item.getPriority(),
          itemNetPriority: item.getNetPriority(),
          existingTags: item.getTags(),
          selectedEntries: item.getEntries(),
          itemsWithTags: entriesWithTags,
          showRelatedItems: this.showRelatedItems(),
          screenTitle: "Update " + this.props.mpgGraph.getCurrentCateoryName(),
          existingParentTags: existingParentTags,
          existingChildTags: existingChildTags
        });
      } else {
        this.props.mpgLogger.unexpectedError(
          `ItemDetails: setCreateOrUpdate: currentItem is undefined`
        );
      }
    } else {
      // this.setState({ displayMode: MpgDisplayMode.Create, itemName: 'name', itemImportance: 0, })
      await this.setState({
        displayMode: MpgDisplayMode.Create,
        itemName: "",
        itemPriority: 0,
        itemNetPriority: 0,
        existingTags: [],
        selectedEntries: [],
        itemsWithTags: [],
        showRelatedItems: this.showRelatedItems(),
        screenTitle: "New " + this.props.mpgGraph.getCurrentCateoryName(),
        existingParentTags: [],
        existingChildTags: []
      });
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // set View, create or update mode
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // setViewCreateUpdateMode = async () => {
  //   // await this.setState({
  //   //   selectedTags: [],
  //   //   itemsWithTags: [],
  //   // })
  //   // this.props.mpgLogger.debug(`MpgItemDetails: setCreateOrUpdateMode: state:`,this.state)
  //   if (this.state.displayMode === MpgDisplayMode.Update) {
  //     const item = this.props.mpgGraph.getItemById(this.state.currentItemId);
  //     if (item !== undefined) {
  //       await this.setState({
  //         selectedTags: item.getTags()
  //       });
  //       let relatedItems: MpgItem[] = [];
  //       relatedItems = this.getItemsWithATags();
  //       // this.props.mpgLogger.debug(`MpgItemDetails: setCreateOrUpdateMode: relatedItems:`, relatedItems)
  //       // this.setCurrentCategoryName();
  //       // this.props.mpgLogger.debug(`MpgItemDetails: setCreateOrUpdateMode: item's tags: ${item.getTags()}`)
  //       // load tags
  //       await this.setState({
  //         screenTitle: item.getName(),
  //         itemName: item.getName(),
  //         itemImportance: item.getImportance(),
  //         selectedTags: item.getTags(),
  //         selectedGoals: item.getGoals(),
  //         selectedActions: item.getActions(),
  //         itemsWithTags: relatedItems,
  //         showRelatedItems: this.showRelatedItems()
  //       });
  //       // await this.nameInput.focus();
  //     } else {
  //       this.props.mpgLogger.unexpectedError(
  //         `ItemDetails: setCreateOrUpdate: currentItem is undefined`
  //       );
  //     }
  //   } else {
  //     if (this.state.displayMode === MpgDisplayMode.View) {
  //       const item = this.props.mpgGraph.getItemById(this.state.currentItemId);
  //       if (item !== undefined) {
  //         await this.setState({
  //           selectedTags: item.getTags()
  //         });
  //         let relatedItems: MpgItem[] = [];
  //         relatedItems = this.getItemsWithATags();
  //         // this.props.mpgLogger.debug(`MpgItemDetails: setCreateOrUpdateMode: relatedItems:`, relatedItems)
  //         // this.setCurrentCategoryName();
  //         // this.props.mpgLogger.debug(`MpgItemDetails: setCreateOrUpdateMode: item's tags: ${item.getTags()}`)
  //         // load tags
  //         await this.setState({
  //           screenTitle: item.getName(),
  //           itemName: item.getName(),
  //           itemImportance: item.getImportance(),
  //           selectedTags: item.getTags(),
  //           selectedGoals: item.getGoals(),
  //           selectedActions: item.getActions(),
  //           itemsWithTags: relatedItems,
  //           showRelatedItems: this.showRelatedItems()
  //         });
  //       } else {
  //         this.props.mpgLogger.unexpectedError(
  //           `ItemDetails: setCreateOrUpdate: currentItem is undefined`
  //         );
  //       }
  //     } else {
  //       // this.setCurrentCategoryName();
  //       // const title = "New " + this.state.currentCategoryName;
  //       await this.setState({
  //         screenTitle: title,
  //         itemName: "",
  //         itemImportance: 0
  //       });
  //       // await this.nameInput.focus();
  //     }
  //   }
  //   // this.props.mpgLogger.debug(`MpgItemDetails: setCreateOrUpdateMode: state and end of call:`,this.state)
  // };
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
      await this.saveCurrentItem();
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
  // handleSave = async () => {
  //   try {
  //     await this.saveItem();
  //     if (!this.props.desktop) {
  //       this.props.history.goBack();
  //     }
  //     this.props.mpgGraph.setCurrentCategoryId(this.state.currentCategoryId);
  //   } catch (error) {
  //     this.props.mpgLogger.unexpectedError(
  //       "MpgItemDetails: handleSave.",
  //       error
  //     );
  //   }
  // };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // switch to update
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  switchToUpdate = () => {
    this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Update);
    this.setState({ displayMode: MpgDisplayMode.Update });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // save item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  saveCurrentItem = async () => {
    try {
      // this.props.showMessage("Saving data ...");
      if (this.state.itemDataChanged) {
        // this.props.mpgLogger.debug(
        //   `MpgItemDetails: SaveItem`,
        //   ` state:`,
        //   this.state
        // );
        if (this.state.displayMode === MpgDisplayMode.Create) {
          await this.props.mpgGraph.createItem(
            this.state.currentCategoryId,
            this.state.itemName,
            this.state.itemPriority,
            this.state.existingTags,
            this.state.existingParentTags,
            this.state.existingChildTags,
            this.state.selectedEntries
          );
          // const currentItemId = this.props.mpgGraph.getCurrentItemId();
          await this.setState({
            // displayMode: MpgDisplayMode.Update,
            // currentItemId: currentItemId,
            itemDataChanged: false
          });
          // this.props.mpgLogger.debug(
          //   `ItemDetails: Saving item`,
          //   ` current item id:`,
          //   this.state.currentItemId
          // );
          // await this.setViewCreateUpdateMode();
          // this.props.mpgLogger.debug(`MpgItemDetails: Saving item`, ` state after crreating item:`, this.state)
        } else {
          // this.props.mpgLogger.debug(
          //   "ItemDetails: handleSave: item name:",
          //   this.state.itemName
          // );
          await this.props.mpgGraph.updateItemDetails(
            this.state.currentItemId,
            this.state.currentCategoryId,
            this.state.itemName,
            this.state.itemPriority,
            this.state.existingTags,
            this.state.existingParentTags,
            this.state.existingChildTags,
            this.state.selectedEntries
          );
          await this.setState({
            itemDataChanged: false
          });
        }
        this.props.showMessage("Data has been saved on the cloud");
      }
    } catch (error) {
      this.props.mpgLogger.unexpectedError(
        "MpgItemDetails: handleSave.",
        error
      );
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // component did mount
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  componentDidMount = () => {
    // we still having problem with this code to focus on the input field
    // it's probably because the field is not created in all cases
    // if (
    //   this.state.displayMode === MpgDisplayMode.Create ||
    //   this.state.displayMode === MpgDisplayMode.Update
    // ) {
    //   this.nameInput.focus();
    // }
    this.setCreateOrUpdateMode();
    const appLocation: AppLocation = {
      page: AppPage.Details,
      itemId: this.state.currentItemId
    };
    this.props.addPage2Histor(appLocation);
  };
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgItemDetails = withRouter(MpgItemDetailsBase);
export default MpgItemDetails;
