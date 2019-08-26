///////////////////////////////////////////////////////////////////////////////////////////////
// MPG Confirm Signup component
// confirm user email
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
import MpgGraph from "./MpgGraph";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IConfirmSignupProps extends RouteComponentProps {
  toggleSidebarVisibility: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void;
  mpgGraph: MpgGraph
  goToNewEntry: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void
}
interface IConfirmSignupState {
  userName: string;
  password: string;
  email: string;
  error: boolean;
  msg: string;
  code: string;
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MPG ConfirmSignup class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgConfirmSignupBase extends React.Component<
  IConfirmSignupProps,
  IConfirmSignupState
> {
  private mpgUser: MpgUser;
  constructor(props: IConfirmSignupProps) {
    super(props);
    this.mpgUser = props.mpgGraph.getMpguser();
    this.state = {
      userName: "user name",
      password: "password",
      email: "email",
      error: false,
      msg: "Please enter userid and confirmation code",
      code: ""
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
          {this.renderConfirmSignupForm()}
        </div>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render form
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderConfirmSignupForm = () => {
    // todo: use constant in App and adjust for desktop or mobile
    const cardWidth = 360;
    // todo: user test colors from theme
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
              Confirm signup
            </Typography>
            <Divider style={{ margin: "20px" }} />
            <Typography variant="body1" color="textPrimary" />
            <TextField
              id="userName"
              label="Name"
              value={this.state.userName}
              margin="normal"
              style={{ marginLeft: 5, marginRight: 10, width: "70%" }}
              onChange={this.handleUserNameChange}
            />
            <TextField
              id="code"
              label="Confirmation code"
              value={this.state.code}
              margin="normal"
              style={{ marginLeft: 5, marginRight: 10, width: "70%" }}
              onChange={this.handleCodeChange}
            />
            <Divider style={{ margin: "20px" }} />
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleConfirmation}
              style={{ margin: "20px" }}
            >
              Confirm
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
  // handle confirmation
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleConfirmation = async () => {
    try {
      let result = await this.mpgUser.confirmSignup(
        this.state.userName,
        this.state.code
      );
      if (result.success) {
        this.props.history.push("/Signin");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      this.setState({
        error: true,
        msg: "Unable to confirm signup. Reason: " + error
      });
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
  // handle code change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleCodeChange = (event: React.ChangeEvent) => {
    this.setState({ code: (event.target as HTMLInputElement).value });
  };
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const MpgConfirmSignup = withRouter(MpgConfirmSignupBase);
export default MpgConfirmSignup;
