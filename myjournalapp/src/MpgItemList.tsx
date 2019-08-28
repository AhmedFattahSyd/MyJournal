///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Item List component
// displays list of items
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import MpgAppBar from "./MpgAppBar";
import {
  Card,
  CardContent,
  Icon,
  Typography,
  CardActionArea,
  Chip
} from "@material-ui/core";
import MpgGraph, { MpgDisplayMode } from "./MpgGraph";
import MpgLogger from "./MpgLogger";
import MpgItem from "./MpgItem";
import MpgCategory from "./MpgCategory";
import MpgTheme from "./MpgTheme";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IItemListProps extends RouteComponentProps {
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  showMessage: Function;
  userSignedIn: boolean;
  currentCategoryId: string;
  mpgGraph: MpgGraph;
  mpgLogger: MpgLogger;
  filteredItems: MpgItem[];
  currentItemId: string;
  allCategories: MpgCategory[];
  displayMode: MpgDisplayMode;
  allTags: MpgItem[];
  allEnteries: MpgItem[];
  goToNewEntry: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  primaryColor: string;
  windowWidth: number
}
interface IItemListState {
  currentCategoryId: string;
  currentCategoryName: string;
  filteredItems: MpgItem[];
  currentItemId: string;
  windowWidth: number
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Item List class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgItemListBase extends React.Component<IItemListProps, IItemListState> {
  constructor(props: IItemListProps) {
    super(props);
    const category = this.props.mpgGraph.getCategoryById(
      props.currentCategoryId
    );
    let categoryName = "???";
    if (category !== undefined) {
      categoryName = category.getName();
    }
    this.state = {
      currentCategoryId: props.currentCategoryId,
      currentCategoryName: categoryName,
      filteredItems: props.filteredItems,
      currentItemId: props.currentItemId,
      windowWidth: props.windowWidth,
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
        />
        <div style={{ paddingTop: 59 }}> </div>
        <div
          style={{
            padding: "10px",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            textAlign: "center",
          }}
        >
          {this.renderList()}
        </div>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render item list
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderList = () => {
    const cardWidth = (window.innerWidth > 500)? 500 : window.innerWidth
    return (
      <Card
        elevation={1}
        style={{width: cardWidth,
          backgroundColor: MpgTheme.palette.primary.light}}
        // style={{ maxWidth: cardWidth, minWidth: cardWidth, margin: 1 }}
      >
        <CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: 1,
            }}
          >
            <Typography variant="h6" color="primary" />
            <Typography variant="h5" style={{color: MpgTheme.palette.primary.contrastText}}>
              {this.state.currentCategoryName + " list"}
            </Typography>
            <Typography variant="h6" color="primary" />
          </div>
          {this.renderItems()}
        </CardContent>
      </Card>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render items
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderItems = () => {
    const cardWidth = window.innerWidth - 30
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "2px 5px 2px 5px",
          flexWrap: "wrap",
        }}
      >
        {/* <List style={{ maxHeight: "100%", overflow: "auto" }}> */}
          {this.state.filteredItems.map(item => (
            <Card
              key={item.getId()}
              elevation={1}
              style={{
                width: cardWidth,
                // maxWidth: cardWidth,
                // minWidth: cardWidth,
                margin: "2px 5px 2px 5px",
              }}
            >
              <CardActionArea
                // onClick={event => this.handleSelectItem(event, item.getId())}
              >
                <CardContent>
                  <Typography
                    style={{ fontSize: "14px", fontWeight: "bold",
                    color: MpgTheme.palette.primary.dark }}
                    align="left"
                  >
                    {item.getName()}
                  </Typography>
                  <Typography
                    style={{ fontSize: "10px",
                    color: MpgTheme.palette.primary.main }}
                    align="left"
                  >
                    Priority: {item.getNetPriority()} ({item.getPriority()})
                  </Typography>
                  {/* <Typography
                    style={{ fontSize: "10px",
                    color: MpgTheme.palette.primary.main  }}
                    align="left"
                  >
                    Tags: {this.props.mpgGraph.getTagNames(item)}
                  </Typography> */}
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
            {item.getTags().map(tag => (
              <Chip
                key={tag.getId()}
                label={tag.getName()}
                color="primary"
                onDelete={event => this.handleTagDelete4Item(event, item, tag)}
                onClick={event => this.handleTagUpdate4Item(event, item, tag)}
                variant="outlined"
                style={{ margin: "1px", fontSize:'8px' }}
                size='small'
              />
            ))}
          </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "5px"
                    }}
                  >
                    <Icon
                      style={{ fontSize: "14px",
                      color: MpgTheme.palette.primary.dark }}
                      onClick={event =>
                        this.handleItemUpdate(event, item.getId())
                      }
                    >
                      edit
                    </Icon>
                    <Icon
                      style={{ fontSize: "14px" ,
                      color: MpgTheme.palette.primary.dark}}
                      onClick={event =>
                        this.handleItemDelete(event, item.getId())
                      }
                    >
                      delete
                    </Icon>
                  </div>
                </CardContent>
              </CardActionArea>
              {/* </Link> */}
            </Card>
          ))}
        {/* </List> */}
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle tag delete for item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleTagDelete4Item = async (event: any, item: MpgItem, tag: MpgItem) => {
    let tags = item.getTags()
    tags = tags.filter(aTag=> aTag.getId() !== tag.getId())
    await this.props.mpgGraph.updateItemDetails(item.getId(), item.getCategoryId(), item.getName(),
      item.getPriority(),tags)
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle update tag for item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleTagUpdate4Item = async (event: React.MouseEvent, item: MpgItem, tag: MpgItem) => {
    await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Update);
    await this.props.mpgGraph.setCurrentItemId(tag.getId());
    await this.props.history.push("/ItemDetails");
};
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // goback
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  goBack = () => {
    this.props.history.goBack();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render items
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // renderItems = () => {
  //   const cardWidth = 320;
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "space-around",
  //         padding: "2px 5px 2px 5px",
  //         flexWrap: "wrap"
  //       }}
  //     >
  //       <List style={{ height: 800, width: 320, overflow: "auto" }}>
  //         {this.state.filteredItems.map(item => (
  //           <ListItem
  //             key={item.getId()}
  //             button
  //             onClick={event => this.handleSelectItem(event, item.getId())}
  //             selected={this.isItemSelected(item.getId())}
  //           >
  //             <ListItemText primary={item.getName()} />
  //           </ListItem>
  //         ))}
  //       </List>
  //     </div>
  //   );
  // };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // isItemSelected
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  isItemSelected = (id: string): boolean => {
    let selected = false;
    if (id === this.state.currentItemId) {
      selected = true;
    }
    return selected;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // check if this is the current item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  isCurrentItem = (id: string): boolean => {
    if (this.state.currentItemId ===  id) {
      return true;
    } else {
      return false;
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle update icon clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemUpdate = async (event: React.MouseEvent, itemId: string) => {
    const itemType = this.props.mpgGraph.getItemType(itemId);
    // this.props.mpgLogger.debug('ItemList: handleItemUpdate: itemType:',itemType)
    if (itemType !== undefined) {
      await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Update);
      await this.props.mpgGraph.setCurrentItemId(itemId);
      await this.goToItemDetails(itemType);
      await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Update);
      await this.props.mpgGraph.setCurrentItemId(itemId);
    } else {
      this.props.mpgLogger.unexpectedError(
        "ItemList: handleItemUpdate: undefine item type"
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // go to ItemDetails
  // delete and embed where it's called
  ///////////////////////////////////////////////////////////////////////////////////////////////
  goToItemDetails = async (itemType: string) => {
    await this.props.history.push("/ItemDetails");
    // if (!this.props.desktop) {
    //   await this.props.history.push("/ItemDetails");
    // }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle select item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSelectItem = async (event: React.MouseEvent, itemId: string) => {
    const itemType = this.props.mpgGraph.getItemType(itemId);
    // this.props.mpgLogger.debug('ItemList: handleItemUpdate: itemType:',itemType)
    if (itemType !== undefined) {
      await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Update);
      await this.props.mpgGraph.setCurrentItemId(itemId);
      await this.goToItemDetails(itemType);
    } else {
      this.props.mpgLogger.unexpectedError(
        "ItemList: handleItemUpdate: undefine item type"
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle delete icon clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemDelete = async (event: React.MouseEvent, id: string) => {
    try {
      await this.props.mpgGraph.deleteItemById(id);
    } catch (err) {
      this.props.mpgLogger.unexpectedError(err, "ItemList: deleteItem: error:");
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // setCategory name
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setCurrentCategoryName = () => {
    let currentCategoryName = "???";
    const currentCategory = this.props.mpgGraph.getCategoryById(
      this.state.currentCategoryId
    );
    if (currentCategory !== undefined) {
      currentCategoryName = currentCategory.getName();
    }
    this.setState({ currentCategoryName: currentCategoryName });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle new item
  // needs tidying up
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleNewItem = async () => {
    const currentCategory = this.props.mpgGraph.getCategoryById(
      this.state.currentCategoryId
    );
    await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Create);
    if (currentCategory !== undefined) {
      await this.goToItemDetails(currentCategory.getName());
      await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Create);
    } else {
      this.props.mpgLogger.unexpectedError(
        `MpgItemList: handleNewItem: category is undefined. categoryId:${
          this.state.currentCategoryId
        }`
      );
    }
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
  componentWillReceiveProps = async (newProps: IItemListProps) => {
    // this.props.mpgLogger.debug("ItemList: componentWillReceiveProps: dummyCounter:",newProps.dummyCounter)
    await this.setState({
      currentCategoryId: newProps.currentCategoryId,
      filteredItems: newProps.filteredItems,
      currentItemId: newProps.currentItemId
    });
    this.setCurrentCategoryName();
  };
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgItemList = withRouter(MpgItemListBase);
export default MpgItemList;
