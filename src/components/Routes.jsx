import { Switch, Route, Redirect } from 'react-router-dom'
import React from "react";
import ScreenShareSession from "./ScreenShareSession";
import Home from "./Home";

class Routes extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            username: null,
        }
    }


    render() {
        return (
            <Switch>
                <Route exact path="/" render={(props) =>
                    <Home {...props}
                          getUserName={
                              (s) => this.setState({username : s})
                          }
                          username={this.state.username}/>
                    }
                />
                <Route path="/room/:id/"
                       render={(props) =>
                           <ScreenShareSession {...props} username={this.state.username}/>
                       }
                />
                {/*<Route component={Home}>*/}
                    {/*<Redirect to="/"/>*/}
                {/*</Route>*/}
                <Route render={() => <Redirect to="/"/>}/>
            </Switch>
        );
    }
}

export default Routes;