import React from 'react';
import './App.css';
import ScreenShareSession from "./components/ScreenShareSession";
import { BrowserRouter as Router } from "react-router-dom";
import {Route} from "react-router-dom";
import Home from "./components/Home"
import Routes from "./components/Routes";


class App extends React.Component {

  render() {
    return (
        <div className="App">
            <header className="App-header">
                <div>Hello World, CK React App</div>
                <Routes/>
            </header>
        </div>
    );
  }
}

export default App;
