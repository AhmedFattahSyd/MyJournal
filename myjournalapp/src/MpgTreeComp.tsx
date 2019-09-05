///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Tree View component
// displays list of items in a tree view
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import { Card} from "@material-ui/core";
import MpgLogger from "./MpgLogger";
import MpgItem from "./MpgItem";
import MpgGraph from "./MpgGraph";
import { withRouter, RouteComponentProps } from "react-router-dom";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import MpgTheme from "./MpgTheme";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface ITreeProps extends RouteComponentProps {
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  mpgGraph: MpgGraph;
  mpgLogger: MpgLogger;
  itemList: MpgItem[];
}
interface ITreeState {
  rootItems: MpgItem[];
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Tree component class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgTreeCompBase extends React.Component<ITreeProps, ITreeState> {
  constructor(props: ITreeProps) {
    super(props);
    this.state = {
      rootItems: props.mpgGraph.getRootItems(props.itemList)
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
        {this.renderTree()}
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render tree
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderTree = () => {
    return (
      <Card style={{ margin: 10 }}>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {this.state.rootItems.map(item => (
            <TreeItem
              key={item.getId()}
              nodeId={item.getId()}
              label={item.getName()}
            //   onClick={event=>this.handleItemUpdate(event, item)}
              style={{
                textAlign: "left",
                color: MpgTheme.palette.primary.dark,
                margin: 5,
                fontWeight: "bold"
              }}
            >
              {item.getChildren().length > 0 ? (
                this.renderChildren(item)
              ) : (
                <div />
              )}
            </TreeItem>
          ))}
        </TreeView>
      </Card>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render children
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderChildren = (item: MpgItem) => {
    return (
      <div>
        {item.getChildren().map(child => (
          <TreeItem
            key={child.getId()}
            nodeId={child.getId()}
            label={child.getName()}
            // onClick={event=>this.handleItemUpdate(event, child)}
            style={{
              textAlign: "left",
              color: MpgTheme.palette.primary.dark,
              margin: 5,
              fontWeight: "bold"
            }}
          >
            {child.getChildren().length > 0 ? (
              this.renderChildren(child)
            ) : (
              <div />
            )}
          </TreeItem>
        ))}
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle update item (any item)
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemUpdate = async (evet: any, item: MpgItem) => {
    console.log(
      "MpgTreeComp: handleItemUpdate: item seclected:",
      item.getName()
    );
    // await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Update);
    // await this.props.mpgGraph.setCurrentCategoryId(tag.getCategoryId());
    // await this.props.mpgGraph.setCurrentItemId(tag.getId());
    // await this.props.history.push("/ItemDetails");
  };
  //////////////////////////////////////////////////////////////////////////////////////////////
  // component will receive props
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillReceiveProps(newProps: ITreeProps) {
    this.setState({
      rootItems: this.props.mpgGraph.getRootItems(newProps.itemList)
    });
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgTreeComp = withRouter(MpgTreeCompBase);
export default MpgTreeComp;
