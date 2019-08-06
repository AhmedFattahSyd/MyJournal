///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Signin component
// Signin user
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import MpgAppBar from "./MpgAppBar";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  TextField
} from "@material-ui/core";
import { MpgUser } from "./MpgUser";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface ISigninProps extends RouteComponentProps {
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  showMessage: Function;
  setUserState: Function;
  mpgUser: MpgUser;
  goToNewEntry: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  desktop: boolean
}
interface ISigninState {
  userName: string;
  password: string;
  error: boolean;
  msg: string;
  signinInProgress: boolean;
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Signin class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgSigninBase extends React.Component<ISigninProps, ISigninState> {
  constructor(props: ISigninProps) {
    super(props);
    this.state = {
      userName: "Signin user name",
      password: "",
      error: false,
      msg: "Please enter username and password",
      signinInProgress: false
    };
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public render = () => {
    return (
      <div>
        <MpgAppBar
          toggleSidebarVisibility={this.props.toggleSidebarVisibility}
          goToNewEntry={this.props.goToNewEntry}
          desktop={this.props.desktop}
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
          {this.renderSigninForm()}
        </div>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render item list
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderSigninForm = () => {
    const cardWidth = 360;
    const errorColor = "red";
    let stateMessageColor = "black";
    if (this.state.error) {
      stateMessageColor = errorColor;
    } else {
      stateMessageColor = "black";
    }
    return (
      <Card
        elevation={1}
        style={{ maxWidth: cardWidth, minWidth: cardWidth, margin: 10 }}
      >
        <CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: 15,
              flexDirection: "column",
              padding: "20px"
            }}
          >
            <Typography variant="h6" color="primary">
              Sign in
            </Typography>
            <Divider style={{ margin: "20px" }} />
            <TextField
              id="userName"
              label="Name"
              value={this.state.userName}
              margin="normal"
              style={{ marginLeft: 5, marginRight: 10, width: "70%" }}
              onChange={this.handleUserNameChange}
            />
            <TextField
              id="password"
              label="Password"
              value={this.state.password}
              margin="normal"
              type="password"
              style={{ marginLeft: 5, marginRight: 10, width: "70%" }}
              onChange={this.handlePasswordChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSignin}
              disabled={this.state.signinInProgress}
              style={{ margin: "20px" }}
            >
              Signin
            </Button>
            <Typography
              variant="body1"
              style={{ textAlign: "center", color: stateMessageColor }}
            >
              {this.state.msg}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // event handlers
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle usaer name text change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleUserNameChange = (event: React.ChangeEvent) => {
    this.setState({ userName: (event.target as HTMLInputElement).value });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle password change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handlePasswordChange = (event: React.ChangeEvent) => {
    this.setState({ password: (event.target as HTMLInputElement).value });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle sign in
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSignin = async () => {
    try {
      this.setState({ signinInProgress: true });
      // console.log("Signin: handleSignin")
      let result = await this.props.mpgUser.signin(
        this.state.userName,
        this.state.password
      );
      if (result.success) {
        // console.log("Signin success. username:",this.state.mpgUser.getUserName());
        await this.setState({ signinInProgress: false });
        await this.setState({
          error: false,
          msg: "Connecting to database in cloud. Please wait ..."
        });
        await this.props.setUserState(true, this.props.mpgUser.getUserName());
        // this.props.showMessage('User has been signed in successfully',1000)
        this.props.history.push("/Home");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      this.setState({ error: true, msg: "Unable to signin. Reason: " + error });
    } finally {
    }
  };
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgSignin = withRouter(MpgSigninBase);
export default MpgSignin;
