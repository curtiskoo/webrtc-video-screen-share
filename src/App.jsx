import React from 'react';
import './App.css';
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
