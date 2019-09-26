import { createMuiTheme } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";
import grey from "@material-ui/core/colors/grey";

export default createMuiTheme({
  palette: {
    primary: {
      main: blue[700],
      contrastText: "#fff",
      light: blue[400],
      dark: blue[900]
    },
    background: {
      default: grey[200]
    },
    secondary: {
      main: red[900],
      light: red[300],
      contrastText: "#000"
    },
    contrastThreshold: 3
  },
});
