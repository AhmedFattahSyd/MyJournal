////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgLanding module
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import * as React from "react";
import MpgAppBar from "./MpgAppBar";
import { Card, CardContent, Typography, Divider, Button } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface ILandingProps extends RouteComponentProps {
  toggleSidebarVisibility: ((event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void)
  goToNewEntry: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => void
}
interface ILandingState {}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgLanding class
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class MpgLanding extends React.Component<ILandingProps, ILandingState> {
  constructor(props: ILandingProps) {
    super(props);
    this.state = {};
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // render
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  public render = () => {
    return (
      <div>
        <MpgAppBar toggleSidebarVisibility={this.props.toggleSidebarVisibility}
          goToNewEntry={this.props.goToNewEntry} />
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
          {this.renderlandingContent()}
        </div>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render item list
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderlandingContent = () => {
    const cardWidth = 360
    return (
      <Card elevation={1}
        style={{ maxWidth: cardWidth, minWidth: cardWidth, margin: 10 }}>
        <CardContent>
          <div style={{
            display: 'flex', justifyContent: 'center', margin: 15,
            flexDirection: 'column', padding: '20px'
          }}>
            <Typography variant="h6" color='primary'>
              Welcome to
                </Typography>
            <Typography variant="h6" color='primary'>
              My Journal
                </Typography>
            <Divider style={{ margin: '10px' }} />
            <Typography variant="body1" color='textPrimary'>
              Please either signin or signup
                </Typography>
            <Divider style={{ margin: '10px' }} />
            <div style={{
              display: 'flex', justifyContent: 'center',
              flexDirection: 'column', padding: '5px 60px',
            }}>
              <Button variant="contained" color='primary' size="small" 
                onClick={this.signUserIn}
                style={{ margin: '20px', }}>Signin</Button>
              <Button variant="contained" color='primary' size="small" 
                onClick={this.signUserUp}
                style={{ margin: '20px', }}>Signup</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // signup
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  signUserUp = () => {
    this.props.history.push('/signup')
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // sign user in
  ///////////////////////////////////////////////////////////////////////////////////////////////
  signUserIn = () => {
    this.props.history.push('/signin')
  }
}
export default MpgLanding;
