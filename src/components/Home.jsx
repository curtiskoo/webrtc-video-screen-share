import React from "react";

class Home extends React.Component {
    constructor(props) {
        super(props)

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


    render() {
        console.log("Home")
        return (
            <div>
                <form onSubmit={this.setRoomID}>
                    <input type='text' id='roomid-input' placeholder="Enter a Room ID"/>
                    <input type="submit" value="Join Room" />
                </form>
            </div>
        );
    }
}

export default Home;
