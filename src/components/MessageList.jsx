import React from "react";
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';

class MessageList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    render() {
        console.log(this.props)
        return (
            <Card className="message-list">
                {this.props.messages &&

                <List id="message-inner-list">
                    {this.props.messages.map((message, index) => (
                        <React.Fragment>
                            <ListItem key={index} alignItems='flex-start'>
                                {/*<ListItemText*/}
                                    {/*primary={`${message.username}:`}*/}
                                    {/*secondary={message.text}*/}
                                {/*/>*/}
                                <ListItemText
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="textPrimary"
                                            >
                                                {`${message.username}:\t`}
                                            </Typography>
                                            {message.text}
                                        </React.Fragment>
                                    }
                                />
                                {/*<h4 className="message-sender">{message.username}</h4>*/}
                                {/*<p className="message-text">{message.text}</p>*/}
                            </ListItem>
                            {/*<Divider variant="middle"/>*/}
                        </React.Fragment>
                        )
                    )}
                </List>
                }

                {/*<ul className="message-inner-list">*/}
                {/*{this.props.messages.map((message, index) => (*/}
                {/*<li key={index}>*/}
                {/*<h4 className="message-sender">{message.username}</h4>*/}
                {/*<p className="message-text">{message.text}</p>*/}
                {/*</li>*/}
                {/*)*/}
                {/*)}*/}
                {/*</ul>*/}
            </Card>
        )
    }

}


export default MessageList