//////////////////////////////////////////////////////////////////////////////////////////////
// MPG Signup component
// Signup user
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { MpgUser } from "./MpgUser";
import MpgAppBar from "./MpgAppBar";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  TextField,
  Button
} from "@material-ui/core";
import MpgGraph from "./MpgGraph";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface ISignupProps extends RouteComponentProps {
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  mpgGraph: MpgGraph;
  goToNewEntry: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}
interface ISignupState {
  userName: string;
  password: string;
  email: string;
  error: boolean;
  msg: string;
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Signin class
// manages user authentication
// uses AWS Amplify SDK to access AWS Cognito
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgSignupBase extends React.Component<ISignupProps, ISignupState> {
  private mpgUser: MpgUser;
  constructor(props: ISignupProps) {
    super(props);
    this.mpgUser = props.mpgGraph.getMpguser();
    this.state = {
      userName: "user name",
      password: "password",
      email: "email",
      error: false,
      msg: "Please enter username and password"
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
          {this.renderSignupForm()}
        </div>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render item list
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderSignupForm = () => {
    const cardWidth = 360; // todo: user test colors from theme
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
              Signup
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
            <TextField
              id="email"
              label="email"
              value={this.state.email}
              margin="normal"
              style={{ marginLeft: 5, marginRight: 10, width: "70%" }}
              onChange={this.handleEmailChange}
            />
            <Divider style={{ margin: "20px" }} />
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSignup}
              style={{ margin: "20px" }}
            >
              Signup
            </Button>
            <Button
              variant="contained"
              onClick={this.confirmSignup}
              style={{ margin: "20px" }}
            >
              Confirm signup
            </Button>
            <Button
              variant="contained"
              onClick={this.signUserIn}
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
  // handle sign up
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSignup = async () => {
    try {
      let result = await this.mpgUser.signup(
        this.state.userName,
        this.state.password,
        this.state.email
      );
      if (result.success) {
        this.props.history.push("/ConfirmSignup");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      this.setState({ error: true, msg: "Unable to signup. Reason: " + error });
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle usaer anem text change
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
  // handle email change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleEmailChange = (event: React.ChangeEvent) => {
    this.setState({ email: (event.target as HTMLInputElement).value });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // sign user in
  ///////////////////////////////////////////////////////////////////////////////////////////////
  signUserIn = () => {
    this.props.history.push("/signin");
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // confirm signup
  ///////////////////////////////////////////////////////////////////////////////////////////////
  confirmSignup = () => {
    this.props.history.push("/confirmSignup");
  };
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgSignup = withRouter(MpgSignupBase);
export default MpgSignup;
