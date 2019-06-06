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

    setUserName = () => {
        let elem = document.getElementById('username-input')
        if (elem != null) {
            let input = elem.value
            this.props.getUserName(input)
            localStorage.setItem('username', input)
        }
    }


    render() {
        console.log("Home")
        console.log(this.props)
        console.log(`Local Storage: ${localStorage.getItem('username')}`)
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
            </div>
        );
    }
}

export default Home;
