import { Switch, Route, Redirect } from 'react-router-dom'
import React from "react";
import ScreenShareSession from "./ScreenShareSession";
import Home from "./Home";

class Routes extends React.Component {

    render() {
        return (
            <Switch>
                <Route exact path="/" component={Home}/>
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