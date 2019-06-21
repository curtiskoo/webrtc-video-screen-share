import React from 'react';
import './App.css';
import Routes from "./components/Routes";
import Cookies from 'universal-cookie';
import AppBar from '@material-ui/core/AppBar';
import {getRandomUsername, printAnimals} from "./username";

class App extends React.Component {
    constructor(props) {
        super(props)

        this.cookies = new Cookies()

        this.state = {
            username: this.cookies.get('username')
        }
    }

    changeUsername = () => {
        this.setState({username : this.cookies.get('username')})
    }

    submitUserName = (e) => {
        e.preventDefault()
        let elem = document.getElementById('username-input')
        if (elem != null) {
            let input = elem.value
            if (input === "") {
                alert("Your username cannot be empty")
            }
            this.cookies.set("username", input, {path: '/'})
            this.changeUsername()
            elem.value = ""
        }
    }

    componentDidMount() {
        if (!this.cookies.get('username')) {
            this.cookies.set("username", getRandomUsername(), {path: '/'})
            this.changeUsername()
        }

        // window.addEventListener("load",function() {
        //     window.scrollTo(0,1);
        // });
    }

    render() {
    return (
        <div className="App">
            <AppBar color="default" position="relative">
                {/*<div>Hello World, CK React App</div>*/}
                <div className="username-right">
                    {this.state.username &&
                        <div>Logged In As: {this.state.username}</div>
                    }

                    <form onSubmit={(e) => {
                        this.submitUserName(e);
                    }}>
                        {this.state.username
                            ? <input type='text' id='username-input' placeholder="Change your Username" autoComplete="off"/>
                            : <input type='text' id='username-input' placeholder="Enter a Username" autoComplete="off"/>
                        }
                        <input type="submit" value="Submit"/>
                    </form>
                </div>
            </AppBar>
            <body className="App-body">
                    <Routes {...this.state}/>
            </body>
        </div>
    );
    }
}

export default App;
