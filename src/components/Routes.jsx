import { Switch, Route, Redirect } from 'react-router-dom'
import React from "react";
import ScreenShareSession from "./ScreenShareSession";
import Home from "./Home";

class Routes extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            username: "bob",
        }
    }


    render() {
        return (
            <Switch>
                <Route exact path="/" render={(props) =>
                    <div>
                    <Home {...props} getUserName={(s) => this.setState({username : s})}/>
                        {this.state.username}
                    </div>}/>
                <Route path="/room/:id/" component={ScreenShareSession}/>
                {/*<Route component={Home}>*/}
                    {/*<Redirect to="/"/>*/}
                {/*</Route>*/}
                <Route render={() => <Redirect to="/"/>}/>
            </Switch>
        );
    }
}

export default Routes;