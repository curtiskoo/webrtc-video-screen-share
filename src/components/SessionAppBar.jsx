import React from "react";
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


class SessionAppBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {

        return (
            <AppBar color="default" position="relative">
                <Toolbar className="sessionappbar-toolbar">
                    <div className="sessionappbar-toolbar-left">
                        <IconButton onClick={() => this.props.exitRoom()}>
                            <ExitToAppIcon/>
                        </IconButton>
                    </div>

                    <div className="sessionappbar-toolbar-middle">
                        <Typography variant="h6"
                                    color="textPrimary"
                        >
                            Stream Chat
                        </Typography>
                    </div>

                    <div class="sessionappbar-toolbar-right">
                        <IconButton>
                            <MenuIcon/>
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
        )
    }
}

export default SessionAppBar