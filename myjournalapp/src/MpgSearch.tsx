////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgSearch component module
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import MpgAppBar from "./MpgAppBar";
import {
  Card,
  Typography,
  TextField,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Chip
} from "@material-ui/core";
import MpgGraph, { MpgDisplayMode } from "./MpgGraph";
import MpgLogger from "./MpgLogger";
import MpgItem from "./MpgItem";
import MpgTheme from "./MpgTheme";
import MpgItemListComp from "./MpgItemListComp";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// define enum for search item type
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
enum SearchItemType {
  Entries = "Entries",
  Tags = "Tags",
  Views = "Views"
}
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface ISearchProps extends RouteComponentProps {
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  showMessage: Function;
  userSignedIn: boolean;
  mpgGraph: MpgGraph;
  mpgLogger: MpgLogger;
  allTags: MpgItem[];
  allEntries: MpgItem[];
  windowWidth: number;
  goToNewEntry: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  allViews: MpgItem[];
}
interface ISearchState {
  tagSearchText: string;
  tagListVisible: boolean;
  entryListVisible: boolean;
  matchedTags: MpgItem[];
  existingTags: MpgItem[];
  deleteInProgress: boolean;
  windowWidth: number;
  nameSearchText: string;
  searchItemType: SearchItemType;
  itemsToSearch: MpgItem[];
  allTags: MpgItem[];
  allEntries: MpgItem[];
  allViews: MpgItem[];
  matchedItems: MpgItem[];
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgSearch class
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class MpgSearchBase extends React.Component<ISearchProps, ISearchState> {
  private itemsWithText: MpgItem[] = [];
  private itemsWithTags: MpgItem[] = [];
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // constructor
  ///////////////////////////////////////////////////////////////////////////////////////////////
  constructor(props: ISearchProps) {
    super(props);
    this.state = {
      tagSearchText: "",
      tagListVisible: false,
      matchedTags: [],
      existingTags: [],
      entryListVisible: false,
      deleteInProgress: false,
      windowWidth: props.windowWidth,
      nameSearchText: "",
      searchItemType: SearchItemType.Entries,
      itemsToSearch: this.props.allEntries,
      allEntries: this.props.allEntries,
      allTags: this.props.allTags,
      allViews: this.props.allViews,
      matchedItems: []
    };
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  render = () => {
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
          {this.renderSearchPanel()}
        </div>
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render search panel
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderSearchPanel = () => {
    const cardWidth = window.innerWidth > 500 ? 500 : window.innerWidth;
    return (
      <Card
        elevation={1}
        style={{
          maxWidth: cardWidth,
          minWidth: cardWidth,
          margin: 10,
          backgroundColor: MpgTheme.palette.primary.light
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignContent: "center"
          }}
        >
          <Select
            value={this.state.searchItemType}
            onChange={this.handleSearchItemTypeChange}
            inputProps={{
              name: "Search for",
              id: "searchIemType"
            }}
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: MpgTheme.palette.primary.contrastText
            }}
          >
            <MenuItem value={"Entries"}>Search for Entries</MenuItem>
            <MenuItem value={"Tags"}>Search for Tags</MenuItem>
            <MenuItem value={"Views"}>Serach for Views</MenuItem>
          </Select>
        </div>
        {this.renderSearchParams()}
        {this.state.entryListVisible ? this.renderEntryList() : <div />}
      </Card>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // handle search item type change
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleSearchItemTypeChange = async (event: any) => {
    await this.setState({ searchItemType: event.target.value });
    await this.setItems2Search();
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // handle search item type change
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setItems2Search = async () => {
    if (this.state.searchItemType === SearchItemType.Entries) {
      this.setState({ itemsToSearch: this.props.allEntries });
    } else {
      if (this.state.searchItemType === SearchItemType.Tags) {
        this.setState({ itemsToSearch: this.props.allTags });
      } else {
        if (this.state.searchItemType === SearchItemType.Views) {
          this.setState({ itemsToSearch: this.props.allViews });
        }
      }
    }
    this.setMatchedIItemsWithText();
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render search params
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderSearchParams = () => {
    return (
      <div>
        <Card
          elevation={1}
          style={{
            margin: 5
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              margin: 5
            }}
          >
            <TextField
              id="nameSearchText"
              label="Search text"
              value={this.state.nameSearchText}
              margin="normal"
              style={{ marginLeft: 5, marginRight: 5, width: "95%" }}
              onChange={this.handleNameSearchTextChange}
              autoFocus={true}
              autoComplete="off"
            />
          </div>
          {this.renderSearch4Tags()}
          {this.state.tagListVisible ? this.renderSearchTagList() : <div />}
          {this.renderExistingTags()}
        </Card>
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render search for tags
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderSearch4Tags = () => {
    return (
      <div>
        <TextField
          id="tag"
          label="Search for tags"
          value={this.state.tagSearchText}
          margin="normal"
          style={{ marginLeft: 5, marginRight: 5, width: "95%" }}
          onChange={this.handleTagSearchTextChange}
          autoComplete="off"
        />
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render existing tags
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderExistingTags = () => {
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {this.state.existingTags.map(tag => (
          <Chip
            key={tag.getId()}
            label={tag.getName()}
            color="primary"
            onDelete={event => this.handleRemoveTag(event, tag)}
            variant="outlined"
            style={{ margin: "5px" }}
          />
        ))}
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // handle remove tag
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleRemoveTag = async (event: any, tag: MpgItem) => {
    const tags = this.state.existingTags.filter(
      aTag => aTag.getId() !== tag.getId()
    );
    await this.setState({ existingTags: tags });
    this.setMatchedItems();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // set matched tags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setMatchedITags = async () => {
    let foundTags: MpgItem[] = [];
    const searchText = this.state.tagSearchText.trim().toLowerCase();
    if (searchText.length > 0) {
      let tagsToBeSearched: MpgItem[] = this.state.allTags;
      for (let tag of tagsToBeSearched) {
        if (
          tag
            .getName()
            .toLowerCase()
            .includes(searchText)
        ) {
          foundTags.push(tag);
        }
      }
    }
    await this.setState({ matchedTags: foundTags });
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
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render search tag lisy
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderSearchTagList = () => {
    return (
      <List>
        {this.state.matchedTags.map(tag => (
          <ListItem
            key={tag.getId()}
            button
            onClick={event => this.handleAddNewTag(event, tag)}
          >
            <ListItemText primary={tag.getName()} />
          </ListItem>
        ))}
      </List>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle add new tag
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleAddNewTag = async (event: any, tag: MpgItem) => {
    const newTags = this.state.existingTags;
    newTags.push(tag);
    await this.setState({
      existingTags: newTags,
      tagListVisible: false,
      tagSearchText: ""
    });
    this.setMatchedItems();
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render entry list
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderEntryList = () => {
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
          Matched entries
        </Typography>
        {this.state.entryListVisible ? (
          <MpgItemListComp
            itemList={this.state.matchedItems}
            toggleSidebarVisibility={this.props.toggleSidebarVisibility}
            mpgGraph={this.props.mpgGraph}
            mpgLogger={this.props.mpgLogger}
            handleTagUpdate={this.handleUpdateItem}
          />
        ) : (
          <div />
        )}
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle action search text change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleNameSearchTextChange = async (event: React.ChangeEvent) => {
    const nameSearchText = (event.target as HTMLInputElement).value;
    if (nameSearchText.length > 0) {
      await this.setState({
        nameSearchText: nameSearchText,
        entryListVisible: true
      });
      await this.setMatchedItems();
    } else {
      await this.setState({
        nameSearchText: nameSearchText,
        entryListVisible: false
      });
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component will receive props
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillReceiveProps = async (newProps: ISearchProps) => {
    await this.setState({
      allEntries: newProps.allEntries,
      allTags: newProps.allTags,
      allViews: newProps.allViews
    });
    await this.setItems2Search();
    this.setMatchedItems();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle update item (any item)
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleUpdateItem = async (tag: MpgItem) => {
    await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Update);
    await this.props.mpgGraph.setCurrentCategoryId(tag.getCategoryId());
    await this.props.mpgGraph.setCurrentItemId(tag.getId());
    await this.props.history.push("/ItemDetails");
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // set matched entries by text and tags
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setMatchedItems = async () => {
    this.setItems2Search();
    let foundItems: MpgItem[] = [];
    if (this.state.existingTags.length > 0) {
      this.setMatchedItemByTags();
      if (this.state.nameSearchText.length === 0) {
        foundItems = this.itemsWithTags;
      } else {
        this.setMatchedIItemsWithText();
        this.itemsWithTags.forEach(item => {
          if (this.itemsWithText.includes(item)) {
            foundItems.push(item);
          }
        });
      }
    } else {
      if (this.state.nameSearchText.length > 0) {
        this.setMatchedIItemsWithText();
        foundItems = this.itemsWithText;
      }
    }
    this.setState({ matchedItems: foundItems, entryListVisible: true });
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // set matched items by tags
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setMatchedItemByTags = () => {
    let matchedItems: MpgItem[] = [];
    if (this.state.searchItemType === SearchItemType.Tags) {
        matchedItems = this.props.mpgGraph.getTagssWithAllTags(
            this.state.existingTags
          );
    } else {
      if (this.state.searchItemType === SearchItemType.Entries) {
        matchedItems = this.props.mpgGraph.getEntriesWithAllTags(
          this.state.existingTags
        );
      } else {
        matchedItems = this.props.mpgGraph.getViewsWithAllTags(
          this.state.existingTags
        );
      }
    }
    this.itemsWithTags = matchedItems;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // set matched items
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setMatchedIItemsWithText = async () => {
    let foundItems: MpgItem[] = [];
    const searchText = this.state.nameSearchText.trim().toLowerCase();
    if (searchText.length > 0) {
      let entriesToBeSearched: MpgItem[] = this.state.itemsToSearch;
      for (let item of entriesToBeSearched) {
        if (
          item
            .getName()
            .toLowerCase()
            .includes(searchText)
        ) {
          foundItems.push(item);
        }
      }
    }
    this.itemsWithText = foundItems;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component will mount
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillMount = () => {
    if (!this.props.userSignedIn) {
      this.props.history.push("/Landing");
    }
  };
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgSearch = withRouter(MpgSearchBase);
export default MpgSearch;
