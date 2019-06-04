import React from 'react';
import './App.css';
import ScreenShareSession from "./components/ScreenShareSession";

class App extends React.Component {

  render() {
    return (
        <div className="App">
          <header className="App-header">
              <div>Hello World, CK React App</div>
              <ScreenShareSession/>
          </header>
        </div>
    );
  }
}

export default App;
