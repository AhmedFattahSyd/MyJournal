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
import MpgGraph, { CreateOrUpdateModes } from "./MpgGraph";
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
  deskTop: boolean;
  currentCategoryId: string;
  filteredItems: MpgItem[];
  currentItemId: string;
  createOrUpdateMode: CreateOrUpdateModes;
  allTags: MpgItem[];
  allEnteries: MpgItem[]
  goToNewEntry: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void
}
interface IHomeState {
  allCategories: MpgCategory[];
  currentCategoryId: string;
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
      currentCategoryId: currentCategoryId
    };
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  // render mobile
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public renderMobile = () => {
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
          {this.renderCategories()}
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
          {this.renderCategories()}
          <MpgItemList
            toggleSidebarVisibility={this.props.toggleSidebarVisibility}
            showMessage={this.props.showMessage}
            userSignedIn={this.props.userSignedIn}
            currentCategoryId={this.props.currentCategoryId}
            mpgGraph={this.props.mpgGraph}
            mpgLogger={this.props.mpgLogger}
            filteredItems={this.props.filteredItems}
            currentItemId={this.props.currentItemId}
            deskTop={this.props.deskTop}
            allCategories={this.props.allCategories}
            createOrUpdateMode={this.props.createOrUpdateMode}
            allTags={this.props.allTags}
            allEnteries={this.props.allEnteries}
            goToNewEntry={this.props.goToNewEntry}
          />
          <MpgItemDetails
            toggleSidebarVisibility={this.props.toggleSidebarVisibility}
            showMessage={this.props.showMessage}
            userSignedIn={this.props.userSignedIn}
            currentCategoryId={this.props.currentCategoryId}
            mpgGraph={this.props.mpgGraph}
            mpgLogger={this.props.mpgLogger}
            createOrUpdateMode={this.props.createOrUpdateMode}
            currentItemId={this.props.currentItemId}
            allTags={this.props.allTags}
            allEnteries={this.props.allEnteries}
            deskTop={this.props.deskTop}
            filteredItems={this.props.filteredItems}
            allCategories={this.props.allCategories}
            goToNewEntry={this.props.goToNewEntry}
          />
        </div>
      </div>
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
    if (!this.props.deskTop) {
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
      allCategories: newProps.allCategories
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
