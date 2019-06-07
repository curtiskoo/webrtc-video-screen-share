import React from "react";
import Cookies from 'universal-cookie';

class Home extends React.Component {
    constructor(props) {
        super(props)

        this.cookies = new Cookies()

        this.state = {
            roomid: null,
        }
    }

    setRoomID = () => {
        let input = document.getElementById('roomid-input').value
        console.log(input)
        this.setState({roomid: input})
        if (input !== null && input !== "") {
            console.log('changing route to room...')
            console.log(`/room/${input}`)
            this.props.history.push(`/room/${input}`)
        }
    }

    setUserName = () => {
        let elem = document.getElementById('username-input')
        if (elem != null) {
            let input = elem.value
            // this.props.getUserName(input)
            this.cookies.set("username", input, {path: '/'})
        }
    }


    render() {
        console.log("Home")
        console.log(this.props)
        return (
            <div>
                <form onSubmit={() => {
                    this.setRoomID();
                    this.setUserName();
                }}>
                    <input type='text' id='roomid-input' placeholder="Enter a Room ID"/>
                    {!this.props.username &&
                        <input type='text' id='username-input' placeholder="Enter a Username"/>
                    }
                    <input type="submit" value="Join Room" />
                </form>
                {this.props.username &&
                    <form onSubmit={(e) => {
                        this.setUserName();
                    }}>
                        <input type='text' id='username-input' placeholder="Change your Username"/>
                        <input type="submit" value="Submit"/>
                    </form>
                }
            </div>
        );
    }
}

export default Home;
