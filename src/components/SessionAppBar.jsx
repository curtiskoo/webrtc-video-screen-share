import React from "react";
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class SessionAppBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            menuOpen: false,
            menuAnchor: null,
            menuSelectedIndex: 0
        }

        this.menuOptions = [
            "Stream Chat",
            "Voice Call",
            "Test This"
        ]
    }

    handleMenuItemClick = (event, index) => {
        this.setState({
            menuSelectedIndex: index,
            menuOpen: false,
            // menuAnchor: null,
        })
        this.props.changeContent(this.menuOptions[index])
    }

    handleMenuClick = (event) => {
        this.setState({
            menuOpen: !this.state.menuOpen,
            menuAnchor: event.target
        })
    }

    handleMenuClose = () => {
        this.setState({
            menuOpen: false,
            menuAnchor: null,
        })
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
                            {this.props.contentDisplay}
                        </Typography>
                    </div>

                    <div class="sessionappbar-toolbar-right">
                        <IconButton onClick={this.handleMenuClick}>
                            <MenuIcon/>
                        </IconButton>
                    </div>
                    <Menu
                        id="stream-menu"
                        anchorEl={this.state.menuAnchor}
                        // keepMounted
                        disableAutoFocusItem={true}
                        open={this.state.menuOpen}
                        onClose={this.handleMenuClose}
                        variant="menu"
                    >
                        {this.menuOptions.map((option, index) => (
                            <MenuItem
                                selected={index === this.state.menuSelectedIndex}
                                onClick={(event) => {
                                    this.handleMenuItemClick(event, index)
                                }}
                            >
                                {option}
                            </MenuItem>
                        ))
                        }
                    </Menu>
                </Toolbar>
            </AppBar>
        )
    }
}

export default SessionAppBar