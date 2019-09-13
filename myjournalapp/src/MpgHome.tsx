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
  CardActionArea,
} from "@material-ui/core";
import MpgCategory from "./MpgCategory";
import MpgGraph, { MpgDisplayMode } from "./MpgGraph";
import MpgLogger from "./MpgLogger";
import MpgItem from "./MpgItem";
import MpgTheme from "./MpgTheme";
import { ListSearchState } from "./MpgGraph";
import { AppLocation, AppPage } from "./MpgApp";
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
}
interface IHomeState {
  allCategories: MpgCategory[];
  currentCategoryId: string;
  currentItemId: string;
  displayMode: MpgDisplayMode;
  cardWidth: number
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
      displayMode: props.displayMode,
      cardWidth: props.cardWidth
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
          {this.renderCategories()}
        </div>
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
          {this.renderCategories()}
        </div>
      </div>
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
        mpgGraph={this.props.mpgGraph}
      />
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render categories
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderCategories = () => {
    return (
      <Card
        elevation={1}
        style={{ maxWidth: this.state.cardWidth, minWidth: this.state.cardWidth, margin: 10,
        backgroundColor: MpgTheme.palette.primary.light }}
      >
        <CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: 15,
            }}
          >
            <Typography variant="h6" color="primary" />
            <Typography variant="h6" style={{color: MpgTheme.palette.primary.contrastText,
              fontWeight:'bold'}}>
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
              {this.state.allCategories.map(category => (
                <Card
                  key={category.getId()}
                  elevation={1}
                  style={{
                    maxWidth: this.state.cardWidth - 40,
                    minWidth: this.state.cardWidth - 40,
                    margin: 10
                  }}
                >
                  <CardActionArea
                    onClick={event =>
                      this.handleCategoryCardClicked(event, category.getName())
                    }
                  >
                    <CardContent>
                      <div style={{ display: "flex", alignContent:'center',
                      justifyContent:'space-around', alignItems:'center',
                    color: MpgTheme.palette.primary.dark }}>
                        <Typography variant="h6" style={{color: MpgTheme.palette.primary.dark,
                          fontWeight:'bold', }}>
                          {category.getName()+
                            ' ('+this.props.mpgGraph.getNumOfItemsInCategory(category)+')'}
                        </Typography>
                      </div>
                    </CardContent>
                  </CardActionArea>
                  <div 
                     style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px"
                    }}>
                    <Icon style={{color: MpgTheme.palette.secondary.dark}}
                      onClick={event =>
                        this.handleSearchCategory(event, category.getName())
                      }>search</Icon>
                    <Icon style={{color: MpgTheme.palette.secondary.dark}}
                    onClick={event =>
                      this.handleAddItem(event, category.getId())
                    }>add</Icon>
                    </div>
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
  handleCategoryCardClicked = async (event: React.MouseEvent, name: string) => {
    // await this.props.mpgGraph.setCurrentCategoryId(id);
    // await this.props.mpgGraph.setListSearchState(ListSearchState.List)
    // this.props.history.push("/Search");
    this.props.goToList(name)
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handler add item  
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleAddItem = async (event: React.MouseEvent, id: string) => {
    await this.props.mpgGraph.setCurrentCategoryId(id);
    await this.props.mpgGraph.setDisplayMode(MpgDisplayMode.Create);
    await this.props.history.push("/ItemDetails");
  };
   ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle search category icon click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSearchCategory = async (event: React.MouseEvent, name: string) => {
    // await this.props.mpgGraph.setCurrentCategoryId(id);
    // await this.props.mpgGraph.setListSearchState(ListSearchState.Search)
    // this.props.history.push("/Search");
    this.props.goToList(name, ListSearchState.Search)
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
  componentWillReceiveProps(newProps: IHomeProps) {
    this.setState({
      allCategories: newProps.allCategories,
      currentCategoryId: newProps.currentCategoryId,
      currentItemId: newProps.currentItemId,
      displayMode: newProps.displayMode,
      cardWidth: newProps.cardWidth,
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
