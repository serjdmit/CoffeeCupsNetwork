import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
//Components
import Navbar from "./components/Navbar";
//Pages
import Home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: "#9f7060",
            main: "#6f4436",
            dark: "#411c10",
            contrastText: "#EEE0B1"
        },
        secondary: {
            light: "#f1ccaa",
            main: "#be9b7b",
            dark: "#8d6d4f",
            contrastText: "#fdfff5"
        }
    },
    typography: {
        useNextVariants: true
    }
});

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                <Router>
                    <Navbar />
                    <div className="container">
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/login" component={login} />
                            <Route exact path="/signup" component={signup} />
                        </Switch>
                    </div>
                </Router>
            </div>
        </MuiThemeProvider>
    );
}

export default App;
