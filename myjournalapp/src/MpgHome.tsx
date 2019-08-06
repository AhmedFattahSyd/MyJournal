///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Home component
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import MpgAppBar from "./MpgAppBar";
import {
  Typography,
  Card,
  CardContent,
  Icon,
  CardActionArea
} from "@material-ui/core";
import MpgCategory from "./MpgCategory";
import MpgGraph, { MpgDisplayMode } from "./MpgGraph";
import MpgItemList from "./MpgItemList";
import MpgLogger from "./MpgLogger";
import MpgItem from "./MpgItem";
import MpgItemDetails from "./MpgItemDetails";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IHomeProps extends RouteComponentProps {
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  showMessage: Function;
  userSignedIn: boolean;
  allCategories: MpgCategory[];
  mpgGraph: MpgGraph;
  mpgLogger: MpgLogger;
  desktop: boolean;
  currentCategoryId: string;
  filteredItems: MpgItem[];
  currentItemId: string;
  createOrUpdateMode: MpgDisplayMode;
  allTags: MpgItem[];
  allEnteries: MpgItem[];
  goToNewEntry: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  displayMode: MpgDisplayMode;
}
interface IHomeState {
  allCategories: MpgCategory[];
  currentCategoryId: string;
  currentItemId: string;
  desktop: boolean;
  displayMode: MpgDisplayMode;
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Home class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgHomeBase extends React.Component<IHomeProps, IHomeState> {
  constructor(props: IHomeProps) {
    super(props);
    let currentCategoryId = "";
    if (props.allCategories.length > 0) {
      currentCategoryId = props.allCategories[0].getId();
      props.mpgGraph.setCurrentCategoryId(currentCategoryId);
    }
    this.state = {
      allCategories: props.allCategories,
      currentCategoryId: currentCategoryId,
      currentItemId: props.currentItemId,
      desktop: props.desktop,
      displayMode: props.displayMode
    };
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  public render = () => {
    return (
      <div>
        {this.props.desktop ? this.renderDesktop() : this.renderMobile()}
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render mobile
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public renderMobile = () => {
    return (
      <div>
        {this.renderAppBar()}
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
          {this.state.displayMode == MpgDisplayMode.List
            ? this.renderItemList()
            : this.renderItemDetails()}
        </div>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render desktop
  // renders different desktops depending of the selected categories
  // entry: entry list, entery details
  // view: view list, view details which include entry list, entery details
  // tag: tag list, tag detials
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public renderDesktop = () => {
    // this.props.mpgLogger.debug(`MpgHome: renderDesktop: state`, this.state);
    return (
      <div style={{backgroundColor:'lightgrey'}}>
        {this.isCurrentItemValid() ||
        this.state.displayMode == MpgDisplayMode.Create
          ? this.renderListAndViewDesktop()
          : this.renderListDesktop()}
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render list and view
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public renderListAndViewDesktop = () => {
    return (
      <div>
        {this.renderAppBar()}
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
          {this.renderItemList()}
          {this.renderItemDetails()}
        </div>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render list and view
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public renderListDesktop = () => {
    return (
      <div>
        {this.renderAppBar()}
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
          {this.renderItemList()}
        </div>
      </div>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // validate current item
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  isCurrentItemValid = (): boolean => {
    let currentItemValid = false;
    if (
      this.props.mpgGraph.getItemById(this.state.currentItemId) != undefined
    ) {
      currentItemValid = true;
    }
    return currentItemValid;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render itemDetails
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderItemDetails = () => {
    return (
      <MpgItemDetails
        toggleSidebarVisibility={this.props.toggleSidebarVisibility}
        showMessage={this.props.showMessage}
        userSignedIn={this.props.userSignedIn}
        currentCategoryId={this.props.currentCategoryId}
        mpgGraph={this.props.mpgGraph}
        mpgLogger={this.props.mpgLogger}
        displayMode={this.props.createOrUpdateMode}
        currentItemId={this.props.currentItemId}
        allTags={this.props.allTags}
        allEnteries={this.props.allEnteries}
        desktop={this.props.desktop}
        filteredItems={this.props.filteredItems}
        allCategories={this.props.allCategories}
        goToNewEntry={this.props.goToNewEntry}
      />
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render itemList
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderItemList = () => {
    return (
      <MpgItemList
        toggleSidebarVisibility={this.props.toggleSidebarVisibility}
        showMessage={this.props.showMessage}
        userSignedIn={this.props.userSignedIn}
        currentCategoryId={this.props.currentCategoryId}
        mpgGraph={this.props.mpgGraph}
        mpgLogger={this.props.mpgLogger}
        filteredItems={this.props.filteredItems}
        currentItemId={this.props.currentItemId}
        desktop={this.props.desktop}
        allCategories={this.props.allCategories}
        displayeMode={this.props.createOrUpdateMode}
        allTags={this.props.allTags}
        allEnteries={this.props.allEnteries}
        goToNewEntry={this.props.goToNewEntry}
      />
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render AppBar
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderAppBar = () => {
    return (
      <MpgAppBar
        toggleSidebarVisibility={this.props.toggleSidebarVisibility}
        goToNewEntry={this.props.goToNewEntry}
        desktop={this.state.desktop}
      />
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render categories
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderCategories = () => {
    const cardWidth = 360;
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
              margin: 15
            }}
          >
            <Typography variant="h6" color="primary" />
            <Typography variant="h6" color="primary">
              Categories ({this.state.allCategories.length})
            </Typography>
            <Typography variant="h6" color="primary" />
          </div>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                padding: 5,
                flexWrap: "wrap"
              }}
            >
              {this.state.allCategories.map(type => (
                <Card
                  key={type.getId()}
                  elevation={1}
                  style={{
                    maxWidth: cardWidth - 40,
                    minWidth: cardWidth - 40,
                    margin: 10
                  }}
                >
                  <CardActionArea
                    onClick={event =>
                      this.handleCategoryCardClicked(event, type.getId())
                    }
                  >
                    <CardContent>
                      <div style={{ display: "flex" }}>
                        <Icon color="primary">view_comfy</Icon>
                        <div style={{ width: "20px" }} />
                        <Typography variant="h6" color="textSecondary">
                          {type.getName()}
                        </Typography>
                      </div>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handler category card click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleCategoryCardClicked = async (event: React.MouseEvent, id: string) => {
    await this.props.mpgGraph.setCurrentCategoryId(id);
    if (!this.props.desktop) {
      this.props.history.push("/ItemList");
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
  componentWillReceiveProps(newProps: IHomeProps) {
    // this.props.mpgLogger.debug("Home: componentWillReceiveProps: allCategories:",newProps.allCategories)
    this.setState({
      allCategories: newProps.allCategories,
      currentCategoryId: newProps.currentCategoryId,
      currentItemId: newProps.currentItemId,
      desktop: newProps.desktop,
      displayMode: newProps.displayMode
    });
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle add category
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleAddCategory = () => {
    this.props.showMessage(
      "Sorry, this functions has not been implemented yet"
    );
  };
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgHome = withRouter(MpgHomeBase);
export default MpgHome;
