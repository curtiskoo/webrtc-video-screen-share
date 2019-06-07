import { Switch, Route, Redirect } from 'react-router-dom'
import React from "react";
import ScreenShareSession from "./ScreenShareSession";
import Home from "./Home";
import Cookies from 'universal-cookie';


class Routes extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }


    render() {
        console.log(this.props)
        return (
            <Switch>
                <Route exact path="/" render={(props) =>
                    <Home {...props} {...this.props}/>
                    }
                />
                <Route path="/room/:id/"
                       render={(props) =>
                           <ScreenShareSession {...props} {...this.props}/>
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