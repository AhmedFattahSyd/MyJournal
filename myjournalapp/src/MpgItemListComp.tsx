///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Item List component
// displays list of items within other components
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import {
  Card,
  Typography,
  CardActionArea,
  Chip,
  Icon
} from "@material-ui/core";
import MpgLogger from "./MpgLogger";
import MpgItem from "./MpgItem";
import MpgTheme from "./MpgTheme";
import MpgGraph, { MpgDisplayMode } from "./MpgGraph";
import { withRouter, RouteComponentProps } from "react-router-dom";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IItemListProps extends RouteComponentProps{
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  mpgGraph: MpgGraph;
  mpgLogger: MpgLogger;
  itemList: MpgItem[];
}
interface IItemListState {
  itemList: MpgItem[];
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Item List component class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgItemListCompBase extends React.Component<
  IItemListProps,
  IItemListState
> {
  constructor(props: IItemListProps) {
    super(props);
    this.state = {
      itemList: props.itemList
    };
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render entry list
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  render = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          margin: 0
        }}
      >
        {this.state.itemList.map(item => this.renderItemCard(item))}
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render item card
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderItemCard = (item: MpgItem) => {
    return (
      <Card
        key={item.getId()}
        elevation={1}
        style={{ textAlign: "left", margin: 5 }}
      >
        <CardActionArea 
          onClick={event=>this.handleItemUpdate(event, item)}
          >
          <div style={{ textAlign: "left", padding: 10 }}>
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: MpgTheme.palette.primary.dark
              }}
              align="left"
            >
              {item.getName()}
            </Typography>
            <Typography
              style={{ fontSize: "10px", color: MpgTheme.palette.primary.main }}
              align="left"
            >
              Priority: {item.getNetPriority()} ({item.getPriority()})
            </Typography>
            {this.renderRelatedTags(item)}
          </div>
        </CardActionArea>
        {this.renderActionIcons(item)}
      </Card>
    );
  };
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render related Tags
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderRelatedTags = (item: MpgItem) => {
    let tags: MpgItem[] = []
    if(this.props.mpgGraph.isCategoryIdTag(item.getCategoryId())){
      tags = item.getParents()
    }else{
      tags = item.getTags()
    }
    return (
      this.renderTags(item, tags)
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // renderTags
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderTags = (item: MpgItem, tags: MpgItem[]) => {
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {tags.map(tag => (
          <Chip
            key={tag.getId()}
            label={tag.getName()}
            color="primary"
            onDelete={event => this.handleTagDelete4Item(event, item, tag)}
            onClick={event => this.handleItemUpdate(event, tag)}
            variant="outlined"
            style={{ margin: "1px", fontSize: "8px" }}
            size="small"
          />
        ))}
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get item tags
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getItemTags = (item: MpgItem): MpgItem[] =>{
    let foundTags: MpgItem[] = []
    return foundTags
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render icons
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderActionIcons = (item: MpgItem) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px"
        }}
      >
        <Icon
          style={{ fontSize: "14px", color: MpgTheme.palette.primary.dark }}
          onClick={event => this.handleItemUpdate(event, item)}
        >
          edit
        </Icon>
        <Icon
          style={{ fontSize: "14px", color: MpgTheme.palette.primary.dark }}
          onClick={event => this.handleItemDelete(event, item)}
        >
          delete
        </Icon>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle update item (any item)
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemUpdate = async (evet: any,tag: MpgItem) => {
    await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Update);
    await this.props.mpgGraph.setCurrentCategoryId(tag.getCategoryId());
    await this.props.mpgGraph.setCurrentItemId(tag.getId());
    await this.props.history.push("/ItemDetails");
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle delete icon clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemDelete = async (event: React.MouseEvent, item: MpgItem) => {
    await this.props.mpgGraph.deleteItem(item);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle tag delete for item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleTagDelete4Item = async (event: any, item: MpgItem, tag: MpgItem) => {
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
  // handle update tag for item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handleItemUpdate = async (event: React.MouseEvent, item: MpgItem) => {
  //   this.props.handleTagUpdate(item);
  // };
  //////////////////////////////////////////////////////////////////////////////////////////////
  // component will receive props
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillReceiveProps(newProps: IItemListProps) {
    this.setState({
      itemList: newProps.itemList
    });
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgItemListComp = withRouter(MpgItemListCompBase);
export default MpgItemListComp;
