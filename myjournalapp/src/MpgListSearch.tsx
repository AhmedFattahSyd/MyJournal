////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgListSearch component module
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import MpgAppBar from "./MpgAppBar";
import {
  Card,
  TextField,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Chip,
  Icon,
  Typography
} from "@material-ui/core";
import MpgGraph, { MpgDisplayMode } from "./MpgGraph";
import MpgLogger from "./MpgLogger";
import MpgItem from "./MpgItem";
import MpgTheme from "./MpgTheme";
import MpgItemListComp from "./MpgItemListComp";
import { ListSearchState, CurrentCategoryType } from "./MpgGraph";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface ListISearchProps extends RouteComponentProps {
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  showMessage: Function;
  userSignedIn: boolean;
  mpgGraph: MpgGraph;
  mpgLogger: MpgLogger;
  allTags: MpgItem[];
  allEntries: MpgItem[];
  cardWidth: number
  goToNewEntry: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  allViews: MpgItem[];
  listSearchState: ListSearchState;
  currentItemType: CurrentCategoryType
}
interface IListSearchState {
  tagSearchText: string;
  tagListVisible: boolean;
  // entryListVisible: boolean;
  matchedTags: MpgItem[];
  existingTags: MpgItem[];
  deleteInProgress: boolean;
  cardWidth: number
  nameSearchText: string;
  currentItemType: CurrentCategoryType;
  itemsToSearch: MpgItem[];
  allTags: MpgItem[];
  allEntries: MpgItem[];
  allViews: MpgItem[];
  matchedItems: MpgItem[];
  listSearchState: ListSearchState;
  items2Show: MpgItem[]
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgListSearch class
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class MpgListSearchBase extends React.Component<
  ListISearchProps,
  IListSearchState
> {
  private itemsWithText: MpgItem[] = [];
  private itemsWithTags: MpgItem[] = [];
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // constructor
  ///////////////////////////////////////////////////////////////////////////////////////////////
  constructor(props: ListISearchProps) {
    super(props);
    this.state = {
      tagSearchText: "",
      tagListVisible: false,
      matchedTags: [],
      existingTags: [],
      deleteInProgress: false,
      cardWidth: props.cardWidth,
      nameSearchText: "",
      currentItemType: props.currentItemType,
      itemsToSearch: this.props.allEntries,
      allEntries: this.props.allEntries,
      allTags: this.props.allTags,
      allViews: this.props.allViews,
      matchedItems: [],
      listSearchState: props.listSearchState,
      items2Show: []
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
          mpgGraph={this.props.mpgGraph}
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
          {/* {this.renderEntryList()} */}
        </div>
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render search panel
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderSearchPanel = () => {
    return (
      <Card
        elevation={1}
        style={{
          maxWidth: this.state.cardWidth,
          minWidth: this.state.cardWidth,
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
            value={this.state.currentItemType}
            onChange={this.handleSearchItemTypeChange}
            inputProps={{
              name: "Search for",
              id: "searchIemType"
            }}
            style={{
              fontSize: "21px",
              fontWeight: "bold",
              color: MpgTheme.palette.primary.contrastText
            }}
          >
            <MenuItem value={"Entry"}>Entries</MenuItem>
            <MenuItem value={"Tag"}>Tags</MenuItem>
            <MenuItem value={"View"}>Views</MenuItem>
          </Select>
        </div>
        {this.renderSearchParamsWithSwitch()}
        {this.renderEntryList()}
      </Card>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // handle search item type change
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleSearchItemTypeChange = async (event: any) => {
    const type = event.target.value
    // console.log('MpgListSearch: handleSearchItemTypeChange: type:',type);
    await this.props.mpgGraph.setCurrentItemType(type)
    // await this.setState({currentItemType: type})
    // await this.setItems2Show()
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // handle search item type change
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setItems2Search = async () => {
    switch (this.state.currentItemType) {
      case CurrentCategoryType.Entry:
        await this.setState({ itemsToSearch: this.state.allEntries });
        break;
      case CurrentCategoryType.View:
        await this.setState({ itemsToSearch: this.state.allViews });
        break;
      case CurrentCategoryType.Tag:
        await this.setState({ itemsToSearch: this.state.allTags });
        break;
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // set search item type from current category
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setSearcItemType = () => {
    if (this.props.mpgGraph.isCurrentcategoryEntry()) {
      this.setState({ currentItemType: CurrentCategoryType.Entry });
    }
    if (this.props.mpgGraph.isCurrentCategoryView()) {
      this.setState({ currentItemType: CurrentCategoryType.View });
    }
    if (this.props.mpgGraph.isCurrentCategoryTag()) {
      this.setState({ currentItemType: CurrentCategoryType.Tag });
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render search params
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderSearchParams = () => {
    return (
      <div>
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
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render search params with switch
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderSearchParamsWithSwitch = () => {
    return (
      <div>
        <Card
          elevation={1}
          style={{
            margin: 5
          }}
        >
          {this.renderListSearchIcons()}
          {this.state.listSearchState === ListSearchState.Search ? (
            this.renderSearchParams()
          ) : (
            <div />
          )}
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
    // this.setMatchedItems();
    this.setItems2Show()
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
    await this.setState({items2Show: this.state.matchedItems})
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
  // render search tag list
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
    // this.setMatchedItems();
    this.setItems2Show()
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render entry list
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderEntryList = () => {
    // let itemsToShow: MpgItem[] = [];
    // switch (this.state.listSearchState) {
    //   case ListSearchState.List:
    //     itemsToShow = this.state.itemsToSearch;
    //     break;
    //   case ListSearchState.Search:
    //     itemsToShow = this.state.matchedItems;
    //     break;
    // }
    return (
      <div>
        <MpgItemListComp
          itemList={this.state.items2Show}
          toggleSidebarVisibility={this.props.toggleSidebarVisibility}
          mpgGraph={this.props.mpgGraph}
          mpgLogger={this.props.mpgLogger}
        />
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render list/ serach icons
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderListSearchIcons = () => {
    let listIconColor = "";
    let searchIconColor = "";
    let panelTitle = "";
    switch (this.state.listSearchState) {
      case ListSearchState.List:
        searchIconColor = MpgTheme.palette.secondary.dark;
        listIconColor = MpgTheme.palette.primary.dark;
        panelTitle = "List";
        break;
      case ListSearchState.Search:
        listIconColor = MpgTheme.palette.secondary.dark;
        searchIconColor = MpgTheme.palette.primary.dark;
        panelTitle = "Seach";
        break;
    }
    // let listIconColor =
    //   this.state.listSearchState === ListSearchState.List
    //     ? MpgTheme.palette.secondary.dark
    //     : MpgTheme.palette.primary.dark;
    // let SearchIconColor =
    //   this.state.listSearchState === ListSearchState.Search
    //     ? MpgTheme.palette.secondary.dark
    //     : MpgTheme.palette.primary.dark;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px"
        }}
      >
        <Icon
          style={{ fontSize: "20px", color: listIconColor }}
          onClick={event=>this.props.mpgGraph.setListSearchState(ListSearchState.List)}
        >
          view_headline
        </Icon>
        <Typography
          variant="body1"
          style={{ color: MpgTheme.palette.primary.dark }}
        >
          {panelTitle}
        </Typography>
        <Icon
          style={{ fontSize: "20px", color: searchIconColor }}
          onClick={event=>this.props.mpgGraph.setListSearchState(ListSearchState.Search)}
        >
          search
        </Icon>
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
        nameSearchText: nameSearchText
      });
      // await this.setMatchedItems();
    } else {
      await this.setState({
        nameSearchText: nameSearchText
      });
    }
    // await this.setMatchedItems();
    this.setItems2Show()
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component will receive props
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillReceiveProps = async (newProps: ListISearchProps) => {
    await this.setState({
      allEntries: newProps.allEntries,
      allTags: newProps.allTags,
      allViews: newProps.allViews,
      listSearchState: newProps.listSearchState,
      currentItemType: newProps.currentItemType,
      cardWidth: newProps.cardWidth,
    });
    // console.log('MpgListSearch: componentWillReceiveProps: newProps:',newProps);
    await this.setItems2Show()
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // set items to show
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setItems2Show = async () =>{
    await this.setItems2Search();
    switch (this.state.listSearchState) {
      case ListSearchState.List:
        await this.setState({items2Show: this.state.itemsToSearch})
        break;
      case ListSearchState.Search:
        await this.setMatchedItems();
        await this.setState({items2Show: this.state.matchedItems})
        break;
    }
  }
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
    this.setState({ matchedItems: foundItems });
    // console.log('MpgListSearch: setMatchedItems: foundItems',foundItems);
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // set matched items by tags
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setMatchedItemByTags = () => {
    let matchedItems: MpgItem[] = [];
    if (this.state.currentItemType === CurrentCategoryType.Tag) {
      matchedItems = this.props.mpgGraph.getTagssWithAllTags(
        this.state.existingTags
      );
    } else {
      if (this.state.currentItemType === CurrentCategoryType.Entry) {
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
  componentWillMount = async () => {
    if (!this.props.userSignedIn) {
      this.props.history.push("/Landing");
    } else {
      await this.setItems2Show()
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component did mount
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentDidMount = async () => {
    // await this.setListSearchParam()
  };
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgListSearch = withRouter(MpgListSearchBase);
export default MpgListSearch;
