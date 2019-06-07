import React from "react";

class MessageList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    render() {
        console.log(this.props)
        return (
            <div className="message-list">
                {this.props.messages &&
                <ul>
                    {this.props.messages.map((message, index) => (
                            <li key={index}>
                                <h4 className="message-sender">{message.username}</h4>
                                <p className="message-text">{message.text}</p>
                            </li>
                        )
                    )}
                </ul>
                }
            </div>
        )
    }

}


export default MessageList