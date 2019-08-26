import { createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import amber from '@material-ui/core/colors/amber';
import pink from '@material-ui/core/colors/pink'
import red from '@material-ui/core/colors/red'
import blue from '@material-ui/core/colors/blue'

export default createMuiTheme({
  palette: {
    primary: {
        main: blue[600],
        contrastText: '#fff',
        light: blue[300],
        dark: blue[900],
    },
    background: {
        light: blue[50]
    },
    secondary: {
        main: red[900],
        light: red[300],
        contrastText: '#000',
    },
    contrastThreshold: 3,
},
});