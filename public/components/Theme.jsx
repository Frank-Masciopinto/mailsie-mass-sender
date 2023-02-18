import { createTheme } from '@mui/material/styles';
import { deepPurple, orange } from '@mui/material/colors';

export const customTheme = createTheme({
  palette: {
    primary: {
      main: deepPurple["A200"],
    },
    secondary: {
      main: '#000000',
    },
  },
  typography: {
    fontFamily: 'Roboto',
  },
});
