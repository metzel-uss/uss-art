import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Router from './routes';
import registerServiceWorker from './registerServiceWorker';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        primary: { main: '#5b9bd5' },
        secondary: { main: '#11cb5f' },
        error: { main: '#f44336' },
    },
    overrides: {
        MuiButton: {
            containedPrimary: {
                color: 'white',
            },
        },
    }
});

ReactDOM.render(
  <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
  </BrowserRouter>
, document.getElementById('root'));
registerServiceWorker();
