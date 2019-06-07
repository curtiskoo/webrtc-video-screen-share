import React from 'react';
import './App.css';
import Routes from "./components/Routes";
import Cookies from 'universal-cookie';

class App extends React.Component {
    constructor(props) {
        super(props)

        this.cookies = new Cookies()

        this.state = {
            username: this.cookies.get('username')
        }
    }

    render() {
    return (
        <div className="App">
            <header className="App-header">
                <div>Hello World, CK React App</div>
                <div>Logged In As: {this.state.username}</div>
                <Routes {...this.state}/>
            </header>
        </div>
    );
    }
}

export default App;
